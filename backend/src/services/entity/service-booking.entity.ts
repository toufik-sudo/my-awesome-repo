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

export type ServiceBookingStatus =
  | 'pending'
  | 'accepted'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'rejected'
  | 'archived'
  | 'counter_offer';
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

  /** Pre-fee subtotal (after group/points discount, before service fee) */
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  subtotalAmount: number;

  /** Total platform service fee computed via FeeRules */
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  serviceFeeAmount: number;

  /** Portion of the fee absorbed by the host (deducted from the guest total) */
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  hostAbsorptionAmount: number;

  /** Discount applied via loyalty points */
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  pointsDiscount: number;

  /** Discount applied via referral commission */
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  referralDiscount: number;

  /** Provider response when sending a counter-offer */
  @Column({ type: 'text', nullable: true })
  hostResponse: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  counterOfferPrice: number | null;

  @Column({ type: 'date', nullable: true })
  counterOfferDate: Date | null;

  @Column({ type: 'varchar', length: 5, nullable: true })
  counterOfferTime: string | null;

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
  acceptedAt: Date;

  @Column({ nullable: true, type: 'datetime' })
  confirmedAt: Date;

  @Column({ nullable: true, type: 'datetime' })
  archivedAt: Date;

  @Column({ nullable: true, type: 'datetime' })
  paymentDeadlineAt: Date;

  @Column({ nullable: true, type: 'datetime' })
  acceptDeadlineAt: Date;

  @Column({ type: 'int', default: 0 })
  paymentReminderCount: number;

  @Column({ type: 'int', default: 0 })
  acceptReminderCount: number;

  @Column({ nullable: true, type: 'datetime' })
  cancelledAt: Date;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  // True when the host (provider) was paused/archived: customer is allowed
  // to cancel this booking with no fees, auto-approved without provider
  // validation. Set by HyperManagementService cascade.
  @Column({ type: 'boolean', default: false })
  hostCascadeFlag: boolean;

  @Column({ type: 'varchar', length: 30, nullable: true })
  cancelledBy: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
