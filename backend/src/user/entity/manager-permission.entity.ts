import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { User } from './user.entity';
import { RbacBackendPermission } from './rbac-backend-permission.entity';
import { RbacFrontendPermission } from './rbac-frontend-permission.entity';
import { Property } from '../../properties/entity/property.entity';
import { TourismService } from '../../services/entity/tourism-service.entity';
import { PropertyGroup } from '../../properties/entity/property-group.entity';
import { ServiceGroup } from '../../services/entity/service-group.entity';

export type PermissionScope = 'all' | 'properties' | 'services' | 'property_groups' | 'service_groups';

@Entity('manager_permissions')
@Index('IDX_MANAGER_PERM_MANAGER', ['managerId'])
@Index('IDX_MANAGER_PERM_BACKEND_KEY', ['backendPermissionKey'])
export class ManagerPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  managerId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'managerId' })
  manager: User;

  @Column()
  assignedById: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assignedById' })
  assignedBy: User;

  /** FK to rbac_backend_permissions.permission_key */
  @Column({ type: 'varchar', length: 200 })
  backendPermissionKey: string;

  @ManyToOne(() => RbacBackendPermission, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'backendPermissionKey', referencedColumnName: 'permission_key' })
  backendPermission: RbacBackendPermission;

  /** FK to rbac_frontend_permissions.permission_key (nullable) */
  @Column({ type: 'varchar', length: 200, nullable: true })
  frontendPermissionKey: string | null;

  @ManyToOne(() => RbacFrontendPermission, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'frontendPermissionKey', referencedColumnName: 'permission_key' })
  frontendPermission: RbacFrontendPermission;

  @Column({ type: 'varchar', length: 30 })
  scope: PermissionScope;

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
