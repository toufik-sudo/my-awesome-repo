import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Property } from '../../properties/entity/property.entity';
import { Booking } from '../../bookings/entity/booking.entity';

@Entity('reviews')
@Unique(['bookingId']) // One review per booking
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_reviews_propertyId', ['propertyId'])
  @Column()
  propertyId: string;

  @ManyToOne(() => Property, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Index('IDX_reviews_guestId', ['guestId'])
  @Column()
  guestId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guestId' })
  guest: User;

  @Column()
  bookingId: string;

  @ManyToOne(() => Booking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  // Ratings (1-5)
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

  // Host reply
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
