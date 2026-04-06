/**
 * RBAC Seed Script — New Architecture
 *
 * Seeds rbac_backend_permissions and rbac_frontend_permissions tables.
 * Each row = one endpoint/UI element with user_roles[] listing allowed roles.
 * Permission keys are ALWAYS generated via generateBackendPermissionKey / generateUiPermissionKey.
 *
 * Run: npx ts-node -r tsconfig-paths/register src/scripts/rbac.seed.ts
 */

import { DataSource } from 'typeorm';
import { generateBackendPermissionKey, type HttpMethod } from '../rbac/utils/generate-backend-permission-key';
import { generateUiPermissionKey } from '../rbac/utils/generate-ui-permission-key';

import { config as dotenvConfig } from 'dotenv';
import * as crypto from 'crypto';
const uuidv4 = () => crypto.randomUUID();

dotenvConfig({ path: '.env' });

// ─── Data Source ────────────────────────────────────────────────────────────

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
});

// ─── Types ────────────────────────────────────────────────────────────────────

interface BackendPerm {
  controller: string;
  endpoint: string;
  method: HttpMethod;
  user_roles: string[];
  module: string;
  description: string;
  scope?: string;
}

interface FrontendPerm {
  component: string;
  sub_view?: string;
  element_type?: string;
  action_name?: string;
  user_roles: string[];
  module: string;
  description: string;
}

// ─── All Roles ────────────────────────────────────────────────────────────────
const ALL = ['hyper_admin', 'hyper_manager', 'admin', 'manager', 'user', 'guest'];
const HYPER = ['hyper_admin', 'hyper_manager'];
const HOST = ['hyper_admin', 'hyper_manager', 'admin', 'manager'];
const ADMIN_UP = ['hyper_admin', 'hyper_manager', 'admin'];
const AUTHENTICATED = ALL;

// ─── Backend Permissions ──────────────────────────────────────────────────────
// Handler names MUST match the actual method names in each controller class.

