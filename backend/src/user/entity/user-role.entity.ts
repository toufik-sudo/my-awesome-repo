import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

export type AppRole = 'hyper_admin' | 'hyper_manager' | 'admin' | 'manager' | 'user';

/**
 * Role mutual exclusivity rules:
 * - hyper_admin: cannot hold hyper_manager, admin, or manager roles
 * - hyper_manager: cannot hold admin or manager roles
 * - admin: manages own properties/services; cannot be hyper_admin or hyper_manager
 * - manager: manages assigned properties from admin; cannot be hyper_admin or hyper_manager
 */
export const INCOMPATIBLE_ROLES: Record<AppRole, AppRole[]> = {
  hyper_admin: ['hyper_manager', 'admin', 'manager'],
  hyper_manager: ['hyper_admin', 'admin', 'manager'],
  admin: ['hyper_admin', 'hyper_manager'],
  manager: ['hyper_admin', 'hyper_manager'],
  user: [],
};

@Entity('user_roles')
@Unique(['userId', 'role'])
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 20 })
  role: AppRole;

  @CreateDateColumn()
  createdAt: Date;
}
