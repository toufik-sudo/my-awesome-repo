import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type FeeScope = 'global' | 'host' | 'property_group' | 'property' | 'service_group' | 'service';
export type FeeCalculation = 'percentage' | 'fixed' | 'percentage_plus_fixed' | 'fixed_then_percentage';

@Entity('service_fee_rules')
export class ServiceFeeRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Who created this rule (hyper_admin / hyper_manager) */
  @Column()
  createdByUserId: number;

  @Column({ type: 'varchar', length: 30 })
  scope: FeeScope;

  /** Target host userId – null when scope=global */
  @Column({ nullable: true })
  targetHostId: number;

  /** Target property group – null unless scope=property_group */
  @Column({ type: 'uuid', nullable: true })
  targetPropertyGroupId: string;

  /** Target property – null unless scope=property */
  @Column({ type: 'uuid', nullable: true })
  targetPropertyId: string;

  /** Target service group – null unless scope=service_group */
  @Column({ type: 'uuid', nullable: true })
  targetServiceGroupId: string;

  /** Target service – null unless scope=service */
  @Column({ type: 'uuid', nullable: true })
  targetServiceId: string;

  @Column({ type: 'varchar', length: 30 })
  calculationType: FeeCalculation;

  /** Percentage fee (e.g. 15 for 15%) */
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  percentageRate: number;

  /** Fixed fee amount */
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fixedAmount: number;

  /**
   * Threshold for fixed_then_percentage: fixed fee applies up to this amount,
   * then percentage applies on the remainder up to maxFee
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fixedThreshold: number;

  /** Min fee cap */
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minFee: number;

  /** Max fee cap */
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxFee: number;

  /** Is this the default rule (only one global default) */
  @Column({ default: false })
  isDefault: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  description: string;

  /**
   * Priority – lower number = higher priority.
   * When multiple rules match (e.g. a property has both a host-level and property-level rule),
   * the rule with the LOWEST priority number is applied first.
   * Example: priority=1 beats priority=100.
   * Use this to override global rules for specific hosts/properties.
   */
  @Column({ default: 100 })
  priority: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
