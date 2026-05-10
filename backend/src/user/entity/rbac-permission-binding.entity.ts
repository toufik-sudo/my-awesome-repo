import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn,
  Index, Unique, ManyToOne, JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RbacBackendPermission } from './rbac-backend-permission.entity';

/**
 * Maps a frontend API call to a backend API permission.
 * When the frontend calls an API, this table is used to check which
 * backend permission the API call requires and if the user's role has access.
 *
 * frontendPermissionApi is a string key like "bookingsApi.create.POST"
 * that identifies the frontend API call (NOT a FK to rbac_frontend_permissions).
 */
@Entity('rbac_permission_bindings')
@Unique('IDX_backendPermissionId_frontendPermissionApi', ['backendPermissionId', 'frontendPermissionApi'])
@Index('IDX_frontendPermissionApi_module', ['module'])
@Index('IDX_frontendPermissionApi', ['frontendPermissionApi'])
export class RbacPermissionBinding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  backendPermissionId: string;

  @ManyToOne(() => RbacBackendPermission, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'backendPermissionId', referencedColumnName: 'permission_key' })
  backendPermission: RbacBackendPermission;

  /**
   * Frontend API call identifier, e.g. "bookingsApi.create.POST"
   * Maps to the corresponding backend permission_key in rbac_backend_permissions.
   */
  @Column({ type: 'varchar', length: 200 })
  frontendPermissionApi: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  endpoint_url: string | null;

  @Column({ type: 'varchar', length: 50 })
  module: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
