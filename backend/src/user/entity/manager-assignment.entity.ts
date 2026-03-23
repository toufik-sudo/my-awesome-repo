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
import { Property } from '../../properties/entity/property.entity';
import { PropertyGroup } from '../../properties/entity/property-group.entity';

export type AssignmentScope = 'property' | 'property_group' | 'all';

@Entity('manager_assignments')
export class ManagerAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  managerId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'managerId' })
  manager: User;

  @Column()
  assignedByAdminId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assignedByAdminId' })
  assignedByAdmin: User;

  @Column({ type: 'varchar', length: 20 })
  scope: AssignmentScope;

  // Nullable - only set when scope is 'property'
  @Column({ type: 'uuid', nullable: true })
  propertyId: string;

  @ManyToOne(() => Property, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  // Nullable - only set when scope is 'property_group'
  @Column({ type: 'uuid', nullable: true })
  propertyGroupId: string;

  @ManyToOne(() => PropertyGroup, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'propertyGroupId' })
  propertyGroup: PropertyGroup;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
