import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { User } from './user.entity';
import { Property } from '../../properties/entity/property.entity';
import { TourismService } from '../../services/entity/tourism-service.entity';
import { PropertyGroup } from '../../properties/entity/property-group.entity';
import { ServiceGroup } from '../../services/entity/service-group.entity';

export type PointsRuleType = 'earning' | 'conversion';
export type PointsTargetRole = 'guest' | 'manager';

@Entity('points_rules')
@Index('IDX_points_rules_createdByUserId', ['createdByUserId'])
export class PointsRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  createdByUserId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdByUserId' })
  createdBy: User;

  @Column({ type: 'varchar', length: 20 })
  ruleType: PointsRuleType;

  @Column({ type: 'varchar', length: 20 })
  targetRole: PointsTargetRole;

  @Column({ type: 'varchar', length: 30, default: 'global' })
  scope: string;

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

  @Column({ type: 'varchar', length: 50 })
  action: string;

  @Column({ default: 0 })
  pointsAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  conversionRate: number;

  @Column({ type: 'varchar', length: 5, default: 'MAD' })
  currency: string;

  @Column({ nullable: true })
  minPointsForConversion: number;

  @Column({ default: 0 })
  maxPointsPerPeriod: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  period: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1 })
  multiplier: number;

  @Column({ type: 'int', nullable: true })
  minNights: number;

  @Column({ type: 'date', nullable: true })
  validFrom: Date;

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
