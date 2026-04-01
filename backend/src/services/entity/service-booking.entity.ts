import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { TourismService } from './tourism-service.entity';

export type ServiceBookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';
export type ServicePaymentMethod = 'cash' | 'ccp' | 'baridi_mob' | 'bank_transfer' | 'edahabia' | 'cib';

@Entity('service_bookings')
export class ServiceBooking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_service_bookings_serviceId')
  @Column()
  serviceId: string;

  @ManyToOne(() => TourismService, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceId' })
  service: TourismService;

  @Index('IDX_service_bookings_customerId')
  @Column()
  customerId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @Column({ type: 'date' })
  bookingDate: Date;

  @Column({ type: 'varchar', length: 5, nullable: true })
  startTime: string; // HH:mm

  @Column({ type: 'int', default: 1 })
  participants: number;

  @Column({ type: 'int', default: 0 })
  childParticipants: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  childPrice: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercent: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalPrice: number;

  @Column({ type: 'varchar', length: 3, default: 'DZD' })
  currency: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: ServiceBookingStatus;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  paymentStatus: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  paymentMethod: ServicePaymentMethod;

  @Column({ type: 'text', nullable: true })
  customerMessage: string;

  @Column({ type: 'text', nullable: true })
  providerResponse: string;

  @Column({ type: 'json', nullable: true })
  participantDetails: Array<{ name: string; age?: number }>;

  @Column({ nullable: true, type: 'datetime' })
  confirmedAt: Date;

  @Column({ nullable: true, type: 'datetime' })
  cancelledAt: Date;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
