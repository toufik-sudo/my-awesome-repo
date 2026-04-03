// ─── Route Constants ────────────────────────────────────────────────────────

export const ADMIN_ROUTES = {
  DASHBOARD: '/dashboard',
  HYPER_DASHBOARD: '/dashboard/hyper',
  ADMIN_DASHBOARD: '/dashboard/admin',
  MANAGER_DASHBOARD: '/dashboard/admin',
  VERIFICATION_REVIEW: '/admin/verification-review',
  DOCUMENT_VALIDATION: '/admin/document-validation',
  PAYMENT_VALIDATION: '/admin/payment-validation',
} as const;

// ─── Role Hierarchy ─────────────────────────────────────────────────────────

export const ROLE_HIERARCHY: Record<string, number> = {
  hyper_admin: 100,
  hyper_manager: 90,
  admin: 50,
  manager: 30,
  user: 10,
  guest: 5,
} as const;

// ─── Invitation Status ──────────────────────────────────────────────────────

export const INVITATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
} as const;

export type InvitationStatus = typeof INVITATION_STATUS[keyof typeof INVITATION_STATUS];

// ─── User Status ────────────────────────────────────────────────────────────

export const USER_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  DISABLED: 'disabled',
} as const;

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

// ─── Invitation Rules (synced with backend) ────────────────────────────────

export { INVITATION_ALLOWED_ROLES, getAllowedInvitationRoles } from './admin.types';

// ─── Hyper Manager Permissions ──────────────────────────────────────────────

export const HYPER_PERMISSIONS = [
  'create_admins',
  'delete_admins',
  'disable_admins',
  'pause_admins',
  'create_managers',
  'delete_managers',
  'disable_managers',
  'pause_managers',
  'manage_guests',
  'validate_documents',
  'reject_documents',
  'view_system_stats',
  'manage_system_settings',
] as const;

export type HyperPermission = typeof HYPER_PERMISSIONS[number];

// ─── Guest Behavior Notes ──────────────────────────────────────────────────
/**
 * Guest behavior depends on who invited them:
 * - Admin invites Guest → access only admin's properties/services (read-only)
 * - Manager invites Guest → access only manager's assigned properties (multi-admin possible)
 * - HyperManager invites Guest → access hyper_manager's permissioned properties
 * 
 * Guests can: view properties/services, calendar, make reservations, contact support.
 * 
 * IT MVP Exception: Guest can request via support to get full access.
 * hyper_admin/hyper_manager can convert guest → user via API.
 * 
 * Non-invited users (self-registration) default to 'user' role with full access.
 */
