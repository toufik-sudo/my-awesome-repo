import {
  Entity, Column, PrimaryGeneratedColumn,
  CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export type PayoutAccountType = 'ccp' | 'bna' | 'badr' | 'cib' | 'baridi_mob' | 'bank_transfer' | 'other';

@Entity('payout_accounts')
export class PayoutAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Host user who owns this payout account */
  @Column()
  hostUserId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hostUserId' })
  host: User;

  @Column({ type: 'varchar', length: 50 })
  accountType: PayoutAccountType;

  @Column()
  bankName: string;

  @Column()
  accountNumber: string;

  @Column({ nullable: true })
  accountKey: string;

  @Column()
  holderName: string;

  @Column({ nullable: true })
  agencyName: string;

  @Column({ nullable: true })
  rib: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