const BACKEND_PERMISSIONS: BackendPerm[] = [
  // ── Properties (PropertiesController) ──────────────────────────────────
  { controller: 'PropertiesController', endpoint: 'findAll', method: 'GET', user_roles: ALL, module: 'properties', description: 'List all properties' },
  { controller: 'PropertiesController', endpoint: 'findOne', method: 'GET', user_roles: ALL, module: 'properties', description: 'Get single property' },
  { controller: 'PropertiesController', endpoint: 'getAvailability', method: 'GET', user_roles: ALL, module: 'properties', description: 'Get property availability' },
  { controller: 'PropertiesController', endpoint: 'create', method: 'POST', user_roles: ['admin'], module: 'properties', description: 'Create a property', scope: 'own' },
  { controller: 'PropertiesController', endpoint: 'update', method: 'PUT', user_roles: ['admin', 'manager'], module: 'properties', description: 'Update a property', scope: 'own' },
  { controller: 'PropertiesController', endpoint: 'updatePrices', method: 'PUT', user_roles: ['admin', 'manager'], module: 'properties', description: 'Update property prices', scope: 'own' },
  { controller: 'PropertiesController', endpoint: 'updatePhotos', method: 'PUT', user_roles: ['admin', 'manager'], module: 'properties', description: 'Update property photos', scope: 'own' },
  { controller: 'PropertiesController', endpoint: 'updateAvailability', method: 'PUT', user_roles: ['admin', 'manager'], module: 'properties', description: 'Update property availability', scope: 'own' },
  { controller: 'PropertiesController', endpoint: 'createPromo', method: 'POST', user_roles: ['admin', 'manager'], module: 'properties', description: 'Create a promo', scope: 'own' },
  { controller: 'PropertiesController', endpoint: 'getPromos', method: 'GET', user_roles: ALL, module: 'properties', description: 'Get property promos' },
  { controller: 'PropertiesController', endpoint: 'deletePromo', method: 'DELETE', user_roles: ['admin', 'manager'], module: 'properties', description: 'Delete a promo', scope: 'own' },
  { controller: 'PropertiesController', endpoint: 'subscribePromoAlert', method: 'POST', user_roles: AUTHENTICATED, module: 'properties', description: 'Subscribe to promo alerts' },
  { controller: 'PropertiesController', endpoint: 'unsubscribePromoAlert', method: 'DELETE', user_roles: AUTHENTICATED, module: 'properties', description: 'Unsubscribe from promo alerts' },
  { controller: 'PropertiesController', endpoint: 'recalculateTrust', method: 'PUT', user_roles: ADMIN_UP, module: 'properties', description: 'Recalculate trust stars' },
  { controller: 'PropertiesController', endpoint: 'remove', method: 'DELETE', user_roles: ['hyper_admin', 'admin'], module: 'properties', description: 'Delete a property', scope: 'own' },
  { controller: 'PropertiesController', endpoint: 'getMyAlerts', method: 'GET', user_roles: AUTHENTICATED, module: 'properties', description: 'Get my saved search alerts' },
  { controller: 'PropertiesController', endpoint: 'createAlert', method: 'POST', user_roles: AUTHENTICATED, module: 'properties', description: 'Create saved search alert' },
  { controller: 'PropertiesController', endpoint: 'updateAlert', method: 'PUT', user_roles: AUTHENTICATED, module: 'properties', description: 'Update saved search alert' },
  { controller: 'PropertiesController', endpoint: 'deleteAlert', method: 'DELETE', user_roles: AUTHENTICATED, module: 'properties', description: 'Delete saved search alert' },

  // ── Tourism Services (TourismServicesController) ───────────────────────
  { controller: 'TourismServicesController', endpoint: 'findAll', method: 'GET', user_roles: ALL, module: 'services', description: 'List all services' },
  { controller: 'TourismServicesController', endpoint: 'getCategories', method: 'GET', user_roles: ALL, module: 'services', description: 'Get service categories' },
  { controller: 'TourismServicesController', endpoint: 'findOne', method: 'GET', user_roles: ALL, module: 'services', description: 'Get single service' },
  { controller: 'TourismServicesController', endpoint: 'create', method: 'POST', user_roles: ['admin'], module: 'services', description: 'Create a service', scope: 'own' },
  { controller: 'TourismServicesController', endpoint: 'update', method: 'PUT', user_roles: ['admin', 'manager'], module: 'services', description: 'Update a service', scope: 'own' },
  { controller: 'TourismServicesController', endpoint: 'pause', method: 'PUT', user_roles: ['admin', 'manager'], module: 'services', description: 'Pause / unpause a service', scope: 'own' },
  { controller: 'TourismServicesController', endpoint: 'remove', method: 'DELETE', user_roles: ['hyper_admin', 'admin'], module: 'services', description: 'Delete a service', scope: 'own' },

  // ── Bookings (BookingsController) ──────────────────────────────────────
  { controller: 'BookingsController', endpoint: 'findAll', method: 'GET', user_roles: HOST, module: 'bookings', description: 'List bookings' },
  { controller: 'BookingsController', endpoint: 'getMyBookings', method: 'GET', user_roles: AUTHENTICATED, module: 'bookings', description: 'Get my bookings' },
  { controller: 'BookingsController', endpoint: 'findOne', method: 'GET', user_roles: AUTHENTICATED, module: 'bookings', description: 'Get single booking' },
  { controller: 'BookingsController', endpoint: 'create', method: 'POST', user_roles: ['manager', 'user', 'guest'], module: 'bookings', description: 'Create a booking' },
  { controller: 'BookingsController', endpoint: 'accept', method: 'PUT', user_roles: ['admin', 'manager'], module: 'bookings', description: 'Accept a booking', scope: 'own' },
  { controller: 'BookingsController', endpoint: 'decline', method: 'PUT', user_roles: ['admin', 'manager'], module: 'bookings', description: 'Decline a booking', scope: 'own' },
  { controller: 'BookingsController', endpoint: 'counterOffer', method: 'PUT', user_roles: ['admin', 'manager'], module: 'bookings', description: 'Counter-offer on booking', scope: 'own' },
  { controller: 'BookingsController', endpoint: 'refund', method: 'PUT', user_roles: ['hyper_admin', 'admin'], module: 'bookings', description: 'Refund a booking', scope: 'own' },
  { controller: 'BookingsController', endpoint: 'updateStatus', method: 'PUT', user_roles: ['admin', 'manager'], module: 'bookings', description: 'Update booking status', scope: 'own' },
  { controller: 'BookingsController', endpoint: 'checkAvailability', method: 'GET', user_roles: AUTHENTICATED, module: 'bookings', description: 'Check booking availability' },

  // ── Service Bookings (ServiceBookingsController) ───────────────────────
  { controller: 'ServiceBookingsController', endpoint: 'create', method: 'POST', user_roles: ['manager', 'user', 'guest'], module: 'service_bookings', description: 'Create service booking' },
  { controller: 'ServiceBookingsController', endpoint: 'getMyBookings', method: 'GET', user_roles: AUTHENTICATED, module: 'service_bookings', description: 'Get my service bookings' },
  { controller: 'ServiceBookingsController', endpoint: 'getProviderBookings', method: 'GET', user_roles: ['admin', 'manager'], module: 'service_bookings', description: 'Get provider service bookings' },
  { controller: 'ServiceBookingsController', endpoint: 'getOne', method: 'GET', user_roles: AUTHENTICATED, module: 'service_bookings', description: 'Get single service booking' },
  { controller: 'ServiceBookingsController', endpoint: 'accept', method: 'PUT', user_roles: ['admin', 'manager'], module: 'service_bookings', description: 'Accept service booking', scope: 'own' },
  { controller: 'ServiceBookingsController', endpoint: 'decline', method: 'PUT', user_roles: ['admin', 'manager'], module: 'service_bookings', description: 'Decline service booking', scope: 'own' },
  { controller: 'ServiceBookingsController', endpoint: 'cancel', method: 'PUT', user_roles: AUTHENTICATED, module: 'service_bookings', description: 'Cancel service booking' },
  { controller: 'ServiceBookingsController', endpoint: 'getAvailability', method: 'GET', user_roles: ALL, module: 'service_bookings', description: 'Get service availability' },
  { controller: 'ServiceBookingsController', endpoint: 'setAvailability', method: 'POST', user_roles: ['admin', 'manager'], module: 'service_bookings', description: 'Set service availability', scope: 'own' },
  { controller: 'ServiceBookingsController', endpoint: 'bulkSetAvailability', method: 'POST', user_roles: ['admin', 'manager'], module: 'service_bookings', description: 'Bulk set service availability', scope: 'own' },

  // ── Reviews (ReviewsController) ────────────────────────────────────────
  { controller: 'ReviewsController', endpoint: 'findByProperty', method: 'GET', user_roles: ALL, module: 'reviews', description: 'Get reviews for property' },
  { controller: 'ReviewsController', endpoint: 'findOne', method: 'GET', user_roles: ALL, module: 'reviews', description: 'Get single review' },
  { controller: 'ReviewsController', endpoint: 'create', method: 'POST', user_roles: ['user', 'guest'], module: 'reviews', description: 'Create a review' },
  { controller: 'ReviewsController', endpoint: 'reply', method: 'POST', user_roles: ['admin', 'manager'], module: 'reviews', description: 'Reply to a review', scope: 'own' },

  // ── Comments (CommentsController) ──────────────────────────────────────
  { controller: 'CommentsController', endpoint: 'getComments', method: 'GET', user_roles: AUTHENTICATED, module: 'comments', description: 'Get comments' },
  { controller: 'CommentsController', endpoint: 'getReplies', method: 'GET', user_roles: AUTHENTICATED, module: 'comments', description: 'Get replies' },
  { controller: 'CommentsController', endpoint: 'createComment', method: 'POST', user_roles: AUTHENTICATED, module: 'comments', description: 'Create a comment' },
  { controller: 'CommentsController', endpoint: 'updateComment', method: 'PUT', user_roles: AUTHENTICATED, module: 'comments', description: 'Update own comment' },
  { controller: 'CommentsController', endpoint: 'deleteComment', method: 'DELETE', user_roles: AUTHENTICATED, module: 'comments', description: 'Delete own comment' },

  // ── Reactions (ReactionsController) ────────────────────────────────────
  { controller: 'ReactionsController', endpoint: 'getReactions', method: 'GET', user_roles: AUTHENTICATED, module: 'reactions', description: 'Get reactions' },
  { controller: 'ReactionsController', endpoint: 'toggleReaction', method: 'POST', user_roles: AUTHENTICATED, module: 'reactions', description: 'Toggle reaction' },
  { controller: 'ReactionsController', endpoint: 'removeReaction', method: 'DELETE', user_roles: AUTHENTICATED, module: 'reactions', description: 'Remove reaction' },

  // ── Favorites (FavoritesController) ────────────────────────────────────
  { controller: 'FavoritesController', endpoint: 'findMyFavorites', method: 'GET', user_roles: AUTHENTICATED, module: 'favorites', description: 'Get my favorites' },
  { controller: 'FavoritesController', endpoint: 'checkFavorite', method: 'GET', user_roles: AUTHENTICATED, module: 'favorites', description: 'Check favorite' },
  { controller: 'FavoritesController', endpoint: 'toggle', method: 'POST', user_roles: AUTHENTICATED, module: 'favorites', description: 'Toggle favorite' },
  { controller: 'FavoritesController', endpoint: 'remove', method: 'DELETE', user_roles: AUTHENTICATED, module: 'favorites', description: 'Remove favorite' },

  // ── Roles (RolesController) ────────────────────────────────────────────
  { controller: 'RolesController', endpoint: 'getStats', method: 'GET', user_roles: ADMIN_UP, module: 'roles', description: 'Dashboard statistics' },
  { controller: 'RolesController', endpoint: 'getUserRoles', method: 'GET', user_roles: ADMIN_UP, module: 'roles', description: 'Get user role' },
  { controller: 'RolesController', endpoint: 'assignRole', method: 'POST', user_roles: ADMIN_UP, module: 'roles', description: 'Assign a role' },
  { controller: 'RolesController', endpoint: 'removeRole', method: 'DELETE', user_roles: ADMIN_UP, module: 'roles', description: 'Remove a role' },
  { controller: 'RolesController', endpoint: 'assignManager', method: 'POST', user_roles: ['admin'], module: 'roles', description: 'Assign manager to properties' },
  { controller: 'RolesController', endpoint: 'setPermissions', method: 'POST', user_roles: ['admin'], module: 'roles', description: 'Set manager permissions' },
  { controller: 'RolesController', endpoint: 'getManagerPermissions', method: 'GET', user_roles: ADMIN_UP, module: 'roles', description: 'Get manager permissions' },
  { controller: 'RolesController', endpoint: 'getManagerProperties', method: 'GET', user_roles: ADMIN_UP, module: 'roles', description: 'Get manager properties' },
  { controller: 'RolesController', endpoint: 'getAllUsers', method: 'GET', user_roles: HYPER, module: 'roles', description: 'List all users' },
  { controller: 'RolesController', endpoint: 'updateUserStatus', method: 'PUT', user_roles: HYPER, module: 'roles', description: 'Update user status' },
  { controller: 'RolesController', endpoint: 'deleteUser', method: 'DELETE', user_roles: HYPER, module: 'roles', description: 'Delete user' },
  { controller: 'RolesController', endpoint: 'getAllAssignments', method: 'GET', user_roles: ADMIN_UP, module: 'roles', description: 'List assignments' },
  { controller: 'RolesController', endpoint: 'removeAssignment', method: 'DELETE', user_roles: ADMIN_UP, module: 'roles', description: 'Remove assignment' },
  { controller: 'RolesController', endpoint: 'checkPermission', method: 'GET', user_roles: ADMIN_UP, module: 'roles', description: 'Check permission' },

  // ── Invitations (InvitationController) ─────────────────────────────────
  { controller: 'InvitationController', endpoint: 'getAllowedRoles', method: 'GET', user_roles: ADMIN_UP, module: 'invitations', description: 'Get allowed invitation roles' },
  { controller: 'InvitationController', endpoint: 'create', method: 'POST', user_roles: ADMIN_UP, module: 'invitations', description: 'Create invitation' },
  { controller: 'InvitationController', endpoint: 'getAll', method: 'GET', user_roles: ADMIN_UP, module: 'invitations', description: 'List invitations' },
  { controller: 'InvitationController', endpoint: 'cancel', method: 'DELETE', user_roles: ADMIN_UP, module: 'invitations', description: 'Cancel invitation' },
  { controller: 'InvitationController', endpoint: 'resend', method: 'POST', user_roles: ADMIN_UP, module: 'invitations', description: 'Resend invitation' },
  { controller: 'InvitationController', endpoint: 'accept', method: 'POST', user_roles: ALL, module: 'invitations', description: 'Accept invitation' },
  { controller: 'InvitationController', endpoint: 'convertGuestToUser', method: 'POST', user_roles: HYPER, module: 'invitations', description: 'Convert guest to user' },

  // ── RBAC Config (RbacConfigController) ─────────────────────────────────
  { controller: 'RbacConfigController', endpoint: 'listBackend', method: 'GET', user_roles: ADMIN_UP, module: 'rbac_config', description: 'List backend RBAC' },
  { controller: 'RbacConfigController', endpoint: 'getBackendByRole', method: 'GET', user_roles: HYPER, module: 'rbac_config', description: 'Get backend perms by role' },
  { controller: 'RbacConfigController', endpoint: 'listFrontend', method: 'GET', user_roles: ADMIN_UP, module: 'rbac_config', description: 'List frontend RBAC' },
  { controller: 'RbacConfigController', endpoint: 'getFrontendByRole', method: 'GET', user_roles: AUTHENTICATED, module: 'rbac_config', description: 'Get frontend perms by role' },
  { controller: 'RbacConfigController', endpoint: 'updateBackend', method: 'PUT', user_roles: ['hyper_admin'], module: 'rbac_config', description: 'Update backend perm' },
  { controller: 'RbacConfigController', endpoint: 'updateFrontend', method: 'PUT', user_roles: ['hyper_admin'], module: 'rbac_config', description: 'Update frontend perm' },
  { controller: 'RbacConfigController', endpoint: 'bulkUpdateBackend', method: 'PUT', user_roles: ['hyper_admin'], module: 'rbac_config', description: 'Bulk update backend' },
  { controller: 'RbacConfigController', endpoint: 'bulkUpdateFrontend', method: 'PUT', user_roles: ['hyper_admin'], module: 'rbac_config', description: 'Bulk update frontend' },
  { controller: 'RbacConfigController', endpoint: 'createBackend', method: 'POST', user_roles: ['hyper_admin'], module: 'rbac_config', description: 'Create backend perm' },
  { controller: 'RbacConfigController', endpoint: 'createFrontend', method: 'POST', user_roles: ['hyper_admin'], module: 'rbac_config', description: 'Create frontend perm' },
  { controller: 'RbacConfigController', endpoint: 'getRoles', method: 'GET', user_roles: ADMIN_UP, module: 'rbac_config', description: 'Get roles list' },
  { controller: 'RbacConfigController', endpoint: 'reloadCache', method: 'POST', user_roles: ['hyper_admin'], module: 'rbac_config', description: 'Reload RBAC cache' },
  { controller: 'RbacConfigController', endpoint: 'status', method: 'GET', user_roles: ['hyper_admin'], module: 'rbac_config', description: 'RBAC cache status' },
  { controller: 'RbacConfigController', endpoint: 'check', method: 'GET', user_roles: ['hyper_admin'], module: 'rbac_config', description: 'Debug permission check' },

  // ── Service Fees (ServiceFeeController) ────────────────────────────────
  { controller: 'ServiceFeeController', endpoint: 'getAll', method: 'GET', user_roles: HYPER, module: 'service_fees', description: 'List service fee rules' },
  { controller: 'ServiceFeeController', endpoint: 'getDefault', method: 'GET', user_roles: ADMIN_UP, module: 'service_fees', description: 'Get default fee rule' },
  { controller: 'ServiceFeeController', endpoint: 'getForHost', method: 'GET', user_roles: ADMIN_UP, module: 'service_fees', description: 'Get fee rules for host' },
  { controller: 'ServiceFeeController', endpoint: 'create', method: 'POST', user_roles: HYPER, module: 'service_fees', description: 'Create fee rule' },
  { controller: 'ServiceFeeController', endpoint: 'update', method: 'PUT', user_roles: HYPER, module: 'service_fees', description: 'Update fee rule' },
  { controller: 'ServiceFeeController', endpoint: 'remove', method: 'DELETE', user_roles: HYPER, module: 'service_fees', description: 'Delete fee rule' },
  { controller: 'ServiceFeeController', endpoint: 'calculate', method: 'POST', user_roles: ADMIN_UP, module: 'service_fees', description: 'Calculate fee' },

  // ── Points Rules (PointsRuleController) ────────────────────────────────
  { controller: 'PointsRuleController', endpoint: 'getAll', method: 'GET', user_roles: HYPER, module: 'points_rules', description: 'List points rules' },
  { controller: 'PointsRuleController', endpoint: 'getDefaults', method: 'GET', user_roles: ADMIN_UP, module: 'points_rules', description: 'Get default rules' },
  { controller: 'PointsRuleController', endpoint: 'getEarning', method: 'GET', user_roles: ADMIN_UP, module: 'points_rules', description: 'Get earning rules' },
  { controller: 'PointsRuleController', endpoint: 'getConversion', method: 'GET', user_roles: ADMIN_UP, module: 'points_rules', description: 'Get conversion rules' },
  { controller: 'PointsRuleController', endpoint: 'getByRole', method: 'GET', user_roles: ADMIN_UP, module: 'points_rules', description: 'Get rules by role' },
  { controller: 'PointsRuleController', endpoint: 'create', method: 'POST', user_roles: HYPER, module: 'points_rules', description: 'Create points rule' },
  { controller: 'PointsRuleController', endpoint: 'update', method: 'PUT', user_roles: HYPER, module: 'points_rules', description: 'Update points rule' },
  { controller: 'PointsRuleController', endpoint: 'remove', method: 'DELETE', user_roles: HYPER, module: 'points_rules', description: 'Delete points rule' },

  // ── Host Fee Absorption (HostFeeAbsorptionController) ──────────────────
  { controller: 'HostFeeAbsorptionController', endpoint: 'getMyAbsorptions', method: 'GET', user_roles: ['admin'], module: 'host_fee_absorption', description: 'List fee absorptions' },
  { controller: 'HostFeeAbsorptionController', endpoint: 'getForHost', method: 'GET', user_roles: ADMIN_UP, module: 'host_fee_absorption', description: 'Get absorption for host' },
  { controller: 'HostFeeAbsorptionController', endpoint: 'create', method: 'POST', user_roles: ['admin'], module: 'host_fee_absorption', description: 'Create fee absorption', scope: 'own' },
  { controller: 'HostFeeAbsorptionController', endpoint: 'update', method: 'PUT', user_roles: ['admin'], module: 'host_fee_absorption', description: 'Update fee absorption', scope: 'own' },
  { controller: 'HostFeeAbsorptionController', endpoint: 'remove', method: 'DELETE', user_roles: ['admin'], module: 'host_fee_absorption', description: 'Delete fee absorption', scope: 'own' },

  // ── Cancellation Rules (CancellationRuleController) ────────────────────
  { controller: 'CancellationRuleController', endpoint: 'getMine', method: 'GET', user_roles: ['admin'], module: 'cancellation_rules', description: 'List cancellation rules' },
  { controller: 'CancellationRuleController', endpoint: 'getForHost', method: 'GET', user_roles: ADMIN_UP, module: 'cancellation_rules', description: 'Get rules for host' },
  { controller: 'CancellationRuleController', endpoint: 'create', method: 'POST', user_roles: ['admin'], module: 'cancellation_rules', description: 'Create cancellation rule', scope: 'own' },
  { controller: 'CancellationRuleController', endpoint: 'update', method: 'PUT', user_roles: ['admin'], module: 'cancellation_rules', description: 'Update cancellation rule', scope: 'own' },
  { controller: 'CancellationRuleController', endpoint: 'remove', method: 'DELETE', user_roles: ['admin'], module: 'cancellation_rules', description: 'Delete cancellation rule', scope: 'own' },

  // ── Payments (PaymentsController) ──────────────────────────────────────
  { controller: 'PaymentsController', endpoint: 'getTransferAccounts', method: 'GET', user_roles: ADMIN_UP, module: 'payments', description: 'Get transfer accounts' },
  { controller: 'PaymentsController', endpoint: 'getAllTransferAccounts', method: 'GET', user_roles: HYPER, module: 'payments', description: 'Get all transfer accounts' },
  { controller: 'PaymentsController', endpoint: 'upsertTransferAccount', method: 'POST', user_roles: ['admin'], module: 'payments', description: 'Upsert transfer account', scope: 'own' },
  { controller: 'PaymentsController', endpoint: 'deleteTransferAccount', method: 'DELETE', user_roles: ['admin'], module: 'payments', description: 'Delete transfer account', scope: 'own' },
  { controller: 'PaymentsController', endpoint: 'uploadReceipt', method: 'POST', user_roles: AUTHENTICATED, module: 'payments', description: 'Upload payment receipt' },
  { controller: 'PaymentsController', endpoint: 'getPendingReceipts', method: 'GET', user_roles: HYPER, module: 'payments', description: 'Get pending receipts' },
  { controller: 'PaymentsController', endpoint: 'getReceiptsByBooking', method: 'GET', user_roles: HOST, module: 'payments', description: 'Get receipts for booking' },
  { controller: 'PaymentsController', endpoint: 'approveReceipt', method: 'PUT', user_roles: HYPER, module: 'payments', description: 'Approve receipt' },
  { controller: 'PaymentsController', endpoint: 'rejectReceipt', method: 'PUT', user_roles: HYPER, module: 'payments', description: 'Reject receipt' },

  // ── Hyper Management (HyperManagementController) ───────────────────────
  { controller: 'HyperManagementController', endpoint: 'pauseProperty', method: 'PUT', user_roles: HYPER, module: 'hyper', description: 'Pause a property' },
  { controller: 'HyperManagementController', endpoint: 'resumeProperty', method: 'PUT', user_roles: HYPER, module: 'hyper', description: 'Resume a property' },
  { controller: 'HyperManagementController', endpoint: 'archiveProperty', method: 'DELETE', user_roles: HYPER, module: 'hyper', description: 'Archive a property' },
  { controller: 'HyperManagementController', endpoint: 'deleteProperty', method: 'DELETE', user_roles: ['hyper_admin'], module: 'hyper', description: 'Permanently delete property' },
  { controller: 'HyperManagementController', endpoint: 'pauseService', method: 'PUT', user_roles: HYPER, module: 'hyper', description: 'Pause a service' },
  { controller: 'HyperManagementController', endpoint: 'resumeService', method: 'PUT', user_roles: HYPER, module: 'hyper', description: 'Resume a service' },
  { controller: 'HyperManagementController', endpoint: 'archiveService', method: 'DELETE', user_roles: HYPER, module: 'hyper', description: 'Archive a service' },
  { controller: 'HyperManagementController', endpoint: 'deleteService', method: 'DELETE', user_roles: ['hyper_admin'], module: 'hyper', description: 'Permanently delete service' },
  { controller: 'HyperManagementController', endpoint: 'pauseUser', method: 'PUT', user_roles: HYPER, module: 'hyper', description: 'Pause a user' },
  { controller: 'HyperManagementController', endpoint: 'resumeUser', method: 'PUT', user_roles: HYPER, module: 'hyper', description: 'Resume a user' },
  { controller: 'HyperManagementController', endpoint: 'archiveUser', method: 'DELETE', user_roles: HYPER, module: 'hyper', description: 'Archive a user' },
  { controller: 'HyperManagementController', endpoint: 'reactivateUser', method: 'PUT', user_roles: HYPER, module: 'hyper', description: 'Reactivate archived user' },

  // ── Document Validation (DocumentValidationController) ─────────────────
  { controller: 'DocumentValidationController', endpoint: 'submitForValidation', method: 'POST', user_roles: HOST, module: 'documents', description: 'Submit for validation' },
  { controller: 'DocumentValidationController', endpoint: 'getPendingDocuments', method: 'GET', user_roles: ['hyper_admin', 'hyper_manager', 'admin'], module: 'documents', description: 'Get pending documents' },
  { controller: 'DocumentValidationController', endpoint: 'approveDocument', method: 'PUT', user_roles: HYPER, module: 'documents', description: 'Approve document' },
  { controller: 'DocumentValidationController', endpoint: 'rejectDocument', method: 'PUT', user_roles: HYPER, module: 'documents', description: 'Reject document' },

  // ── Property Groups (PropertyGroupsController) ─────────────────────────
  { controller: 'PropertyGroupsController', endpoint: 'findAll', method: 'GET', user_roles: ADMIN_UP, module: 'property_groups', description: 'List property groups' },
  { controller: 'PropertyGroupsController', endpoint: 'findOne', method: 'GET', user_roles: ADMIN_UP, module: 'property_groups', description: 'Get single group' },
  { controller: 'PropertyGroupsController', endpoint: 'create', method: 'POST', user_roles: ['admin'], module: 'property_groups', description: 'Create group', scope: 'own' },
  { controller: 'PropertyGroupsController', endpoint: 'update', method: 'PUT', user_roles: ['admin'], module: 'property_groups', description: 'Update group', scope: 'own' },
  { controller: 'PropertyGroupsController', endpoint: 'remove', method: 'DELETE', user_roles: ['admin'], module: 'property_groups', description: 'Delete group', scope: 'own' },
  { controller: 'PropertyGroupsController', endpoint: 'addProperty', method: 'POST', user_roles: ['admin'], module: 'property_groups', description: 'Add property to group', scope: 'own' },
  { controller: 'PropertyGroupsController', endpoint: 'removeProperty', method: 'DELETE', user_roles: ['admin'], module: 'property_groups', description: 'Remove property from group', scope: 'own' },
  { controller: 'PropertyGroupsController', endpoint: 'getGroupProperties', method: 'GET', user_roles: ADMIN_UP, module: 'property_groups', description: 'Get properties in group' },

  // ── Service Groups (ServiceGroupsController) ──────────────────────────
  { controller: 'ServiceGroupsController', endpoint: 'findAll', method: 'GET', user_roles: ADMIN_UP, module: 'service_groups', description: 'List service groups' },
  { controller: 'ServiceGroupsController', endpoint: 'findOne', method: 'GET', user_roles: ADMIN_UP, module: 'service_groups', description: 'Get single service group' },
  { controller: 'ServiceGroupsController', endpoint: 'create', method: 'POST', user_roles: ['admin'], module: 'service_groups', description: 'Create service group', scope: 'own' },
  { controller: 'ServiceGroupsController', endpoint: 'update', method: 'PUT', user_roles: ['admin'], module: 'service_groups', description: 'Update service group', scope: 'own' },
  { controller: 'ServiceGroupsController', endpoint: 'remove', method: 'DELETE', user_roles: ['admin'], module: 'service_groups', description: 'Delete service group', scope: 'own' },
  { controller: 'ServiceGroupsController', endpoint: 'getServices', method: 'GET', user_roles: ADMIN_UP, module: 'service_groups', description: 'Get services in group' },
  { controller: 'ServiceGroupsController', endpoint: 'addService', method: 'POST', user_roles: ['admin'], module: 'service_groups', description: 'Add service to group', scope: 'own' },
  { controller: 'ServiceGroupsController', endpoint: 'removeService', method: 'DELETE', user_roles: ['admin'], module: 'service_groups', description: 'Remove service from group', scope: 'own' },

  // ── Support Chat (SupportChatController) ───────────────────────────────
  { controller: 'SupportChatController', endpoint: 'createThread', method: 'POST', user_roles: AUTHENTICATED, module: 'support', description: 'Create support thread' },
  { controller: 'SupportChatController', endpoint: 'getMyThreads', method: 'GET', user_roles: AUTHENTICATED, module: 'support', description: 'Get my threads' },
  { controller: 'SupportChatController', endpoint: 'getAdminThreads', method: 'GET', user_roles: ADMIN_UP, module: 'support', description: 'Get admin threads' },
  { controller: 'SupportChatController', endpoint: 'getThread', method: 'GET', user_roles: AUTHENTICATED, module: 'support', description: 'Get thread detail' },
  { controller: 'SupportChatController', endpoint: 'getMessages', method: 'GET', user_roles: AUTHENTICATED, module: 'support', description: 'Get messages' },
  { controller: 'SupportChatController', endpoint: 'sendMessage', method: 'POST', user_roles: AUTHENTICATED, module: 'support', description: 'Send message' },
  { controller: 'SupportChatController', endpoint: 'updateStatus', method: 'PATCH', user_roles: ADMIN_UP, module: 'support', description: 'Update thread status' },
  { controller: 'SupportChatController', endpoint: 'assignThread', method: 'PATCH', user_roles: ADMIN_UP, module: 'support', description: 'Assign thread' },
  { controller: 'SupportChatController', endpoint: 'markRead', method: 'POST', user_roles: AUTHENTICATED, module: 'support', description: 'Mark read' },

  // ── Payout Accounts (PayoutAccountController) ─────────────────────────
  { controller: 'PayoutAccountController', endpoint: 'getMine', method: 'GET', user_roles: ['admin'], module: 'payout_accounts', description: 'My payout accounts' },
  { controller: 'PayoutAccountController', endpoint: 'getAll', method: 'GET', user_roles: HYPER, module: 'payout_accounts', description: 'All payout accounts' },
  { controller: 'PayoutAccountController', endpoint: 'create', method: 'POST', user_roles: ['admin'], module: 'payout_accounts', description: 'Create payout account', scope: 'own' },
  { controller: 'PayoutAccountController', endpoint: 'update', method: 'PUT', user_roles: ['admin'], module: 'payout_accounts', description: 'Update payout account', scope: 'own' },
  { controller: 'PayoutAccountController', endpoint: 'remove', method: 'DELETE', user_roles: ['admin'], module: 'payout_accounts', description: 'Delete payout account', scope: 'own' },

  // ── Metrics (MetricsController — bookings module) ─────────────────────
  { controller: 'MetricsController', endpoint: 'getUsers', method: 'GET', user_roles: HYPER, module: 'metrics', description: 'User metrics' },
  { controller: 'MetricsController', endpoint: 'getBookings', method: 'GET', user_roles: ADMIN_UP, module: 'metrics', description: 'Booking metrics' },
  { controller: 'MetricsController', endpoint: 'getProperties', method: 'GET', user_roles: ADMIN_UP, module: 'metrics', description: 'Property metrics' },
  { controller: 'MetricsController', endpoint: 'getServices', method: 'GET', user_roles: ADMIN_UP, module: 'metrics', description: 'Service metrics' },
  { controller: 'MetricsController', endpoint: 'getRevenue', method: 'GET', user_roles: ADMIN_UP, module: 'metrics', description: 'Revenue metrics' },
  { controller: 'MetricsController', endpoint: 'getSummary', method: 'GET', user_roles: ADMIN_UP, module: 'metrics', description: 'Platform summary' },

  // ── Dashboard (DashboardController) ────────────────────────────────────
  { controller: 'DashboardController', endpoint: 'getDashboard', method: 'GET', user_roles: HOST, module: 'dashboard', description: 'Get dashboard data' },

  // ── Badges (BadgeController) ──────────────────────────────────────────
  { controller: 'BadgeController', endpoint: 'getAllBadges', method: 'GET', user_roles: AUTHENTICATED, module: 'badges', description: 'List badges' },
  { controller: 'BadgeController', endpoint: 'getMyBadges', method: 'GET', user_roles: AUTHENTICATED, module: 'badges', description: 'My badges' },
  { controller: 'BadgeController', endpoint: 'getMyProgress', method: 'GET', user_roles: AUTHENTICATED, module: 'badges', description: 'Badge progress' },
  { controller: 'BadgeController', endpoint: 'checkUnlocks', method: 'POST', user_roles: AUTHENTICATED, module: 'badges', description: 'Check badge unlocks' },

  // ── Points (PointsController) ─────────────────────────────────────────
  { controller: 'PointsController', endpoint: 'getMySummary', method: 'GET', user_roles: AUTHENTICATED, module: 'points', description: 'Get my points summary' },
  { controller: 'PointsController', endpoint: 'getMyTransactions', method: 'GET', user_roles: AUTHENTICATED, module: 'points', description: 'Get my transactions' },
  { controller: 'PointsController', endpoint: 'getLeaderboard', method: 'GET', user_roles: AUTHENTICATED, module: 'points', description: 'Get leaderboard' },
  { controller: 'PointsController', endpoint: 'adminAward', method: 'POST', user_roles: HYPER, module: 'points', description: 'Admin award points' },
  { controller: 'PointsController', endpoint: 'adminDeduct', method: 'POST', user_roles: HYPER, module: 'points', description: 'Admin deduct points' },
  { controller: 'PointsController', endpoint: 'getUserPoints', method: 'GET', user_roles: ADMIN_UP, module: 'points', description: 'Get user points' },

  // ── Rankings (RankingsController) ──────────────────────────────────────
  { controller: 'RankingsController', endpoint: 'getRankings', method: 'GET', user_roles: AUTHENTICATED, module: 'rankings', description: 'Get rankings' },
  { controller: 'RankingsController', endpoint: 'getMyRank', method: 'GET', user_roles: AUTHENTICATED, module: 'rankings', description: 'Get my rank' },

  // ── Rewards (RewardsController) ────────────────────────────────────────
  { controller: 'RewardsController', endpoint: 'getShop', method: 'GET', user_roles: AUTHENTICATED, module: 'rewards', description: 'Browse rewards shop' },
  { controller: 'RewardsController', endpoint: 'getAll', method: 'GET', user_roles: HYPER, module: 'rewards', description: 'List all rewards' },
  { controller: 'RewardsController', endpoint: 'getById', method: 'GET', user_roles: AUTHENTICATED, module: 'rewards', description: 'Get reward by id' },
  { controller: 'RewardsController', endpoint: 'create', method: 'POST', user_roles: HYPER, module: 'rewards', description: 'Create reward' },
  { controller: 'RewardsController', endpoint: 'update', method: 'PUT', user_roles: HYPER, module: 'rewards', description: 'Update reward' },
  { controller: 'RewardsController', endpoint: 'remove', method: 'DELETE', user_roles: HYPER, module: 'rewards', description: 'Delete reward' },
  { controller: 'RewardsController', endpoint: 'redeem', method: 'POST', user_roles: ['user', 'guest', 'manager'], module: 'rewards', description: 'Redeem reward' },
  { controller: 'RewardsController', endpoint: 'getMyRedemptions', method: 'GET', user_roles: AUTHENTICATED, module: 'rewards', description: 'My redemptions' },
  { controller: 'RewardsController', endpoint: 'useRedemption', method: 'PUT', user_roles: AUTHENTICATED, module: 'rewards', description: 'Use redemption' },
  { controller: 'RewardsController', endpoint: 'cancelRedemption', method: 'PUT', user_roles: AUTHENTICATED, module: 'rewards', description: 'Cancel redemption' },
  { controller: 'RewardsController', endpoint: 'getAllRedemptions', method: 'GET', user_roles: HYPER, module: 'rewards', description: 'All redemptions (admin)' },

  // ── Referrals (ReferralController) ─────────────────────────────────────
  { controller: 'ReferralController', endpoint: 'getMyCode', method: 'GET', user_roles: AUTHENTICATED, module: 'referrals', description: 'Get my referral code' },
  { controller: 'ReferralController', endpoint: 'createReferral', method: 'POST', user_roles: AUTHENTICATED, module: 'referrals', description: 'Create referral' },
  { controller: 'ReferralController', endpoint: 'getMyReferrals', method: 'GET', user_roles: AUTHENTICATED, module: 'referrals', description: 'Get my referrals' },
  { controller: 'ReferralController', endpoint: 'getMyStats', method: 'GET', user_roles: AUTHENTICATED, module: 'referrals', description: 'Get referral stats' },
  { controller: 'ReferralController', endpoint: 'completeSignup', method: 'POST', user_roles: ALL, module: 'referrals', description: 'Complete referral signup' },
  { controller: 'ReferralController', endpoint: 'shareProperty', method: 'POST', user_roles: AUTHENTICATED, module: 'referrals', description: 'Share property' },
  { controller: 'ReferralController', endpoint: 'getShareStats', method: 'GET', user_roles: AUTHENTICATED, module: 'referrals', description: 'Get share stats' },

  // ── Profiles (ProfilesController) ─────────────────────────────────────
  { controller: 'ProfilesController', endpoint: 'findMyProfile', method: 'GET', user_roles: AUTHENTICATED, module: 'profiles', description: 'Get my profile' },
  { controller: 'ProfilesController', endpoint: 'updateMyProfile', method: 'PUT', user_roles: AUTHENTICATED, module: 'profiles', description: 'Update my profile' },

  // ── Settings (SettingsController) ──────────────────────────────────────
  { controller: 'SettingsController', endpoint: 'getSettings', method: 'GET', user_roles: AUTHENTICATED, module: 'settings', description: 'Get settings' },
  { controller: 'SettingsController', endpoint: 'updatePreferences', method: 'PUT', user_roles: AUTHENTICATED, module: 'settings', description: 'Update preferences' },
  { controller: 'SettingsController', endpoint: 'updateNotifications', method: 'PUT', user_roles: AUTHENTICATED, module: 'settings', description: 'Update notifications' },
  { controller: 'SettingsController', endpoint: 'updateAccount', method: 'PUT', user_roles: AUTHENTICATED, module: 'settings', description: 'Update account' },
  { controller: 'SettingsController', endpoint: 'changePassword', method: 'PUT', user_roles: AUTHENTICATED, module: 'settings', description: 'Change password' },

  // ── User (UserController) ─────────────────────────────────────────────
  { controller: 'UserController', endpoint: 'updateLanguage', method: 'PUT', user_roles: AUTHENTICATED, module: 'user', description: 'Update language' },
  { controller: 'UserController', endpoint: 'uploadAvatar', method: 'POST', user_roles: AUTHENTICATED, module: 'user', description: 'Upload avatar' },
  { controller: 'UserController', endpoint: 'deleteAvatar', method: 'DELETE', user_roles: AUTHENTICATED, module: 'user', description: 'Delete avatar' },
  { controller: 'UserController', endpoint: 'completeProfile', method: 'POST', user_roles: AUTHENTICATED, module: 'user', description: 'Complete profile' },

  // ── Notifications (NotificationController) ─────────────────────────────
  { controller: 'NotificationController', endpoint: 'get', method: 'GET', user_roles: AUTHENTICATED, module: 'notifications', description: 'Get all notifications' },
  { controller: 'NotificationController', endpoint: 'getNew', method: 'GET', user_roles: AUTHENTICATED, module: 'notifications', description: 'Get new notifications' },

  // ── Email Tracking (EmailTrackingController) — mostly public ──────────
  { controller: 'EmailTrackingController', endpoint: 'getAnalytics', method: 'GET', user_roles: ADMIN_UP, module: 'email_tracking', description: 'Email analytics' },
];

