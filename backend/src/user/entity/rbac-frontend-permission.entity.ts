import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';

/**
 * One row per UI element (not per role).
 * `user_roles` lists all roles that can see/use this UI element.
 * `permission_key` is ALWAYS generated via generateUiPermissionKey(component, subView, element, action).
 */
@Entity('rbac_frontend_permissions')
@Unique('IDX_RBAC_CONFIG_FRONTEND_PERMISSION_KEY', ['permission_key'])
@Index('IDX_RBAC_CONFIG_FRONTEND_MODULE', ['module'])
export class RbacFrontendPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Who created this permission (nullable for seed) */
  @Column({ type: 'uuid', nullable: true })
  created_by: string | null;

  /**
   * Generated key: ui.<ComponentName>.<SubView?>.<ElementType?>.<ActionName?>
   */
  @Column({ type: 'varchar', length: 200, unique: true })
  permission_key: string;

  /** Roles allowed to see/use this UI element */
  @Column({ type: 'simple-json' })
  user_roles: string[];

  /** Component name */
  @Column({ type: 'varchar', length: 100 })
  component: string;

  /** Sub-view within the component */
  @Column({ type: 'varchar', length: 100, nullable: true })
  sub_view: string | null;

  /** Element type (Button, Tab, Page, Widget, etc.) */
  @Column({ type: 'varchar', length: 50, nullable: true })
  element_type: string | null;

  /** Action name (Add, Edit, Delete, View, etc.) */
  @Column({ type: 'varchar', length: 50, nullable: true })
  action_name: string | null;

  /** Module grouping */
  @Column({ type: 'varchar', length: 50, default: 'general' })
  module: string;

  /** Description */
  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string | null;

  @Column({ default: true })
  allowed: boolean;

  @Column({ type: 'simple-json', nullable: true })
  conditions: Record<string, any> | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
