import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Property } from '../../properties/entity/property.entity';

export type BookingStatus =
  | 'pending'
  | 'accepted'      // host accepted, awaiting guest payment
  | 'confirmed'     // payment validated by hyper admin/manager
  | 'cancelled'
  | 'completed'
  | 'rejected'
  | 'archived';     // auto-archived (no payment within 24h after acceptance)
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded' | 'failed';
export type PaymentMethod = 'cash' | 'ccp' | 'baridi_mob' | 'bank_transfer' | 'edahabia' | 'cib';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_bookings_propertyId', ['propertyId'])
  @Column()
  propertyId: string;

  @ManyToOne(() => Property, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Index('IDX_bookings_guestId', ['guestId'])
  @Column()
  guestId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guestId' })
  guest: User;

  @Column({ type: 'date' })
  checkInDate: Date;

  @Column({ type: 'date' })
  checkOutDate: Date;

  @Column({ type: 'int' })
  numberOfGuests: number;

  @Column({ type: 'int' })
  numberOfNights: number;

  // Pricing breakdown
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  pricePerNight: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  cleaningFee: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  serviceFee: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercent: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  discountType: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  effectiveRate: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalPrice: number;

  @Column({ type: 'varchar', length: 3, default: 'DZD' })
  currency: string;

  // Status
  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: BookingStatus;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  paymentStatus: PaymentStatus;

  @Column({ type: 'varchar', length: 20, nullable: true })
  paymentMethod: PaymentMethod;

  // Guest message
  @Column({ type: 'text', nullable: true })
  guestMessage: string;

  // Host response
  @Column({ type: 'text', nullable: true })
  hostResponse: string;

  @Column({ nullable: true, type: 'datetime' })
  acceptedAt: Date;

  @Column({ nullable: true, type: 'datetime' })
  confirmedAt: Date;

  @Column({ nullable: true, type: 'datetime' })
  archivedAt: Date;

  /** Deadline by which the guest must pay after host acceptance (acceptedAt + 24h). */
  @Column({ nullable: true, type: 'datetime' })
  paymentDeadlineAt: Date;

  /** Deadline by which the host must accept (createdAt + 48h). */
  @Column({ nullable: true, type: 'datetime' })
  acceptDeadlineAt: Date;

  /** Number of payment reminders sent to the guest after acceptance. */
  @Column({ type: 'int', default: 0 })
  paymentReminderCount: number;

  /** Number of acceptance reminders sent to the host. */
  @Column({ type: 'int', default: 0 })
  acceptReminderCount: number;

  /** Set to true when an admin/manager booked on behalf of this guest and the
   *  guest has not yet validated the booking. */
  @Column({ type: 'boolean', default: false })
  awaitingGuestConfirmation: boolean;

  @Column({ nullable: true, type: 'datetime' })
  guestConfirmedAt: Date | null;

  /** Admin/manager who created the booking on behalf of the guest, if any. */
  @Column({ type: 'int', nullable: true })
  createdByAdminId: number | null;

  @Column({ nullable: true, type: 'datetime' })
  cancelledAt: Date;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  // True when the host (admin) was paused/archived: guest is allowed to
  // cancel this booking with no fees, and the cancel request is auto-approved
  // without host validation. Set by HyperManagementService cascade.
  @Column({ type: 'boolean', default: false })
  hostCascadeFlag: boolean;

  // Snapshot of who initiated the cancellation: 'guest' | 'host' | 'system_host_cascade'
  @Column({ type: 'varchar', length: 30, nullable: true })
  cancelledBy: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
