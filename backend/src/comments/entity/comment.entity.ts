import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Booking } from '../../bookings/entity/booking.entity';

/**
 * Property comments — can be linked to a booking, property, or service.
 * A guest can only comment after a validated booking ends.
 */
@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Index('IDX_comments_userId', ['userId'])
  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  /** Type of the target entity: 'property', 'service', 'booking' */
  @Index('IDX_comments_targetType', ['targetType'])
  @Column({ type: 'varchar', length: 50, default: 'property' })
  targetType: string;

  /** ID of the target entity */
  @Index('IDX_comments_targetId', ['targetId'])
  @Column({ type: 'varchar', length: 100, nullable: true })
  targetId: string;

  /** FK to the completed booking that entitles this comment */
  @Index('IDX_comments_bookingId', ['bookingId'])
  @Column({ type: 'uuid', nullable: true })
  bookingId: string;

  @ManyToOne(() => Booking, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  /** Parent comment for nested replies */
  @Column({ type: 'uuid', nullable: true })
  parentId: string;

  @ManyToOne(() => Comment, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Comment;

  @Column({ type: 'simple-json', nullable: true })
  media: { id: string; type: string; url: string; thumbnail?: string }[];

  @Column({ type: 'simple-json', nullable: true })
  mentions: { userId: string; name: string; startIndex: number; endIndex: number }[];

  @Column({ default: false })
  isEdited: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
