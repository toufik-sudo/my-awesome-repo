import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

export type BlameType =
  | 'guest_no_payment'    // guest didn't pay within 24h after host acceptance
  | 'host_no_response'    // host didn't accept within 48h
  | 'manual';             // manual blame issued by hyper admin/manager

@Entity('user_blames')
export class UserBlame {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_user_blames_userId')
  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 30 })
  type: BlameType;

  @Column({ type: 'text', nullable: true })
  reason: string;

  /** Booking or service-booking id that triggered this blame, if any. */
  @Column({ type: 'varchar', length: 64, nullable: true })
  bookingRef: string;

  @Column({ nullable: true })
  createdByUserId: number;

  @CreateDateColumn()
  createdAt: Date;

  /** Set when the blame is removed by hyper admin/manager (after support contact). */
  @Column({ type: 'datetime', nullable: true })
  removedAt: Date;

  @Column({ nullable: true })
  removedByUserId: number;

  @Column({ type: 'text', nullable: true })
  removalNote: string;
}
