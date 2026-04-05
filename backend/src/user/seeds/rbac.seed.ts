/**
 * RBAC Seed Script
 *
 * Seeds rbac_backend_permissions and rbac_frontend_permissions tables.
 * Run: npx ts-node -r tsconfig-paths/register src/user/seeds/rbac.seed.ts
 * Or:  npm run seed:rbac
 *
 * Idempotent — uses INSERT ... ON CONFLICT DO UPDATE.
 */

import { DataSource } from 'typeorm';
import { AppRole } from '../entity/user.entity';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BackendPerm {
  role: AppRole;
  resource: string;
  action: string;
  permission_key: string;
  scope: string;
  allowed: boolean;
  conditions?: Record<string, any>;
}

interface FrontendPerm {
  role: AppRole;
  ui_key: string;
  permission_key: string;
  allowed: boolean;
  conditions?: Record<string, any>;
}

// ─── Backend Permissions ──────────────────────────────────────────────────────

const BACKEND_PERMISSIONS: BackendPerm[] = [
  // ═══ HYPER_ADMIN ═══
  // Property management — restricted
  { role: 'hyper_admin', resource: 'property', action: 'create', permission_key: 'create_property', scope: 'global', allowed: false },
  { role: 'hyper_admin', resource: 'property', action: 'update', permission_key: 'modify_property', scope: 'global', allowed: false },
  { role: 'hyper_admin', resource: 'property', action: 'delete', permission_key: 'delete_property', scope: 'global', allowed: true },
  { role: 'hyper_admin', resource: 'property', action: 'read', permission_key: 'view_property', scope: 'global', allowed: true },
  { role: 'hyper_admin', resource: 'property', action: 'pause', permission_key: 'pause_property', scope: 'global', allowed: true },
  // Service management — restricted
  { role: 'hyper_admin', resource: 'service', action: 'create', permission_key: 'create_service', scope: 'global', allowed: false },
  { role: 'hyper_admin', resource: 'service', action: 'update', permission_key: 'modify_service', scope: 'global', allowed: false },
  { role: 'hyper_admin', resource: 'service', action: 'delete', permission_key: 'delete_service', scope: 'global', allowed: true },
  { role: 'hyper_admin', resource: 'service', action: 'read', permission_key: 'view_service', scope: 'global', allowed: true },
  { role: 'hyper_admin', resource: 'service', action: 'pause', permission_key: 'pause_service', scope: 'global', allowed: true },
  // Booking — restricted
  { role: 'hyper_admin', resource: 'booking', action: 'read', permission_key: 'view_bookings', scope: 'global', allowed: true },
  { role: 'hyper_admin', resource: 'booking', action: 'accept', permission_key: 'accept_bookings', scope: 'global', allowed: false },
  { role: 'hyper_admin', resource: 'booking', action: 'reject', permission_key: 'reject_bookings', scope: 'global', allowed: true },
  { role: 'hyper_admin', resource: 'booking', action: 'create', permission_key: 'make_booking', scope: 'global', allowed: false, conditions: { booking_only: true } },
  // Groups — restricted
  { role: 'hyper_admin', resource: 'property_group', action: 'create', permission_key: 'create_property_groups', scope: 'global', allowed: false },
  { role: 'hyper_admin', resource: 'property_group', action: 'read', permission_key: 'view_property_groups', scope: 'global', allowed: true },
  // Fee/cancellation — restricted
  { role: 'hyper_admin', resource: 'fee', action: 'create', permission_key: 'create_absorption_fees', scope: 'global', allowed: false },
  { role: 'hyper_admin', resource: 'cancellation', action: 'create', permission_key: 'create_cancellation_rules', scope: 'global', allowed: false },
  // Fee rules — allowed (hyper_admin manages global fee rules)
  { role: 'hyper_admin', resource: 'fee_rule', action: 'manage', permission_key: 'manage_fee_rules', scope: 'global', allowed: true },
  { role: 'hyper_admin', resource: 'points_rule', action: 'manage', permission_key: 'manage_points_rules', scope: 'global', allowed: true },
  // User/admin management
  { role: 'hyper_admin', resource: 'user', action: 'manage', permission_key: 'manage_users', scope: 'global', allowed: true },
  { role: 'hyper_admin', resource: 'admin', action: 'manage', permission_key: 'manage_admins', scope: 'global', allowed: true },
  { role: 'hyper_admin', resource: 'manager', action: 'invite', permission_key: 'invite_manager', scope: 'global', allowed: false },
  // Communication
  { role: 'hyper_admin', resource: 'chat', action: 'reply', permission_key: 'reply_chat', scope: 'global', allowed: true },
  { role: 'hyper_admin', resource: 'review', action: 'reply', permission_key: 'reply_reviews', scope: 'global', allowed: true },
  // Analytics & dashboard
  { role: 'hyper_admin', resource: 'analytics', action: 'view', permission_key: 'view_analytics', scope: 'global', allowed: true },
  { role: 'hyper_admin', resource: 'payment', action: 'validate', permission_key: 'validate_payments', scope: 'global', allowed: true },
  { role: 'hyper_admin', resource: 'document', action: 'verify', permission_key: 'verify_documents', scope: 'global', allowed: true },
  { role: 'hyper_admin', resource: 'payment', action: 'view', permission_key: 'view_payments', scope: 'global', allowed: true },
  { role: 'hyper_admin', resource: 'email', action: 'view', permission_key: 'view_email_analytics', scope: 'global', allowed: true },

  // ═══ HYPER_MANAGER ═══ (permissions assignable by hyper_admin — default false, granted via assignments)
  { role: 'hyper_manager', resource: 'property', action: 'create', permission_key: 'create_property', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'property', action: 'update', permission_key: 'modify_property', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'property', action: 'delete', permission_key: 'delete_property', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'property', action: 'pause', permission_key: 'pause_property', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'property', action: 'read', permission_key: 'view_property', scope: 'global', allowed: true },
  { role: 'hyper_manager', resource: 'service', action: 'create', permission_key: 'create_service', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'service', action: 'update', permission_key: 'modify_service', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'service', action: 'delete', permission_key: 'delete_service', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'service', action: 'pause', permission_key: 'pause_service', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'booking', action: 'read', permission_key: 'view_bookings', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'booking', action: 'accept', permission_key: 'accept_bookings', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'booking', action: 'reject', permission_key: 'reject_bookings', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'booking', action: 'pause', permission_key: 'pause_bookings', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'booking', action: 'create', permission_key: 'make_booking', scope: 'global', allowed: false },
  { role: 'hyper_manager', resource: 'booking', action: 'refund', permission_key: 'refund_users', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'demand', action: 'answer', permission_key: 'answer_demands', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'demand', action: 'decline', permission_key: 'decline_demands', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'demand', action: 'accept', permission_key: 'accept_demands', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'chat', action: 'reply', permission_key: 'reply_chat', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'review', action: 'reply', permission_key: 'reply_reviews', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'comment', action: 'reply', permission_key: 'reply_comments', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'message', action: 'send', permission_key: 'send_messages', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'guest', action: 'contact', permission_key: 'contact_guests', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'analytics', action: 'view', permission_key: 'view_analytics', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'promotion', action: 'manage', permission_key: 'manage_promotions', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'offer', action: 'modify', permission_key: 'modify_offers', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'user', action: 'manage', permission_key: 'manage_users', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'admin', action: 'manage', permission_key: 'manage_admins', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'manager', action: 'manage', permission_key: 'manage_managers', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'manager', action: 'invite', permission_key: 'invite_manager', scope: 'global', allowed: false },
  { role: 'hyper_manager', resource: 'payment', action: 'validate', permission_key: 'validate_payments', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'document', action: 'verify', permission_key: 'verify_documents', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'fee_rule', action: 'manage', permission_key: 'manage_fee_rules', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'cancellation', action: 'manage', permission_key: 'manage_cancellation_rules', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'entity', action: 'archive', permission_key: 'archive_entities', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'payment', action: 'view', permission_key: 'view_payments', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'email', action: 'view', permission_key: 'view_email_analytics', scope: 'assigned', allowed: false },
  { role: 'hyper_manager', resource: 'fee_absorption', action: 'manage', permission_key: 'manage_fee_absorption', scope: 'assigned', allowed: false },

  // ═══ ADMIN (Host) ═══
  { role: 'admin', resource: 'property', action: 'create', permission_key: 'create_property', scope: 'own', allowed: true },
  { role: 'admin', resource: 'property', action: 'update', permission_key: 'modify_property', scope: 'own', allowed: true },
  { role: 'admin', resource: 'property', action: 'delete', permission_key: 'delete_property', scope: 'own', allowed: true },
  { role: 'admin', resource: 'property', action: 'pause', permission_key: 'pause_property', scope: 'own', allowed: true },
  { role: 'admin', resource: 'property', action: 'read', permission_key: 'view_property', scope: 'own', allowed: true },
  { role: 'admin', resource: 'service', action: 'create', permission_key: 'create_service', scope: 'own', allowed: true },
  { role: 'admin', resource: 'service', action: 'update', permission_key: 'modify_service', scope: 'own', allowed: true },
  { role: 'admin', resource: 'service', action: 'delete', permission_key: 'delete_service', scope: 'own', allowed: true },
  { role: 'admin', resource: 'service', action: 'pause', permission_key: 'pause_service', scope: 'own', allowed: true },
  { role: 'admin', resource: 'booking', action: 'read', permission_key: 'view_bookings', scope: 'own', allowed: true },
  { role: 'admin', resource: 'booking', action: 'accept', permission_key: 'accept_bookings', scope: 'own', allowed: true },
  { role: 'admin', resource: 'booking', action: 'reject', permission_key: 'reject_bookings', scope: 'own', allowed: true },
  { role: 'admin', resource: 'booking', action: 'pause', permission_key: 'pause_bookings', scope: 'own', allowed: true },
  { role: 'admin', resource: 'booking', action: 'refund', permission_key: 'refund_users', scope: 'own', allowed: true },
  { role: 'admin', resource: 'booking', action: 'create', permission_key: 'make_booking', scope: 'global', allowed: false },
  { role: 'admin', resource: 'demand', action: 'answer', permission_key: 'answer_demands', scope: 'own', allowed: true },
  { role: 'admin', resource: 'demand', action: 'decline', permission_key: 'decline_demands', scope: 'own', allowed: true },
  { role: 'admin', resource: 'demand', action: 'accept', permission_key: 'accept_demands', scope: 'own', allowed: true },
  { role: 'admin', resource: 'chat', action: 'reply', permission_key: 'reply_chat', scope: 'own', allowed: true },
  { role: 'admin', resource: 'review', action: 'reply', permission_key: 'reply_reviews', scope: 'own', allowed: true },
  { role: 'admin', resource: 'comment', action: 'reply', permission_key: 'reply_comments', scope: 'own', allowed: true },
  { role: 'admin', resource: 'message', action: 'send', permission_key: 'send_messages', scope: 'own', allowed: true },
  { role: 'admin', resource: 'guest', action: 'contact', permission_key: 'contact_guests', scope: 'own', allowed: true },
  { role: 'admin', resource: 'analytics', action: 'view', permission_key: 'view_analytics', scope: 'own', allowed: true },
  { role: 'admin', resource: 'promotion', action: 'manage', permission_key: 'manage_promotions', scope: 'own', allowed: true },
  { role: 'admin', resource: 'offer', action: 'modify', permission_key: 'modify_offers', scope: 'own', allowed: true },
  { role: 'admin', resource: 'property_group', action: 'create', permission_key: 'create_property_groups', scope: 'own', allowed: true },
  { role: 'admin', resource: 'fee_absorption', action: 'manage', permission_key: 'manage_fee_absorption', scope: 'own', allowed: true },
  { role: 'admin', resource: 'fee_rule', action: 'manage', permission_key: 'manage_fee_rules', scope: 'global', allowed: false },
  { role: 'admin', resource: 'points_rule', action: 'manage', permission_key: 'manage_points_rules', scope: 'global', allowed: false },
  { role: 'admin', resource: 'manager', action: 'invite', permission_key: 'invite_manager', scope: 'own', allowed: true },
  { role: 'admin', resource: 'price', action: 'modify', permission_key: 'modify_prices', scope: 'own', allowed: true },
  { role: 'admin', resource: 'photo', action: 'modify', permission_key: 'modify_photos', scope: 'own', allowed: true },
  { role: 'admin', resource: 'availability', action: 'manage', permission_key: 'manage_availability', scope: 'own', allowed: true },
  { role: 'admin', resource: 'amenity', action: 'manage', permission_key: 'manage_amenities', scope: 'own', allowed: true },

  // ═══ MANAGER ═══ (permissions depend on admin assignments, defaults are false)
  { role: 'manager', resource: 'property', action: 'update', permission_key: 'modify_property', scope: 'assigned', allowed: false },
  { role: 'manager', resource: 'property', action: 'pause', permission_key: 'pause_property', scope: 'assigned', allowed: false },
  { role: 'manager', resource: 'property', action: 'read', permission_key: 'view_property', scope: 'assigned', allowed: true },
  { role: 'manager', resource: 'booking', action: 'read', permission_key: 'view_bookings', scope: 'assigned', allowed: false },
  { role: 'manager', resource: 'booking', action: 'accept', permission_key: 'accept_bookings', scope: 'assigned', allowed: false },
  { role: 'manager', resource: 'booking', action: 'reject', permission_key: 'reject_bookings', scope: 'assigned', allowed: false },
  { role: 'manager', resource: 'booking', action: 'create', permission_key: 'make_booking', scope: 'assigned', allowed: true },
  { role: 'manager', resource: 'chat', action: 'reply', permission_key: 'reply_chat', scope: 'assigned', allowed: false },
  { role: 'manager', resource: 'review', action: 'reply', permission_key: 'reply_reviews', scope: 'assigned', allowed: false },
  { role: 'manager', resource: 'analytics', action: 'view', permission_key: 'view_analytics', scope: 'assigned', allowed: false },
  { role: 'manager', resource: 'price', action: 'modify', permission_key: 'modify_prices', scope: 'assigned', allowed: false },
  { role: 'manager', resource: 'photo', action: 'modify', permission_key: 'modify_photos', scope: 'assigned', allowed: false },
  { role: 'manager', resource: 'availability', action: 'manage', permission_key: 'manage_availability', scope: 'assigned', allowed: false },
  { role: 'manager', resource: 'guest', action: 'invite', permission_key: 'invite_guest', scope: 'assigned', allowed: true },

  // ═══ USER ═══
  { role: 'user', resource: 'property', action: 'read', permission_key: 'view_property', scope: 'global', allowed: true },
  { role: 'user', resource: 'service', action: 'read', permission_key: 'view_service', scope: 'global', allowed: true },
  { role: 'user', resource: 'booking', action: 'create', permission_key: 'make_booking', scope: 'global', allowed: true },
  { role: 'user', resource: 'booking', action: 'read', permission_key: 'view_bookings', scope: 'own', allowed: true },
  { role: 'user', resource: 'review', action: 'create', permission_key: 'create_review', scope: 'global', allowed: true },
  { role: 'user', resource: 'reaction', action: 'manage', permission_key: 'manage_reactions', scope: 'global', allowed: true },
  { role: 'user', resource: 'profile', action: 'update', permission_key: 'update_profile', scope: 'own', allowed: true },

  // ═══ GUEST ═══
  { role: 'guest', resource: 'property', action: 'read', permission_key: 'view_property', scope: 'inherited', allowed: true },
  { role: 'guest', resource: 'service', action: 'read', permission_key: 'view_service', scope: 'inherited', allowed: true },
  { role: 'guest', resource: 'booking', action: 'create', permission_key: 'make_booking', scope: 'inherited', allowed: true },
  { role: 'guest', resource: 'booking', action: 'read', permission_key: 'view_bookings', scope: 'own', allowed: true },
  { role: 'guest', resource: 'review', action: 'create', permission_key: 'create_review', scope: 'inherited', allowed: true },
  { role: 'guest', resource: 'reaction', action: 'manage', permission_key: 'manage_reactions', scope: 'inherited', allowed: true },
  { role: 'guest', resource: 'profile', action: 'update', permission_key: 'update_profile', scope: 'own', allowed: true },
];

