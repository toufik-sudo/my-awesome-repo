import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';

export type PropertyType = 'apartment' | 'house' | 'villa' | 'studio' | 'condo' | 'hotel' | 'chalet' | 'riad';
export type PropertyStatus = 'draft' | 'published' | 'archived' | 'suspended';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_properties_hostId')
  @Column()
  hostId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hostId' })
  host: User;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 20 })
  propertyType: PropertyType;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: PropertyStatus;

  // Pricing
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  pricePerNight: number;

  @Column({ type: 'varchar', length: 3, default: 'DZD' })
  currency: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  pricePerWeek: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  pricePerMonth: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weeklyDiscount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  monthlyDiscount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  customDiscount: number;

  @Column({ type: 'int', nullable: true })
  customDiscountMinNights: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  cleaningFee: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 5.0 })
  serviceFeePercent: number;

  @Column({ type: 'json', nullable: true })
  acceptedPaymentMethods: string[];

  // Location
  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @Column({ length: 500 })
  address: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 100 })
  wilaya: string;

  @Column({ length: 100, default: 'Algeria' })
  country: string;

  @Column({ length: 10, nullable: true })
  zipCode: string;

  // Capacity
  @Column({ type: 'int' })
  maxGuests: number;

  @Column({ type: 'int' })
  bedrooms: number;

  @Column({ type: 'int' })
  bathrooms: number;

  @Column({ type: 'int', default: 0 })
  beds: number;

  // Media
  @Column({ type: 'json' })
  images: string[];

  // Amenities & rules
  @Column({ type: 'json' })
  amenities: string[];

  @Column({ type: 'varchar', length: 5, default: '14:00' })
  checkInTime: string;

  @Column({ type: 'varchar', length: 5, default: '11:00' })
  checkOutTime: string;

  @Column({ type: 'json', nullable: true })
  houseRules: string[];

  @Column({ type: 'varchar', length: 50, default: 'flexible' })
  cancellationPolicy: string;

  // Stats (denormalized for performance)
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ type: 'int', default: 0 })
  bookingCount: number;

  @Column({ default: true })
  isAvailable: boolean;

  // Verification / Trust
  @Column({ type: 'int', default: 0 })
  trustStars: number;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  instantBooking: boolean;

  @Column({ type: 'int', default: 1 })
  minNights: number;

  @Column({ type: 'int', default: 365 })
  maxNights: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
