import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { User } from './user.entity';
import { Property } from '../../properties/entity/property.entity';
import { TourismService } from '../../services/entity/tourism-service.entity';
import { PropertyGroup } from '../../properties/entity/property-group.entity';
import { ServiceGroup } from '../../services/entity/service-group.entity';

export type AbsorptionScope = 'all' | 'property_group' | 'service_group' | 'property' | 'service';

@Entity('host_fee_absorptions')
@Index('IDX_host_fee_absorptions_hostUserId', ['hostUserId'])
export class HostFeeAbsorption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  hostUserId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hostUserId' })
  host: User;

  @Column({ type: 'varchar', length: 30, default: 'all' })
  scope: AbsorptionScope;

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

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 100 })
  absorptionPercent: number;

  @Column({ type: 'date', nullable: true })
  validFrom: Date;

  @Column({ type: 'date', nullable: true })
  validTo: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
