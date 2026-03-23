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

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ length: 255, nullable: true })
  displayName: string;

  @Column({ length: 1000, nullable: true })
  avatarUrl: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ length: 20, nullable: true })
  phoneNumber: string;

  @Column({ default: false })
  phoneVerified: boolean;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 100, nullable: true })
  wilaya: string;

  @Column({ length: 100, default: 'Algeria' })
  country: string;

  @Column({ type: 'json', nullable: true })
  languages: string[];

  @Column({ default: false })
  isHost: boolean;

  @Column({ default: false })
  isSuperhost: boolean;

  @Column({ default: false })
  identityVerified: boolean;

  @Column({ nullable: true, type: 'datetime' })
  hostSince: Date;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  hostRating: number;

  @Column({ type: 'int', default: 0 })
  totalReviews: number;

  @Column({ type: 'varchar', length: 10, default: 'fr' })
  preferredLanguage: string;

  @Column({ type: 'varchar', length: 3, default: 'DZD' })
  preferredCurrency: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
