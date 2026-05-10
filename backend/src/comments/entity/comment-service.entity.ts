import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { ServiceBooking } from '../../services/entity/service-booking.entity';

/**
 * Tourism service comments — linked to a completed service booking.
 */
@Entity('comment_services')
export class CommentService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Index('IDX_comment_services_userId', ['userId'])
  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Index('IDX_comment_services_serviceBookingId', ['serviceBookingId'])
  @Column({ type: 'uuid' })
  serviceBookingId: string;

  @ManyToOne(() => ServiceBooking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceBookingId' })
  serviceBooking: ServiceBooking;

  /** Parent for nested replies */
  @Column({ type: 'uuid', nullable: true })
  parentId: string;

  @ManyToOne(() => CommentService, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: CommentService;

  @Column({ type: 'simple-json', nullable: true })
  media: { id: string; type: string; url: string; thumbnail?: string }[];

  @Column({ default: false })
  isEdited: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
