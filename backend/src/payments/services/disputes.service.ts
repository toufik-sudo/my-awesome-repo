import { Injectable, Logger, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { BookingDispute, DisputeResolution, DisputeSeverity } from '../entity/booking-dispute.entity';
import { HostPayout } from '../entity/host-payout.entity';
import { HostFeeDebt } from '../entity/host-fee-debt.entity';
import { Booking } from '../../bookings/entity/booking.entity';
import { ServiceBooking } from '../../services/entity/service-booking.entity';
import { Property } from '../../properties/entity/property.entity';
import { TourismService } from '../../services/entity/tourism-service.entity';
import { User } from '../../user/entity/user.entity';
import { ScopeContext } from '../../rbac/scope-context';
import { ScopeFilterService } from '../../rbac/services/scope-filter.service';
import { JobProducerService } from '../../infrastructure/jobs';
import { EventsGateway } from '../../infrastructure/websocket';

const PERM_KEY_LIST_DISPUTES = 'backend.EscrowController.listDisputes.GET';
const PERM_KEY_RESOLVE_DISPUTE = 'backend.EscrowController.resolveDispute.PUT';

/**
 * Guest-side dispute workflow.
 *  - openDispute: guest opens a claim before/within the claim window → freezes the linked payout.
 *  - resolveDispute: hyper_admin/hyper_manager closes the case with a resolution outcome.
 *      • refund_full / refund_partial → refund is paid by the platform; a HostFeeDebt is recorded
 *        so it gets recovered from future host payouts.
 *      • release_to_host → payout flips back to scheduled.
 *      • host_suspended / host_archived → cascading sanction triggered.
 */
@Injectable()
export class DisputesService {
  private readonly logger = new Logger(DisputesService.name);

  constructor(
    @InjectRepository(BookingDispute) private readonly disputeRepo: Repository<BookingDispute>,
    @InjectRepository(HostPayout) private readonly payoutRepo: Repository<HostPayout>,
    @InjectRepository(HostFeeDebt) private readonly debtRepo: Repository<HostFeeDebt>,
    @InjectRepository(Booking) private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(ServiceBooking) private readonly sbRepo: Repository<ServiceBooking>,
    @InjectRepository(Property) private readonly propertyRepo: Repository<Property>,
    @InjectRepository(TourismService) private readonly serviceRepo: Repository<TourismService>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly scopeFilter: ScopeFilterService,
    private readonly config: ConfigService,
    private readonly jobs: JobProducerService,
    private readonly events: EventsGateway,
  ) {}

  async openDispute(data: {
    bookingId?: string;
    serviceBookingId?: string;
    guestUserId: number;
    subject: string;
    description: string;
    severity?: DisputeSeverity;
    attachments?: string[];
  }): Promise<BookingDispute> {
    if (!data.bookingId && !data.serviceBookingId) {
      throw new BadRequestException('bookingId or serviceBookingId is required');
    }

    // Authorize: guest must own the booking
    if (data.bookingId) {
      const b = await this.bookingRepo.findOne({ where: { id: data.bookingId } });
      if (!b) throw new NotFoundException('Booking not found');
      if (b.guestId !== data.guestUserId) {
        throw new ForbiddenException('You can only dispute your own booking');
      }
    } else {
      const sb = await this.sbRepo.findOne({ where: { id: data.serviceBookingId } });
      if (!sb) throw new NotFoundException('Service booking not found');
      if (sb.customerId !== data.guestUserId) {
        throw new ForbiddenException('You can only dispute your own service booking');
      }
    }

    const dispute = this.disputeRepo.create({
      bookingType: data.bookingId ? 'property' : 'service',
      bookingId: data.bookingId || null,
      serviceBookingId: data.serviceBookingId || null,
      guestUserId: data.guestUserId,
      subject: data.subject,
      description: data.description,
      attachments: data.attachments || [],
      severity: data.severity || 'moderate',
      status: 'open',
    });
    const saved = await this.disputeRepo.save(dispute);
    this.logger.log(`[Disputes] Opened ${saved.id} by guest ${data.guestUserId}`);

    // Freeze any linked scheduled payout
    await this.freezeRelatedPayout(saved);

    // Notify hyper-admin/manager
    await this.notifyHypers(saved);

    return saved;
  }

  async listDisputes(scopeCtx: ScopeContext, status?: string): Promise<BookingDispute[]> {
    const qb = this.disputeRepo.createQueryBuilder('d')
      .leftJoinAndSelect('d.guest', 'guest')
      .leftJoinAndSelect('d.booking', 'booking')
      .leftJoinAndSelect('booking.property', 'property')
      .leftJoinAndSelect('d.serviceBooking', 'sb')
      .leftJoinAndSelect('sb.service', 'service')
      .orderBy('d.createdAt', 'DESC');

    if (status) qb.andWhere('d.status = :status', { status });

    if (scopeCtx.userRole === 'hyper_admin') {
      // global access — no filter
    } else if (scopeCtx.userRole === 'admin') {
      // Host sees only disputes targeting their own properties/services
      qb.andWhere('(property.hostId = :uid OR service.providerId = :uid)', { uid: scopeCtx.userId });
    } else if (['hyper_manager', 'manager'].includes(scopeCtx.userRole)) {
      const [propertyIds, serviceIds] = await Promise.all([
        this.scopeFilter.effectivePropertyIds(scopeCtx, PERM_KEY_LIST_DISPUTES),
        this.scopeFilter.effectiveServiceIds(scopeCtx, PERM_KEY_LIST_DISPUTES),
      ]);
      if (propertyIds !== null && propertyIds.length === 0 && serviceIds !== null && serviceIds.length === 0) return [];
      if (propertyIds !== null && serviceIds !== null && propertyIds.length > 0 && serviceIds.length > 0) {
        qb.andWhere('(booking.propertyId IN (:...propertyIds) OR sb.serviceId IN (:...serviceIds))', { propertyIds, serviceIds });
      } else if (propertyIds !== null && propertyIds.length > 0) {
        qb.andWhere('booking.propertyId IN (:...propertyIds)', { propertyIds });
      } else if (serviceIds !== null && serviceIds.length > 0) {
        qb.andWhere('sb.serviceId IN (:...serviceIds)', { serviceIds });
      } else if (propertyIds !== null || serviceIds !== null) {
        return [];
      }
    } else {
      // Guests see only their own
      qb.andWhere('d.guestUserId = :uid', { uid: scopeCtx.userId });
    }

    return qb.getMany();
  }

  async resolveDispute(
    disputeId: string,
    resolverId: number,
    resolution: DisputeResolution,
    refundAmount: number,
    note: string | undefined,
    scopeCtx: ScopeContext,
  ): Promise<BookingDispute> {
    if (!['hyper_admin', 'hyper_manager'].includes(scopeCtx.userRole)) {
      throw new ForbiddenException('Only hyper_admin / hyper_manager can resolve disputes');
    }

    const dispute = await this.disputeRepo.findOne({
      where: { id: disputeId },
      relations: ['booking', 'booking.property', 'serviceBooking', 'serviceBooking.service'],
    });
    if (!dispute) throw new NotFoundException('Dispute not found');
    if (['resolved_guest', 'resolved_host', 'dismissed'].includes(dispute.status)) {
      throw new BadRequestException('Dispute already resolved');
    }

    const hostUserId = dispute.booking?.property?.hostId
      || dispute.serviceBooking?.service?.providerId;

    if (scopeCtx.userRole === 'hyper_manager') {
      const [propertyIds, serviceIds] = await Promise.all([
        this.scopeFilter.effectivePropertyIds(scopeCtx, PERM_KEY_RESOLVE_DISPUTE),
        this.scopeFilter.effectiveServiceIds(scopeCtx, PERM_KEY_RESOLVE_DISPUTE),
      ]);
      const propertyId = dispute.booking?.propertyId;
      const serviceId = dispute.serviceBooking?.serviceId;
      const canAccessProperty = !propertyId || propertyIds === null || propertyIds.includes(propertyId);
      const canAccessService = !serviceId || serviceIds === null || serviceIds.includes(serviceId);
      if (!canAccessProperty || !canAccessService) {
        throw new ForbiddenException('You do not have access to resolve this dispute');
      }
    }

    dispute.resolution = resolution;
    dispute.refundAmount = refundAmount || 0;
    dispute.resolvedByUserId = resolverId;
    dispute.resolvedAt = new Date();
    dispute.resolutionNote = note || null;
    dispute.status = ['refund_full', 'refund_partial', 'host_suspended', 'host_archived'].includes(resolution)
      ? 'resolved_guest'
      : resolution === 'release_to_host' ? 'resolved_host' : 'dismissed';

    const saved = await this.disputeRepo.save(dispute);

    const payout = await this.findRelatedPayout(dispute);

    switch (resolution) {
      case 'release_to_host':
        if (payout && payout.status === 'on_hold') {
          payout.status = 'scheduled';
          payout.releaseAt = new Date(); // immediate next-cron release
          await this.payoutRepo.save(payout);
        }
        break;

      case 'refund_full':
      case 'refund_partial':
        if (payout) {
          payout.status = resolution === 'refund_full' ? 'forfeited' : 'partially_released';
          await this.payoutRepo.save(payout);
        }
        if (hostUserId && refundAmount > 0) {
          // Platform paid the refund out of pocket → host owes it back
          const due = new Date();
          due.setMonth(due.getMonth() + 1); // 1 month to settle
          await this.debtRepo.save(this.debtRepo.create({
            hostUserId,
            origin: 'dispute_refund',
            disputeId: dispute.id,
            amount: refundAmount,
            currency: payout?.currency || 'DZD',
            status: 'pending',
            dueAt: due,
            description: `Refund issued to guest for dispute ${dispute.id}`,
          }));
        }
        break;

      case 'host_suspended':
      case 'host_archived':
        if (payout) {
          payout.status = 'forfeited';
          await this.payoutRepo.save(payout);
        }
        if (hostUserId) await this.applyHostSanction(hostUserId, resolution, dispute.id);
        break;
    }

    await this.notifyParties(saved, payout, hostUserId);
    return saved;
  }

  // ── helpers ────────────────────────────────────────────────────────────

  private async findRelatedPayout(dispute: BookingDispute): Promise<HostPayout | null> {
    if (dispute.bookingId) {
      return this.payoutRepo.findOne({ where: { bookingId: dispute.bookingId } });
    }
    if (dispute.serviceBookingId) {
      return this.payoutRepo.findOne({ where: { serviceBookingId: dispute.serviceBookingId } });
    }
    return null;
  }

  private async freezeRelatedPayout(dispute: BookingDispute) {
    const payout = await this.findRelatedPayout(dispute);
    if (payout && payout.status === 'scheduled') {
      payout.status = 'on_hold';
      await this.payoutRepo.save(payout);
      this.logger.log(`[Disputes] Payout ${payout.id} frozen (on_hold) due to dispute ${dispute.id}`);
    }
  }

  private async applyHostSanction(hostUserId: number, kind: 'host_suspended' | 'host_archived', disputeId: string) {
    const host = await this.userRepo.findOne({ where: { id: hostUserId } });
    if (!host) return;
    const now = new Date();
    if (kind === 'host_suspended') {
      host.suspendedAt = now;
      host.suspendedReason = `Severe dispute (${disputeId})`;
    } else {
      host.suspendedAt = host.suspendedAt || now;
      host.archivedAt = now;
      host.suspendedReason = host.suspendedReason || `Critical dispute (${disputeId})`;
    }

    // Add reactivation penalty
    const penalty = Number(this.config.get('HOST_REACTIVATION_PENALTY_DZD', 2500));
    host.reactivationDueAmount = Number(host.reactivationDueAmount || 0) + penalty;
    await this.userRepo.save(host);

    // Cascade suspend properties/services
    const propStatus = kind === 'host_archived' ? 'archived' : 'paused';
    await this.propertyRepo.createQueryBuilder().update(Property)
      .set({ status: propStatus as any }).where('hostId = :h', { h: hostUserId }).execute()
      .catch((e) => this.logger.warn(`[Disputes] Property cascade failed: ${e.message}`));
    await this.serviceRepo.createQueryBuilder().update(TourismService)
      .set({ status: propStatus as any }).where('providerId = :h', { h: hostUserId }).execute()
      .catch((e) => this.logger.warn(`[Disputes] Service cascade failed: ${e.message}`));
  }

  private async notifyHypers(dispute: BookingDispute) {
    const hypers = await this.userRepo.createQueryBuilder('u')
      .where('u.role IN (:...roles)', { roles: ['hyper_admin', 'hyper_manager'] })
      .getMany();
    for (const h of hypers) {
      await this.jobs.queueNotification({
        userId: h.id,
        type: 'dispute_opened',
        title: `Nouvelle réclamation — ${dispute.subject}`,
        message: dispute.description.slice(0, 200),
        actionUrl: `/admin/disputes/${dispute.id}`,
      });
      this.events.emitToUser(String(h.id), 'dispute:opened', { disputeId: dispute.id });
    }
  }

  private async notifyParties(dispute: BookingDispute, payout: HostPayout | null, hostUserId?: number) {
    // Guest
    const guest = await this.userRepo.findOne({ where: { id: dispute.guestUserId } });
    if (guest) {
      await this.jobs.queueNotification({
        userId: guest.id,
        type: 'dispute_resolved',
        title: `Réclamation traitée — ${dispute.resolution}`,
        message: dispute.resolutionNote || `Statut : ${dispute.status}`,
        actionUrl: `/disputes/${dispute.id}`,
      });
      if (guest.email) {
        await this.jobs.sendEmail({
          to: guest.email,
          subject: `Votre réclamation a été traitée — ${dispute.resolution}`,
          body: `Votre réclamation a été traitée. Résolution : ${dispute.resolution}.${
            dispute.refundAmount ? ` Remboursement : ${dispute.refundAmount}.` : ''
          }${dispute.resolutionNote ? `\nNote: ${dispute.resolutionNote}` : ''}`,
          template: 'dispute-resolved',
          context: { dispute, payout },
        });
      }
    }
    // Host
    if (hostUserId) {
      const host = await this.userRepo.findOne({ where: { id: hostUserId } });
      if (host) {
        await this.jobs.queueNotification({
          userId: host.id,
          type: 'dispute_resolved_host',
          title: `Réclamation client traitée`,
          message: `Résolution : ${dispute.resolution}.${dispute.refundAmount ? ` Remboursement: ${dispute.refundAmount}.` : ''}`,
          actionUrl: `/host/disputes/${dispute.id}`,
        });
      }
    }
  }
}
