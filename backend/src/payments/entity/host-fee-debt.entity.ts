import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { BookingDispute } from './booking-dispute.entity';

export type DebtStatus = 'pending' | 'partially_settled' | 'settled' | 'written_off';
export type DebtOrigin = 'dispute_refund' | 'reactivation_penalty' | 'manual_adjustment';

/**
 * Tracks fees the host owes to the platform.
 * - Created when a dispute is resolved in the guest's favor and the platform
 *   had to refund service fees that should be borne by the host.
 * - Created when the host needs to pay a reactivation penalty.
 * - Can be settled by deducting from future host payouts (see PayoutSchedulerService).
 */
@Entity('host_fee_debts')
@Index('IDX_host_fee_debts_hostUserId_status', ['hostUserId', 'status'])
export class HostFeeDebt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  hostUserId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hostUserId' })
  host: User;

  @Column({ type: 'varchar', length: 30 })
  origin: DebtOrigin;

  @Column({ type: 'uuid', nullable: true })
  disputeId: string;

  @ManyToOne(() => BookingDispute, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'disputeId' })
  dispute: BookingDispute;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  settledAmount: number;

  @Column({ type: 'varchar', length: 3, default: 'DZD' })
  currency: string;

  @Column({ type: 'varchar', length: 30, default: 'pending' })
  status: DebtStatus;

  /** Deadline before host gets suspended for unpaid debts */
  @Column({ type: 'datetime', nullable: true })
  dueAt: Date;

  /** Deadline before properties get archived (default: dueAt + ARCHIVE_AFTER_MONTHS) */
  @Column({ type: 'datetime', nullable: true })
  archiveAt: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
