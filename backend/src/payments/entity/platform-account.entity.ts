import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export type PlatformAccountType = 'ccp' | 'bna' | 'badr' | 'cib' | 'baridi_mob' | 'bank_transfer' | 'stripe' | 'other';

/**
 * Escrow accounts owned by the platform (hyper-admin).
 * Guests pay INTO these accounts. Funds are held until the claim window
 * elapses, then released to the host as a payout.
 */
@Entity('platform_accounts')
export class PlatformAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  accountType: PlatformAccountType;

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

  @Column({ type: 'varchar', length: 3, default: 'DZD' })
  currency: string;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({ default: true })
  isActive: boolean;

  /** When true, this account is offered to guests at checkout. */
  @Column({ default: true })
  acceptsGuestPayments: boolean;

  /** When true, this account can be used to pay host reactivation penalties. */
  @Column({ default: true })
  acceptsReactivationPayments: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
