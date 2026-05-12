import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Index, OneToOne,
} from 'typeorm';
import { Booking } from '../../bookings/entity/booking.entity';
import { ServiceBooking } from '../../services/entity/service-booking.entity';
import { User } from '../../user/entity/user.entity';
import { PaymentReceipt } from './payment-receipt.entity';

export type HostPayoutStatus =
  | 'scheduled'   // Awaiting release date (claim window not yet elapsed)
  | 'on_hold'     // Frozen due to an open dispute
  | 'released'    // Payout has been transferred to the host
  | 'forfeited'   // Host lost the payout (dispute resolved against host)
  | 'partially_released'; // Partial payout (partial refund issued to guest)

@Entity('host_payouts')
@Index('IDX_host_payouts_hostUserId_status', ['hostUserId', 'status'])
@Index('IDX_host_payouts_releaseAt', ['releaseAt'])
export class HostPayout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Discriminator: 'property' | 'service' (backfilled from FKs for legacy rows) */
  @Index('IDX_host_payouts_bookingType')
  @Column({ type: 'varchar', length: 20, nullable: true })
  bookingType: 'property' | 'service' | null;

  /** Property booking (mutually exclusive with serviceBookingId) */
  @Index()
  @Column({ type: 'uuid', nullable: true })
  bookingId: string;

  @ManyToOne(() => Booking, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  serviceBookingId: string;

  @ManyToOne(() => ServiceBooking, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'serviceBookingId' })
  serviceBooking: ServiceBooking;

  /** Receipt that triggered this payout (after approval) */
  @Column({ type: 'uuid', nullable: true })
  receiptId: string;

  @ManyToOne(() => PaymentReceipt, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'receiptId' })
  receipt: PaymentReceipt;

  /** Host who will receive the payout */
  @Index()
  @Column()
  hostUserId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hostUserId' })
  host: User;

  /** Total amount paid by guest (gross) */
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  grossAmount: number;

  /** Platform fee charged on the host side */
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  platformFee: number;

  /** Service fee charged on the guest side (refundable in case of dispute) */
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  guestServiceFee: number;

  /** Net amount the host will actually receive (grossAmount - platformFee) */
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  netAmount: number;

  /** Amount actually released so far (supports partial releases) */
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  releasedAmount: number;

  @Column({ type: 'varchar', length: 3, default: 'DZD' })
  currency: string;

  /** When the payout becomes eligible for release (check-in + CLAIM_WINDOW_HOURS) */
  @Column({ type: 'datetime' })
  releaseAt: Date;

  @Column({ type: 'varchar', length: 30, default: 'scheduled' })
  status: HostPayoutStatus;

  /** When the payout was actually released (full or partial) */
  @Column({ type: 'datetime', nullable: true })
  releasedAt: Date;

  @Column({ type: 'int', nullable: true })
  releasedByUserId: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'releasedByUserId' })
  releasedBy: User;

  /** Reference of the outbound transfer (CCP txn id, Stripe transfer id, etc.) */
  @Column({ nullable: true })
  externalTransferRef: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
