import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { Booking } from '../../bookings/entity/booking.entity';
import { ServiceBooking } from '../../services/entity/service-booking.entity';
import { User } from '../../user/entity/user.entity';

export type DisputeStatus = 'open' | 'under_review' | 'resolved_guest' | 'resolved_host' | 'dismissed';
export type DisputeSeverity = 'minor' | 'moderate' | 'severe' | 'critical';
export type DisputeResolution =
  | 'refund_full'         // Guest fully refunded incl. service fees
  | 'refund_partial'      // Partial refund, partial host payout
  | 'release_to_host'     // Dispute dismissed, host gets the full payout
  | 'host_suspended'      // Host suspended, payout forfeited
  | 'host_archived';      // Host archived (severe), payout forfeited

@Entity('booking_disputes')
@Index('IDX_booking_disputes_status', ['status'])
export class BookingDispute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Discriminator: 'property' | 'service' (backfilled from FKs for legacy rows) */
  @Index('IDX_booking_disputes_bookingType')
  @Column({ type: 'varchar', length: 20, nullable: true })
  bookingType: 'property' | 'service' | null;

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

  @Index()
  @Column()
  guestUserId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guestUserId' })
  guest: User;

  @Column({ type: 'varchar', length: 200 })
  subject: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  @Column({ type: 'varchar', length: 20, default: 'open' })
  status: DisputeStatus;

  @Column({ type: 'varchar', length: 20, default: 'moderate' })
  severity: DisputeSeverity;

  @Column({ type: 'varchar', length: 30, nullable: true })
  resolution: DisputeResolution;

  /** Refund amount actually granted to the guest (if any) */
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  refundAmount: number;

  @Column({ type: 'int', nullable: true })
  resolvedByUserId: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'resolvedByUserId' })
  resolvedBy: User;

  @Column({ type: 'datetime', nullable: true })
  resolvedAt: Date;

  @Column({ type: 'text', nullable: true })
  resolutionNote: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
