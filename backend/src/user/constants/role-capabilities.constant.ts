import { AppRole } from '../entity/user.entity';
import { PermissionType } from '../entity/manager-permission.entity';

/**
 * Defines what each role CANNOT do (restrictions).
 * Everything not listed here is implicitly allowed for that role within its scope.
 */
export const ROLE_RESTRICTIONS: Record<AppRole, string[]> = {
  hyper_admin: [
    'invite_manager',          // managers are admin-scoped
    'create_property',         // hyper_admin doesn't own properties
    'modify_property',
    'create_service',          // hyper_admin doesn't own services
    'modify_service',
    'create_absorption_fees',
    'create_cancellation_rules',
    'accept_bookings',         // booking acceptance is host-level
    'make_booking',            // hyper_admin cannot book
    'assign_permissions_non_hypermanager', // can only assign to hyper_managers
    'create_property_groups',  // property groups are admin-level
  ],
  hyper_manager: [
    'invite_manager',
    'make_booking',
    // Everything else depends on permissions assigned by hyper_admin
  ],
  admin: [
    'access_other_admin_properties',
    'invite_hyper_admin',
    'invite_hyper_manager',
    'invite_admin',
    'global_document_verification',
    'manage_global_fee_rules',
    'make_booking',
  ],
  manager: [
    // Restricted to assigned scope; can book for self or others
  ],
  user: [
    // Read + booking only, full platform access
  ],
  guest: [
    // Read + booking only, scoped to inviter's properties/services
    // No management permissions at all
  ],
};

/**
 * Permissions that a hyper_admin can assign to hyper_managers.
 * These cover both CRUD on entities and special capabilities.
 */
export const HYPER_MANAGER_ASSIGNABLE_PERMISSIONS: PermissionType[] = [
  // Entity CRUD
  'create_property',
  'modify_property',
  'delete_property',
  'pause_property',
  'create_service',
  'modify_service',
  'delete_service',
  'pause_service',
  // Booking & demand management
  'view_bookings',
  'accept_bookings',
  'reject_bookings',
  'pause_bookings',
  'refund_users',
  'answer_demands',
  'decline_demands',
  'accept_demands',
  // Communication
  'reply_chat',
  'reply_reviews',
  'reply_comments',
  'send_messages',
  'contact_guests',
  // Business
  'view_analytics',
  'manage_promotions',
  'modify_offers',
  // User management
  'manage_users',
  'manage_admins',
  'manage_managers',
  // Special capabilities
  'validate_payments',
  'verify_documents',
  'manage_fee_rules',
  'manage_cancellation_rules',
  'archive_entities',
  // Dashboard access
  'view_payments',
  'view_email_analytics',
  'manage_fee_absorption',
];

/**
 * Permissions that an admin can assign to their managers.
 * Subset — no hyper-level or cross-admin permissions.
 */
export const ADMIN_ASSIGNABLE_PERMISSIONS: PermissionType[] = [
  'modify_property',
  'pause_property',
  'modify_prices',
  'modify_photos',
  'modify_title',
  'modify_description',
  'manage_availability',
  'manage_amenities',
  'view_bookings',
  'accept_bookings',
  'reject_bookings',
  'pause_bookings',
  'refund_users',
  'answer_demands',
  'decline_demands',
  'accept_demands',
  'reply_chat',
  'reply_reviews',
  'reply_comments',
  'send_messages',
  'contact_guests',
  'manage_reactions',
  'manage_likes',
  'view_analytics',
  'manage_promotions',
  'modify_offers',
  'modify_service',
  'pause_service',
];

/**
 * Roles allowed to access all properties/services on the platform (not scoped).
 */
export const GLOBAL_ACCESS_ROLES: AppRole[] = ['hyper_admin', 'hyper_manager', 'user'];

/**
 * Roles that have scoped access (only see what's assigned to them).
 */
export const SCOPED_ACCESS_ROLES: AppRole[] = ['admin', 'manager', 'guest'];
