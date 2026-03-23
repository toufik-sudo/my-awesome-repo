import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Property } from '../../properties/entity/property.entity';

export type DocumentType =
  | 'national_id'
  | 'passport'
  | 'permit'
  | 'notarized_deed'
  | 'land_registry'
  | 'utility_bill'
  | 'management_declaration';

export type DocumentStatus = 'pending' | 'approved' | 'rejected';

@Entity('verification_documents')
export class VerificationDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_verification_docs_propertyId')
  @Column()
  propertyId: string;

  @ManyToOne(() => Property, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Column({ type: 'varchar', length: 30 })
  type: DocumentType;

  @Column({ length: 255 })
  fileName: string;

  @Column({ length: 500 })
  fileUrl: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: DocumentStatus;

  @Column({ type: 'text', nullable: true })
  reviewNote: string;

  @Column({ nullable: true })
  reviewedBy: number;

  @Column({ nullable: true, type: 'datetime' })
  reviewedAt: Date;

  // AI Analysis fields
  @Column({ type: 'boolean', nullable: true })
  aiAnalyzed: boolean;

  @Column({ type: 'boolean', nullable: true })
  aiValidationResult: boolean;

  @Column({ type: 'float', nullable: true })
  aiConfidence: number;

  @Column({ type: 'text', nullable: true })
  aiReason: string;

  @Column({ type: 'json', nullable: true })
  aiDetectedIssues: string[];

  @Column({ nullable: true, type: 'datetime' })
  aiAnalyzedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
