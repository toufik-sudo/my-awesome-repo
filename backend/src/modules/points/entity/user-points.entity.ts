import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../../../user/entity/user.entity';

export type PointAction =
  | 'booking_completed'
  | 'review_submitted'
  | 'referral_signup'
  | 'first_booking'
  | 'profile_completed'
  | 'property_verified'
  | 'service_created'
  | 'five_star_review'
  | 'monthly_bonus'
  | 'event_participation'
  | 'photo_upload'
  | 'social_share'
  | 'property_shared'
  | 'loyalty_milestone'
  | 'admin_bonus'
  | 'penalty';

export type PointTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

@Entity('user_points')
export class UserPoints {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'int', default: 0 })
  totalPoints: number;

  @Column({ type: 'int', default: 0 })
  availablePoints: number;

  @Column({ type: 'int', default: 0 })
  spentPoints: number;

  @Column({ type: 'varchar', length: 20, default: 'bronze' })
  tier: PointTier;

  @Column({ type: 'int', default: 0 })
  lifetimePoints: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('point_transactions')
export class PointTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 50 })
  action: PointAction;

  @Column({ type: 'int' })
  points: number;

  @Column({ type: 'varchar', length: 10 })
  type: 'earn' | 'spend' | 'bonus' | 'penalty';

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  referenceId: string;

  @Column({ type: 'varchar', nullable: true })
  referenceType: string;

  @CreateDateColumn()
  createdAt: Date;
}
