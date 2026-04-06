import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';

export type RbacScope = 'global' | 'admin' | 'assigned' | 'own' | 'inherited';

/**
 * One row per endpoint (not per role).
 * `user_roles` lists all roles allowed to call this endpoint.
 * `permission_key` is ALWAYS generated via generateBackendPermissionKey(controller, endpoint, method).
 */
@Entity('rbac_backend_permissions')
@Unique('IDX_RBAC_CONFIG_BACKEND_PERMISSION_KEY', ['permission_key'])
@Index('IDX_RBAC_CONFIG_BACKEND_CONTROLLER', ['controller'])
@Index('IDX_RBAC_CONFIG_BACKEND_MODULE', ['module'])
export class RbacBackendPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Who created this permission (nullable for seed) */
  @Column({ type: 'uuid', nullable: true })
  created_by: string | null;

  /**
   * Generated key: backend.<ControllerName>.<endpointName>.<METHOD>
   */
  @Column({ type: 'varchar', length: 200, unique: true })
  permission_key: string;

  /** Roles allowed to access this endpoint */
  @Column({ type: 'simple-json' })
  user_roles: string[];

  @Column({ type: 'varchar', length: 100 })
  controller: string;

  @Column({ type: 'varchar', length: 100 })
  endpoint: string;

  @Column({ type: 'varchar', length: 10 })
  method: string;

  /** Module grouping for filtering */
  @Column({ type: 'varchar', length: 50, default: 'general' })
  module: string;

  /** Description of what this endpoint does */
  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 20, default: 'global' })
  scope: RbacScope;

  @Column({ default: true })
  allowed: boolean;

  @Column({ type: 'simple-json', nullable: true })
  conditions: Record<string, any> | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
