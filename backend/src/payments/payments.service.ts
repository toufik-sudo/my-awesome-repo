import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TransferAccount } from './entity/transfer-account.entity';
import { PaymentReceipt } from './entity/payment-receipt.entity';
import { User } from '../user/entity/user.entity';
import { Booking } from '../bookings/entity/booking.entity';
import { ServiceBooking } from '../services/entity/service-booking.entity';
import { JobProducerService } from '../infrastructure/jobs';
import { EventsGateway } from '../infrastructure/websocket';
import { ScopeContext, getScopedPerms } from '../rbac/scope-context';
import { ScopeFilterService } from '../rbac/services/scope-filter.service';
import { EscrowService } from './services/escrow.service';
import { HyperNotifierService } from '../user/services/hyper-notifier.service';

const PERM_KEY_PENDING_RECEIPTS = 'backend.PaymentsController.getPendingReceipts.GET';
const PERM_KEY_APPROVE_RECEIPT = 'backend.PaymentsController.approveReceipt.PUT';
const PERM_KEY_REJECT_RECEIPT = 'backend.PaymentsController.rejectReceipt.PUT';
const PERM_KEY_RECEIPTS_BY_BOOKING = 'backend.PaymentsController.getReceiptsByBooking.GET';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(TransferAccount)
    private readonly accountRepo: Repository<TransferAccount>,
    @InjectRepository(PaymentReceipt)
    private readonly receiptRepo: Repository<PaymentReceipt>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(ServiceBooking)
    private readonly serviceBookingRepo: Repository<ServiceBooking>,
    private readonly jobProducer: JobProducerService,
    private readonly eventsGateway: EventsGateway,
    private readonly scopeFilter: ScopeFilterService,
    private readonly escrow: EscrowService,
    private readonly hyperNotifier: HyperNotifierService,
  ) {}

  // ─── Transfer Accounts ───────────────────────────────────────────────

  async getTransferAccounts(): Promise<TransferAccount[]> {
    return this.accountRepo.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async getAllTransferAccounts(scopeCtx?: ScopeContext): Promise<TransferAccount[]> {
    // Only hyper roles can list all transfer accounts
    if (scopeCtx && !['hyper_admin', 'hyper_manager', 'admin'].includes(scopeCtx.userRole)) {
      throw new ForbiddenException('Insufficient permissions to list all transfer accounts');
    }
    return this.accountRepo.find({ order: { sortOrder: 'ASC', createdAt: 'ASC' } });
  }

  async upsertTransferAccount(data: Partial<TransferAccount>, scopeCtx?: ScopeContext): Promise<TransferAccount> {
    // Only hyper/admin roles can manage transfer accounts
    if (scopeCtx && !['hyper_admin', 'hyper_manager', 'admin'].includes(scopeCtx.userRole)) {
      throw new ForbiddenException('Insufficient permissions to manage transfer accounts');
    }
    if (data.id) {
      const existing = await this.accountRepo.findOne({ where: { id: data.id } });
      if (!existing) throw new NotFoundException('Transfer account not found');
      Object.assign(existing, data);
      return this.accountRepo.save(existing);
    }
    const account = this.accountRepo.create(data);
    return this.accountRepo.save(account);
  }

  async deleteTransferAccount(id: string, scopeCtx?: ScopeContext): Promise<void> {
    if (scopeCtx && !['hyper_admin', 'hyper_manager', 'admin'].includes(scopeCtx.userRole)) {
      throw new ForbiddenException('Insufficient permissions to delete transfer accounts');
    }
    const result = await this.accountRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Transfer account not found');
  }

  // ─── Payment Receipts ────────────────────────────────────────────────

  async uploadReceipt(data: {
    bookingId: string;
    uploadedByUserId: number;
    receiptUrl: string;
    originalFileName: string;
    amount: number;
    transferAccountId?: string;
    guestNote?: string;
  }, scopeCtx?: ScopeContext): Promise<PaymentReceipt> {
    // Verify the uploader matches the scopeCtx user (no impersonation)
    if (scopeCtx && data.uploadedByUserId !== scopeCtx.userId) {
      throw new ForbiddenException('Cannot upload receipt for another user');
    }
    const receipt = this.receiptRepo.create({
      ...data,
      status: 'pending',
      currency: 'DZD',
    });
    const saved = await this.receiptRepo.save(receipt);
    // Notify hyper-admin / hyper-manager that a receipt is awaiting validation
    this.escrow.notifyHyperOnReceiptSubmitted(saved).catch((e) =>
      this.logger.warn(`[Payments] notifyHyperOnReceiptSubmitted failed: ${e.message}`),
    );
    return saved;
  }

  async getPendingReceipts(scopeCtx?: ScopeContext): Promise<PaymentReceipt[]> {
    const qb = this.receiptRepo.createQueryBuilder('r')
      .leftJoinAndSelect('r.booking', 'booking')
      .leftJoinAndSelect('booking.property', 'property')
      .leftJoinAndSelect('booking.guest', 'guest')
      .leftJoinAndSelect('r.uploadedBy', 'uploadedBy')
      .leftJoinAndSelect('r.transferAccount', 'transferAccount')
      .where('r.status = :status', { status: 'pending' })
      .orderBy('r.createdAt', 'ASC');

    // Scope filter: admin sees only receipts for their properties; hyper_manager scoped like manager
    if (scopeCtx) {
      const { userRole } = scopeCtx;
      if (userRole === 'hyper_admin') {
        // global access — no filter
      } else if (userRole === 'admin') {
        qb.andWhere('property.hostId = :hostId', { hostId: scopeCtx.userId });
      } else if (['hyper_manager', 'manager', 'guest'].includes(userRole)) {
        const allowedIds = await this.scopeFilter.resolvePropertyIds(
          getScopedPerms(scopeCtx), PERM_KEY_PENDING_RECEIPTS,
        );
        if (allowedIds !== null) {
          if (allowedIds.length === 0) return [];
          qb.andWhere('booking.propertyId IN (:...allowedIds)', { allowedIds });
        }
      }
    }

    return qb.getMany();
  }

  async approveReceipt(id: string, reviewedByUserId: number, note?: string, scopeCtx?: ScopeContext): Promise<PaymentReceipt> {
    const receipt = await this.receiptRepo.findOne({
      where: { id },
      relations: ['booking', 'booking.property', 'uploadedBy'],
    });
    if (!receipt) throw new NotFoundException('Receipt not found');
    if (receipt.status !== 'pending') throw new BadRequestException('Receipt already reviewed');

    // Scope: verify the reviewer has access to the booking's property
    await this.assertReceiptAccess(receipt, scopeCtx, PERM_KEY_APPROVE_RECEIPT);

    receipt.status = 'approved';
    receipt.reviewedByUserId = reviewedByUserId;
    receipt.reviewedAt = new Date();
    receipt.reviewNote = note || null;

    const saved = await this.receiptRepo.save(receipt);
    this.logger.log(`Receipt ${id} approved by user ${reviewedByUserId}`);

    // Create the host payout (escrow split + scheduled release date)
    try {
      await this.escrow.createPayoutForReceipt(saved);
    } catch (e) {
      this.logger.error(`[Payments] Escrow payout creation failed for receipt ${id}: ${(e as Error).message}`);
    }

    // Flip booking → confirmed + paid (was 'accepted' awaiting payment)
    try {
      if (receipt.bookingId) {
        await this.bookingRepo.update(receipt.bookingId, {
          status: 'confirmed' as any,
          paymentStatus: 'paid' as any,
          confirmedAt: new Date(),
        });
        const updated = await this.bookingRepo.findOne({
          where: { id: receipt.bookingId },
          relations: ['property', 'guest'],
        });
        if (updated) {
          this.eventsGateway.emitBookingUpdate(String(updated.guestId), updated);
          if (updated.property?.hostId) {
            this.eventsGateway.emitBookingUpdate(String(updated.property.hostId), updated);
            // Notify host that payment was validated
            await this.jobProducer.queueNotification({
              userId: updated.property.hostId as any,
              type: 'booking_update',
              title: 'Guest payment validated — booking confirmed',
              message: `Booking ${receipt.bookingId.slice(0, 8)} is fully confirmed.`,
              channel: 'both',
              actionUrl: `/bookings/${receipt.bookingId}`,
              metadata: { bookingId: receipt.bookingId, status: 'confirmed' },
            });
          }
        }
      } else if (receipt.serviceBookingId) {
        await this.serviceBookingRepo.update(receipt.serviceBookingId, {
          status: 'confirmed' as any,
          paymentStatus: 'paid' as any,
          confirmedAt: new Date(),
        });
      }
    } catch (e) {
      this.logger.error(`[Payments] Booking confirmation update failed for receipt ${id}: ${(e as Error).message}`);
    }

    await this.notifyGuest(receipt, 'approved');

    // Hyper oversight notification
    await this.hyperNotifier.notifyHypers({
      type: 'booking_update',
      title: 'Payment validated — booking confirmed',
      message: `Receipt ${id.slice(0, 8)} approved; booking is now confirmed.`,
      actionUrl: `/admin/bookings/${receipt.bookingId || receipt.serviceBookingId}`,
      metadata: { receiptId: id, bookingId: receipt.bookingId, serviceBookingId: receipt.serviceBookingId },
      socketEvent: 'booking:status',
      socketPayload: { bookingId: receipt.bookingId, status: 'confirmed' },
    });

    return saved;
  }

  async rejectReceipt(id: string, reviewedByUserId: number, note?: string, scopeCtx?: ScopeContext): Promise<PaymentReceipt> {
    const receipt = await this.receiptRepo.findOne({
      where: { id },
      relations: ['booking', 'booking.property', 'uploadedBy'],
    });
    if (!receipt) throw new NotFoundException('Receipt not found');
    if (receipt.status !== 'pending') throw new BadRequestException('Receipt already reviewed');

    await this.assertReceiptAccess(receipt, scopeCtx, PERM_KEY_REJECT_RECEIPT);

    receipt.status = 'rejected';
    receipt.reviewedByUserId = reviewedByUserId;
    receipt.reviewedAt = new Date();
    receipt.reviewNote = note || null;

    const saved = await this.receiptRepo.save(receipt);
    this.logger.log(`Receipt ${id} rejected by user ${reviewedByUserId}`);

    await this.notifyGuest(receipt, 'rejected');

    return saved;
  }

  // ─── Scope helpers ───────────────────────────────────────────────────

  private async assertReceiptAccess(receipt: PaymentReceipt, scopeCtx: ScopeContext | undefined, permKey: string): Promise<void> {
    if (!scopeCtx) return;
    const { userRole, userId } = scopeCtx;

    // Only hyper_admin has unrestricted global access
    if (userRole === 'hyper_admin') return;

    // Admin: must own the property
    if (userRole === 'admin') {
      const propertyHostId = receipt.booking?.property?.hostId;
      if (propertyHostId && propertyHostId !== userId) {
        throw new ForbiddenException('You do not have access to this receipt');
      }
      return;
    }

    // hyper_manager, manager, guest: check scoped perms
    if (['hyper_manager', 'manager', 'guest'].includes(userRole)) {
      const allowedIds = await this.scopeFilter.resolvePropertyIds(
        getScopedPerms(scopeCtx), permKey,
      );
      if (allowedIds !== null && receipt.booking?.propertyId && !allowedIds.includes(receipt.booking.propertyId)) {
        throw new ForbiddenException('You do not have access to this receipt');
      }
      return;
    }

    throw new ForbiddenException('Insufficient permissions');
  }

  // ─── Notification Helper ─────────────────────────────────────────────

  private async notifyGuest(receipt: PaymentReceipt, decision: 'approved' | 'rejected') {
    const guest = receipt.uploadedBy
      || await this.userRepo.findOne({ where: { id: receipt.uploadedByUserId } });

    if (!guest) {
      this.logger.warn(`Cannot notify guest: user ${receipt.uploadedByUserId} not found`);
      return;
    }

    const propertyTitle = receipt.booking?.property?.title || 'your property';
    const bookingRef = receipt.bookingId.slice(0, 8).toUpperCase();
    const isApproved = decision === 'approved';

    const subject = isApproved
      ? `Payment Approved — Booking ${bookingRef}`
      : `Payment Rejected — Booking ${bookingRef}`;

    const body = isApproved
      ? `Great news! Your payment receipt for "${propertyTitle}" (Booking #${bookingRef}) has been approved. Your booking is now confirmed.`
      : `Your payment receipt for "${propertyTitle}" (Booking #${bookingRef}) has been rejected.${receipt.reviewNote ? ` Reason: ${receipt.reviewNote}` : ''} Please upload a new receipt or contact support.`;

    await this.jobProducer.sendEmail({
      to: guest.email,
      subject,
      body,
      template: isApproved ? 'payment-approved' : 'payment-rejected',
      context: {
        guestName: guest.firstName || guest.email,
        propertyTitle,
        bookingRef,
        amount: receipt.amount,
        currency: receipt.currency,
        reviewNote: receipt.reviewNote,
      },
    });

    await this.jobProducer.queueNotification({
      userId: guest.id,
      type: isApproved ? 'payment_approved' : 'payment_rejected',
      title: subject,
      message: body,
      actionUrl: `/bookings/${receipt.bookingId}`,
    });

    this.eventsGateway.emitToUser(String(guest.id), 'payment:status', {
      receiptId: receipt.id,
      bookingId: receipt.bookingId,
      status: decision,
    });
  }

  async getReceiptsByBooking(bookingId: string, scopeCtx?: ScopeContext): Promise<PaymentReceipt[]> {
    // Only hyper_admin has unrestricted access
    if (scopeCtx && scopeCtx.userRole !== 'hyper_admin') {
      const receipts = await this.receiptRepo.find({
        where: { bookingId },
        relations: ['booking', 'booking.property', 'transferAccount'],
        order: { createdAt: 'DESC' },
      });

      if (scopeCtx.userRole === 'admin' && receipts.length > 0) {
        const hostId = receipts[0].booking?.property?.hostId;
        if (hostId && hostId !== scopeCtx.userId) {
          throw new ForbiddenException('You do not have access to these receipts');
        }
      } else if (['hyper_manager', 'manager', 'guest'].includes(scopeCtx.userRole) && receipts.length > 0) {
        const propertyId = receipts[0].booking?.propertyId;
        if (propertyId) {
          const allowedIds = await this.scopeFilter.resolvePropertyIds(
            getScopedPerms(scopeCtx), PERM_KEY_RECEIPTS_BY_BOOKING,
          );
          if (allowedIds !== null && !allowedIds.includes(propertyId)) {
            throw new ForbiddenException('You do not have access to these receipts');
          }
        }
      }

      return receipts;
    }

    return this.receiptRepo.find({
      where: { bookingId },
      relations: ['transferAccount'],
      order: { createdAt: 'DESC' },
    });
  }
}