// ─── Frontend Permissions ─────────────────────────────────────────────────────

const FRONTEND_PERMISSIONS: FrontendPerm[] = [
  // Properties
  { component: 'PropertyListPage', sub_view: 'Header', element_type: 'Button', action_name: 'Add', user_roles: ['admin'], module: 'properties', description: 'Show Add Property button' },
  { component: 'PropertyListPage', sub_view: 'Card', element_type: 'Button', action_name: 'Edit', user_roles: ['admin', 'manager'], module: 'properties', description: 'Show edit property button' },
  { component: 'PropertyListPage', sub_view: 'Card', element_type: 'Button', action_name: 'Delete', user_roles: ['hyper_admin', 'admin'], module: 'properties', description: 'Show delete property button' },
  { component: 'PropertyListPage', sub_view: 'Card', element_type: 'Button', action_name: 'Pause', user_roles: ['admin', 'manager'], module: 'properties', description: 'Show pause property button' },
  { component: 'PropertyListPage', sub_view: 'Card', element_type: 'Button', action_name: 'Duplicate', user_roles: ['admin'], module: 'properties', description: 'Show duplicate property button' },

  // Services
  { component: 'ServiceListPage', sub_view: 'Header', element_type: 'Button', action_name: 'Add', user_roles: ['admin'], module: 'services', description: 'Show Add Service button' },
  { component: 'ServiceListPage', sub_view: 'Card', element_type: 'Button', action_name: 'Edit', user_roles: ['admin', 'manager'], module: 'services', description: 'Show edit service button' },
  { component: 'ServiceListPage', sub_view: 'Card', element_type: 'Button', action_name: 'Delete', user_roles: ['hyper_admin', 'admin'], module: 'services', description: 'Show delete service button' },
  { component: 'ServiceListPage', sub_view: 'Card', element_type: 'Button', action_name: 'Pause', user_roles: ['admin', 'manager'], module: 'services', description: 'Show pause service button' },
  { component: 'ServiceListPage', sub_view: 'Card', element_type: 'Button', action_name: 'Duplicate', user_roles: ['admin'], module: 'services', description: 'Show duplicate service button' },

  // Bookings
  { component: 'BookingsPage', element_type: 'Tab', action_name: 'View', user_roles: HOST, module: 'bookings', description: 'Show bookings tab' },
  { component: 'BookingsPage', sub_view: 'Detail', element_type: 'Button', action_name: 'Accept', user_roles: ['admin', 'manager'], module: 'bookings', description: 'Show accept booking button' },
  { component: 'BookingsPage', sub_view: 'Detail', element_type: 'Button', action_name: 'Reject', user_roles: ['admin', 'manager'], module: 'bookings', description: 'Show reject booking button' },
  { component: 'BookingsPage', sub_view: 'Detail', element_type: 'Button', action_name: 'Refund', user_roles: ['hyper_admin', 'admin'], module: 'bookings', description: 'Show refund booking button' },

  // Dashboard
  { component: 'Dashboard', sub_view: 'Analytics', element_type: 'Tab', action_name: 'View', user_roles: ADMIN_UP, module: 'dashboard', description: 'Show analytics tab' },
  { component: 'Dashboard', sub_view: 'Payments', element_type: 'Tab', action_name: 'View', user_roles: ADMIN_UP, module: 'dashboard', description: 'Show payments tab' },
  { component: 'Dashboard', sub_view: 'Revenue', element_type: 'Widget', action_name: 'View', user_roles: ADMIN_UP, module: 'dashboard', description: 'Show revenue widget' },

  // Users
  { component: 'UsersPage', element_type: 'Tab', action_name: 'View', user_roles: HYPER, module: 'users', description: 'Show users tab' },
  { component: 'UsersPage', sub_view: 'List', element_type: 'Button', action_name: 'Invite', user_roles: ADMIN_UP, module: 'users', description: 'Show invite button' },
  { component: 'UsersPage', sub_view: 'List', element_type: 'Button', action_name: 'ConvertGuest', user_roles: ['admin'], module: 'users', description: 'Convert guest to user' },
  { component: 'UsersPage', sub_view: 'Detail', element_type: 'Button', action_name: 'AssignRole', user_roles: ['hyper_admin', 'admin'], module: 'users', description: 'Assign role button' },
  { component: 'UsersPage', sub_view: 'Detail', element_type: 'Button', action_name: 'ManagePermissions', user_roles: ['hyper_admin', 'admin'], module: 'users', description: 'Manage permissions button' },

  // RBAC
  { component: 'RbacSettings', element_type: 'Page', action_name: 'View', user_roles: HYPER, module: 'rbac', description: 'View RBAC settings' },
  { component: 'RbacSettings', element_type: 'Page', action_name: 'Edit', user_roles: ['hyper_admin'], module: 'rbac', description: 'Edit RBAC settings' },

  // Fees
  { component: 'ServiceFeesPage', element_type: 'Page', action_name: 'View', user_roles: HYPER, module: 'fees', description: 'View service fees' },
  { component: 'ServiceFeesPage', sub_view: 'Header', element_type: 'Button', action_name: 'Add', user_roles: ['hyper_admin'], module: 'fees', description: 'Add fee rule' },
  { component: 'HostFeeAbsorptionPage', element_type: 'Page', action_name: 'View', user_roles: ['admin'], module: 'fees', description: 'View fee absorption' },
  { component: 'CancellationRulesPage', element_type: 'Page', action_name: 'View', user_roles: ['admin'], module: 'fees', description: 'View cancellation rules' },

  // Points / Rewards
  { component: 'PointsRulesPage', element_type: 'Page', action_name: 'View', user_roles: HYPER, module: 'points', description: 'View points rules' },
  { component: 'PointsRulesPage', sub_view: 'Header', element_type: 'Button', action_name: 'Add', user_roles: ['hyper_admin'], module: 'points', description: 'Add points rule' },
  { component: 'RewardsPage', element_type: 'Page', action_name: 'View', user_roles: AUTHENTICATED, module: 'points', description: 'View rewards' },
  { component: 'RewardsPage', sub_view: 'Detail', element_type: 'Button', action_name: 'Redeem', user_roles: ['user', 'guest', 'manager'], module: 'points', description: 'Redeem reward' },

  // Referrals
  { component: 'ReferralsPage', element_type: 'Page', action_name: 'View', user_roles: AUTHENTICATED, module: 'referrals', description: 'View referrals' },
  { component: 'PropertyDetailPage', sub_view: 'Actions', element_type: 'Button', action_name: 'Share', user_roles: AUTHENTICATED, module: 'referrals', description: 'Share property' },

  // Communication
  { component: 'ChatPage', element_type: 'Page', action_name: 'Reply', user_roles: ['admin', 'manager'], module: 'communication', description: 'Reply in chat' },
  { component: 'ReviewsPage', element_type: 'Page', action_name: 'Reply', user_roles: ['admin', 'manager'], module: 'communication', description: 'Reply to reviews' },

  // Payout
  { component: 'PayoutAccountsPage', element_type: 'Page', action_name: 'View', user_roles: ['admin'], module: 'payout', description: 'View payout accounts' },
  { component: 'PayoutAccountsPage', sub_view: 'Header', element_type: 'Button', action_name: 'Add', user_roles: ['admin'], module: 'payout', description: 'Add payout account' },
];

