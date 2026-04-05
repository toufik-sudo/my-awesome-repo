export type AppRole = 'hyper_admin' | 'hyper_manager' | 'admin' | 'manager' | 'user' | 'guest';

export type AssignmentScope = 'all' | 'property' | 'property_group';

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

export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'cancelled';

export interface UserRole {
  userId: number;
  role: AppRole;
}

export interface PropertyGroup {
  id: string;
  adminId: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyGroupMembership {
  id: string;
  propertyId: string;
  groupId: string;
  addedAt: string;
}

export interface ManagerAssignment {
  id: string;
  managerId: number;
  assignedByAdminId: number;
  scope: AssignmentScope;
  propertyId?: string;
  propertyGroupId?: string;
  isActive: boolean;
  createdAt: string;
  property?: { id: string; title: string };
  propertyGroup?: { id: string; name: string };
}

export interface ManagerPermission {
  id: string;
  assignmentId: string;
  permission: PermissionType;
  isGranted: boolean;
}

export interface UserWithRoles {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: AppRole;
  isActive?: boolean;
}

export interface Invitation {
  id: string;
  method: 'email' | 'phone';
  email?: string;
  phone?: string;
  role: AppRole;
  status: InvitationStatus;
  invitedBy: number;
  message?: string;
  token?: string;
  createdAt: string;
  updatedAt?: string;
  expiresAt: string;
  acceptedAt?: string;
}

export interface CreateInvitationRequest {
  method: 'email' | 'phone';
  email?: string;
  phone?: string;
  role: AppRole;
  message?: string;
}

export interface ConvertGuestToUserRequest {
  userId: number;
}

export interface ConvertGuestToUserResponse {
  userId: number;
  role: AppRole;
}

// ─── Invitation Rules ─────────────────────────────────────────────────────

/**
 * Which roles each inviter role can invite.
 * Synced with backend/src/user/constants/invitation-rules.constant.ts
 *
 * NOTE: hyper_admin CANNOT invite manager (admin-scoped).
 */
export const INVITATION_ALLOWED_ROLES: Record<AppRole, AppRole[]> = {
  hyper_admin: ['hyper_manager', 'admin', 'user', 'guest'],
  hyper_manager: ['admin', 'guest'],
  admin: ['manager', 'guest'],
  manager: ['guest'],
  user: [],
  guest: [],
};

export function getAllowedInvitationRoles(inviterRole: AppRole): AppRole[] {
  return INVITATION_ALLOWED_ROLES[inviterRole] || [];
}

// ─── Booking Restrictions ─────────────────────────────────────────────────

/**
 * Only manager, guest, and user can make bookings.
 * hyper_admin, hyper_manager, and admin CANNOT book.
 */
export const BOOKING_ALLOWED_ROLES: AppRole[] = ['manager', 'guest', 'user'];

export function canMakeBooking(role: AppRole): boolean {
  return BOOKING_ALLOWED_ROLES.includes(role);
}

// ─── Labels ───────────────────────────────────────────────────────────────

export const ROLE_LABELS: Record<AppRole, string> = {
  hyper_admin: 'Hyper Admin',
  hyper_manager: 'Hyper Manager',
  admin: 'Admin (Host)',
  manager: 'Manager',
  user: 'Utilisateur',
  guest: 'Guest',
};

export const PERMISSION_LABELS: Record<PermissionType, string> = {
  create_property: 'Create Property',
  modify_property: 'Modify Property',
  delete_property: 'Delete Property',
  pause_property: 'Pause Property',
  modify_prices: 'Modify Prices',
  modify_photos: 'Modify Photos',
  modify_title: 'Modify Title',
  modify_description: 'Modify Description',
  manage_availability: 'Manage Availability',
  manage_amenities: 'Manage Amenities',
  view_bookings: 'View Bookings',
  accept_bookings: 'Accept Bookings',
  reject_bookings: 'Reject Bookings',
  pause_bookings: 'Pause Bookings',
  refund_users: 'Refund Users',
  answer_demands: 'Answer Demands',
  decline_demands: 'Decline Demands',
  accept_demands: 'Accept Demands',
  reply_chat: 'Reply to Chat',
  reply_reviews: 'Reply to Reviews',
  reply_comments: 'Reply to Comments',
  send_messages: 'Send Messages',
  contact_guests: 'Contact Guests',
  manage_reactions: 'Manage Reactions',
  manage_likes: 'Manage Likes',
  view_analytics: 'View Analytics',
  manage_promotions: 'Manage Promotions',
  modify_offers: 'Modify Offers',
  create_service: 'Create Service',
  modify_service: 'Modify Service',
  delete_service: 'Delete Service',
  pause_service: 'Pause Service',
  manage_users: 'Manage Users',
  manage_admins: 'Manage Admins',
  manage_managers: 'Manage Managers',
  validate_payments: 'Validate Payments',
  verify_documents: 'Verify Documents',
  manage_fee_rules: 'Manage Fee Rules',
  manage_cancellation_rules: 'Manage Cancellation Rules',
  archive_entities: 'Archive Entities',
  view_payments: 'View Payments',
  view_email_analytics: 'View Email Analytics',
  manage_fee_absorption: 'Manage Fee Absorption',
};

export const PERMISSION_CATEGORIES: Record<string, PermissionType[]> = {
  'Property Management': [
    'create_property', 'modify_property', 'delete_property', 'pause_property',
    'modify_prices', 'modify_photos', 'modify_title', 'modify_description',
    'manage_availability', 'manage_amenities',
  ],
  'Bookings': ['view_bookings', 'accept_bookings', 'reject_bookings', 'pause_bookings', 'refund_users', 'answer_demands', 'decline_demands', 'accept_demands'],
  'Communication': ['reply_chat', 'reply_reviews', 'reply_comments', 'send_messages', 'contact_guests'],
  'Social & Engagement': ['manage_reactions', 'manage_likes'],
  'Business & Analytics': ['view_analytics', 'manage_promotions', 'modify_offers'],
  'Service Management': ['create_service', 'modify_service', 'delete_service', 'pause_service'],
  'User Management': ['manage_users', 'manage_admins', 'manage_managers'],
  'Special Capabilities': ['validate_payments', 'verify_documents', 'manage_fee_rules', 'manage_cancellation_rules', 'archive_entities'],
  'Dashboard Access': ['view_payments', 'view_email_analytics', 'manage_fee_absorption'],
};

// ─── Role Restrictions (for UI enforcement) ───────────────────────────────

/**
 * What each role CANNOT do — for frontend UI gating.
 * Synced with backend/src/user/constants/role-capabilities.constant.ts
 */
export const ROLE_RESTRICTIONS: Record<AppRole, string[]> = {
  hyper_admin: [
    'invite_manager',
    'create_property', 'modify_property',
    'create_service', 'modify_service',
    'create_absorption_fees', 'create_cancellation_rules',
    'accept_bookings',
    'make_booking',
    'assign_permissions_non_hypermanager',
    'create_property_groups',
  ],
  hyper_manager: [
    'invite_manager',
    'make_booking',
    // Everything else depends on permissions assigned by hyper_admin
  ],
  admin: [
    'access_other_admin_properties', 'invite_hyper_admin', 'invite_hyper_manager',
    'invite_admin', 'global_document_verification', 'manage_global_fee_rules', 'make_booking',
  ],
  manager: [],
  user: [],
  guest: [],
};

/**
 * Hyper-manager assignable permission types.
 * Synced with backend/src/user/constants/role-capabilities.constant.ts
 */
export const HYPER_MANAGER_ASSIGNABLE_PERMISSIONS: PermissionType[] = [
  'create_property', 'modify_property', 'delete_property', 'pause_property',
  'create_service', 'modify_service', 'delete_service', 'pause_service',
  'view_bookings', 'accept_bookings', 'reject_bookings', 'pause_bookings',
  'refund_users', 'answer_demands', 'decline_demands', 'accept_demands',
  'reply_chat', 'reply_reviews', 'reply_comments', 'send_messages', 'contact_guests',
  'view_analytics', 'manage_promotions', 'modify_offers',
  'manage_users', 'manage_admins', 'manage_managers',
  'validate_payments', 'verify_documents', 'manage_fee_rules', 'manage_cancellation_rules', 'archive_entities',
];

/**
 * Admin-assignable permission types for managers.
 */
export const ADMIN_ASSIGNABLE_PERMISSIONS: PermissionType[] = [
  'modify_property', 'pause_property', 'modify_prices', 'modify_photos',
  'modify_title', 'modify_description', 'manage_availability', 'manage_amenities',
  'view_bookings', 'accept_bookings', 'reject_bookings', 'pause_bookings',
  'refund_users', 'answer_demands', 'decline_demands', 'accept_demands',
  'reply_chat', 'reply_reviews', 'reply_comments', 'send_messages', 'contact_guests',
  'manage_reactions', 'manage_likes', 'view_analytics', 'manage_promotions', 'modify_offers',
  'modify_service', 'pause_service',
];
