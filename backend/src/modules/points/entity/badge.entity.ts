import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../../../user/entity/user.entity';

export type BadgeCategory = 'booking' | 'review' | 'social' | 'loyalty' | 'special' | 'achievement';

@Entity('badges')
export class Badge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'json' })
  name: Record<string, string>; // { fr, en, ar }

  @Column({ type: 'json' })
  description: Record<string, string>;

  @Column({ type: 'varchar', length: 10 })
  icon: string; // emoji

  @Column({ type: 'varchar', length: 20 })
  category: BadgeCategory;

  /** Points threshold to auto-unlock (0 = manual/action-based) */
  @Column({ type: 'int', default: 0 })
  pointsThreshold: number;

  /** Action count threshold (e.g., 10 bookings) */
  @Column({ type: 'varchar', length: 50, nullable: true })
  actionRequired: string;

  @Column({ type: 'int', default: 0 })
  actionCountRequired: number;

  @Column({ type: 'int', default: 0 })
  bonusPoints: number;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('user_badges')
export class UserBadge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  badgeId: string;

  @ManyToOne(() => Badge, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'badgeId' })
  badge: Badge;

  @CreateDateColumn()
  unlockedAt: Date;
}
