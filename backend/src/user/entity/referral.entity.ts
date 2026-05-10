import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Property } from '../../properties/entity/property.entity';

export type ReferralStatus = 'pending' | 'signed_up' | 'first_booking' | 'completed' | 'expired';

@Entity('referrals')
export class Referral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  referrerId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'referrerId' })
  referrer: User;

  @Column({ nullable: true })
  referredUserId: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'referredUserId' })
  referredUser: User;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  inviteeContact: string;

  @Column({ type: 'varchar', length: 20, default: 'link' })
  method: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: ReferralStatus;

  @Column({ type: 'int', default: 0 })
  referrerPointsAwarded: number;

  @Column({ type: 'int', default: 0 })
  referredPointsAwarded: number;

  @Column({ type: 'uuid', nullable: true })
  sharedPropertyId: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

/**
 * Property shares — now with FK to properties table.
 */
@Entity('property_shares')
export class PropertyShare {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  propertyId: string;

  @ManyToOne(() => Property, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Column({ type: 'varchar', length: 30 })
  method: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  recipient: string;

  @CreateDateColumn()
  createdAt: Date;
}
