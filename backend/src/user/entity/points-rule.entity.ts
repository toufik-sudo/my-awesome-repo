import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type PointsRuleType = 'earning' | 'conversion';
export type PointsTargetRole = 'guest' | 'manager';

@Entity('points_rules')
export class PointsRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  createdByUserId: number;

  @Column({ type: 'varchar', length: 20 })
  ruleType: PointsRuleType;

  /** Which role earns/converts: guest or manager */
  @Column({ type: 'varchar', length: 20 })
  targetRole: PointsTargetRole;

  /** Action that triggers points (booking_completed, review_submitted, referral_signup, property_shared, etc.) */
  @Column({ type: 'varchar', length: 50 })
  action: string;

  /** Points earned per action (earning rules only, must be > 0) */
  @Column({ default: 0 })
  pointsAmount: number;

  /** For conversion rules: how many points = 1 unit of currency */
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  conversionRate: number;

  /** Currency code for conversion */
  @Column({ type: 'varchar', length: 5, default: 'MAD' })
  currency: string;

  /** Min points for conversion (conversion rules only, required) */
  @Column({ nullable: true })
  minPointsForConversion: number;

  /** Max points per period (earning rules only, 0 = unlimited) */
  @Column({ default: 0 })
  maxPointsPerPeriod: number;

  /** Period for max points (daily, weekly, monthly) — earning rules only */
  @Column({ type: 'varchar', length: 20, nullable: true })
  period: string;

  /** Multiplier for special events (earning rules only, must be > 0) */
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1 })
  multiplier: number;

  /** Minimum number of nights required to earn points (optional for earning) */
  @Column({ type: 'int', nullable: true })
  minNights: number;

  /** Start date of the rule application period (optional for earning) */
  @Column({ type: 'date', nullable: true })
  validFrom: Date;

  /** End date of the rule application period (optional for earning) */
  @Column({ type: 'date', nullable: true })
  validTo: Date;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
