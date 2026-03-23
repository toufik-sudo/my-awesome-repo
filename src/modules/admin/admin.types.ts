export type AppRole = 'hyper_manager' | 'admin' | 'manager' | 'user';

export type AssignmentScope = 'all' | 'property' | 'property_group';

export type PermissionType =
  | 'view_bookings'
  | 'accept_bookings'
  | 'decline_bookings'
  | 'refund_bookings'
  | 'reply_reviews'
  | 'reply_comments'
  | 'manage_reactions'
  | 'modify_prices'
  | 'modify_photos'
  | 'modify_listing'
  | 'modify_availability'
  | 'view_analytics'
  | 'manage_promotions'
  | 'contact_guests'
  | 'manage_amenities';

export interface UserRole {
  id: string;
  userId: number;
  role: AppRole;
  createdAt: string;
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
  roles: AppRole[];
}

export const PERMISSION_LABELS: Record<PermissionType, string> = {
  view_bookings: 'View Bookings',
  accept_bookings: 'Accept Bookings',
  decline_bookings: 'Decline Bookings',
  refund_bookings: 'Refund Bookings',
  reply_reviews: 'Reply to Reviews',
  reply_comments: 'Reply to Comments',
  manage_reactions: 'Manage Reactions',
  modify_prices: 'Modify Prices',
  modify_photos: 'Modify Photos',
  modify_listing: 'Modify Listing',
  modify_availability: 'Modify Availability',
  view_analytics: 'View Analytics',
  manage_promotions: 'Manage Promotions',
  contact_guests: 'Contact Guests',
  manage_amenities: 'Manage Amenities',
};

export const PERMISSION_CATEGORIES: Record<string, PermissionType[]> = {
  'Bookings': ['view_bookings', 'accept_bookings', 'decline_bookings', 'refund_bookings'],
  'Communication': ['reply_reviews', 'reply_comments', 'manage_reactions', 'contact_guests'],
  'Property Management': ['modify_prices', 'modify_photos', 'modify_listing', 'modify_availability', 'manage_amenities'],
  'Business': ['view_analytics', 'manage_promotions'],
};
