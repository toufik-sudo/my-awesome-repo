import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Unique, Index,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Property } from '../../properties/entity/property.entity';
import { Booking } from '../../bookings/entity/booking.entity';
import { TourismService } from '../../services/entity/tourism-service.entity';
import { ServiceBooking } from '../../services/entity/service-booking.entity';

@Entity('reviews')
@Unique(['bookingId'])
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_reviews_propertyId', ['propertyId'])
  @Column({ nullable: true })
  propertyId: string;

  @ManyToOne(() => Property, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Index('IDX_reviews_guestId', ['guestId'])
  @Column()
  guestId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guestId' })
  guest: User;

  @Column({ nullable: true })
  bookingId: string;

  @ManyToOne(() => Booking, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  /** FK to tourism_services — set when reviewing a service */
  @Index('IDX_reviews_serviceId', ['serviceId'])
  @Column({ type: 'uuid', nullable: true })
  serviceId: string;

  @ManyToOne(() => TourismService, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'serviceId' })
  service: TourismService;

  /** FK to service_bookings — set when reviewing a service */
  @Column({ type: 'uuid', nullable: true })
  serviceBookingId: string;

  @ManyToOne(() => ServiceBooking, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'serviceBookingId' })
  serviceBooking: ServiceBooking;

  @Column({ type: 'int' })
  overallRating: number;

  @Column({ type: 'int', nullable: true })
  hostRating: number;

  @Column({ type: 'int', nullable: true })
  cleanlinessRating: number;

  @Column({ type: 'int', nullable: true })
  accuracyRating: number;

  @Column({ type: 'int', nullable: true })
  communicationRating: number;

  @Column({ type: 'int', nullable: true })
  locationRating: number;

  @Column({ type: 'int', nullable: true })
  valueRating: number;

  @Column({ type: 'int', nullable: true })
  checkInRating: number;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'text', nullable: true })
  hostReply: string;

  @Column({ nullable: true, type: 'datetime' })
  hostReplyAt: Date;

  @Column({ default: true })
  isPublic: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
