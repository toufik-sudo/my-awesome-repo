import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ServiceBooking } from '../entity/service-booking.entity';
import { ServiceAvailability } from '../entity/service-availability.entity';
import { TourismService } from '../entity/tourism-service.entity';
import { CreateServiceBookingDto, ServiceAvailabilityDto } from '../dto/service-booking.dto';

@Injectable()
export class ServiceBookingsService {
  private readonly logger = new Logger(ServiceBookingsService.name);

  constructor(
    @InjectRepository(ServiceBooking)
    private readonly bookingRepo: Repository<ServiceBooking>,
    @InjectRepository(ServiceAvailability)
    private readonly availRepo: Repository<ServiceAvailability>,
    @InjectRepository(TourismService)
    private readonly serviceRepo: Repository<TourismService>,
  ) {}

  async create(dto: CreateServiceBookingDto, customerId: number) {
    const service = await this.serviceRepo.findOne({ where: { id: dto.serviceId } });
    if (!service) throw new NotFoundException('Service not found');
    if (!service.isAvailable) throw new BadRequestException('Service is not available');

    const totalParticipants = dto.participants + (dto.childParticipants || 0);
    if (totalParticipants < service.minParticipants || totalParticipants > service.maxParticipants) {
      throw new BadRequestException(`Participants must be between ${service.minParticipants} and ${service.maxParticipants}`);
    }

    // Check availability
    const avail = await this.availRepo.findOne({
      where: { serviceId: dto.serviceId, date: new Date(dto.bookingDate) as any },
    });
    if (avail?.isBlocked) throw new BadRequestException('Date is not available');
    if (avail?.maxSlots && avail.bookedSlots >= avail.maxSlots) {
      throw new BadRequestException('No slots available for this date');
    }

    // Calculate price
    const unitPrice = avail?.customPrice || Number(service.price);
    const childPrice = service.priceChild ? Number(service.priceChild) : unitPrice;
    let total = unitPrice * dto.participants + childPrice * (dto.childParticipants || 0);

    // Group discount
    let discount = 0;
    if (service.groupDiscount && totalParticipants >= 5) {
      discount = Number(service.groupDiscount);
      total = total * (1 - discount / 100);
    }

    const booking = this.bookingRepo.create({
      serviceId: dto.serviceId,
      customerId,
      bookingDate: new Date(dto.bookingDate),
      startTime: dto.startTime,
      participants: dto.participants,
      childParticipants: dto.childParticipants || 0,
      unitPrice,
      childPrice,
      discountPercent: discount,
      totalPrice: Math.round(total * 100) / 100,
      currency: service.currency,
      paymentMethod: dto.paymentMethod as any,
      customerMessage: dto.message,
      participantDetails: dto.participantDetails,
    });

    const saved = await this.bookingRepo.save(booking);

    // Update booked slots
    if (avail) {
      avail.bookedSlots += 1;
      await this.availRepo.save(avail);
    }

    // Update service booking count
    await this.serviceRepo.increment({ id: dto.serviceId }, 'bookingCount', 1);

    return saved;
  }

  async getMyBookings(customerId: number) {
    return this.bookingRepo.find({
      where: { customerId },
      relations: ['service'],
      order: { createdAt: 'DESC' },
    });
  }

  async getProviderBookings(providerId: number) {
    return this.bookingRepo
      .createQueryBuilder('sb')
      .leftJoinAndSelect('sb.service', 'service')
      .leftJoinAndSelect('sb.customer', 'customer')
      .where('service.providerId = :providerId', { providerId })
      .orderBy('sb.createdAt', 'DESC')
      .getMany();
  }

  async getOne(id: string) {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['service', 'customer'],
    });
    if (!booking) throw new NotFoundException('Service booking not found');
    return booking;
  }

  async accept(id: string) {
    const booking = await this.getOne(id);
    if (booking.status !== 'pending') throw new BadRequestException('Booking is not pending');
    booking.status = 'confirmed';
    booking.confirmedAt = new Date();
    return this.bookingRepo.save(booking);
  }

  async decline(id: string, reason?: string) {
    const booking = await this.getOne(id);
    if (booking.status !== 'pending') throw new BadRequestException('Booking is not pending');
    booking.status = 'rejected';
    booking.cancellationReason = reason;
    return this.bookingRepo.save(booking);
  }

  async cancel(id: string, reason?: string) {
    const booking = await this.getOne(id);
    if (!['pending', 'confirmed'].includes(booking.status)) throw new BadRequestException('Cannot cancel');
    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = reason;
    return this.bookingRepo.save(booking);
  }

  // ── Availability management ──
  async getAvailability(serviceId: string, startDate: string, endDate: string) {
    return this.availRepo.find({
      where: {
        serviceId,
        date: Between(new Date(startDate), new Date(endDate)) as any,
      },
      order: { date: 'ASC' },
    });
  }

  async setAvailability(serviceId: string, dto: ServiceAvailabilityDto) {
    let avail = await this.availRepo.findOne({
      where: { serviceId, date: new Date(dto.date) as any },
    });
    if (avail) {
      Object.assign(avail, dto, { date: new Date(dto.date) });
      return this.availRepo.save(avail);
    }
    return this.availRepo.save(this.availRepo.create({
      serviceId,
      date: new Date(dto.date),
      ...dto,
    }));
  }

  async bulkSetAvailability(serviceId: string, dates: ServiceAvailabilityDto[]) {
    return Promise.all(dates.map(d => this.setAvailability(serviceId, d)));
  }
}
