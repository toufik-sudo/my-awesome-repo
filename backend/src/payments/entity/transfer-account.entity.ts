import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type AccountType = 'ccp' | 'bna' | 'badr' | 'cib' | 'other';

@Entity('transfer_accounts')
export class TransferAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  bankName: string;

  @Column({ type: 'varchar', length: 20 })
  accountType: AccountType;

  @Column({ type: 'varchar', length: 100 })
  accountNumber: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  accountKey: string;

  @Column({ type: 'varchar', length: 255 })
  holderName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  agencyName: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
