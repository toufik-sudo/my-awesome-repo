import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity('notification_settings')
export class NotificationSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // Master switches
  @Column({ default: true })
  emailNotifications: boolean;

  @Column({ default: true })
  pushNotifications: boolean;

  @Column({ default: false })
  marketingEmails: boolean;

  @Column({ default: true })
  securityAlerts: boolean;

  @Column({ default: false })
  weeklyDigest: boolean;

  // Granular: Comment replies
  @Column({ default: true })
  commentReplies: boolean;

  @Column({ default: true })
  commentRepliesPush: boolean;

  // Granular: Ranking updates
  @Column({ default: true })
  rankingUpdates: boolean;

  @Column({ default: false })
  rankingUpdatesPush: boolean;

  // Granular: New followers
  @Column({ default: true })
  newFollowers: boolean;

  @Column({ default: true })
  newFollowersPush: boolean;

  // Granular: System announcements
  @Column({ default: true })
  systemAnnouncements: boolean;

  @Column({ default: true })
  systemAnnouncementsPush: boolean;

  // Quiet hours
  @Column({ default: false })
  quietHoursEnabled: boolean;

  @Column({ type: 'varchar', length: 5, default: '22:00' })
  quietHoursStart: string;

  @Column({ type: 'varchar', length: 5, default: '07:00' })
  quietHoursEnd: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
