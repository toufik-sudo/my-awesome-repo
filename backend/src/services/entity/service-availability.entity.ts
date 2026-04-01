import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { TourismService } from './tourism-service.entity';

@Entity('service_availability')
@Unique(['serviceId', 'date'])
export class ServiceAvailability {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  serviceId: string;

  @ManyToOne(() => TourismService, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceId' })
  service: TourismService;

  @Column({ type: 'date' })
  date: Date;

  @Column({ default: false })
  isBlocked: boolean;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  customPrice: number;

  @Column({ type: 'int', nullable: true })
  maxSlots: number;

  @Column({ type: 'int', default: 0 })
  bookedSlots: number;

  @Column({ type: 'json', nullable: true })
  timeSlots: string[]; // ["09:00", "14:00", "18:00"]
}
