import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { User } from './user.entity';
import { RbacBackendPermission } from './rbac-backend-permission.entity';
import { RbacFrontendPermission } from './rbac-frontend-permission.entity';

export type GuestPermissionScope = 'all' | 'properties' | 'services' | 'property_groups' | 'service_groups';

@Entity('guest_permissions')
@Index('IDX_GUEST_PERM_GUEST', ['guestId'])
@Index('IDX_GUEST_PERM_BACKEND_KEY', ['backendPermissionKey'])
export class GuestPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  guestId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guestId' })
  guest: User;

  @Column()
  assignedById: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assignedById' })
  assignedBy: User;

  @Column({ type: 'varchar', length: 200 })
  backendPermissionKey: string;

  @ManyToOne(() => RbacBackendPermission, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'backendPermissionKey', referencedColumnName: 'permission_key' })
  backendPermission: RbacBackendPermission;

  @Column({ type: 'varchar', length: 200, nullable: true })
  frontendPermissionKey: string | null;

  @ManyToOne(() => RbacFrontendPermission, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'frontendPermissionKey', referencedColumnName: 'permission_key' })
  frontendPermission: RbacFrontendPermission;

  @Column({ type: 'varchar', length: 30 })
  scope: GuestPermissionScope;

  @Column({ type: 'simple-json', nullable: true })
  properties: string[] | null;

  @Column({ type: 'simple-json', nullable: true })
  services: string[] | null;

  @Column({ type: 'simple-json', nullable: true })
  propertyGroups: string[] | null;

  @Column({ type: 'simple-json', nullable: true })
  serviceGroups: string[] | null;

  @Column({ default: true })
  isGranted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
