import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Property } from './property.entity';

@Entity('property_availability')
@Unique(['propertyId', 'date'])
export class PropertyAvailability {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  propertyId: string;

  @ManyToOne(() => Property, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Column({ type: 'date' })
  date: Date;

  @Column({ default: false })
  isBlocked: boolean;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  customPrice: number;
}
