import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Booking } from '../entity/booking.entity';
import { Property } from '../../properties/entity/property.entity';
import { CreateBookingDto } from '../dtos/create-booking.dto';
import { differenceInDays, parseISO } from 'date-fns';
import { EventsGateway } from '../../infrastructure/websocket';
import { JobProducerService } from '../../infrastructure/jobs';
import { RedisCacheService } from '../../infrastructure/redis';
import { RolesService } from '../../user/services/roles.service';
import { ScopeFilterService } from '../../rbac/services/scope-filter.service';
import { ScopeContext, getScopedPerms } from '../../rbac/scope-context';
import { HyperNotifierService } from '../../user/services/hyper-notifier.service';
import { UserBlameService } from '../../user/services/user-blame.service';
import { ReferralService } from '../../user/services/referral.service';
import { ServiceFeeService } from '../../user/services/service-fee.service';
import { HostFeeAbsorptionService } from '../../user/services/host-fee-absorption.service';
import { NotificationContent } from '../../notification/constants/notification-content.constant';

const ACCEPT_DEADLINE_HOURS = 48;
const PAYMENT_DEADLINE_HOURS = 24;

const PERM_KEY_FIND_ALL = 'backend.BookingsController.findAll.GET';

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
    private readonly rolesService: RolesService,
    private readonly scopeFilter: ScopeFilterService,
    private readonly hyperNotifier: HyperNotifierService,
    private readonly blameService: UserBlameService,
    private readonly referralService: ReferralService,
    private readonly serviceFeeService: ServiceFeeService,
    private readonly hostFeeAbsorptionService: HostFeeAbsorptionService,
  ) {}

  async findAll(
    status?: string,
    scopeCtx?: ScopeContext,
    pagination?: { page?: number; limit?: number },
  ) {
    const where: any = {};
    if (status) where.status = status;

    if (scopeCtx) {
      const { userRole } = scopeCtx;
      if (userRole !== 'hyper_admin') {
        const allowedPropertyIds = await this.scopeFilter.effectivePropertyIds(
          scopeCtx, PERM_KEY_FIND_ALL,
        );
        if (allowedPropertyIds !== null) {
          if (allowedPropertyIds.length === 0) {
            const page = pagination?.page ?? 1;
            const limit = pagination?.limit ?? 20;
            return { data: [], total: 0, page, limit, totalPages: 0 };
          }
          where.propertyId = In(allowedPropertyIds);
        }
      }
    }

    const page = Math.max(1, pagination?.page ?? 1);
    const limit = Math.max(1, Math.min(100, pagination?.limit ?? 20));
    const [data, total] = await this.bookingRepository.findAndCount({
      where,
      relations: ['property', 'guest'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    return this.bookingRepository.findOne({ where: { id }, relations: ['property', 'guest'] });
  }

  async findOneScoped(id: string, callerId: number, scopeCtx?: ScopeContext) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['property', 'guest'],
    });
    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.guestId === callerId) return booking;

    const callerRole = scopeCtx?.userRole || await this.rolesService.getUserRole(callerId);

    // Only hyper_admin has unrestricted global access
    if (callerRole === 'hyper_admin') return booking;

    if (callerRole === 'admin') {
      const isOwner = await this.rolesService.isPropertyOwner(callerId, booking.propertyId);
      if (isOwner) return booking;
      throw new ForbiddenException('You do not own this booking\'s property');
    }

    // hyper_manager uses scoped perms like manager
    if (callerRole === 'hyper_manager' || callerRole === 'manager') {
      const hasAccess = await this.rolesService.hasPermissionForProperty(
        callerId, booking.propertyId, 'view_bookings',
      );
      if (hasAccess) return booking;
    }

    throw new ForbiddenException('You do not have access to this booking');
  }

  private calculatePricing(property: Property, nights: number): PricingResult {
    const pricePerNight = Number(property.pricePerNight);

    if (nights >= 28) {
      if (property.pricePerMonth) {
        const monthlyRate = Number(property.pricePerMonth) / 30;
        return { effectiveRate: monthlyRate, discount: ((pricePerNight - monthlyRate) / pricePerNight) * 100, discountType: 'monthly_rate' };
      }
      if (property.monthlyDiscount) {
        const discountedRate = pricePerNight * (1 - Number(property.monthlyDiscount) / 100);
        return { effectiveRate: discountedRate, discount: Number(property.monthlyDiscount), discountType: 'monthly_discount' };
      }
    }

    if (nights >= 7) {
      if (property.pricePerWeek) {
        const weeklyRate = Number(property.pricePerWeek) / 7;
        return { effectiveRate: weeklyRate, discount: ((pricePerNight - weeklyRate) / pricePerNight) * 100, discountType: 'weekly_rate' };
      }
      if (property.weeklyDiscount) {
        const discountedRate = pricePerNight * (1 - Number(property.weeklyDiscount) / 100);
        return { effectiveRate: discountedRate, discount: Number(property.weeklyDiscount), discountType: 'weekly_discount' };
      }
    }

    if (property.customDiscount && property.customDiscountMinNights && nights >= property.customDiscountMinNights) {
      const discountedRate = pricePerNight * (1 - Number(property.customDiscount) / 100);
      return { effectiveRate: discountedRate, discount: Number(property.customDiscount), discountType: `custom_${property.customDiscountMinNights}+` };
    }

    return { effectiveRate: pricePerNight, discount: 0, discountType: '' };
  }

  async create(dto: CreateBookingDto, guestId: number, scopeCtx?: ScopeContext) {
    // Detect admin/manager booking-on-behalf-of-guest flow.
    const callerRole = scopeCtx?.userRole;
    const isAdminCaller = !!callerRole && ['hyper_admin', 'hyper_manager', 'admin', 'manager'].includes(callerRole);
    const onBehalfRaw = (dto as any).onBehalfOfGuestId;
    const onBehalfId = onBehalfRaw != null && onBehalfRaw !== '' ? Number(onBehalfRaw) : undefined;
    const isOnBehalf = isAdminCaller && Number.isFinite(onBehalfId);

    if (!isOnBehalf && isAdminCaller && callerRole !== 'manager') {
      // Pure admin/hyper roles cannot self-book — only on behalf of a guest.
      throw new ForbiddenException('Administrative roles cannot create bookings');
    }

    let effectiveGuestId = guestId;
    if (isOnBehalf) {
      const targetRole = await this.rolesService.getUserRole(onBehalfId!).catch(() => null);
      if (!targetRole || !['user', 'guest'].includes(targetRole)) {
        throw new BadRequestException('Target user is not a guest/user');
      }
      effectiveGuestId = onBehalfId!;
    }

    const property = await this.propertyRepository.findOne({ where: { id: dto.propertyId } });
    if (!property) throw new NotFoundException('Property not found');

    const checkIn = parseISO(dto.checkIn);
    const checkOut = parseISO(dto.checkOut);
    const nights = differenceInDays(checkOut, checkIn);

    if (nights < 1) throw new BadRequestException('Check-out must be after check-in');
    if (nights < property.minNights) throw new BadRequestException(`Minimum stay is ${property.minNights} nights`);
    if (nights > property.maxNights) throw new BadRequestException(`Maximum stay is ${property.maxNights} nights`);
    if (dto.guests > property.maxGuests) throw new BadRequestException(`Maximum guests is ${property.maxGuests}`);

    const pricing = this.calculatePricing(property, nights);
    const subtotal = Math.round(nights * pricing.effectiveRate);

    // Dynamic service fee via hyper-admin configured rules + host absorption
    let serviceFee = 0;
    let hostAbsorptionAmount = 0;
    let serviceFeeRateLog = 'dynamic-rule';
    try {
      const feeResult = await this.serviceFeeService.calculateFee(
        property.hostId,
        property.id,
        null,
        subtotal,
      );
      serviceFee = feeResult?.fee ?? 0;

      const absorption = await this.hostFeeAbsorptionService.getAbsorptionForBooking(
        property.hostId,
        property.id,
        undefined,
        undefined,
        undefined,
        checkIn,
      );
      if (absorption?.absorptionPercent > 0) {
        hostAbsorptionAmount = Math.round((serviceFee * absorption.absorptionPercent) / 100 * 100) / 100;
      }
    } catch (e) {
      this.logger.warn(`Fee rule lookup failed for property ${property.id}: ${(e as Error).message}`);
    }

    if (!serviceFee) {
      const fallbackRate = dto.paymentMethod === 'cash' ? 2.5 : Number(property.serviceFeePercent || 5);
      serviceFee = Math.round(subtotal * (fallbackRate / 100));
      serviceFeeRateLog = `${fallbackRate}%-fallback`;
    }

    const guestServiceFee = Math.max(0, serviceFee - hostAbsorptionAmount);
    const cleaningFee = Number(property.cleaningFee || 0);
    const totalPrice = subtotal + guestServiceFee + cleaningFee;

    this.logger.log(
      `Booking created: property=${dto.propertyId}, guest=${effectiveGuestId}` +
      `${isOnBehalf ? ` (on-behalf by ${guestId} as ${callerRole})` : ''}, ` +
      `nights=${nights}, paymentMethod=${dto.paymentMethod}, ` +
      `effectiveRate=${pricing.effectiveRate}, discount=${pricing.discount.toFixed(1)}% (${pricing.discountType}), ` +
      `subtotal=${subtotal}, serviceFee=${serviceFee} (${serviceFeeRateLog}), ` +
      `hostAbsorption=${hostAbsorptionAmount}, guestServiceFee=${guestServiceFee}, ` +
      `cleaningFee=${cleaningFee}, total=${totalPrice} DZD`,
    );

    // On-behalf bookings are auto-validated (skip host pending acceptance).
    const initialStatus = isOnBehalf
      ? 'accepted'
      : (property.instantBooking ? 'confirmed' : 'pending');

    const booking = this.bookingRepository.create({
      propertyId: dto.propertyId,
      property: { id: dto.propertyId } as any,
      guestId: effectiveGuestId,
      guest: { id: effectiveGuestId } as any,
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
      serviceFee: guestServiceFee,
      totalPrice,
      currency: property.currency || 'DZD',
      paymentMethod: dto.paymentMethod as any,
      guestMessage: dto.message || null,
      status: initialStatus as any,
      paymentStatus: 'pending',
      acceptedAt: isOnBehalf ? new Date() : null,
      paymentDeadlineAt: isOnBehalf
        ? new Date(Date.now() + PAYMENT_DEADLINE_HOURS * 3600 * 1000)
        : null,
      acceptDeadlineAt: (isOnBehalf || property.instantBooking)
        ? null
        : new Date(Date.now() + ACCEPT_DEADLINE_HOURS * 3600 * 1000),
    });

    const saved = await this.bookingRepository.save(booking);
    const fullBooking = await this.findOne(saved.id);

    // Invalidate availability cache so the requested dates are immediately
    // marked as blocked for other guests.
    try {
      await this.cache.invalidatePattern(`app:avail:${dto.propertyId}:*`);
    } catch {}

    if (property.hostId) {
      this.eventsGateway.emitBookingUpdate(String(property.hostId), fullBooking);
    }
    if (isOnBehalf) {
      this.eventsGateway.emitBookingUpdate(String(effectiveGuestId), fullBooking);
    }

    if (isOnBehalf) {
      // Mandatory notification to the target guest — must validate the booking
      // before payment can proceed.
      this.jobProducer.queueNotification({
        userId: effectiveGuestId as any,
        type: 'booking_awaiting_guest_confirmation',
        ...NotificationContent.bookingCreatedForGuest({
          propertyName: property.title,
          bookingId: saved.id,
          nights,
          paymentDeadlineHours: PAYMENT_DEADLINE_HOURS,
        }),
        channel: 'both',
        actionUrl: `/bookings/${saved.id}`,
        metadata: { bookingId: saved.id, propertyId: property.id, createdByAdminId: guestId, awaitingGuestConfirmation: true },
      });
      // Inform host that an admin pre-created a booking awaiting guest validation.
      this.jobProducer.queueNotification({
        userId: property.hostId as any,
        type: 'booking_admin_created',
        ...NotificationContent.bookingAdminPreValidated({
          propertyName: property.title,
          bookingId: saved.id,
          nights,
        }),
        channel: 'in_app',
        actionUrl: `/bookings/${saved.id}`,
        metadata: { bookingId: saved.id, propertyId: property.id, createdByAdminId: guestId, awaitingGuestConfirmation: true },
      });
    } else {
      this.jobProducer.queueNotification({
        userId: property.hostId as any,
        type: 'booking_request',
        ...NotificationContent.newBookingRequest({
          propertyName: property.title,
          bookingId: saved.id,
          nights,
        }),
        channel: 'both',
        actionUrl: `/bookings/${saved.id}`,
        metadata: { bookingId: saved.id, propertyId: property.id },
      });
    }

    await this.hyperNotifier.notifyHypers({
      type: isOnBehalf ? 'booking_admin_created' : 'booking_request',
      ...NotificationContent.hyperBookingCreated({
        bookingId: saved.id,
        propertyName: property.title,
        onBehalf: isOnBehalf,
      }),
      actionUrl: `/admin/bookings/${saved.id}`,
      metadata: { bookingId: saved.id, propertyId: property.id, status: initialStatus, onBehalf: isOnBehalf, createdByAdminId: isOnBehalf ? guestId : undefined },
      socketEvent: 'booking:created',
      socketPayload: { bookingId: saved.id },
    });

    return fullBooking;
  }

  async updateStatus(id: string, status: string, scopeCtx?: ScopeContext) {
    const booking = await this.findOne(id);
    if (!booking) throw new NotFoundException('Booking not found');

    // Block host-side status changes while the target guest still has to validate
    // an admin-on-behalf booking.
    if (booking.awaitingGuestConfirmation && ['accepted', 'confirmed'].includes(status)) {
      throw new ForbiddenException('Booking is awaiting guest confirmation');
    }

    await this.assertBookingAccess(booking, scopeCtx);

    const updateData: Partial<Booking> = { status: status as any };
    if (status === 'accepted') {
      updateData.acceptedAt = new Date();
      updateData.paymentDeadlineAt = new Date(Date.now() + PAYMENT_DEADLINE_HOURS * 3600 * 1000);
      (updateData as any).acceptDeadlineAt = null;
    }
    if (status === 'confirmed') updateData.confirmedAt = new Date();
    if (status === 'cancelled') updateData.cancelledAt = new Date();
    if (status === 'archived') updateData.archivedAt = new Date();

    await this.bookingRepository.update(id, updateData);
    const updated = await this.findOne(id);

    // Invalidate availability cache for this property so blocked dates reflect
    // the new status immediately (active vs released).
    try {
      await this.cache.invalidatePattern(`app:avail:${booking.propertyId}:*`);
    } catch {}

    this.eventsGateway.emitBookingUpdate(String(booking.guestId), updated);
    if (booking.property?.hostId) {
      this.eventsGateway.emitBookingUpdate(String(booking.property.hostId), updated);
    }

    if (status === 'confirmed' && booking.guest?.email) {
      this.jobProducer.sendBookingConfirmation(updated, booking.guest.email);
    }

    const propName = booking.property?.title;
    let guestCopy = { title: `Booking ${status}`, message: `Your booking has been ${status}` };
    if (status === 'accepted') {
      guestCopy = NotificationContent.bookingAccepted({
        propertyName: propName,
        bookingId: id,
        paymentDeadlineHours: PAYMENT_DEADLINE_HOURS,
      });
    } else if (status === 'confirmed') {
      guestCopy = NotificationContent.bookingConfirmed({ propertyName: propName, bookingId: id });
    }

    this.jobProducer.queueNotification({
      userId: booking.guestId,
      type: 'booking_update',
      ...guestCopy,
      channel: 'both',
      actionUrl: `/bookings/${id}`,
      metadata: { bookingId: id, status },
    });

    if (status === 'confirmed' && booking.property?.hostId) {
      this.jobProducer.queueNotification({
        userId: booking.property.hostId as any,
        type: 'booking_update',
        ...NotificationContent.bookingConfirmedForHost({ propertyName: propName, bookingId: id }),
        channel: 'both',
        actionUrl: `/bookings/${id}`,
        metadata: { bookingId: id, status },
      });
    }

    await this.hyperNotifier.notifyHypers({
      type: 'booking_update',
      ...NotificationContent.hyperBookingStatus({ bookingId: id, status }),
      actionUrl: `/admin/bookings/${id}`,
      metadata: { bookingId: id, status },
      socketEvent: 'booking:status',
      socketPayload: { bookingId: id, status },
    });

    // Referral lifecycle: trigger first-booking bonus when confirmed
    if (status === 'confirmed' && booking.guestId) {
      try {
        await this.referralService.onReferredUserBooking(booking.guestId, id);
      } catch (e) {
        this.logger.warn(`Referral first-booking hook failed: ${(e as Error).message}`);
      }
    }

    return updated;
  }

  /**
   * Called by the target guest of an admin-on-behalf booking to validate it.
   * Transitions the booking from awaiting-guest-confirmation → 'accepted',
   * starts the payment deadline, and notifies the host.
   */
  async confirmByGuest(id: string, callerId: number) {
    const booking = await this.findOne(id);
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.guestId !== callerId) {
      throw new ForbiddenException('Only the target guest can confirm this booking');
    }
    if (!booking.awaitingGuestConfirmation) {
      throw new BadRequestException('Booking does not require guest confirmation');
    }

    const now = new Date();
    await this.bookingRepository.update(id, {
      status: 'accepted' as any,
      awaitingGuestConfirmation: false,
      guestConfirmedAt: now,
      acceptedAt: now,
      paymentDeadlineAt: new Date(Date.now() + PAYMENT_DEADLINE_HOURS * 3600 * 1000),
      acceptDeadlineAt: null,
    });
    const updated = await this.findOne(id);

    try { await this.cache.invalidatePattern(`app:avail:${booking.propertyId}:*`); } catch {}

    this.eventsGateway.emitBookingUpdate(String(booking.guestId), updated);
    if (booking.property?.hostId) {
      this.eventsGateway.emitBookingUpdate(String(booking.property.hostId), updated);
    }

    this.jobProducer.queueNotification({
      userId: booking.guestId,
      type: 'booking_update',
      ...NotificationContent.bookingAccepted({
        propertyName: booking.property?.title,
        bookingId: id,
        paymentDeadlineHours: PAYMENT_DEADLINE_HOURS,
      }),
      channel: 'both',
      actionUrl: `/bookings/${id}/payment`,
      metadata: { bookingId: id, status: 'accepted', confirmedByGuest: true },
    });
    if (booking.property?.hostId) {
      this.jobProducer.queueNotification({
        userId: booking.property.hostId as any,
        type: 'booking_guest_confirmed',
        title: 'Réservation validée par le guest',
        message: `Le guest a validé la réservation pour « ${booking.property?.title || ''} ». Paiement en attente.`,
        channel: 'in_app',
        actionUrl: `/bookings/${id}`,
        metadata: { bookingId: id },
      });
    }

    return updated;
  }

  async declineBooking(id: string, reason?: string, scopeCtx?: ScopeContext) {
    const booking = await this.findOne(id);
    if (!booking) throw new NotFoundException('Booking not found');

    await this.assertBookingAccess(booking, scopeCtx);

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
      ...NotificationContent.bookingDeclined({
        propertyName: booking.property?.title,
        bookingId: id,
        reason,
      }),
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
  }, scopeCtx?: ScopeContext) {
    const booking = await this.findOne(id);
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== 'pending') throw new BadRequestException('Can only counter-offer pending bookings');

    await this.assertBookingAccess(booking, scopeCtx);

    const updateData: any = {
      status: 'counter_offer',
      hostResponse: data.message || null,
    };

    if (data.newPrice) updateData.totalPrice = data.newPrice;
    if (data.newCheckIn) updateData.checkInDate = parseISO(data.newCheckIn);
    if (data.newCheckOut) updateData.checkOutDate = parseISO(data.newCheckOut);

    await this.bookingRepository.update(id, updateData);
    const updated = await this.findOne(id);

    this.eventsGateway.emitBookingUpdate(String(booking.guestId), updated);

    this.jobProducer.queueNotification({
      userId: booking.guestId,
      type: 'booking_update',
      ...NotificationContent.bookingCounterOffer({
        propertyName: booking.property?.title,
        bookingId: id,
        message: data.message,
      }),
      actionUrl: `/bookings/${id}`,
      metadata: { bookingId: id, status: 'counter_offer' },
    });

    return updated;
  }

  async findByGuest(
    guestId: number,
    scopeCtx?: ScopeContext,
    pagination?: { page?: number; limit?: number },
  ) {
    if (scopeCtx && scopeCtx.userId !== guestId &&
        scopeCtx.userRole !== 'hyper_admin') {
      throw new ForbiddenException('Cannot view bookings for another user');
    }
    const page = Math.max(1, pagination?.page ?? 1);
    const limit = Math.max(1, Math.min(100, pagination?.limit ?? 20));
    const [data, total] = await this.bookingRepository.findAndCount({
      where: { guestId },
      relations: ['property'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  /**
   * Guest-initiated cancel. When the booking carries hostCascadeFlag=true
   * (host was paused/archived), the cancel is auto-approved with no fees:
   *  • Online payment methods → full refund (paymentStatus → 'refunded').
   *  • Cash (hand-to-hand)    → no refund (nothing was processed by us).
   * Outside of host-cascade, the standard cancellation policy applies via
   * existing flows; this method only short-circuits the cascade case.
   */
  async cancelByGuest(id: string, callerId: number, reason?: string) {
    const booking = await this.findOne(id);
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.guestId !== callerId) {
      throw new ForbiddenException('You can only cancel your own bookings');
    }
    if (['cancelled', 'rejected', 'completed'].includes(booking.status)) {
      throw new BadRequestException('Booking already finalized');
    }

    const isHostCascade = (booking as any).hostCascadeFlag === true;
    const isCash = booking.paymentMethod === 'cash';
    const newPaymentStatus =
      isHostCascade && !isCash ? 'refunded' : booking.paymentStatus;

    await this.bookingRepository.update(id, {
      status: 'cancelled' as any,
      cancelledAt: new Date(),
      cancellationReason:
        reason ||
        (isHostCascade ? 'Auto-cancel: host paused/archived' : 'Cancelled by guest'),
      paymentStatus: newPaymentStatus as any,
      cancelledBy: isHostCascade ? 'system_host_cascade' : 'guest',
    } as any);

    const updated = await this.findOne(id);
    this.eventsGateway.emitBookingUpdate(String(booking.guestId), updated);

    this.jobProducer.queueNotification({
      userId: booking.guestId,
      type: 'booking_update',
      ...(isHostCascade
        ? NotificationContent.bookingCancelledHostCascade({
            propertyName: booking.property?.title,
            bookingId: id,
            isCash,
          })
        : NotificationContent.bookingCancelledByGuest({
            propertyName: booking.property?.title,
            bookingId: id,
          })),
      actionUrl: `/bookings/${id}`,
      metadata: { bookingId: id, status: 'cancelled', autoApproved: isHostCascade },
    });

    this.logger.log(
      `Booking ${id} cancelled by guest ${callerId} ` +
        `(hostCascade=${isHostCascade}, refund=${newPaymentStatus === 'refunded'})`,
    );

    return updated;
  }

  /**
   * Assert the caller has access to manage this booking (accept/decline/counter-offer/status).
   * - hyper_admin/hyper_manager: global access
   * - admin: must own the booking's property
   * - manager: must have scoped permission for the property
   * - guest who made the booking: allowed for cancel only (handled upstream)
   */
  private async assertBookingAccess(booking: Booking, scopeCtx?: ScopeContext): Promise<void> {
    if (!scopeCtx) return;
    const { userRole, userId } = scopeCtx;

    // Only hyper_admin has unrestricted global access
    if (userRole === 'hyper_admin') return;

    // Booking guest can access their own booking
    if (booking.guestId === userId) return;

    if (userRole === 'admin') {
      const isOwner = await this.rolesService.isPropertyOwner(userId, booking.propertyId);
      if (isOwner) return;
      throw new ForbiddenException('You do not own this booking\'s property');
    }

    // hyper_manager uses scoped perms like manager
    if (userRole === 'hyper_manager' || userRole === 'manager') {
      const hasAccess = await this.rolesService.hasPermissionForProperty(
        userId, booking.propertyId, 'manage_bookings',
      );
      if (hasAccess) return;
      throw new ForbiddenException('No permission to manage this booking');
    }

    throw new ForbiddenException('Insufficient permissions');
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
}
