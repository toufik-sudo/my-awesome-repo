import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export type RewardType = 'discount' | 'upgrade' | 'free_service' | 'free_night' | 'cashback' | 'gift';
export type RewardStatus = 'active' | 'paused' | 'expired' | 'sold_out';
export type RedemptionStatus = 'pending' | 'confirmed' | 'used' | 'expired' | 'cancelled';

@Entity('rewards')
export class Reward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Reward display name */
  @Column({ type: 'varchar', length: 100 })
  name: string;

  /** Detailed description */
  @Column({ type: 'text', nullable: true })
  description: string;

  /** Type of reward */
  @Column({ type: 'varchar', length: 30 })
  type: RewardType;

  /** Points cost to redeem */
  @Column({ type: 'int' })
  pointsCost: number;

  /** Discount percentage (for discount type, 0-100) */
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercent: number;

  /** Fixed discount amount (e.g., 500 DZD off) */
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  /** Currency for fixed discounts */
  @Column({ type: 'varchar', length: 5, default: 'DZD' })
  currency: string;

  /** Icon or emoji for display */
  @Column({ type: 'varchar', length: 10, default: '🎁' })
  icon: string;

  /** Image URL for the reward */
  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl: string;

  /** Which tier is required to redeem (null = any tier) */
  @Column({ type: 'varchar', length: 20, nullable: true })
  requiredTier: string;

  /** Max total redemptions (null = unlimited) */
  @Column({ type: 'int', nullable: true })
  maxRedemptions: number;

  /** Current redemption count */
  @Column({ type: 'int', default: 0 })
  currentRedemptions: number;

  /** Max redemptions per user (null = unlimited) */
  @Column({ type: 'int', nullable: true })
  maxPerUser: number;

  /** Valid from date */
  @Column({ type: 'date', nullable: true })
  validFrom: Date;

  /** Valid to date */
  @Column({ type: 'date', nullable: true })
  validTo: Date;

  /** Status */
  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: RewardStatus;

  /** Category for grouping in the shop */
  @Column({ type: 'varchar', length: 30, default: 'general' })
  category: string;

  /** Sort order for display */
  @Column({ type: 'int', default: 100 })
  sortOrder: number;

  /** Created by (hyper admin/manager) */
  @Column()
  createdByUserId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('reward_redemptions')
export class RewardRedemption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  rewardId: string;

  @ManyToOne(() => Reward, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rewardId' })
  reward: Reward;

  /** Points spent for this redemption */
  @Column({ type: 'int' })
  pointsSpent: number;

  /** Unique redemption code for the user */
  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  /** Status */
  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: RedemptionStatus;

  /** When the redemption was used */
  @Column({ type: 'timestamp', nullable: true })
  usedAt: Date;

  /** Booking or service ID where used */
  @Column({ type: 'varchar', nullable: true })
  usedOnReferenceId: string;

  /** Type of reference (booking, service_booking) */
  @Column({ type: 'varchar', length: 30, nullable: true })
  usedOnReferenceType: string;

  /** Expiry date for the redemption code */
  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
