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

export type NotificationType =
  | 'doc_submitted'
  | 'doc_ai_approved'
  | 'doc_ai_rejected'
  | 'doc_pending_review'
  | 'doc_admin_approved'
  | 'doc_admin_rejected'
  | 'saved_search_match'
  | 'promo_alert'
  | 'system'
  | 'general';

export type NotificationChannel = 'in_app' | 'email' | 'both';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_notifications_userId', ['userId'])
  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 30, default: 'general' })
  type: NotificationType;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'varchar', length: 10, default: 'in_app' })
  channel: NotificationChannel;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true, length: 500 })
  actionUrl: string;

  @Column({ nullable: true, type: 'json' })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
