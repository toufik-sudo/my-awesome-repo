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

export const ROLE_HIERARCHY = {
  hyper_admin: 5,
  hyper_manager: 4,
  admin: 3,
  manager: 2,
  user: 1,
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
