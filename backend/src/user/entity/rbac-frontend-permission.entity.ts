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

@Entity('rbac_frontend_permissions')
@Unique(['role', 'ui_key'])
@Index(['role'])
@Index(['permission_key'])
export class RbacFrontendPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  role: AppRole;

  @Column({ type: 'varchar', length: 100 })
  ui_key: string;

  @Column({ type: 'varchar', length: 80 })
  permission_key: string;

  @Column({ default: true })
  allowed: boolean;

  @Column({ type: 'simple-json', nullable: true })
  conditions: Record<string, any> | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
