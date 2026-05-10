import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { HostPayout } from '../entity/host-payout.entity';
import { PaymentReceipt } from '../entity/payment-receipt.entity';
import { Booking } from '../../bookings/entity/booking.entity';
import { ServiceBooking } from '../../services/entity/service-booking.entity';
import { Property } from '../../properties/entity/property.entity';
import { TourismService } from '../../services/entity/tourism-service.entity';
import { User } from '../../user/entity/user.entity';
import { ServiceFeeService } from '../../user/services/service-fee.service';
import { JobProducerService } from '../../infrastructure/jobs';
import { EventsGateway } from '../../infrastructure/websocket';

/**
 * Owns the financial split that happens when a guest payment is approved.
 *  1. Compute platform fee (host-side) and guest service fee via FeeRules
 *  2. Create a HostPayout row with status=scheduled and a releaseAt date
 *     equal to (checkIn + ESCROW_CLAIM_WINDOW_HOURS).
 *  3. Notify the host with the payout amount and release date.
 */
@Injectable()
export class EscrowService {
  private readonly logger = new Logger(EscrowService.name);

  constructor(
    @InjectRepository(HostPayout) private readonly payoutRepo: Repository<HostPayout>,
    @InjectRepository(Booking) private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(ServiceBooking) private readonly serviceBookingRepo: Repository<ServiceBooking>,
    @InjectRepository(Property) private readonly propertyRepo: Repository<Property>,
    @InjectRepository(TourismService) private readonly serviceRepo: Repository<TourismService>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly feeService: ServiceFeeService,
    private readonly config: ConfigService,
    private readonly jobs: JobProducerService,
    private readonly events: EventsGateway,
  ) {}

  /** Called from PaymentsService.approveReceipt */
  async createPayoutForReceipt(receipt: PaymentReceipt): Promise<HostPayout | null> {
    if (!receipt.bookingId && !receipt.serviceBookingId) {
      this.logger.warn(`[Escrow] Receipt ${receipt.id} has neither bookingId nor serviceBookingId — skipping payout.`);
      return null;
    }

    // Avoid duplicate payouts for the same receipt
    const existing = await this.payoutRepo.findOne({ where: { receiptId: receipt.id } });
    if (existing) {
      this.logger.log(`[Escrow] Payout already exists for receipt ${receipt.id} → ${existing.id}`);
      return existing;
    }

    let hostUserId: number;
    let propertyId: string | null = null;
    let serviceId: string | null = null;
    let propertyGroupId: string | null = null;
    let serviceGroupId: string | null = null;
    let releaseAt: Date;

    if (receipt.bookingId) {
      const booking = await this.bookingRepo.findOne({
        where: { id: receipt.bookingId },
        relations: ['property'],
      });
      if (!booking) throw new NotFoundException(`Booking ${receipt.bookingId} not found`);
      const property = booking.property
        || await this.propertyRepo.findOne({ where: { id: booking.propertyId } });
      hostUserId = property.hostId;
      propertyId = property.id;
      propertyGroupId = (property as any).propertyGroupId || null;
      releaseAt = this.computeReleaseAt(booking.checkInDate);
    } else {
      const sb = await this.serviceBookingRepo.findOne({
        where: { id: receipt.serviceBookingId },
        relations: ['service'],
      });
      if (!sb) throw new NotFoundException(`ServiceBooking ${receipt.serviceBookingId} not found`);
      const svc = sb.service
        || await this.serviceRepo.findOne({ where: { id: sb.serviceId } });
      hostUserId = svc.providerId;
      serviceId = svc.id;
      serviceGroupId = (svc as any).serviceGroupId || null;
      releaseAt = this.computeReleaseAt(sb.bookingDate);
    }

    const host = await this.userRepo.findOne({ where: { id: hostUserId } });

    const grossAmount = Number(receipt.amount) || 0;

    // Resolve fees through dynamic FeeRules (with .env defaults as fallback)
    const { hostPlatformFee, guestServiceFee } = await this.resolveFees({
      hostUserId,
      propertyId,
      propertyGroupId,
      serviceId,
      serviceGroupId,
      grossAmount,
    });

    const netAmount = Math.max(0, Math.round((grossAmount - hostPlatformFee) * 100) / 100);

    const payout = this.payoutRepo.create({
      bookingId: receipt.bookingId || null,
      serviceBookingId: receipt.serviceBookingId || null,
      receiptId: receipt.id,
      hostUserId,
      host,
      grossAmount,
      platformFee: hostPlatformFee,
      guestServiceFee,
      netAmount,
      currency: receipt.currency || 'DZD',
      releaseAt,
      status: 'scheduled',
    });

    const saved = await this.payoutRepo.save(payout);
    this.logger.log(
      `[Escrow] Payout ${saved.id} created for host ${hostUserId} (gross=${grossAmount}, fee=${hostPlatformFee}, net=${netAmount}, releaseAt=${releaseAt.toISOString()})`,
    );

    await this.notifyHostPayoutScheduled(saved, host);
    return saved;
  }

