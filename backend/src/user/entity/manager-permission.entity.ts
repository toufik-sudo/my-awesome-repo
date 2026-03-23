import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ManagerAssignment } from './manager-assignment.entity';

// All configurable permissions for managers
export type PermissionType =
  | 'answer_demands'
  | 'accept_demands'
  | 'decline_demands'
  | 'refund_users'
  | 'reply_reviews'
  | 'reply_comments'
  | 'manage_reactions'
  | 'modify_prices'
  | 'modify_photos'
  | 'modify_offers'
  | 'modify_title'
  | 'modify_description'
  | 'view_analytics'
  | 'manage_availability'
  | 'send_messages';

@Entity('manager_permissions')
@Unique(['assignmentId', 'permission'])
export class ManagerPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  assignmentId: string;

  @ManyToOne(() => ManagerAssignment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assignmentId' })
  assignment: ManagerAssignment;

  @Column({ type: 'varchar', length: 50 })
  permission: PermissionType;

  @Column({ default: true })
  isGranted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
