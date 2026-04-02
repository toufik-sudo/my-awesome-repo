import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../entity/booking.entity';
import { Property } from '../../properties/entity/property.entity';
import { CreateBookingDto } from '../dtos/create-booking.dto';
import { differenceInDays, parseISO } from 'date-fns';
import { EventsGateway } from '../../infrastructure/websocket';
import { JobProducerService } from '../../infrastructure/jobs';
import { RedisCacheService } from '../../infrastructure/redis';

interface PricingResult {
  effectiveRate: number;
  discount: number;
  discountType: string;
}

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    private readonly eventsGateway: EventsGateway,
    private readonly jobProducer: JobProducerService,
    private readonly cache: RedisCacheService,
  ) {}

  async findAll(status?: string) {
    const where: any = {};
    if (status) where.status = status;
    return this.bookingRepository.find({ where, relations: ['property', 'guest'], order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    return this.bookingRepository.findOne({ where: { id }, relations: ['property', 'guest'] });
  }

  /**
   * Calculate the effective nightly rate based on property discount tiers.
   */
  private calculatePricing(property: Property, nights: number): PricingResult {
    const pricePerNight = Number(property.pricePerNight);

    // Monthly rate (28+ nights)
    if (nights >= 28) {
      if (property.pricePerMonth) {
        const monthlyRate = Number(property.pricePerMonth) / 30;
        return {
          effectiveRate: monthlyRate,
          discount: ((pricePerNight - monthlyRate) / pricePerNight) * 100,
          discountType: 'monthly_rate',
        };
      }
      if (property.monthlyDiscount) {
        const discountedRate = pricePerNight * (1 - Number(property.monthlyDiscount) / 100);
        return {
          effectiveRate: discountedRate,
          discount: Number(property.monthlyDiscount),
          discountType: 'monthly_discount',
        };
      }
    }

    // Weekly rate (7+ nights)
    if (nights >= 7) {
      if (property.pricePerWeek) {
        const weeklyRate = Number(property.pricePerWeek) / 7;
        return {
          effectiveRate: weeklyRate,
          discount: ((pricePerNight - weeklyRate) / pricePerNight) * 100,
          discountType: 'weekly_rate',
        };
      }
      if (property.weeklyDiscount) {
        const discountedRate = pricePerNight * (1 - Number(property.weeklyDiscount) / 100);
        return {
          effectiveRate: discountedRate,
          discount: Number(property.weeklyDiscount),
          discountType: 'weekly_discount',
        };
      }
    }

    // Custom discount
    if (property.customDiscount && property.customDiscountMinNights && nights >= property.customDiscountMinNights) {
      const discountedRate = pricePerNight * (1 - Number(property.customDiscount) / 100);
      return {
        effectiveRate: discountedRate,
        discount: Number(property.customDiscount),
        discountType: `custom_${property.customDiscountMinNights}+`,
      };
    }

    return { effectiveRate: pricePerNight, discount: 0, discountType: '' };
  }

  async create(dto: CreateBookingDto, guestId: number) {
    const property = await this.propertyRepository.findOne({ where: { id: dto.propertyId } });
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const checkIn = parseISO(dto.checkIn);
    const checkOut = parseISO(dto.checkOut);
    const nights = differenceInDays(checkOut, checkIn);

    if (nights < 1) {
      throw new BadRequestException('Check-out must be after check-in');
    }
    if (nights < property.minNights) {
      throw new BadRequestException(`Minimum stay is ${property.minNights} nights`);
    }
    if (nights > property.maxNights) {
      throw new BadRequestException(`Maximum stay is ${property.maxNights} nights`);
    }
    if (dto.guests > property.maxGuests) {
      throw new BadRequestException(`Maximum guests is ${property.maxGuests}`);
    }

    const pricing = this.calculatePricing(property, nights);
    const subtotal = Math.round(nights * pricing.effectiveRate);
    const serviceFeeRate = dto.paymentMethod === 'cash' ? 2.5 : Number(property.serviceFeePercent || 5);
    const serviceFee = Math.round(subtotal * (serviceFeeRate / 100));
    const cleaningFee = Number(property.cleaningFee || 0);
    const totalPrice = subtotal + serviceFee + cleaningFee;

    this.logger.log(
      `Booking created: property=${dto.propertyId}, guest=${guestId}, ` +
      `nights=${nights}, paymentMethod=${dto.paymentMethod}, ` +
      `effectiveRate=${pricing.effectiveRate}, discount=${pricing.discount.toFixed(1)}% (${pricing.discountType}), ` +
      `subtotal=${subtotal}, serviceFee=${serviceFee} (${serviceFeeRate}%), ` +
      `cleaningFee=${cleaningFee}, total=${totalPrice} DZD`,
    );

    const booking = this.bookingRepository.create({
      propertyId: dto.propertyId,
      property: { id: dto.propertyId } as any,
      guestId,
      guest: { id: guestId } as any,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuests: dto.guests,
      numberOfNights: nights,
      pricePerNight: Number(property.pricePerNight),
      effectiveRate: pricing.effectiveRate,
      discountPercent: pricing.discount,
      discountType: pricing.discountType || null,
      subtotal,
      cleaningFee,
      serviceFee,
      totalPrice,
      currency: property.currency || 'DZD',
      paymentMethod: dto.paymentMethod as any,
      guestMessage: dto.message || null,
      status: property.instantBooking ? 'confirmed' : 'pending',
      paymentStatus: 'pending',
    });

    const saved = await this.bookingRepository.save(booking);
    const fullBooking = await this.findOne(saved.id);

    // Real-time notification to host
    if (property.hostId) {
      this.eventsGateway.emitBookingUpdate(String(property.hostId), fullBooking);
      
      // Also notify authorized managers for this property
      this.notifyAuthorizedManagers(property.id, fullBooking, property.title);
    }

    // Queue notification job for the host
    this.jobProducer.queueNotification({
      userId: property.hostId as any,
      type: 'booking_request',
      title: 'Nouvelle demande de réservation',
      message: `Nouvelle réservation pour ${property.title || property.id} (${nights} nuits, ${totalPrice} DZD)`,
      channel: 'both',
      actionUrl: `/bookings/${saved.id}`,
      metadata: { bookingId: saved.id, propertyId: property.id },
    });

    return fullBooking;
  }

  async updateStatus(id: string, status: string) {
    const booking = await this.findOne(id);
    if (!booking) throw new NotFoundException('Booking not found');

    const updateData: Partial<Booking> = { status: status as any };
    if (status === 'confirmed') updateData.confirmedAt = new Date();
    if (status === 'cancelled') updateData.cancelledAt = new Date();

    await this.bookingRepository.update(id, updateData);
    const updated = await this.findOne(id);

    // Real-time update to guest
    this.eventsGateway.emitBookingUpdate(String(booking.guestId), updated);

    // Queue email for booking confirmation
    if (status === 'confirmed' && booking.guest?.email) {
      this.jobProducer.sendBookingConfirmation(updated, booking.guest.email);
    }

    // Queue notification
    this.jobProducer.queueNotification({
      userId: booking.guestId,
      type: 'booking_update',
      title: `Booking ${status}`,
      message: `Your booking has been ${status}`,
      actionUrl: `/bookings/${id}`,
      metadata: { bookingId: id, status },
    });

    return updated;
  }

  async declineBooking(id: string, reason?: string) {
    const booking = await this.findOne(id);
    if (!booking) throw new NotFoundException('Booking not found');

    await this.bookingRepository.update(id, {
      status: 'rejected' as any,
      cancellationReason: reason || null,
      cancelledAt: new Date(),
    });

    const updated = await this.findOne(id);
    this.eventsGateway.emitBookingUpdate(String(booking.guestId), updated);

    this.jobProducer.queueNotification({
      userId: booking.guestId,
      type: 'booking_update',
      title: 'Booking Declined',
      message: reason ? `Your booking was declined: ${reason}` : 'Your booking was declined by the host',
      actionUrl: `/bookings/${id}`,
      metadata: { bookingId: id, status: 'rejected' },
    });

    return updated;
  }

  async createCounterOffer(id: string, data: {
    newPrice: number;
    newCheckIn?: string;
    newCheckOut?: string;
    message?: string;
  }) {
    const booking = await this.findOne(id);
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== 'pending') {
      throw new BadRequestException('Can only counter-offer pending bookings');
    }

    const updateData: any = {
      status: 'counter_offer',
      hostResponse: data.message || null,
    };

    // Store counter-offer details — using hostResponse and totalPrice fields
    if (data.newPrice) updateData.totalPrice = data.newPrice;
    if (data.newCheckIn) updateData.checkInDate = parseISO(data.newCheckIn);
    if (data.newCheckOut) updateData.checkOutDate = parseISO(data.newCheckOut);

    await this.bookingRepository.update(id, updateData);
    const updated = await this.findOne(id);

    this.eventsGateway.emitBookingUpdate(String(booking.guestId), updated);

    this.jobProducer.queueNotification({
      userId: booking.guestId,
      type: 'booking_update',
      title: 'Counter-Offer Received',
      message: `The host has sent a counter-offer for your booking${data.message ? ': ' + data.message : ''}`,
      actionUrl: `/bookings/${id}`,
      metadata: { bookingId: id, status: 'counter_offer' },
    });

    return updated;
  }

  async findByGuest(guestId: number) {
    return this.bookingRepository.find({
      where: { guestId },
      relations: ['property'],
      order: { createdAt: 'DESC' },
    });
  }

  async checkAvailability(propertyId: string, checkIn: string, checkOut: string) {
    const overlapping = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.propertyId = :propertyId', { propertyId })
      .andWhere('booking.status IN (:...statuses)', { statuses: ['pending', 'confirmed'] })
      .andWhere('booking.checkInDate < :checkOut', { checkOut })
      .andWhere('booking.checkOutDate > :checkIn', { checkIn })
      .getCount();

    return { available: overlapping === 0 };
  }

  /** Notify managers who have accept_bookings permission for a property */
  private async notifyAuthorizedManagers(propertyId: string, booking: any, propertyTitle: string) {
    try {
      const { ManagerAssignment } = await import('../../user/entity/manager-assignment.entity');
      const { ManagerPermission } = await import('../../user/entity/manager-permission.entity');

      const assignmentRepo = this.bookingRepository.manager.getRepository(ManagerAssignment);
      const permissionRepo = this.bookingRepository.manager.getRepository(ManagerPermission);

      // Get active assignments that cover this property
      const assignments = await assignmentRepo.find({ where: { isActive: true } });

      for (const assignment of assignments) {
        let covers = false;
        if (assignment.scope === 'all') covers = true;
        else if (assignment.scope === 'property' && assignment.propertyId === propertyId) covers = true;

        if (!covers) continue;

        // Check accept_bookings permission
        const perm = await permissionRepo.findOne({
          where: { assignmentId: assignment.id, permission: 'accept_bookings' as any, isGranted: true },
        });

        if (perm) {
          this.eventsGateway.emitBookingUpdate(String(assignment.managerId), booking);
          this.jobProducer.queueNotification({
            userId: assignment.managerId,
            type: 'booking_request',
            title: 'Nouvelle demande de réservation',
            message: `Nouvelle réservation pour ${propertyTitle}`,
            channel: 'in_app',
            actionUrl: `/bookings/${booking.id}`,
            metadata: { bookingId: booking.id, propertyId },
          });
        }
      }
    } catch (err:any) {
      this.logger.warn(`Failed to notify managers: ${err.message}`);
    }
  }
}