  /** Notify hyper-admin / hyper-manager that a guest submitted a receipt to validate. */
  async notifyHyperOnReceiptSubmitted(receipt: PaymentReceipt): Promise<void> {
    const hypers = await this.userRepo
      .createQueryBuilder('u')
      .where('u.role IN (:...roles)', { roles: ['hyper_admin', 'hyper_manager'] })
      .andWhere('u.isActive = 1')
      .getMany();

    const ref = receipt.id.slice(0, 8).toUpperCase();
    const subject = `[Validation requise] Nouveau reçu ${ref} — ${receipt.amount} ${receipt.currency}`;
    const body = `Un guest vient de soumettre un reçu de paiement de ${receipt.amount} ${receipt.currency}. Merci de le valider rapidement pour libérer la réservation.`;

    for (const h of hypers) {
      if (h.email) {
        await this.jobs.sendEmail({
          to: h.email,
          subject,
          body,
          template: 'receipt-pending-review',
          context: { receiptId: receipt.id, amount: receipt.amount, currency: receipt.currency, ref },
        });
      }
      await this.jobs.queueNotification({
        userId: h.id,
        type: 'receipt_pending_review',
        title: subject,
        message: body,
        actionUrl: `/admin/payments/receipts/${receipt.id}`,
      });
      this.events.emitToUser(String(h.id), 'receipt:pending', { receiptId: receipt.id });
    }
  }

  // ── helpers ────────────────────────────────────────────────────────────

  private computeReleaseAt(checkInDate: Date | string): Date {
    const hours = Number(this.config.get('ESCROW_CLAIM_WINDOW_HOURS', 24));
    const base = new Date(checkInDate);
    base.setHours(base.getHours() + hours);
    return base;
  }

  private async resolveFees(args: {
    hostUserId: number;
    propertyId: string | null;
    propertyGroupId: string | null;
    serviceId: string | null;
    serviceGroupId: string | null;
    grossAmount: number;
  }) {
    let hostPlatformFee = 0;
    try {
      const res = await this.feeService.calculateFee(
        args.hostUserId,
        args.propertyId,
        args.propertyGroupId,
        args.grossAmount,
        args.serviceId,
        args.serviceGroupId,
      );
      hostPlatformFee = res?.fee || 0;
    } catch (e) {
      this.logger.warn(`[Escrow] FeeRule resolution failed, falling back to .env defaults: ${(e as Error).message}`);
    }

    if (!hostPlatformFee) {
      const pct = Number(this.config.get('DEFAULT_HOST_PLATFORM_FEE_PCT', 10));
      hostPlatformFee = Math.round(args.grossAmount * (pct / 100) * 100) / 100;
    }

    const guestPct = Number(this.config.get('DEFAULT_GUEST_SERVICE_FEE_PCT', 5));
    const guestServiceFee = Math.round(args.grossAmount * (guestPct / 100) * 100) / 100;

    return { hostPlatformFee, guestServiceFee };
  }

  private async notifyHostPayoutScheduled(payout: HostPayout, host: User) {
    if (!host) return;
    const dateStr = payout.releaseAt.toISOString().slice(0, 10);
    const subject = `Paiement reçu — versement programmé le ${dateStr}`;
    const body =
      `Bonne nouvelle ! Le paiement de votre réservation a été validé.\n` +
      `Montant net que vous recevrez : ${payout.netAmount} ${payout.currency} ` +
      `(brut ${payout.grossAmount}, frais plateforme ${payout.platformFee}).\n` +
      `Date prévue de versement : ${dateStr} (J+1 après check-in, sauf réclamation).`;

    if (host.email) {
      await this.jobs.sendEmail({
        to: host.email,
        subject,
        body,
        template: 'payout-scheduled',
        context: {
          hostName: host.firstName || host.email,
          netAmount: payout.netAmount,
          grossAmount: payout.grossAmount,
          platformFee: payout.platformFee,
          currency: payout.currency,
          releaseDate: dateStr,
          payoutId: payout.id,
        },
      });
    }
    await this.jobs.queueNotification({
      userId: host.id,
      type: 'payout_scheduled',
      title: subject,
      message: body,
      actionUrl: `/host/payouts/${payout.id}`,
      metadata: { payoutId: payout.id, releaseAt: payout.releaseAt },
    });
    this.events.emitToUser(String(host.id), 'payout:scheduled', {
      payoutId: payout.id,
      netAmount: payout.netAmount,
      releaseAt: payout.releaseAt,
    });
  }
}
