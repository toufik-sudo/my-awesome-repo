import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Booking } from '../../bookings/entity/booking.entity';
import { User } from '../../user/entity/user.entity';
import { TransferAccount } from './transfer-account.entity';

export type ReceiptStatus = 'pending' | 'approved' | 'rejected';

@Entity('payment_receipts')
export class PaymentReceipt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bookingId: string;

  @ManyToOne(() => Booking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @Column()
  uploadedByUserId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'uploadedByUserId' })
  uploadedBy: User;

  @Column({ nullable: true })
  transferAccountId: string;

  @ManyToOne(() => TransferAccount, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'transferAccountId' })
  transferAccount: TransferAccount;

  @Column({ type: 'varchar', length: 1000 })
  receiptUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  originalFileName: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'DZD' })
  currency: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: ReceiptStatus;

  @Column({ nullable: true })
  reviewedByUserId: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'reviewedByUserId' })
  reviewedBy: User;

  @Column({ type: 'datetime', nullable: true })
  reviewedAt: Date;

  @Column({ type: 'text', nullable: true })
  reviewNote: string;

  @Column({ type: 'text', nullable: true })
  guestNote: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
