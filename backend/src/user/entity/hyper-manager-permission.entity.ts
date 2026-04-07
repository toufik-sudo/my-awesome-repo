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
import { User } from './user.entity';

/**
 * Scope for hyper_manager permissions.
 * Includes 'admins' scope — only available for hyper_manager.
 */
export type HyperManagerPermissionScope =
  | 'all'
  | 'properties'
  | 'services'
  | 'property_groups'
  | 'service_groups'
  | 'admins';

@Entity('hyper_manager_permissions')
@Index('IDX_HM_PERM_MANAGER', ['hyperManagerId'])
@Index('IDX_HM_PERM_BACKEND_KEY', ['backendPermissionKey'])
export class HyperManagerPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** The hyper_manager this permission is assigned to */
  @Column()
  hyperManagerId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hyperManagerId' })
  hyperManager: User;

  /** Who assigned this permission (hyper_admin) */
  @Column()
  assignedById: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assignedById' })
  assignedBy: User;

  /** FK to rbac_backend_permissions.permission_key */
  @Column({ type: 'varchar', length: 200 })
  backendPermissionKey: string;

  /** FK to rbac_frontend_permissions.permission_key (nullable) */
  @Column({ type: 'varchar', length: 200, nullable: true })
  frontendPermissionKey: string | null;

  /** Scope of this permission */
  @Column({ type: 'varchar', length: 30 })
  scope: HyperManagerPermissionScope;

  /** Property IDs — only when scope = 'properties' */
  @Column({ type: 'simple-json', nullable: true })
  properties: string[] | null;

  /** Service IDs — only when scope = 'services' */
  @Column({ type: 'simple-json', nullable: true })
  services: string[] | null;

  /** Property Group IDs — only when scope = 'property_groups' */
  @Column({ type: 'simple-json', nullable: true })
  propertyGroups: string[] | null;

  /** Service Group IDs — only when scope = 'service_groups' */
  @Column({ type: 'simple-json', nullable: true })
  serviceGroups: string[] | null;

  /** Admin IDs — only when scope = 'admins' (hyper_manager exclusive) */
  @Column({ type: 'simple-json', nullable: true })
  admins: number[] | null;

  @Column({ default: true })
  isGranted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
