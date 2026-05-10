import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, In } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { HostPayout } from '../entity/host-payout.entity';
import { HostFeeDebt } from '../entity/host-fee-debt.entity';
import { User } from '../../user/entity/user.entity';
import { Property } from '../../properties/entity/property.entity';
import { TourismService } from '../../services/entity/tourism-service.entity';
import { JobProducerService } from '../../infrastructure/jobs';
import { EventsGateway } from '../../infrastructure/websocket';

/**
 * Releases scheduled payouts whose claim window has elapsed.
 *
 *  - Only payouts with status='scheduled' and releaseAt <= now are touched.
 *  - Payouts on disputed bookings (status='on_hold') are skipped.
 *  - Outstanding HostFeeDebts are deducted from the net amount before release.
 *  - On debt overdue (>HOST_ARCHIVE_AFTER_MONTHS), the host's properties/services
 *    are archived (cascading suspension model).
 *  - Runs every 10 minutes; idempotent.
 */
@Injectable()
export class PayoutSchedulerService {
  private readonly logger = new Logger(PayoutSchedulerService.name);

  constructor(
    @InjectRepository(HostPayout) private readonly payoutRepo: Repository<HostPayout>,
    @InjectRepository(HostFeeDebt) private readonly debtRepo: Repository<HostFeeDebt>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Property) private readonly propertyRepo: Repository<Property>,
    @InjectRepository(TourismService) private readonly serviceRepo: Repository<TourismService>,
    private readonly config: ConfigService,
    private readonly jobs: JobProducerService,
    private readonly events: EventsGateway,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES, { name: 'release-due-payouts' })
  async releaseDuePayouts(): Promise<void> {
    const now = new Date();
    const due = await this.payoutRepo.find({
      where: { status: 'scheduled', releaseAt: LessThanOrEqual(now) },
      take: 200,
    });
    if (due.length === 0) return;

    this.logger.log(`[PayoutScheduler] ${due.length} payout(s) due for release`);
    for (const payout of due) {
      try {
        await this.releaseOne(payout);
      } catch (e) {
        this.logger.error(`[PayoutScheduler] Failed to release payout ${payout.id}: ${(e as Error).message}`);
      }
    }
  }

  /** Daily — check for overdue host debts → suspend or archive. */
  @Cron(CronExpression.EVERY_DAY_AT_3AM, { name: 'enforce-host-debts' })
  async enforceHostDebts(): Promise<void> {
    const now = new Date();
    const archiveAfterMonths = Number(this.config.get('HOST_ARCHIVE_AFTER_MONTHS', 6));

    // 1. Suspend hosts whose debts are past dueAt
    const overdue = await this.debtRepo
      .createQueryBuilder('d')
      .where('d.status IN (:...statuses)', { statuses: ['pending', 'partially_settled'] })
      .andWhere('d.dueAt <= :now', { now })
      .getMany();

    const hostIdsToSuspend = new Set(overdue.map(d => d.hostUserId));
    for (const hostId of hostIdsToSuspend) {
      const host = await this.userRepo.findOne({ where: { id: hostId } });
      if (!host || host.suspendedAt) continue;
      host.suspendedAt = now;
      host.suspendedReason = 'Unpaid platform fees / disputes';
      await this.userRepo.save(host);
      await this.cascadeSuspend(hostId, 'paused');
      this.logger.warn(`[PayoutScheduler] Host ${hostId} suspended for unpaid debts`);
      await this.notifyHostSanction(host, 'suspended');
    }

    // 2. Archive properties/services if grace period elapsed
    const archiveCutoff = new Date(now);
    archiveCutoff.setMonth(archiveCutoff.getMonth() - archiveAfterMonths);

    const veryOverdue = await this.debtRepo
      .createQueryBuilder('d')
      .where('d.status IN (:...statuses)', { statuses: ['pending', 'partially_settled'] })
      .andWhere('d.createdAt <= :cutoff', { cutoff: archiveCutoff })
      .getMany();

    const hostIdsToArchive = new Set(veryOverdue.map(d => d.hostUserId));
    for (const hostId of hostIdsToArchive) {
      const host = await this.userRepo.findOne({ where: { id: hostId } });
      if (!host || host.archivedAt) continue;
      host.archivedAt = now;
      await this.userRepo.save(host);
      await this.cascadeSuspend(hostId, 'archived');
      this.logger.warn(`[PayoutScheduler] Host ${hostId} archived (grace period elapsed)`);
      await this.notifyHostSanction(host, 'archived');
    }
  }

  // ── core ────────────────────────────────────────────────────────────────

  private async releaseOne(payout: HostPayout): Promise<void> {
    // Refresh latest state (avoid stale cache)
    const fresh = await this.payoutRepo.findOne({ where: { id: payout.id } });
    if (!fresh || fresh.status !== 'scheduled') return;

    // Deduct outstanding debts from netAmount
    const debts = await this.debtRepo.find({
      where: { hostUserId: fresh.hostUserId, status: In(['pending', 'partially_settled']) },
      order: { createdAt: 'ASC' },
    });

    let remainingNet = Number(fresh.netAmount);
    let totalDeducted = 0;

    for (const debt of debts) {
      if (remainingNet <= 0) break;
      const owed = Number(debt.amount) - Number(debt.settledAmount);
      const take = Math.min(owed, remainingNet);
      debt.settledAmount = Number(debt.settledAmount) + take;
      debt.status = debt.settledAmount >= Number(debt.amount) ? 'settled' : 'partially_settled';
      await this.debtRepo.save(debt);
      remainingNet -= take;
      totalDeducted += take;
    }

    fresh.releasedAmount = Math.max(0, Math.round(remainingNet * 100) / 100);
    fresh.status = 'released';
    fresh.releasedAt = new Date();
    fresh.notes = totalDeducted > 0
      ? `Released after deducting ${totalDeducted} ${fresh.currency} of platform debts.`
      : null;
    await this.payoutRepo.save(fresh);

    this.logger.log(
      `[PayoutScheduler] Payout ${fresh.id} RELEASED → host=${fresh.hostUserId} ` +
      `released=${fresh.releasedAmount} (deducted=${totalDeducted})`,
    );

    // If host has no more debts and was suspended ONLY for debts, lift suspension
    const remainingDebts = await this.debtRepo.count({
      where: { hostUserId: fresh.hostUserId, status: In(['pending', 'partially_settled']) },
    });
    if (remainingDebts === 0) {
      const host = await this.userRepo.findOne({ where: { id: fresh.hostUserId } });
      if (host?.suspendedAt && host.suspendedReason?.includes('Unpaid platform fees')) {
        host.suspendedAt = null;
        host.suspendedReason = null;
        host.reactivationDueAmount = 0;
        await this.userRepo.save(host);
        await this.cascadeSuspend(fresh.hostUserId, 'active');
      }
    }

    // Notify host of effective release
    const host = await this.userRepo.findOne({ where: { id: fresh.hostUserId } });
    if (host?.email) {
      await this.jobs.sendEmail({
        to: host.email,
        subject: `Versement libéré — ${fresh.releasedAmount} ${fresh.currency}`,
        body: `Votre versement de ${fresh.releasedAmount} ${fresh.currency} a été libéré.${
          totalDeducted > 0 ? ` Note : ${totalDeducted} ${fresh.currency} ont été déduits pour solder des frais plateforme dus.` : ''
        }`,
        template: 'payout-released',
        context: {
          hostName: host.firstName || host.email,
          released: fresh.releasedAmount,
          deducted: totalDeducted,
          currency: fresh.currency,
          payoutId: fresh.id,
        },
      });
    }
    if (host) {
      await this.jobs.queueNotification({
        userId: host.id,
        type: 'payout_released',
        title: `Versement libéré — ${fresh.releasedAmount} ${fresh.currency}`,
        message: `Votre versement a été libéré sur votre compte.`,
        actionUrl: `/host/payouts/${fresh.id}`,
      });
      this.events.emitToUser(String(host.id), 'payout:released', {
        payoutId: fresh.id,
        releasedAmount: fresh.releasedAmount,
      });
    }
  }

  private async cascadeSuspend(hostId: number, mode: 'paused' | 'archived' | 'active') {
    const propStatus = mode === 'archived' ? 'archived' : mode === 'paused' ? 'paused' : 'published';
    await this.propertyRepo
      .createQueryBuilder()
      .update(Property)
      .set({ status: propStatus as any })
      .where('hostId = :hostId', { hostId })
      .execute()
      .catch((e) => this.logger.warn(`[PayoutScheduler] Property cascade failed: ${e.message}`));

    await this.serviceRepo
      .createQueryBuilder()
      .update(TourismService)
      .set({ status: propStatus as any })
      .where('providerId = :hostId', { hostId })
      .execute()
      .catch((e) => this.logger.warn(`[PayoutScheduler] Service cascade failed: ${e.message}`));
  }

  private async notifyHostSanction(host: User, type: 'suspended' | 'archived') {
    const penalty = Number(this.config.get('HOST_REACTIVATION_PENALTY_DZD', 2500));
    const subject = type === 'suspended'
      ? `Compte suspendu — frais plateforme impayés`
      : `Compte archivé — délai de régularisation dépassé`;
    const body =
      `Votre compte a été ${type === 'suspended' ? 'suspendu' : 'archivé'} pour cause de frais plateforme impayés.\n` +
      `Pour réactiver votre compte, veuillez régler le solde dû ainsi qu'une pénalité de ${penalty} DA via la page de réactivation.`;
    if (host.email) {
      await this.jobs.sendEmail({
        to: host.email, subject, body,
        template: 'host-sanction',
        context: { hostName: host.firstName || host.email, type, penalty },
      });
    }
    await this.jobs.queueNotification({
      userId: host.id,
      type: type === 'suspended' ? 'host_suspended' : 'host_archived',
      title: subject,
      message: body,
      actionUrl: `/host/reactivation`,
    });
  }
}
