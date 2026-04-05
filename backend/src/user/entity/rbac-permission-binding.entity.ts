import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm';

/**
 * Maps a backend API permission key to a frontend UI permission key.
 * Maintained automatically by the permissions:sync script.
 */
@Entity('rbac_permission_bindings')
@Unique(['api_permission_key', 'ui_permission_key'])
@Index(['module'])
export class RbacPermissionBinding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  api_permission_key: string;

  @Column({ type: 'varchar', length: 150 })
  ui_permission_key: string;

  @Column({ type: 'varchar', length: 50 })
  module: string;

  @CreateDateColumn()
  created_at: Date;
}
