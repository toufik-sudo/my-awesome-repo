export type AppRole = 'hyper_admin' | 'hyper_manager' | 'admin' | 'manager' | 'user';

export type AssignmentScope = 'all' | 'property' | 'property_group';

export type PermissionType =
  // Property management
  | 'create_property'
  | 'modify_property'
  | 'delete_property'
  | 'pause_property'
  | 'archive_property'
  | 'duplicate_property'
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
  | 'archive_service'
  | 'duplicate_service'
  // User management (hyper level)
  | 'manage_users'
  | 'manage_admins'
  | 'manage_managers'
  // Fee management
  | 'manage_fee_absorption'
  | 'manage_cancellation_rules';

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
  isActive?: boolean;
  phoneNbr?: string;
  city?: string;
}

export const PERMISSION_LABELS: Record<PermissionType, string> = {
  // Property management
  create_property: 'Créer une propriété',
  modify_property: 'Modifier une propriété',
  delete_property: 'Supprimer une propriété',
  pause_property: 'Mettre en pause une propriété',
  archive_property: 'Archiver une propriété',
  duplicate_property: 'Dupliquer une propriété',
  modify_prices: 'Modifier les prix',
  modify_photos: 'Modifier les photos',
  modify_title: 'Modifier le titre',
  modify_description: 'Modifier la description',
  manage_availability: 'Gérer la disponibilité',
  manage_amenities: 'Gérer les commodités',
  // Booking management
  view_bookings: 'Voir les réservations',
  accept_bookings: 'Accepter les réservations',
  reject_bookings: 'Rejeter les réservations',
  pause_bookings: 'Mettre en pause les réservations',
  refund_users: 'Rembourser les utilisateurs',
  // Communication
  reply_chat: 'Répondre au chat',
  reply_reviews: 'Répondre aux avis',
  reply_comments: 'Répondre aux commentaires',
  send_messages: 'Envoyer des messages',
  contact_guests: 'Contacter les clients',
  // Social
  manage_reactions: 'Gérer les réactions',
  manage_likes: 'Gérer les likes',
  // Business
  view_analytics: 'Voir les analyses',
  manage_promotions: 'Gérer les promotions',
  modify_offers: 'Modifier les offres',
  // Services
  create_service: 'Créer un service',
  modify_service: 'Modifier un service',
  delete_service: 'Supprimer un service',
  pause_service: 'Mettre en pause un service',
  archive_service: 'Archiver un service',
  duplicate_service: 'Dupliquer un service',
  // User management
  manage_users: 'Gérer les utilisateurs',
  manage_admins: 'Gérer les admins',
  manage_managers: 'Gérer les managers',
  // Fee management
  manage_fee_absorption: 'Gérer l\'absorption des frais',
  manage_cancellation_rules: 'Gérer les règles d\'annulation',
};

export const PERMISSION_CATEGORIES: Record<string, PermissionType[]> = {
  'Gestion des propriétés': [
    'create_property', 'modify_property', 'delete_property', 'pause_property',
    'archive_property', 'duplicate_property',
    'modify_prices', 'modify_photos', 'modify_title', 'modify_description',
    'manage_availability', 'manage_amenities',
  ],
  'Réservations': ['view_bookings', 'accept_bookings', 'reject_bookings', 'pause_bookings', 'refund_users'],
  'Communication': ['reply_chat', 'reply_reviews', 'reply_comments', 'send_messages', 'contact_guests'],
  'Social & Engagement': ['manage_reactions', 'manage_likes'],
  'Business & Analytics': ['view_analytics', 'manage_promotions', 'modify_offers'],
  'Gestion des services': ['create_service', 'modify_service', 'delete_service', 'pause_service', 'archive_service', 'duplicate_service'],
  'Gestion des utilisateurs': ['manage_users', 'manage_admins', 'manage_managers'],
  'Frais & Annulations': ['manage_fee_absorption', 'manage_cancellation_rules'],
};
