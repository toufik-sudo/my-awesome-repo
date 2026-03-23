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
import { Property } from '../../properties/entity/property.entity';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded' | 'failed';
export type PaymentMethod = 'cash' | 'ccp' | 'baridi_mob' | 'bank_transfer' | 'edahabia' | 'cib';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_bookings_propertyId')
  @Column()
  propertyId: string;

  @ManyToOne(() => Property, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Index('IDX_bookings_guestId')
  @Column()
  guestId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guestId' })
  guest: User;

  @Column({ type: 'date' })
  checkInDate: Date;

  @Column({ type: 'date' })
  checkOutDate: Date;

  @Column({ type: 'int' })
  numberOfGuests: number;

  @Column({ type: 'int' })
  numberOfNights: number;

  // Pricing breakdown
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  pricePerNight: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  cleaningFee: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  serviceFee: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercent: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  discountType: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  effectiveRate: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalPrice: number;

  @Column({ type: 'varchar', length: 3, default: 'DZD' })
  currency: string;

  // Status
  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: BookingStatus;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  paymentStatus: PaymentStatus;

  @Column({ type: 'varchar', length: 20, nullable: true })
  paymentMethod: PaymentMethod;

  // Guest message
  @Column({ type: 'text', nullable: true })
  guestMessage: string;

  // Host response
  @Column({ type: 'text', nullable: true })
  hostResponse: string;

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
