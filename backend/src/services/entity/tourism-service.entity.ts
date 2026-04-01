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

export type ServiceCategory =
  | 'restaurant'
  | 'walking_tour'
  | 'cycling_tour'
  | 'car_tour'
  | 'bus_tour'
  | 'horse_tour'
  | 'boat_tour'
  | 'beauty_salon'
  | 'massage'
  | 'hammam'
  | 'tourist_guide'
  | 'photography'
  | 'park_visit'
  | 'beach_visit'
  | 'nature_excursion'
  | 'regional_event'
  | 'cooking_class'
  | 'art_class'
  | 'drawing_class'
  | 'sport_activity'
  | 'spa'
  | 'shopping_tour'
  | 'cultural_visit'
  | 'nightlife'
  | 'silver_jewelry'
  | 'gold_jewelry'
  | 'traditional_jewelry'
  | 'pottery'
  | 'leather_craft'
  | 'carpet_weaving'
  | 'woodwork'
  | 'calligraphy'
  | 'henna_art'
  | 'other';

export type ServiceStatus = 'draft' | 'published' | 'archived' | 'suspended';
export type PricingType = 'per_person' | 'per_group' | 'per_hour' | 'fixed';
export type DurationUnit = 'minutes' | 'hours' | 'days';

@Entity('tourism_services')
export class TourismService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_services_providerId', ['providerId'])
  @Column()
  providerId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'providerId' })
  provider: User;

  @Column({ type: 'json' })
  title: Record<string, string>;

  @Column({ type: 'json' })
  description: Record<string, string>;

  @Column({ type: 'varchar', length: 30 })
  category: ServiceCategory;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: ServiceStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 3, default: 'DZD' })
  currency: string;

  @Column({ type: 'varchar', length: 20, default: 'per_person' })
  pricingType: PricingType;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  priceChild: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  groupDiscount: number;

  @Column({ type: 'int', nullable: true })
  duration: number;

  @Column({ type: 'varchar', length: 10, default: 'hours' })
  durationUnit: DurationUnit;

  @Column({ type: 'int', default: 1 })
  minParticipants: number;

  @Column({ type: 'int', default: 20 })
  maxParticipants: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({ length: 500, nullable: true })
  address: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 100 })
  wilaya: string;

  @Column({ length: 100, default: 'Algeria' })
  country: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ type: 'json', nullable: true })
  includes: Record<string, string[]>;

  @Column({ type: 'json', nullable: true })
  requirements: Record<string, string[]>;

  @Column({ type: 'json', nullable: true })
  schedule: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  languages: string[];

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ type: 'int', default: 0 })
  bookingCount: number;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  instantBooking: boolean;

  @Column({ type: 'int', default: 0 })
  minAge: number;

  @Column({ type: 'varchar', length: 50, default: 'flexible' })
  cancellationPolicy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
