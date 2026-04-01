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

  /** Action that triggers points (booking_completed, review_submitted, etc.) */
  @Column({ type: 'varchar', length: 50 })
  action: string;

  /** Points earned per action */
  @Column({ default: 0 })
  pointsAmount: number;

  /** For conversion rules: how many points = 1 unit of currency */
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  conversionRate: number;

  /** Currency code for conversion */
  @Column({ type: 'varchar', length: 5, default: 'MAD' })
  currency: string;

  /** Min points for conversion */
  @Column({ nullable: true })
  minPointsForConversion: number;

  /** Max points per period (0 = unlimited) */
  @Column({ default: 0 })
  maxPointsPerPeriod: number;

  /** Period for max points (daily, weekly, monthly) */
  @Column({ type: 'varchar', length: 20, nullable: true })
  period: string;

  /** Multiplier for special events */
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1 })
  multiplier: number;

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
