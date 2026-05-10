import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { User } from './user.entity';
import { Property } from '../../properties/entity/property.entity';
import { TourismService } from '../../services/entity/tourism-service.entity';
import { PropertyGroup } from '../../properties/entity/property-group.entity';
import { ServiceGroup } from '../../services/entity/service-group.entity';

export type FeeScope = 'global' | 'host' | 'property_group' | 'property' | 'service_group' | 'service';
export type FeeCalculation = 'percentage' | 'fixed' | 'percentage_plus_fixed' | 'fixed_then_percentage';

@Entity('service_fee_rules')
@Index('IDX_service_fee_rules_createdByUserId', ['createdByUserId'])
export class ServiceFeeRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  createdByUserId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdByUserId' })
  createdByUser: User;

  @Column({ type: 'varchar', length: 30 })
  scope: FeeScope;

  @Column({ nullable: true })
  targetHostId: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'targetHostId' })
  targetHost: User;

  @Column({ type: 'uuid', nullable: true })
  targetPropertyGroupId: string;

  @ManyToOne(() => PropertyGroup, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'targetPropertyGroupId' })
  targetPropertyGroup: PropertyGroup;

  @Column({ type: 'uuid', nullable: true })
  targetPropertyId: string;

  @ManyToOne(() => Property, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'targetPropertyId' })
  targetProperty: Property;

  @Column({ type: 'uuid', nullable: true })
  targetServiceGroupId: string;

  @ManyToOne(() => ServiceGroup, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'targetServiceGroupId' })
  targetServiceGroup: ServiceGroup;

  @Column({ type: 'uuid', nullable: true })
  targetServiceId: string;

  @ManyToOne(() => TourismService, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'targetServiceId' })
  targetService: TourismService;

  @Column({ type: 'varchar', length: 30 })
  calculationType: FeeCalculation;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  percentageRate: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  fixedAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  fixedThreshold: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  minFee: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  maxFee: number;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 100 })
  priority: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
