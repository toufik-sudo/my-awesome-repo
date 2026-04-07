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
 * Scope for guest permissions.
 */
export type GuestPermissionScope = 'all' | 'properties' | 'services' | 'property_groups' | 'service_groups';

@Entity('guest_permissions')
@Index('IDX_GUEST_PERM_GUEST', ['guestId'])
@Index('IDX_GUEST_PERM_BACKEND_KEY', ['backendPermissionKey'])
export class GuestPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** The guest this permission is assigned to */
  @Column()
  guestId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guestId' })
  guest: User;

  /** Who assigned this permission (admin, manager, or hyper role) */
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
  scope: GuestPermissionScope;

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

  @Column({ default: true })
  isGranted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
