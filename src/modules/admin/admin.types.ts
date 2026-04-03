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
  | 'manage_managers';

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
};
