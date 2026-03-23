import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Property } from './property.entity';
import { PropertyGroup } from './property-group.entity';

@Entity('property_group_memberships')
@Unique(['propertyId', 'groupId'])
export class PropertyGroupMembership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  propertyId: string;

  @ManyToOne(() => Property, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Column('uuid')
  groupId: string;

  @ManyToOne(() => PropertyGroup, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'groupId' })
  group: PropertyGroup;

  @CreateDateColumn()
  createdAt: Date;
}
