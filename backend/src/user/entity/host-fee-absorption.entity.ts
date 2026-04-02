import {
  Entity, Column, PrimaryGeneratedColumn,
  CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export type AbsorptionScope = 'all' | 'property_group' | 'service_group' | 'property' | 'service';

@Entity('host_fee_absorptions')
export class HostFeeAbsorption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Host userId who absorbs the fees */
  @Column()
  hostUserId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hostUserId' })
  host: User;

  @Column({ type: 'varchar', length: 30, default: 'all' })
  scope: AbsorptionScope;

  /** Target IDs depending on scope */
  @Column({ type: 'uuid', nullable: true })
  targetPropertyGroupId: string;

  @Column({ type: 'uuid', nullable: true })
  targetServiceGroupId: string;

  @Column({ type: 'uuid', nullable: true })
  targetPropertyId: string;

  @Column({ type: 'uuid', nullable: true })
  targetServiceId: string;

  /** Percentage of fee the host absorbs (0-100). 100 = host pays all fees */
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 100 })
  absorptionPercent: number;

  /** Optional period restriction */
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