// ─── Frontend Permissions ─────────────────────────────────────────────────────

const FRONTEND_PERMISSIONS: FrontendPerm[] = [
  // ═══ HYPER_ADMIN ═══
  { role: 'hyper_admin', ui_key: 'show_add_property_button', permission_key: 'create_property', allowed: false },
  { role: 'hyper_admin', ui_key: 'show_edit_property_button', permission_key: 'modify_property', allowed: false },
  { role: 'hyper_admin', ui_key: 'show_duplicate_property_button', permission_key: 'create_property', allowed: false },
  { role: 'hyper_admin', ui_key: 'show_add_service_button', permission_key: 'create_service', allowed: false },
  { role: 'hyper_admin', ui_key: 'show_edit_service_button', permission_key: 'modify_service', allowed: false },
  { role: 'hyper_admin', ui_key: 'show_duplicate_service_button', permission_key: 'create_service', allowed: false },
  { role: 'hyper_admin', ui_key: 'show_accept_booking_button', permission_key: 'accept_bookings', allowed: false },
  { role: 'hyper_admin', ui_key: 'show_create_group_button', permission_key: 'create_property_groups', allowed: false },
  { role: 'hyper_admin', ui_key: 'show_create_absorption_button', permission_key: 'create_absorption_fees', allowed: false },
  { role: 'hyper_admin', ui_key: 'show_create_cancellation_button', permission_key: 'create_cancellation_rules', allowed: false },
  { role: 'hyper_admin', ui_key: 'show_invite_manager_option', permission_key: 'invite_manager', allowed: false },
  { role: 'hyper_admin', ui_key: 'show_dashboard_analytics', permission_key: 'view_analytics', allowed: true },
  { role: 'hyper_admin', ui_key: 'show_user_management', permission_key: 'manage_users', allowed: true },
  { role: 'hyper_admin', ui_key: 'show_payment_validation', permission_key: 'validate_payments', allowed: true },
  { role: 'hyper_admin', ui_key: 'show_document_verification', permission_key: 'verify_documents', allowed: true },
  { role: 'hyper_admin', ui_key: 'show_fee_rules_management', permission_key: 'manage_fee_rules', allowed: true },
  { role: 'hyper_admin', ui_key: 'show_points_rules_management', permission_key: 'manage_points_rules', allowed: true },

  // ═══ HYPER_MANAGER ═══ (defaults — actual depends on assigned permissions)
  { role: 'hyper_manager', ui_key: 'show_add_property_button', permission_key: 'create_property', allowed: false },
  { role: 'hyper_manager', ui_key: 'show_edit_property_button', permission_key: 'modify_property', allowed: false },
  { role: 'hyper_manager', ui_key: 'show_add_service_button', permission_key: 'create_service', allowed: false },
  { role: 'hyper_manager', ui_key: 'show_edit_service_button', permission_key: 'modify_service', allowed: false },
  { role: 'hyper_manager', ui_key: 'show_accept_booking_button', permission_key: 'accept_bookings', allowed: false },
  { role: 'hyper_manager', ui_key: 'show_invite_manager_option', permission_key: 'invite_manager', allowed: false },
  { role: 'hyper_manager', ui_key: 'show_dashboard_analytics', permission_key: 'view_analytics', allowed: false },
  { role: 'hyper_manager', ui_key: 'show_payment_validation', permission_key: 'validate_payments', allowed: false },
  { role: 'hyper_manager', ui_key: 'show_document_verification', permission_key: 'verify_documents', allowed: false },

  // ═══ ADMIN ═══
  { role: 'admin', ui_key: 'show_add_property_button', permission_key: 'create_property', allowed: true },
  { role: 'admin', ui_key: 'show_edit_property_button', permission_key: 'modify_property', allowed: true },
  { role: 'admin', ui_key: 'show_duplicate_property_button', permission_key: 'create_property', allowed: true },
  { role: 'admin', ui_key: 'show_add_service_button', permission_key: 'create_service', allowed: true },
  { role: 'admin', ui_key: 'show_edit_service_button', permission_key: 'modify_service', allowed: true },
  { role: 'admin', ui_key: 'show_duplicate_service_button', permission_key: 'create_service', allowed: true },
  { role: 'admin', ui_key: 'show_accept_booking_button', permission_key: 'accept_bookings', allowed: true },
  { role: 'admin', ui_key: 'show_create_group_button', permission_key: 'create_property_groups', allowed: true },
  { role: 'admin', ui_key: 'show_create_absorption_button', permission_key: 'manage_fee_absorption', allowed: true },
  { role: 'admin', ui_key: 'show_invite_manager_option', permission_key: 'invite_manager', allowed: true },
  { role: 'admin', ui_key: 'show_dashboard_analytics', permission_key: 'view_analytics', allowed: true },
  { role: 'admin', ui_key: 'show_fee_rules_management', permission_key: 'manage_fee_rules', allowed: false },
  { role: 'admin', ui_key: 'show_points_rules_management', permission_key: 'manage_points_rules', allowed: false },

  // ═══ MANAGER ═══
  { role: 'manager', ui_key: 'show_add_property_button', permission_key: 'create_property', allowed: false },
  { role: 'manager', ui_key: 'show_edit_property_button', permission_key: 'modify_property', allowed: false },
  { role: 'manager', ui_key: 'show_accept_booking_button', permission_key: 'accept_bookings', allowed: false },
  { role: 'manager', ui_key: 'show_dashboard_analytics', permission_key: 'view_analytics', allowed: false },

  // ═══ USER ═══
  { role: 'user', ui_key: 'show_booking_button', permission_key: 'make_booking', allowed: true },
  { role: 'user', ui_key: 'show_review_form', permission_key: 'create_review', allowed: true },

  // ═══ GUEST ═══
  { role: 'guest', ui_key: 'show_booking_button', permission_key: 'make_booking', allowed: true },
  { role: 'guest', ui_key: 'show_review_form', permission_key: 'create_review', allowed: true },
];

