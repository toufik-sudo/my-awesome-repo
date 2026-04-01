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
import { TourismService } from './tourism-service.entity';

export type ServiceDocumentType =
  | 'national_id'
  | 'registre_commerce'
  | 'avis_imposition'
  | 'certificat_tourisme'
  | 'certificat_culture'
  | 'certificat_artisanat'
  | 'licence_activite';

export type ServiceDocumentStatus = 'pending' | 'approved' | 'rejected';

@Entity('service_verification_documents')
export class ServiceVerificationDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_svc_docs_serviceId')
  @Column()
  serviceId: string;

  @ManyToOne(() => TourismService, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceId' })
  service: TourismService;

  @Column({ type: 'varchar', length: 30 })
  type: ServiceDocumentType;

  @Column({ length: 255 })
  fileName: string;

  @Column({ length: 500 })
  fileUrl: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: ServiceDocumentStatus;

  @Column({ type: 'text', nullable: true })
  reviewNote: string;

  @Column({ nullable: true })
  reviewedBy: number;

  @Column({ nullable: true, type: 'datetime' })
  reviewedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
