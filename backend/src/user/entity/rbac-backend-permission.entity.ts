import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { AppRole } from './user.entity';

export type RbacScope = 'global' | 'admin' | 'assigned' | 'own' | 'inherited';

@Entity('rbac_backend_permissions')
@Unique(['role', 'permission_key'])
@Index(['role'])
@Index(['resource', 'action'])
export class RbacBackendPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  role: AppRole;

  @Column({ type: 'varchar', length: 50 })
  resource: string;

  @Column({ type: 'varchar', length: 30 })
  action: string;

  @Column({ type: 'varchar', length: 80, unique: false })
  permission_key: string;

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
