/**
 * Frontend Permission Registry — mirrors backend/src/rbac/permission-registry.ts
 *
 * All UI permission keys are generated via generateUiPermissionKey().
 * Import these constants in components instead of using hardcoded strings.
 */
import { generateUiPermissionKey } from './generate-ui-permission-key';

// ─── Property pages ──────────────────────────────────────────────────────────
export const UI_PERM = {
  // Properties
  PROPERTY_ADD: generateUiPermissionKey('PropertyListPage', 'Header', 'Button', 'Add'),
  PROPERTY_EDIT: generateUiPermissionKey('PropertyListPage', 'Card', 'Button', 'Edit'),
  PROPERTY_DELETE: generateUiPermissionKey('PropertyListPage', 'Card', 'Button', 'Delete'),
  PROPERTY_PAUSE: generateUiPermissionKey('PropertyListPage', 'Card', 'Button', 'Pause'),
  PROPERTY_DUPLICATE: generateUiPermissionKey('PropertyListPage', 'Card', 'Button', 'Duplicate'),

  // Services
  SERVICE_ADD: generateUiPermissionKey('ServiceListPage', 'Header', 'Button', 'Add'),
  SERVICE_EDIT: generateUiPermissionKey('ServiceListPage', 'Card', 'Button', 'Edit'),
  SERVICE_DELETE: generateUiPermissionKey('ServiceListPage', 'Card', 'Button', 'Delete'),
  SERVICE_PAUSE: generateUiPermissionKey('ServiceListPage', 'Card', 'Button', 'Pause'),
  SERVICE_DUPLICATE: generateUiPermissionKey('ServiceListPage', 'Card', 'Button', 'Duplicate'),

  // Bookings
  BOOKINGS_TAB: generateUiPermissionKey('BookingsPage', undefined, 'Tab', 'View'),
  BOOKING_ACCEPT: generateUiPermissionKey('BookingsPage', 'Detail', 'Button', 'Accept'),
  BOOKING_REJECT: generateUiPermissionKey('BookingsPage', 'Detail', 'Button', 'Reject'),
  BOOKING_REFUND: generateUiPermissionKey('BookingsPage', 'Detail', 'Button', 'Refund'),

  // Dashboard
  ANALYTICS_TAB: generateUiPermissionKey('Dashboard', 'Analytics', 'Tab', 'View'),
  PAYMENTS_TAB: generateUiPermissionKey('Dashboard', 'Payments', 'Tab', 'View'),
  REVENUE_WIDGET: generateUiPermissionKey('Dashboard', 'Revenue', 'Widget', 'View'),

  // Users
  USERS_TAB: generateUiPermissionKey('UsersPage', undefined, 'Tab', 'View'),
  USER_INVITE: generateUiPermissionKey('UsersPage', 'List', 'Button', 'Invite'),
  USER_CONVERT_GUEST: generateUiPermissionKey('UsersPage', 'List', 'Button', 'ConvertGuest'),
  USER_ASSIGN_ROLE: generateUiPermissionKey('UsersPage', 'Detail', 'Button', 'AssignRole'),
  USER_MANAGE_PERMS: generateUiPermissionKey('UsersPage', 'Detail', 'Button', 'ManagePermissions'),

  // RBAC
  RBAC_VIEW: generateUiPermissionKey('RbacSettings', undefined, 'Page', 'View'),
  RBAC_EDIT: generateUiPermissionKey('RbacSettings', undefined, 'Page', 'Edit'),

  // Fees
  SERVICE_FEES_VIEW: generateUiPermissionKey('ServiceFeesPage', undefined, 'Page', 'View'),
  SERVICE_FEES_ADD: generateUiPermissionKey('ServiceFeesPage', 'Header', 'Button', 'Add'),
  FEE_ABSORPTION_VIEW: generateUiPermissionKey('HostFeeAbsorptionPage', undefined, 'Page', 'View'),
  CANCELLATION_RULES_VIEW: generateUiPermissionKey('CancellationRulesPage', undefined, 'Page', 'View'),

  // Points / Rewards
  POINTS_RULES_VIEW: generateUiPermissionKey('PointsRulesPage', undefined, 'Page', 'View'),
  POINTS_RULES_ADD: generateUiPermissionKey('PointsRulesPage', 'Header', 'Button', 'Add'),
  REWARDS_VIEW: generateUiPermissionKey('RewardsPage', undefined, 'Page', 'View'),
  REWARD_REDEEM: generateUiPermissionKey('RewardsPage', 'Detail', 'Button', 'Redeem'),

  // Referrals
  REFERRALS_VIEW: generateUiPermissionKey('ReferralsPage', undefined, 'Page', 'View'),
  PROPERTY_SHARE: generateUiPermissionKey('PropertyDetailPage', 'Actions', 'Button', 'Share'),

  // Communication
  CHAT_REPLY: generateUiPermissionKey('ChatPage', undefined, 'Page', 'Reply'),
  REVIEWS_REPLY: generateUiPermissionKey('ReviewsPage', undefined, 'Page', 'Reply'),

  // Payout
  PAYOUT_VIEW: generateUiPermissionKey('PayoutAccountsPage', undefined, 'Page', 'View'),
  PAYOUT_ADD: generateUiPermissionKey('PayoutAccountsPage', 'Header', 'Button', 'Add'),
} as const;

/** All valid UI permission keys */
export const ALL_UI_KEYS = new Set(Object.values(UI_PERM));

export type UiPermissionKey = (typeof UI_PERM)[keyof typeof UI_PERM];
