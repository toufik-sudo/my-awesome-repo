import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export type ReferralStatus = 'pending' | 'signed_up' | 'first_booking' | 'completed' | 'expired';

@Entity('referrals')
export class Referral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** The user who referred */
  @Column()
  referrerId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'referrerId' })
  referrer: User;

  /** The referred user (null until signup) */
  @Column({ nullable: true })
  referredUserId: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'referredUserId' })
  referredUser: User;

  /** Unique referral code */
  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  /** Email or phone of the invited person */
  @Column({ type: 'varchar', length: 100, nullable: true })
  inviteeContact: string;

  /** Method used: email, sms, link, social */
  @Column({ type: 'varchar', length: 20, default: 'link' })
  method: string;

  /** Status of the referral */
  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: ReferralStatus;

  /** Points awarded to referrer */
  @Column({ type: 'int', default: 0 })
  referrerPointsAwarded: number;

  /** Points awarded to referred user */
  @Column({ type: 'int', default: 0 })
  referredPointsAwarded: number;

  /** Property ID if shared via property share */
  @Column({ type: 'uuid', nullable: true })
  sharedPropertyId: string;

  /** Expiry date */
  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

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

  /** Share method: email, whatsapp, facebook, twitter, copy_link */
  @Column({ type: 'varchar', length: 30 })
  method: string;

  /** Recipient info (optional) */
  @Column({ type: 'varchar', length: 100, nullable: true })
  recipient: string;

  @CreateDateColumn()
  createdAt: Date;
}
