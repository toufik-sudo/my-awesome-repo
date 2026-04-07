import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger, Inject, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { ServiceBooking } from '../entity/service-booking.entity';
import { ServiceAvailability } from '../entity/service-availability.entity';
import { TourismService } from '../entity/tourism-service.entity';
import { CreateServiceBookingDto, ServiceAvailabilityDto } from '../dto/service-booking.dto';
import { ServiceFeeService } from '../../user/services/service-fee.service';
import { HostFeeAbsorptionService } from '../../user/services/host-fee-absorption.service';
import { PointsRuleService } from '../../user/services/points-rule.service';
import { RolesService } from '../../user/services/roles.service';
import { ScopeFilterService } from '../../rbac/services/scope-filter.service';
import { ScopeContext, getScopedPerms } from '../../rbac/scope-context';

const PERM_KEY_PROVIDER_BOOKINGS = 'backend.ServiceBookingsController.getProviderBookings.GET';

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
    @Optional() private readonly scopeFilter?: ScopeFilterService,
    @Optional() private readonly feeService?: ServiceFeeService,
    @Optional() private readonly absorptionService?: HostFeeAbsorptionService,
    @Optional() private readonly pointsRuleService?: PointsRuleService,
    @Optional() private readonly rolesService?: RolesService,
  ) {}

  async create(dto: CreateServiceBookingDto, customerId: number, _scopeCtx?: ScopeContext) {
    const service = await this.serviceRepo.findOne({ where: { id: dto.serviceId } });
    if (!service) throw new NotFoundException('Service not found');
    if (!service.isAvailable) throw new BadRequestException('Service is not available');

    const totalParticipants = dto.participants + (dto.childParticipants || 0);
    if (totalParticipants < service.minParticipants || totalParticipants > service.maxParticipants) {
      throw new BadRequestException(`Participants must be between ${service.minParticipants} and ${service.maxParticipants}`);
    }

    const avail = await this.availRepo.findOne({
      where: { serviceId: dto.serviceId, date: new Date(dto.bookingDate) as any },
    });
    if (avail?.isBlocked) throw new BadRequestException('Date is not available');
    if (avail?.maxSlots && avail.bookedSlots >= avail.maxSlots) {
      throw new BadRequestException('No slots available for this date');
    }

    const unitPrice = avail?.customPrice || Number(service.price);
    const childPrice = service.priceChild ? Number(service.priceChild) : unitPrice;
    let subtotal = unitPrice * dto.participants + childPrice * (dto.childParticipants || 0);

    let discount = 0;
    if (service.groupDiscount && totalParticipants >= 5) {
      discount = Number(service.groupDiscount);
      subtotal = subtotal * (1 - discount / 100);
    }

    let pointsDiscount = 0;
    if (dto.usePoints && dto.pointsToUse > 0 && this.pointsRuleService) {
      const convRate = await this.pointsRuleService.getConversionRate('guest');
      if (convRate && dto.pointsToUse >= convRate.minPoints) {
        pointsDiscount = dto.pointsToUse * convRate.rate;
        if (pointsDiscount > subtotal) pointsDiscount = subtotal;
      }
    }

    const amountAfterPoints = subtotal - pointsDiscount;

    let serviceFee = 0;
    let hostAbsorptionAmount = 0;
    if (this.feeService) {
      const feeResult = await this.feeService.calculateFee(
        service.providerId, '', null, amountAfterPoints, dto.serviceId,
      );
      serviceFee = feeResult.fee;

      if (this.absorptionService) {
        const absorption = await this.absorptionService.getAbsorptionForBooking(
          service.providerId, undefined, dto.serviceId, undefined, undefined, new Date(dto.bookingDate),
        );
        if (absorption.absorptionPercent > 0) {
          hostAbsorptionAmount = Math.round(serviceFee * absorption.absorptionPercent / 100 * 100) / 100;
        }
      }
    }

    const guestFee = serviceFee - hostAbsorptionAmount;
    const totalPrice = Math.round((amountAfterPoints + guestFee) * 100) / 100;

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
      totalPrice,
      currency: service.currency,
      paymentMethod: dto.paymentMethod as any,
      customerMessage: dto.message,
      participantDetails: dto.participantDetails,
    });

    const saved = await this.bookingRepo.save(booking);

    if (avail) {
      avail.bookedSlots += 1;
      await this.availRepo.save(avail);
    }

    await this.serviceRepo.increment({ id: dto.serviceId }, 'bookingCount', 1);

    return {
      ...saved,
      _pricing: {
        subtotal: Math.round(subtotal * 100) / 100,
        pointsDiscount,
        serviceFee,
        hostAbsorption: hostAbsorptionAmount,
        guestFee,
        totalPrice,
      },
    };
  }

  async getMyBookings(customerId: number, _scopeCtx?: ScopeContext) {
    return this.bookingRepo.find({
      where: { customerId },
      relations: ['service'],
      order: { createdAt: 'DESC' },
    });
  }

  async getProviderBookings(providerId: number, scopeCtx?: ScopeContext) {
    const query = this.bookingRepo
      .createQueryBuilder('sb')
      .leftJoinAndSelect('sb.service', 'service')
      .leftJoinAndSelect('sb.customer', 'customer')
      .where('service.providerId = :providerId', { providerId })
      .orderBy('sb.createdAt', 'DESC');

    // Apply scope filtering for manager/hyper_manager/guest
    if (scopeCtx && this.scopeFilter && ['manager', 'hyper_manager', 'guest'].includes(scopeCtx.userRole)) {
      const scopedPerms = getScopedPerms(scopeCtx);
      const allowedServiceIds = await this.scopeFilter.resolveServiceIds(scopedPerms, PERM_KEY_PROVIDER_BOOKINGS);

      if (allowedServiceIds !== null) {
        if (allowedServiceIds.length === 0) return [];
        query.andWhere('sb.serviceId IN (:...allowedServiceIds)', { allowedServiceIds });
      }
    }

    return query.getMany();
  }

  async getOne(id: string) {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['service', 'customer'],
    });
    if (!booking) throw new NotFoundException('Service booking not found');
    return booking;
  }

  async getOneScoped(id: string, callerId: number, _scopeCtx?: ScopeContext) {
    const booking = await this.getOne(id);

    if (booking.customerId === callerId) return booking;

    if (this.rolesService) {
      const callerRole = await this.rolesService.getUserRole(callerId);

      if (callerRole === 'hyper_admin' || callerRole === 'hyper_manager') return booking;

      if (callerRole === 'admin') {
        const isOwner = await this.rolesService.isServiceOwner(callerId, booking.serviceId);
        if (isOwner) return booking;
      }

      if (callerRole === 'manager') {
        const hasAccess = await this.rolesService.hasPermissionForProperty(
          callerId, booking.serviceId, 'view_bookings',
        );
        if (hasAccess) return booking;
      }
    }

    throw new ForbiddenException('You do not have access to this service booking');
  }

  async accept(id: string, _scopeCtx?: ScopeContext) {
    const booking = await this.getOne(id);
    if (booking.status !== 'pending') throw new BadRequestException('Booking is not pending');
    booking.status = 'confirmed';
    booking.confirmedAt = new Date();
    return this.bookingRepo.save(booking);
  }

  async decline(id: string, reason?: string, _scopeCtx?: ScopeContext) {
    const booking = await this.getOne(id);
    if (booking.status !== 'pending') throw new BadRequestException('Booking is not pending');
    booking.status = 'rejected';
    booking.cancellationReason = reason;
    return this.bookingRepo.save(booking);
  }

  async cancel(id: string, reason?: string, _scopeCtx?: ScopeContext) {
    const booking = await this.getOne(id);
    if (!['pending', 'confirmed'].includes(booking.status)) throw new BadRequestException('Cannot cancel');
    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = reason;
    return this.bookingRepo.save(booking);
  }

  async getAvailability(serviceId: string, startDate: string, endDate: string, _scopeCtx?: ScopeContext) {
    return this.availRepo.find({
      where: {
        serviceId,
        date: Between(new Date(startDate), new Date(endDate)) as any,
      },
      order: { date: 'ASC' },
    });
  }

  async setAvailability(serviceId: string, dto: ServiceAvailabilityDto, _scopeCtx?: ScopeContext) {
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

  async bulkSetAvailability(serviceId: string, dates: ServiceAvailabilityDto[], _scopeCtx?: ScopeContext) {
    return Promise.all(dates.map(d => this.setAvailability(serviceId, d)));
  }
}
