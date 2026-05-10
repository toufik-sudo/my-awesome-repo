import { Injectable, Logger, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../../user/entity/user.entity';
import { HostFeeDebt } from '../entity/host-fee-debt.entity';
import { PaymentReceipt } from '../entity/payment-receipt.entity';
import { Property } from '../../properties/entity/property.entity';
import { TourismService } from '../../services/entity/tourism-service.entity';
import { JobProducerService } from '../../infrastructure/jobs';

export type ReactivationMethod = 'transfer_receipt' | 'stripe';

/**
 * Handles the host reactivation flow:
 *  - getQuote: returns the outstanding amount = sum(pending debts) + reactivation penalty
 *  - submitReactivation: hyper-admin chooses how the host paid (receipt OR stripe txn)
 *      and clears the suspension if successful.
 */
@Injectable()
export class HostReactivationService {
  private readonly logger = new Logger(HostReactivationService.name);

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(HostFeeDebt) private readonly debtRepo: Repository<HostFeeDebt>,
    @InjectRepository(PaymentReceipt) private readonly receiptRepo: Repository<PaymentReceipt>,
    @InjectRepository(Property) private readonly propertyRepo: Repository<Property>,
    @InjectRepository(TourismService) private readonly serviceRepo: Repository<TourismService>,
    private readonly config: ConfigService,
    private readonly jobs: JobProducerService,
  ) {}

  async getQuote(hostUserId: number): Promise<{
    debtTotal: number;
    penalty: number;
    total: number;
    currency: string;
    debts: HostFeeDebt[];
  }> {
    const debts = await this.debtRepo.find({
      where: { hostUserId, status: In(['pending', 'partially_settled']) },
    });
    const debtTotal = debts.reduce(
      (s, d) => s + (Number(d.amount) - Number(d.settledAmount)),
      0,
    );
    const penalty = Number(this.config.get('HOST_REACTIVATION_PENALTY_DZD', 2500));
    return {
      debtTotal: Math.round(debtTotal * 100) / 100,
      penalty,
      total: Math.round((debtTotal + penalty) * 100) / 100,
      currency: 'DZD',
      debts,
    };
  }

  /**
   * The hyper-admin confirms a reactivation payment was received.
   *  - method='transfer_receipt': a PaymentReceipt was uploaded by the host & approved.
   *  - method='stripe': Stripe payment intent succeeded.
   */
  async confirmReactivation(args: {
    hostUserId: number;
    method: ReactivationMethod;
    reference: string;          // receiptId or stripe paymentIntentId
    amountPaid: number;
    confirmedByUserId: number;
    confirmedByRole: string;
  }): Promise<{ host: User; settledDebts: number }> {
    if (!['hyper_admin', 'hyper_manager'].includes(args.confirmedByRole)) {
      throw new ForbiddenException('Only hyper_admin / hyper_manager can confirm reactivation');
    }

    const host = await this.userRepo.findOne({ where: { id: args.hostUserId } });
    if (!host) throw new NotFoundException('Host not found');
    if (!host.suspendedAt && !host.archivedAt) {
      throw new BadRequestException('Host is not suspended');
    }

    const quote = await this.getQuote(args.hostUserId);
    if (args.amountPaid + 0.01 < quote.total) {
      throw new BadRequestException(
        `Insufficient payment. Required: ${quote.total} ${quote.currency}, received: ${args.amountPaid}`,
      );
    }

    // Settle every outstanding debt
    let settledCount = 0;
    for (const debt of quote.debts) {
      debt.settledAmount = Number(debt.amount);
      debt.status = 'settled';
      await this.debtRepo.save(debt);
      settledCount++;
    }

    // Clear sanctions
    host.suspendedAt = null;
    host.suspendedReason = null;
    host.archivedAt = null;
    host.reactivationDueAmount = 0;
    await this.userRepo.save(host);

    // Cascade revive
    await this.propertyRepo.createQueryBuilder().update(Property)
      .set({ status: 'published' as any })
      .where('hostId = :h AND status IN (:...statuses)', { h: host.id, statuses: ['paused', 'archived'] })
      .execute()
      .catch((e) => this.logger.warn(`[Reactivation] Property revive failed: ${e.message}`));
    await this.serviceRepo.createQueryBuilder().update(TourismService)
      .set({ status: 'published' as any })
      .where('providerId = :h AND status IN (:...statuses)', { h: host.id, statuses: ['paused', 'archived'] })
      .execute()
      .catch((e) => this.logger.warn(`[Reactivation] Service revive failed: ${e.message}`));

    this.logger.log(
      `[Reactivation] Host ${host.id} reactivated via ${args.method} (ref=${args.reference}, paid=${args.amountPaid}, debts=${settledCount})`,
    );

    if (host.email) {
      await this.jobs.sendEmail({
        to: host.email,
        subject: `Votre compte a été réactivé`,
        body: `Votre paiement de réactivation (${args.amountPaid} ${quote.currency}) a bien été enregistré. Votre compte et vos propriétés/services sont à nouveau actifs. Bienvenue de retour !`,
        template: 'host-reactivated',
        context: { hostName: host.firstName || host.email, amount: args.amountPaid, method: args.method },
      });
    }
    await this.jobs.queueNotification({
      userId: host.id,
      type: 'host_reactivated',
      title: 'Compte réactivé',
      message: `Votre compte a été réactivé. Vous pouvez à nouveau gérer vos propriétés et services.`,
      actionUrl: `/dashboard`,
    });

    return { host, settledDebts: settledCount };
  }
}
