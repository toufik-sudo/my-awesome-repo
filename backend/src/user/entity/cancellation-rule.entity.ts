import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { User } from './user.entity';
import { Property } from '../../properties/entity/property.entity';
import { TourismService } from '../../services/entity/tourism-service.entity';
import { PropertyGroup } from '../../properties/entity/property-group.entity';
import { ServiceGroup } from '../../services/entity/service-group.entity';

export type CancellationPolicyType = 'flexible' | 'moderate' | 'strict' | 'custom';
export type CancellationScope = 'all' | 'property_group' | 'service_group' | 'property' | 'service';

@Entity('cancellation_rules')
@Index('IDX_cancellation_rules_hostUserId', ['hostUserId'])
export class CancellationRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  hostUserId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hostUserId' })
  host: User;

  @Column({ type: 'varchar', length: 20 })
  policyType: CancellationPolicyType;

  @Column({ type: 'varchar', length: 30 })
  scope: CancellationScope;

  @Column({ type: 'uuid', nullable: true })
  targetPropertyGroupId: string;

  @ManyToOne(() => PropertyGroup, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'targetPropertyGroupId' })
  targetPropertyGroup: PropertyGroup;

  @Column({ type: 'uuid', nullable: true })
  targetServiceGroupId: string;

  @ManyToOne(() => ServiceGroup, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'targetServiceGroupId' })
  targetServiceGroup: ServiceGroup;

  @Column({ type: 'uuid', nullable: true })
  targetPropertyId: string;

  @ManyToOne(() => Property, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'targetPropertyId' })
  targetProperty: Property;

  @Column({ type: 'uuid', nullable: true })
  targetServiceId: string;

  @ManyToOne(() => TourismService, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'targetServiceId' })
  targetService: TourismService;

  @Column({ default: 24 })
  fullRefundHours: number;

  @Column({ default: 12 })
  partialRefundHours: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 50 })
  partialRefundPercent: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  lateCancelPenalty: number;

  @Column({ default: false })
  noShowPenalty: boolean;

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
