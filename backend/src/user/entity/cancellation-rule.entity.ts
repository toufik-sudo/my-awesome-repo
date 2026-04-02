import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type CancellationPolicyType = 'flexible' | 'moderate' | 'strict' | 'custom';
export type CancellationScope = 'all' | 'property_group' | 'service_group' | 'property' | 'service';

@Entity('cancellation_rules')
export class CancellationRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  hostUserId: number;

  @Column({ type: 'varchar', length: 20 })
  policyType: CancellationPolicyType;

  @Column({ type: 'varchar', length: 30 })
  scope: CancellationScope;

  @Column({ type: 'uuid', nullable: true })
  targetPropertyGroupId: string;

  @Column({ type: 'uuid', nullable: true })
  targetServiceGroupId: string;

  @Column({ type: 'uuid', nullable: true })
  targetPropertyId: string;

  @Column({ type: 'uuid', nullable: true })
  targetServiceId: string;

  /** Hours before check-in for full refund */
  @Column({ default: 24 })
  fullRefundHours: number;

  /** Hours before check-in for partial refund */
  @Column({ default: 12 })
  partialRefundHours: number;

  /** Partial refund percentage */
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 50 })
  partialRefundPercent: number;

  /** Late cancellation penalty percentage */
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  lateCancelPenalty: number;

  /** Whether no-show is penalized */
  @Column({ default: false })
  noShowPenalty: boolean;

  /** No-show penalty percentage */
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  noShowPenaltyPercent: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