// ─── Seed Runner ──────────────────────────────────────────────────────────────

export async function seedRbac(dataSource: DataSource): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // Seed backend permissions
    for (const perm of BACKEND_PERMISSIONS) {
      await queryRunner.query(
        `INSERT INTO rbac_backend_permissions (id, role, resource, action, permission_key, scope, allowed, conditions)
         VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (role, permission_key)
         DO UPDATE SET resource = $2, action = $3, scope = $5, allowed = $6, conditions = $7, updated_at = NOW()`,
        [
          perm.role,
          perm.resource,
          perm.action,
          perm.permission_key,
          perm.scope,
          perm.allowed,
          perm.conditions ? JSON.stringify(perm.conditions) : null,
        ],
      );
    }

    // Seed frontend permissions
    for (const perm of FRONTEND_PERMISSIONS) {
      await queryRunner.query(
        `INSERT INTO rbac_frontend_permissions (id, role, ui_key, permission_key, allowed, conditions)
         VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5)
         ON CONFLICT (role, ui_key)
         DO UPDATE SET permission_key = $3, allowed = $4, conditions = $5, updated_at = NOW()`,
        [
          perm.role,
          perm.ui_key,
          perm.permission_key,
          perm.allowed,
          perm.conditions ? JSON.stringify(perm.conditions) : null,
        ],
      );
    }

    await queryRunner.commitTransaction();
    console.log(`✅ RBAC seed complete: ${BACKEND_PERMISSIONS.length} backend + ${FRONTEND_PERMISSIONS.length} frontend permissions`);
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('❌ RBAC seed failed:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}

// Direct execution support
if (require.main === module) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createConnection } = require('typeorm');
  createConnection()
    .then((ds: DataSource) => seedRbac(ds))
    .then(() => process.exit(0))
    .catch((err: any) => {
      console.error(err);
      process.exit(1);
    });
}
