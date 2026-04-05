/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * RBAC Permission Registry — Single Source of Truth
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * ALL permission keys MUST be generated through the generator functions.
 * ⚠️  Hardcoded permission strings are FORBIDDEN — use rbac:validate to check.
 *
 * Sections:
 *   1. Backend API permissions  (controller.endpoint.METHOD)
 *   2. Frontend UI permissions  (component.subView.element.action)
 *   3. Bindings                 (API ↔ UI mappings)
 */

import { generateBackendPermissionKey, HttpMethod } from './utils/generate-backend-permission-key';
import { generateUiPermissionKey } from './utils/generate-ui-permission-key';

// ─── Helper to build a backend key + metadata ────────────────────────────────

interface BackendPermEntry {
  key: string;
  resource: string;
  action: string;
  description: string;
}

function be(
  controller: string,
  endpoint: string,
  method: HttpMethod,
  resource: string,
  action: string,
  description: string,
): BackendPermEntry {
  return {
    key: generateBackendPermissionKey(controller, endpoint, method),
    resource,
    action,
    description,
  };
}

interface FrontendPermEntry {
  key: string;
  description: string;
}

function fe(
  component: string,
  subView?: string,
  element?: string,
  action?: string,
  description?: string,
): FrontendPermEntry {
  return {
    key: generateUiPermissionKey(component, subView, element, action),
    description: description || '',
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. BACKEND PERMISSIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const BACKEND_PERMISSIONS: BackendPermEntry[] = [
  // ── Properties ──────────────────────────────────────────────────────────────
  be('PropertiesController', 'findAll', 'GET', 'properties', 'read', 'List all properties'),
  be('PropertiesController', 'findOne', 'GET', 'properties', 'read_one', 'Get single property'),
  be('PropertiesController', 'create', 'POST', 'properties', 'create', 'Create a property'),
  be('PropertiesController', 'update', 'PUT', 'properties', 'update', 'Update a property'),
  be('PropertiesController', 'delete', 'DELETE', 'properties', 'delete', 'Delete a property'),
  be('PropertiesController', 'pause', 'PUT', 'properties', 'pause', 'Pause / unpause a property'),
  be('PropertiesController', 'duplicate', 'POST', 'properties', 'duplicate', 'Duplicate a property'),

  // ── Services ────────────────────────────────────────────────────────────────
  be('ServicesController', 'findAll', 'GET', 'services', 'read', 'List all services'),
  be('ServicesController', 'findOne', 'GET', 'services', 'read_one', 'Get single service'),
  be('ServicesController', 'create', 'POST', 'services', 'create', 'Create a service'),
  be('ServicesController', 'update', 'PUT', 'services', 'update', 'Update a service'),
  be('ServicesController', 'delete', 'DELETE', 'services', 'delete', 'Delete a service'),
  be('ServicesController', 'pause', 'PUT', 'services', 'pause', 'Pause / unpause a service'),
  be('ServicesController', 'duplicate', 'POST', 'services', 'duplicate', 'Duplicate a service'),

  // ── Bookings ────────────────────────────────────────────────────────────────
  be('BookingsController', 'findAll', 'GET', 'bookings', 'read', 'List bookings'),
  be('BookingsController', 'findOne', 'GET', 'bookings', 'read_one', 'Get single booking'),
  be('BookingsController', 'create', 'POST', 'bookings', 'create', 'Create a booking'),
  be('BookingsController', 'accept', 'PUT', 'bookings', 'accept', 'Accept a booking'),
  be('BookingsController', 'reject', 'PUT', 'bookings', 'reject', 'Reject a booking'),
  be('BookingsController', 'cancel', 'PUT', 'bookings', 'cancel', 'Cancel a booking'),
  be('BookingsController', 'refund', 'POST', 'bookings', 'refund', 'Refund a booking'),

  // ── Users / Roles ───────────────────────────────────────────────────────────
  be('RolesController', 'getStats', 'GET', 'roles', 'read_stats', 'Dashboard statistics'),
  be('RolesController', 'getUserRoles', 'GET', 'roles', 'read_user_role', 'Get user role'),
  be('RolesController', 'assignRole', 'POST', 'roles', 'assign', 'Assign a role'),
  be('RolesController', 'removeRole', 'DELETE', 'roles', 'remove', 'Remove a role'),
  be('RolesController', 'listUsers', 'GET', 'users', 'read', 'List all users'),
  be('RolesController', 'listAdmins', 'GET', 'users', 'read_admins', 'List admins'),
  be('RolesController', 'listManagers', 'GET', 'users', 'read_managers', 'List managers'),

  // ── Invitations ─────────────────────────────────────────────────────────────
  be('InvitationController', 'create', 'POST', 'invitations', 'create', 'Send an invitation'),
  be('InvitationController', 'findAll', 'GET', 'invitations', 'read', 'List invitations'),
  be('InvitationController', 'accept', 'POST', 'invitations', 'accept', 'Accept invitation'),
  be('InvitationController', 'revoke', 'DELETE', 'invitations', 'revoke', 'Revoke invitation'),
  be('InvitationController', 'convertGuestToUser', 'POST', 'invitations', 'convert_guest', 'Convert guest → user'),

  // ── RBAC Config ─────────────────────────────────────────────────────────────
  be('RbacConfigController', 'listBackend', 'GET', 'rbac_config', 'read_backend', 'List backend RBAC perms'),
  be('RbacConfigController', 'listFrontend', 'GET', 'rbac_config', 'read_frontend', 'List frontend RBAC perms'),
  be('RbacConfigController', 'updateBackend', 'PUT', 'rbac_config', 'update_backend', 'Update backend RBAC perm'),
  be('RbacConfigController', 'updateFrontend', 'PUT', 'rbac_config', 'update_frontend', 'Update frontend RBAC perm'),
  be('RbacConfigController', 'bulkUpdateBackend', 'PUT', 'rbac_config', 'bulk_update_backend', 'Bulk update backend RBAC'),
  be('RbacConfigController', 'bulkUpdateFrontend', 'PUT', 'rbac_config', 'bulk_update_frontend', 'Bulk update frontend RBAC'),
  be('RbacConfigController', 'createBackend', 'POST', 'rbac_config', 'create_backend', 'Create backend perm'),
  be('RbacConfigController', 'createFrontend', 'POST', 'rbac_config', 'create_frontend', 'Create frontend perm'),
  be('RbacConfigController', 'reloadCache', 'POST', 'rbac_config', 'reload_cache', 'Force reload RBAC cache'),
  be('RbacConfigController', 'status', 'GET', 'rbac_config', 'read_status', 'Check RBAC cache status'),
  be('RbacConfigController', 'check', 'GET', 'rbac_config', 'check_perm', 'Debug permission check'),

  // ── Service Fees ────────────────────────────────────────────────────────────
  be('ServiceFeeController', 'findAll', 'GET', 'service_fees', 'read', 'List service fee rules'),
  be('ServiceFeeController', 'create', 'POST', 'service_fees', 'create', 'Create service fee rule'),
  be('ServiceFeeController', 'update', 'PUT', 'service_fees', 'update', 'Update service fee rule'),
  be('ServiceFeeController', 'delete', 'DELETE', 'service_fees', 'delete', 'Delete service fee rule'),

  // ── Points Rules ────────────────────────────────────────────────────────────
  be('PointsRuleController', 'findAll', 'GET', 'points_rules', 'read', 'List points rules'),
  be('PointsRuleController', 'create', 'POST', 'points_rules', 'create', 'Create points rule'),
  be('PointsRuleController', 'update', 'PUT', 'points_rules', 'update', 'Update points rule'),
  be('PointsRuleController', 'delete', 'DELETE', 'points_rules', 'delete', 'Delete points rule'),

  // ── Host Fee Absorption ─────────────────────────────────────────────────────
  be('HostFeeAbsorptionController', 'findAll', 'GET', 'host_fee_absorption', 'read', 'List fee absorption configs'),
  be('HostFeeAbsorptionController', 'create', 'POST', 'host_fee_absorption', 'create', 'Create fee absorption'),
  be('HostFeeAbsorptionController', 'update', 'PUT', 'host_fee_absorption', 'update', 'Update fee absorption'),
  be('HostFeeAbsorptionController', 'delete', 'DELETE', 'host_fee_absorption', 'delete', 'Delete fee absorption'),

  // ── Cancellation Rules ──────────────────────────────────────────────────────
  be('CancellationRuleController', 'findAll', 'GET', 'cancellation_rules', 'read', 'List cancellation rules'),
  be('CancellationRuleController', 'create', 'POST', 'cancellation_rules', 'create', 'Create cancellation rule'),
  be('CancellationRuleController', 'update', 'PUT', 'cancellation_rules', 'update', 'Update cancellation rule'),
  be('CancellationRuleController', 'delete', 'DELETE', 'cancellation_rules', 'delete', 'Delete cancellation rule'),

  // ── Referrals ───────────────────────────────────────────────────────────────
  be('ReferralController', 'findAll', 'GET', 'referrals', 'read', 'List referrals'),
  be('ReferralController', 'create', 'POST', 'referrals', 'create', 'Create referral'),
  be('ReferralController', 'shareProperty', 'POST', 'referrals', 'share_property', 'Share a property'),

  // ── Rewards ─────────────────────────────────────────────────────────────────
  be('RewardsController', 'findAll', 'GET', 'rewards', 'read', 'List rewards'),
  be('RewardsController', 'create', 'POST', 'rewards', 'create', 'Create reward'),
  be('RewardsController', 'update', 'PUT', 'rewards', 'update', 'Update reward'),
  be('RewardsController', 'delete', 'DELETE', 'rewards', 'delete', 'Delete reward'),
  be('RewardsController', 'redeem', 'POST', 'rewards', 'redeem', 'Redeem a reward'),

  // ── Metrics ─────────────────────────────────────────────────────────────────
  be('MetricsController', 'getDashboard', 'GET', 'metrics', 'read_dashboard', 'Get dashboard metrics'),
  be('MetricsController', 'getRevenue', 'GET', 'metrics', 'read_revenue', 'Get revenue metrics'),

  // ── Payout Accounts ─────────────────────────────────────────────────────────
  be('PayoutAccountController', 'findAll', 'GET', 'payout_accounts', 'read', 'List payout accounts'),
  be('PayoutAccountController', 'create', 'POST', 'payout_accounts', 'create', 'Create payout account'),
  be('PayoutAccountController', 'update', 'PUT', 'payout_accounts', 'update', 'Update payout account'),
  be('PayoutAccountController', 'delete', 'DELETE', 'payout_accounts', 'delete', 'Delete payout account'),

  // ── Points (user) ──────────────────────────────────────────────────────────
  be('PointsController', 'getBalance', 'GET', 'points', 'read_balance', 'Get points balance'),
  be('PointsController', 'getHistory', 'GET', 'points', 'read_history', 'Get points history'),
  be('PointsController', 'adminAward', 'POST', 'points', 'admin_award', 'Award points (admin)'),

  // ── Badges ──────────────────────────────────────────────────────────────────
  be('BadgeController', 'findAll', 'GET', 'badges', 'read', 'List badges'),
  be('BadgeController', 'awardBadge', 'POST', 'badges', 'award', 'Award badge to user'),
];

// ═══════════════════════════════════════════════════════════════════════════════
// 2. FRONTEND UI PERMISSIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const FRONTEND_PERMISSIONS: FrontendPermEntry[] = [
  // ── Property pages ──────────────────────────────────────────────────────────
  fe('PropertyListPage', 'Header', 'Button', 'Add', 'Show "Add Property" button'),
  fe('PropertyListPage', 'Card', 'Button', 'Edit', 'Show edit button on property card'),
  fe('PropertyListPage', 'Card', 'Button', 'Delete', 'Show delete button on property card'),
  fe('PropertyListPage', 'Card', 'Button', 'Pause', 'Show pause button on property card'),
  fe('PropertyListPage', 'Card', 'Button', 'Duplicate', 'Show duplicate button on property card'),

  // ── Service pages ──────────────────────────────────────────────────────────
  fe('ServiceListPage', 'Header', 'Button', 'Add', 'Show "Add Service" button'),
  fe('ServiceListPage', 'Card', 'Button', 'Edit', 'Show edit button on service card'),
  fe('ServiceListPage', 'Card', 'Button', 'Delete', 'Show delete button on service card'),
  fe('ServiceListPage', 'Card', 'Button', 'Pause', 'Show pause button on service card'),
  fe('ServiceListPage', 'Card', 'Button', 'Duplicate', 'Show duplicate button on service card'),

  // ── Booking pages ──────────────────────────────────────────────────────────
  fe('BookingsPage', undefined, 'Tab', 'View', 'Show bookings tab'),
  fe('BookingsPage', 'Detail', 'Button', 'Accept', 'Show accept booking button'),
  fe('BookingsPage', 'Detail', 'Button', 'Reject', 'Show reject booking button'),
  fe('BookingsPage', 'Detail', 'Button', 'Refund', 'Show refund booking button'),

  // ── Dashboard ──────────────────────────────────────────────────────────────
  fe('Dashboard', 'Analytics', 'Tab', 'View', 'Show analytics tab'),
  fe('Dashboard', 'Payments', 'Tab', 'View', 'Show payments tab'),
  fe('Dashboard', 'Revenue', 'Widget', 'View', 'Show revenue widget'),

  // ── User management ────────────────────────────────────────────────────────
  fe('UsersPage', undefined, 'Tab', 'View', 'Show users management tab'),
  fe('UsersPage', 'List', 'Button', 'Invite', 'Show invite user button'),
  fe('UsersPage', 'List', 'Button', 'ConvertGuest', 'Show convert guest → user button'),
  fe('UsersPage', 'Detail', 'Button', 'AssignRole', 'Show assign role button'),
  fe('UsersPage', 'Detail', 'Button', 'ManagePermissions', 'Show manage permissions button'),

  // ── RBAC settings ──────────────────────────────────────────────────────────
  fe('RbacSettings', undefined, 'Page', 'View', 'Show RBAC settings page'),
  fe('RbacSettings', undefined, 'Page', 'Edit', 'Allow editing RBAC settings'),

  // ── Fee management ─────────────────────────────────────────────────────────
  fe('ServiceFeesPage', undefined, 'Page', 'View', 'Show service fees page'),
  fe('ServiceFeesPage', 'Header', 'Button', 'Add', 'Show add fee rule button'),
  fe('HostFeeAbsorptionPage', undefined, 'Page', 'View', 'Show fee absorption page'),
  fe('CancellationRulesPage', undefined, 'Page', 'View', 'Show cancellation rules page'),

  // ── Points / Rewards ───────────────────────────────────────────────────────
  fe('PointsRulesPage', undefined, 'Page', 'View', 'Show points rules page'),
  fe('PointsRulesPage', 'Header', 'Button', 'Add', 'Show add points rule button'),
  fe('RewardsPage', undefined, 'Page', 'View', 'Show rewards page'),
  fe('RewardsPage', 'Detail', 'Button', 'Redeem', 'Show redeem button'),

  // ── Referrals ──────────────────────────────────────────────────────────────
  fe('ReferralsPage', undefined, 'Page', 'View', 'Show referrals page'),
  fe('PropertyDetailPage', 'Actions', 'Button', 'Share', 'Show share property button'),

  // ── Communication ──────────────────────────────────────────────────────────
  fe('ChatPage', undefined, 'Page', 'Reply', 'Allow replying in chat'),
  fe('ReviewsPage', undefined, 'Page', 'Reply', 'Allow replying to reviews'),

  // ── Payout ─────────────────────────────────────────────────────────────────
  fe('PayoutAccountsPage', undefined, 'Page', 'View', 'Show payout accounts page'),
  fe('PayoutAccountsPage', 'Header', 'Button', 'Add', 'Show add payout account button'),
];

// ═══════════════════════════════════════════════════════════════════════════════
// 3. PERMISSION BINDINGS (API ↔ UI)
// ═══════════════════════════════════════════════════════════════════════════════

export interface PermissionBinding {
  apiPermissionKey: string;
  uiPermissionKey: string;
  module: string;
}

export const PERMISSION_BINDINGS: PermissionBinding[] = [
  // Properties
  { apiPermissionKey: generateBackendPermissionKey('PropertiesController', 'create', 'POST'), uiPermissionKey: generateUiPermissionKey('PropertyListPage', 'Header', 'Button', 'Add'), module: 'properties' },
  { apiPermissionKey: generateBackendPermissionKey('PropertiesController', 'update', 'PUT'), uiPermissionKey: generateUiPermissionKey('PropertyListPage', 'Card', 'Button', 'Edit'), module: 'properties' },
  { apiPermissionKey: generateBackendPermissionKey('PropertiesController', 'delete', 'DELETE'), uiPermissionKey: generateUiPermissionKey('PropertyListPage', 'Card', 'Button', 'Delete'), module: 'properties' },
  { apiPermissionKey: generateBackendPermissionKey('PropertiesController', 'pause', 'PUT'), uiPermissionKey: generateUiPermissionKey('PropertyListPage', 'Card', 'Button', 'Pause'), module: 'properties' },
  { apiPermissionKey: generateBackendPermissionKey('PropertiesController', 'duplicate', 'POST'), uiPermissionKey: generateUiPermissionKey('PropertyListPage', 'Card', 'Button', 'Duplicate'), module: 'properties' },

  // Services
  { apiPermissionKey: generateBackendPermissionKey('ServicesController', 'create', 'POST'), uiPermissionKey: generateUiPermissionKey('ServiceListPage', 'Header', 'Button', 'Add'), module: 'services' },
  { apiPermissionKey: generateBackendPermissionKey('ServicesController', 'update', 'PUT'), uiPermissionKey: generateUiPermissionKey('ServiceListPage', 'Card', 'Button', 'Edit'), module: 'services' },
  { apiPermissionKey: generateBackendPermissionKey('ServicesController', 'delete', 'DELETE'), uiPermissionKey: generateUiPermissionKey('ServiceListPage', 'Card', 'Button', 'Delete'), module: 'services' },

  // Bookings
  { apiPermissionKey: generateBackendPermissionKey('BookingsController', 'accept', 'PUT'), uiPermissionKey: generateUiPermissionKey('BookingsPage', 'Detail', 'Button', 'Accept'), module: 'bookings' },
  { apiPermissionKey: generateBackendPermissionKey('BookingsController', 'reject', 'PUT'), uiPermissionKey: generateUiPermissionKey('BookingsPage', 'Detail', 'Button', 'Reject'), module: 'bookings' },
  { apiPermissionKey: generateBackendPermissionKey('BookingsController', 'refund', 'POST'), uiPermissionKey: generateUiPermissionKey('BookingsPage', 'Detail', 'Button', 'Refund'), module: 'bookings' },

  // Users
  { apiPermissionKey: generateBackendPermissionKey('InvitationController', 'create', 'POST'), uiPermissionKey: generateUiPermissionKey('UsersPage', 'List', 'Button', 'Invite'), module: 'users' },
  { apiPermissionKey: generateBackendPermissionKey('InvitationController', 'convertGuestToUser', 'POST'), uiPermissionKey: generateUiPermissionKey('UsersPage', 'List', 'Button', 'ConvertGuest'), module: 'users' },
  { apiPermissionKey: generateBackendPermissionKey('RolesController', 'assignRole', 'POST'), uiPermissionKey: generateUiPermissionKey('UsersPage', 'Detail', 'Button', 'AssignRole'), module: 'users' },

  // RBAC
  { apiPermissionKey: generateBackendPermissionKey('RbacConfigController', 'listBackend', 'GET'), uiPermissionKey: generateUiPermissionKey('RbacSettings', undefined, 'Page', 'View'), module: 'rbac' },
  { apiPermissionKey: generateBackendPermissionKey('RbacConfigController', 'updateBackend', 'PUT'), uiPermissionKey: generateUiPermissionKey('RbacSettings', undefined, 'Page', 'Edit'), module: 'rbac' },

  // Dashboard
  { apiPermissionKey: generateBackendPermissionKey('MetricsController', 'getDashboard', 'GET'), uiPermissionKey: generateUiPermissionKey('Dashboard', 'Analytics', 'Tab', 'View'), module: 'dashboard' },
  { apiPermissionKey: generateBackendPermissionKey('MetricsController', 'getRevenue', 'GET'), uiPermissionKey: generateUiPermissionKey('Dashboard', 'Revenue', 'Widget', 'View'), module: 'dashboard' },

  // Rewards
  { apiPermissionKey: generateBackendPermissionKey('RewardsController', 'redeem', 'POST'), uiPermissionKey: generateUiPermissionKey('RewardsPage', 'Detail', 'Button', 'Redeem'), module: 'rewards' },

  // Referrals / Share
  { apiPermissionKey: generateBackendPermissionKey('ReferralController', 'shareProperty', 'POST'), uiPermissionKey: generateUiPermissionKey('PropertyDetailPage', 'Actions', 'Button', 'Share'), module: 'referrals' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 4. KEY LOOKUP MAPS (for runtime)
// ═══════════════════════════════════════════════════════════════════════════════

/** Map backend key → entry */
export const BACKEND_KEY_MAP = new Map(BACKEND_PERMISSIONS.map(e => [e.key, e]));

/** Map UI key → entry */
export const FRONTEND_KEY_MAP = new Map(FRONTEND_PERMISSIONS.map(e => [e.key, e]));

/** Map API key → UI key */
export const API_TO_UI_MAP = new Map(PERMISSION_BINDINGS.map(b => [b.apiPermissionKey, b.uiPermissionKey]));

/** Map UI key → API key */
export const UI_TO_API_MAP = new Map(PERMISSION_BINDINGS.map(b => [b.uiPermissionKey, b.apiPermissionKey]));

/** All valid backend keys */
export const ALL_BACKEND_KEYS = new Set(BACKEND_PERMISSIONS.map(e => e.key));

/** All valid frontend keys */
export const ALL_FRONTEND_KEYS = new Set(FRONTEND_PERMISSIONS.map(e => e.key));
