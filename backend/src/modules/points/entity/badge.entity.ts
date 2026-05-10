import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable,
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

  /**
   * Direct M2M with users — replaces user_badges join table.
   * Join table 'badge_users' has extra column unlockedAt managed via QueryBuilder.
   */
  @ManyToMany(() => User, { eager: false })
  @JoinTable({
    name: 'badge_users',
    joinColumn: { name: 'badgeId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  users: User[];

  @CreateDateColumn()
  createdAt: Date;
}

/**
 * Explicit join entity for badge↔user with unlockedAt column.
 * Use raw queries or QueryBuilder for insert/select with unlockedAt.
 */
import { Entity as E2, Column as C2, PrimaryGeneratedColumn as PG2, CreateDateColumn as CD2, ManyToOne, JoinColumn, Index } from 'typeorm';

@E2('badge_users')
@Index('IDX_badge_users_userId', ['userId'])
@Index('IDX_badge_users_badgeId', ['badgeId'])
export class BadgeUser {
  @PG2('uuid')
  id: string;

  @C2()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @C2({ type: 'uuid' })
  badgeId: string;

  @ManyToOne(() => Badge, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'badgeId' })
  badge: Badge;

  @CD2()
  unlockedAt: Date;
}
