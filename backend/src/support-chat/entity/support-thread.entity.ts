import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, OneToMany, Index,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';

export type SupportThreadStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type SupportCategory = 'technical' | 'booking_issue' | 'payment' | 'property_issue' | 'general' | 'negative_review';

@Entity('support_threads')
export class SupportThread {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  subject: string;

  @Column({ type: 'varchar', length: 50, default: 'general' })
  category: SupportCategory;

  @Column({ type: 'varchar', length: 20, default: 'open' })
  status: SupportThreadStatus;

  /** The user who initiated the thread (host or guest) */
  @Index('IDX_support_thread_initiator', ['initiatorId'])
  @Column()
  initiatorId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'initiatorId' })
  initiator: User;

  /** The admin/hyper-admin assigned to this thread (nullable until assigned) */
  @Column({ nullable: true })
  assignedAdminId: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'assignedAdminId' })
  assignedAdmin: User;

  /** Optional reference to a property */
  @Column({ nullable: true })
  propertyId: string;

  /** Optional reference to a booking */
  @Column({ nullable: true })
  bookingId: string;

  /** Optional reference to a review (for negative review threads) */
  @Column({ nullable: true })
  reviewId: string;

  @Column({ type: 'int', default: 0 })
  unreadCountAdmin: number;

  @Column({ type: 'int', default: 0 })
  unreadCountUser: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
