import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransferAccount } from './entity/transfer-account.entity';
import { PaymentReceipt } from './entity/payment-receipt.entity';
import { User } from '../user/entity/user.entity';
import { JobProducerService } from '../infrastructure/jobs';
import { EventsGateway } from '../infrastructure/websocket';

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
    private readonly jobProducer: JobProducerService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  // ─── Transfer Accounts ───────────────────────────────────────────────

  async getTransferAccounts(): Promise<TransferAccount[]> {
    return this.accountRepo.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async getAllTransferAccounts(): Promise<TransferAccount[]> {
    return this.accountRepo.find({ order: { sortOrder: 'ASC', createdAt: 'ASC' } });
  }

  async upsertTransferAccount(data: Partial<TransferAccount>): Promise<TransferAccount> {
    if (data.id) {
      const existing = await this.accountRepo.findOne({ where: { id: data.id } });
      if (!existing) throw new NotFoundException('Transfer account not found');
      Object.assign(existing, data);
      return this.accountRepo.save(existing);
    }
    const account = this.accountRepo.create(data);
    return this.accountRepo.save(account);
  }

  async deleteTransferAccount(id: string): Promise<void> {
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
  }): Promise<PaymentReceipt> {
    const receipt = this.receiptRepo.create({
      ...data,
      status: 'pending',
      currency: 'DZD',
    });
    return this.receiptRepo.save(receipt);
  }

  async getPendingReceipts(): Promise<PaymentReceipt[]> {
    return this.receiptRepo.find({
      where: { status: 'pending' },
      relations: ['booking', 'booking.property', 'booking.guest', 'uploadedBy', 'transferAccount'],
      order: { createdAt: 'ASC' },
    });
  }

  async approveReceipt(id: string, reviewedByUserId: number, note?: string): Promise<PaymentReceipt> {
    const receipt = await this.receiptRepo.findOne({
      where: { id },
      relations: ['booking', 'booking.property', 'uploadedBy'],
    });
    if (!receipt) throw new NotFoundException('Receipt not found');
    if (receipt.status !== 'pending') throw new BadRequestException('Receipt already reviewed');

    receipt.status = 'approved';
    receipt.reviewedByUserId = reviewedByUserId;
    receipt.reviewedAt = new Date();
    receipt.reviewNote = note || null;

    const saved = await this.receiptRepo.save(receipt);
    this.logger.log(`Receipt ${id} approved by user ${reviewedByUserId}`);

    // Send email & notification to the guest
    await this.notifyGuest(receipt, 'approved');

    return saved;
  }

  async rejectReceipt(id: string, reviewedByUserId: number, note?: string): Promise<PaymentReceipt> {
    const receipt = await this.receiptRepo.findOne({
      where: { id },
      relations: ['booking', 'booking.property', 'uploadedBy'],
    });
    if (!receipt) throw new NotFoundException('Receipt not found');
    if (receipt.status !== 'pending') throw new BadRequestException('Receipt already reviewed');

    receipt.status = 'rejected';
    receipt.reviewedByUserId = reviewedByUserId;
    receipt.reviewedAt = new Date();
    receipt.reviewNote = note || null;

    const saved = await this.receiptRepo.save(receipt);
    this.logger.log(`Receipt ${id} rejected by user ${reviewedByUserId}`);

    // Send email & notification to the guest
    await this.notifyGuest(receipt, 'rejected');

    return saved;
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

    // Queue email
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

    // Queue in-app notification
    await this.jobProducer.queueNotification({
      userId: guest.id,
      type: isApproved ? 'payment_approved' : 'payment_rejected',
      title: subject,
      message: body,
      actionUrl: `/bookings/${receipt.bookingId}`,
    });

    // Real-time socket event
    this.eventsGateway.emitToUser(String(guest.id), 'payment:status', {
      receiptId: receipt.id,
      bookingId: receipt.bookingId,
      status: decision,
    });
  }

  async getReceiptsByBooking(bookingId: string): Promise<PaymentReceipt[]> {
    return this.receiptRepo.find({
      where: { bookingId },
      relations: ['transferAccount'],
      order: { createdAt: 'DESC' },
    });
  }
}
