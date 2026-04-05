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

// All configurable permissions for managers and hyper_managers
export type PermissionType =
  // Property management
  | 'create_property'
  | 'modify_property'
  | 'delete_property'
  | 'pause_property'
  | 'modify_prices'
  | 'modify_photos'
  | 'modify_title'
  | 'modify_description'
  | 'manage_availability'
  | 'manage_amenities'
  // Booking management
  | 'view_bookings'
  | 'accept_bookings'
  | 'reject_bookings'
  | 'pause_bookings'
  | 'refund_users'
  | 'answer_demands'
  | 'decline_demands'
  | 'accept_demands'
  | 'manage_bookings'
  // Communication
  | 'reply_chat'
  | 'reply_reviews'
  | 'reply_comments'
  | 'send_messages'
  | 'contact_guests'
  // Social & engagement
  | 'manage_reactions'
  | 'manage_likes'
  // Business & analytics
  | 'view_analytics'
  | 'manage_promotions'
  | 'modify_offers'
  // Service management
  | 'create_service'
  | 'modify_service'
  | 'delete_service'
  | 'pause_service'
  // User management (hyper level)
  | 'manage_users'
  | 'manage_admins'
  | 'manage_managers'
  // Special capabilities (hyper_manager assignable)
  | 'validate_payments'
  | 'verify_documents'
  | 'manage_fee_rules'
  | 'manage_cancellation_rules'
  | 'archive_entities'
  // Granular dashboard permissions
  | 'view_payments'
  | 'view_email_analytics'
  | 'manage_fee_absorption';


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