// ─── Seed Runner ──────────────────────────────────────────────────────────────

export async function seedRbac(): Promise<void> {
  await AppDataSource.initialize();
  console.log('✅ Database connected');

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    console.log('✅ RBAC seed RUNNING ...');
    let backendCount = 0;
    let frontendCount = 0;

    // ── Seed backend permissions ──────────────────────────────────────────
    for (const perm of BACKEND_PERMISSIONS) {
      const permKey = generateBackendPermissionKey(perm.controller, perm.endpoint, perm.method);

      await queryRunner.query(
        `INSERT INTO rbac_backend_permissions
          (id, permission_key, user_roles, controller, endpoint, method, module, description, scope, allowed)
         VALUES
          (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, true)
         ON DUPLICATE KEY UPDATE
          user_roles    = VALUES(user_roles),
          controller    = VALUES(controller),
          endpoint      = VALUES(endpoint),
          method        = VALUES(method),
          module        = VALUES(module),
          description   = VALUES(description),
          scope         = VALUES(scope)`,
        [
          permKey,
          JSON.stringify(perm.user_roles),
          perm.controller,
          perm.endpoint,
          perm.method,
          perm.module,
          perm.description,
          perm.scope ?? 'global',
        ],
      );
      backendCount++;
    }

    // ── Seed frontend permissions ─────────────────────────────────────────
    for (const perm of FRONTEND_PERMISSIONS) {
      const permKey = generateUiPermissionKey(
        perm.component,
        perm.sub_view,
        perm.element_type,
        perm.action_name,
      );

      await queryRunner.query(
        `INSERT INTO rbac_frontend_permissions
          (id, permission_key, user_roles, component, sub_view, element_type, action_name, module, description, allowed)
         VALUES
          (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, true)
         ON DUPLICATE KEY UPDATE
          user_roles   = VALUES(user_roles),
          component    = VALUES(component),
          sub_view     = VALUES(sub_view),
          element_type = VALUES(element_type),
          action_name  = VALUES(action_name),
          module       = VALUES(module),
          description  = VALUES(description)`,
        [
          permKey,
          JSON.stringify(perm.user_roles),
          perm.component,
          perm.sub_view ?? null,
          perm.element_type ?? null,
          perm.action_name ?? null,
          perm.module,
          perm.description,
        ],
      );
      frontendCount++;
    }

    await queryRunner.commitTransaction();
    console.log(`✅ RBAC seed complete — ${backendCount} backend / ${frontendCount} frontend permissions`);

  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('❌ RBAC seed failed:', error);
    throw error;
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

seedRbac();
