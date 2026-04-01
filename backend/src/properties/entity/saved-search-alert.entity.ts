import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';

export type AlertFrequency = 'instant' | 'daily' | 'weekly';
export type AlertChannel = 'email' | 'push' | 'sms';

@Entity('saved_search_alerts')
export class SavedSearchAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ length: 255 })
  name: string;

  // Search criteria stored as JSON
  @Column({ type: 'json' })
  criteria: {
    city?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    guests?: number;
    bedrooms?: number;
    minTrustStars?: number;
    amenities?: string[];
    allowPets?: boolean;
  };

  @Column({ type: 'varchar', length: 20, default: 'daily' })
  frequency: AlertFrequency;

  @Column({ type: 'json' })
  channels: AlertChannel[] = ["email"];

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastTriggeredAt: Date;

  @Column({ type: 'int', default: 0 })
  matchCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
