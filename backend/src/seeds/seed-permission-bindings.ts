/**
 * Seed script for rbac_permission_bindings table.
 * Maps frontend API call keys to their corresponding backend API permission keys.
 *
 * Format: frontendPermissionApi = "<apiObjectName>.<methodName>.<HTTP_METHOD>"
 * Maps to backendPermissionKey in rbac_backend_permissions table.
 *
 * Run via: npx ts-node backend/src/seeds/seed-permission-bindings.ts
 */

import { PermissionBindingService } from '../user/services/permission-binding.service';

export const PERMISSION_BINDING_SEED: Array<{
  frontendPermissionApi: string;
  backendPermissionKey: string;
  module: string;
}> = [
  // ─── Properties ────────────────────────────────────────────────────
  { frontendPermissionApi: 'propertiesApi.getAll.GET', backendPermissionKey: 'backend.PropertiesController.findAll.GET', module: 'properties' },
  { frontendPermissionApi: 'propertiesApi.getById.GET', backendPermissionKey: 'backend.PropertiesController.findOne.GET', module: 'properties' },
  { frontendPermissionApi: 'propertiesApi.create.POST', backendPermissionKey: 'backend.PropertiesController.create.POST', module: 'properties' },
  { frontendPermissionApi: 'propertiesApi.update.PUT', backendPermissionKey: 'backend.PropertiesController.update.PUT', module: 'properties' },
  { frontendPermissionApi: 'propertiesApi.updatePrices.PUT', backendPermissionKey: 'backend.PropertiesController.update.PUT', module: 'properties' },
  { frontendPermissionApi: 'propertiesApi.updatePhotos.PUT', backendPermissionKey: 'backend.PropertiesController.update.PUT', module: 'properties' },
  { frontendPermissionApi: 'propertiesApi.updateAvailability.PUT', backendPermissionKey: 'backend.PropertiesController.updateAvailability.PUT', module: 'properties' },
  { frontendPermissionApi: 'propertiesApi.delete.DELETE', backendPermissionKey: 'backend.PropertiesController.delete.DELETE', module: 'properties' },
  { frontendPermissionApi: 'propertiesApi.getAvailability.GET', backendPermissionKey: 'backend.PropertiesController.getAvailability.GET', module: 'properties' },

  // ─── Property Groups ───────────────────────────────────────────────
  { frontendPermissionApi: 'groupsApi.getAll.GET', backendPermissionKey: 'backend.PropertyGroupsController.findAll.GET', module: 'property_groups' },
  { frontendPermissionApi: 'groupsApi.getOne.GET', backendPermissionKey: 'backend.PropertyGroupsController.findOne.GET', module: 'property_groups' },
  { frontendPermissionApi: 'groupsApi.create.POST', backendPermissionKey: 'backend.PropertyGroupsController.create.POST', module: 'property_groups' },
  { frontendPermissionApi: 'groupsApi.update.PUT', backendPermissionKey: 'backend.PropertyGroupsController.update.PUT', module: 'property_groups' },
  { frontendPermissionApi: 'groupsApi.remove.DELETE', backendPermissionKey: 'backend.PropertyGroupsController.remove.DELETE', module: 'property_groups' },

  // ─── Bookings ──────────────────────────────────────────────────────
  { frontendPermissionApi: 'bookingsApi.create.POST', backendPermissionKey: 'backend.BookingsController.create.POST', module: 'bookings' },
  { frontendPermissionApi: 'bookingsApi.getAll.GET', backendPermissionKey: 'backend.BookingsController.findAll.GET', module: 'bookings' },
  { frontendPermissionApi: 'bookingsApi.getById.GET', backendPermissionKey: 'backend.BookingsController.findOne.GET', module: 'bookings' },
  { frontendPermissionApi: 'bookingsApi.getByGuest.GET', backendPermissionKey: 'backend.BookingsController.findByGuest.GET', module: 'bookings' },
  { frontendPermissionApi: 'bookingsApi.updateStatus.PUT', backendPermissionKey: 'backend.BookingsController.updateStatus.PUT', module: 'bookings' },
  { frontendPermissionApi: 'bookingsApi.decline.PUT', backendPermissionKey: 'backend.BookingsController.decline.PUT', module: 'bookings' },
  { frontendPermissionApi: 'bookingsApi.counterOffer.POST', backendPermissionKey: 'backend.BookingsController.counterOffer.POST', module: 'bookings' },
  { frontendPermissionApi: 'bookingsApi.checkAvailability.GET', backendPermissionKey: 'backend.BookingsController.checkAvailability.GET', module: 'bookings' },

  // ─── Tourism Services ──────────────────────────────────────────────
  { frontendPermissionApi: 'servicesApi.getAll.GET', backendPermissionKey: 'backend.TourismServicesController.findAll.GET', module: 'services' },
  { frontendPermissionApi: 'servicesApi.getById.GET', backendPermissionKey: 'backend.TourismServicesController.findOne.GET', module: 'services' },
  { frontendPermissionApi: 'servicesApi.create.POST', backendPermissionKey: 'backend.TourismServicesController.create.POST', module: 'services' },
  { frontendPermissionApi: 'servicesApi.update.PUT', backendPermissionKey: 'backend.TourismServicesController.update.PUT', module: 'services' },
  { frontendPermissionApi: 'servicesApi.remove.DELETE', backendPermissionKey: 'backend.TourismServicesController.remove.DELETE', module: 'services' },

  // ─── Service Bookings ──────────────────────────────────────────────
  { frontendPermissionApi: 'serviceBookingsApi.create.POST', backendPermissionKey: 'backend.ServiceBookingsController.create.POST', module: 'service_bookings' },
  { frontendPermissionApi: 'serviceBookingsApi.getProviderBookings.GET', backendPermissionKey: 'backend.ServiceBookingsController.getProviderBookings.GET', module: 'service_bookings' },
  { frontendPermissionApi: 'serviceBookingsApi.accept.PUT', backendPermissionKey: 'backend.ServiceBookingsController.accept.PUT', module: 'service_bookings' },
  { frontendPermissionApi: 'serviceBookingsApi.decline.PUT', backendPermissionKey: 'backend.ServiceBookingsController.decline.PUT', module: 'service_bookings' },

  // ─── Reviews ───────────────────────────────────────────────────────
  { frontendPermissionApi: 'reviewsApi.getByProperty.GET', backendPermissionKey: 'backend.ReviewsController.findByProperty.GET', module: 'reviews' },
  { frontendPermissionApi: 'reviewsApi.create.POST', backendPermissionKey: 'backend.ReviewsController.create.POST', module: 'reviews' },

  // ─── Comments ──────────────────────────────────────────────────────
  { frontendPermissionApi: 'commentsApi.getComments.GET', backendPermissionKey: 'backend.CommentsController.getComments.GET', module: 'comments' },
  { frontendPermissionApi: 'commentsApi.create.POST', backendPermissionKey: 'backend.CommentsController.create.POST', module: 'comments' },
  { frontendPermissionApi: 'commentsApi.update.PUT', backendPermissionKey: 'backend.CommentsController.update.PUT', module: 'comments' },
  { frontendPermissionApi: 'commentsApi.delete.DELETE', backendPermissionKey: 'backend.CommentsController.delete.DELETE', module: 'comments' },

  // ─── Favorites ─────────────────────────────────────────────────────
  { frontendPermissionApi: 'favoritesApi.getMyFavorites.GET', backendPermissionKey: 'backend.FavoritesController.findByUser.GET', module: 'favorites' },
  { frontendPermissionApi: 'favoritesApi.toggle.POST', backendPermissionKey: 'backend.FavoritesController.toggle.POST', module: 'favorites' },

  // ─── Payments ──────────────────────────────────────────────────────
  { frontendPermissionApi: 'paymentsApi.getPendingReceipts.GET', backendPermissionKey: 'backend.PaymentsController.getPendingReceipts.GET', module: 'payments' },
  { frontendPermissionApi: 'paymentsApi.approveReceipt.PUT', backendPermissionKey: 'backend.PaymentsController.approveReceipt.PUT', module: 'payments' },
  { frontendPermissionApi: 'paymentsApi.rejectReceipt.PUT', backendPermissionKey: 'backend.PaymentsController.rejectReceipt.PUT', module: 'payments' },
  { frontendPermissionApi: 'paymentsApi.uploadReceipt.POST', backendPermissionKey: 'backend.PaymentsController.uploadReceipt.POST', module: 'payments' },
  { frontendPermissionApi: 'paymentsApi.getTransferAccounts.GET', backendPermissionKey: 'backend.PaymentsController.getTransferAccounts.GET', module: 'payments' },
  { frontendPermissionApi: 'paymentsApi.getAllTransferAccounts.GET', backendPermissionKey: 'backend.PaymentsController.getAllTransferAccounts.GET', module: 'payments' },
  { frontendPermissionApi: 'paymentsApi.upsertTransferAccount.POST', backendPermissionKey: 'backend.PaymentsController.upsertTransferAccount.POST', module: 'payments' },
  { frontendPermissionApi: 'paymentsApi.deleteTransferAccount.DELETE', backendPermissionKey: 'backend.PaymentsController.deleteTransferAccount.DELETE', module: 'payments' },

  // ─── Dashboard ─────────────────────────────────────────────────────
  { frontendPermissionApi: 'dashboardApi.getDashboard.GET', backendPermissionKey: 'backend.DashboardController.getDashboard.GET', module: 'dashboard' },

  // ─── Metrics ───────────────────────────────────────────────────────
  { frontendPermissionApi: 'metricsApi.getUsers.GET', backendPermissionKey: 'backend.MetricsController.getDetailedUsers.GET', module: 'metrics' },
  { frontendPermissionApi: 'metricsApi.getBookings.GET', backendPermissionKey: 'backend.MetricsController.getDetailedBookings.GET', module: 'metrics' },
  { frontendPermissionApi: 'metricsApi.getProperties.GET', backendPermissionKey: 'backend.MetricsController.getDetailedProperties.GET', module: 'metrics' },
  { frontendPermissionApi: 'metricsApi.getServices.GET', backendPermissionKey: 'backend.MetricsController.getDetailedServices.GET', module: 'metrics' },
  { frontendPermissionApi: 'metricsApi.getRevenue.GET', backendPermissionKey: 'backend.MetricsController.getRevenueBreakdown.GET', module: 'metrics' },
  { frontendPermissionApi: 'metricsApi.getSummary.GET', backendPermissionKey: 'backend.MetricsController.getPlatformSummary.GET', module: 'metrics' },

  // ─── Hyper Management ──────────────────────────────────────────────
  { frontendPermissionApi: 'hyperManagementApi.pauseProperty.PUT', backendPermissionKey: 'backend.HyperManagementController.pauseProperty.PUT', module: 'hyper_management' },
  { frontendPermissionApi: 'hyperManagementApi.resumeProperty.PUT', backendPermissionKey: 'backend.HyperManagementController.resumeProperty.PUT', module: 'hyper_management' },
  { frontendPermissionApi: 'hyperManagementApi.archiveProperty.PUT', backendPermissionKey: 'backend.HyperManagementController.archiveProperty.PUT', module: 'hyper_management' },
  { frontendPermissionApi: 'hyperManagementApi.deleteProperty.DELETE', backendPermissionKey: 'backend.HyperManagementController.deleteProperty.DELETE', module: 'hyper_management' },
  { frontendPermissionApi: 'hyperManagementApi.pauseUser.PUT', backendPermissionKey: 'backend.HyperManagementController.pauseUser.PUT', module: 'hyper_management' },
  { frontendPermissionApi: 'hyperManagementApi.resumeUser.PUT', backendPermissionKey: 'backend.HyperManagementController.resumeUser.PUT', module: 'hyper_management' },
  { frontendPermissionApi: 'hyperManagementApi.archiveUser.PUT', backendPermissionKey: 'backend.HyperManagementController.archiveUser.PUT', module: 'hyper_management' },

  // ─── Document Validation ──────────────────────────────────────────
  { frontendPermissionApi: 'documentsApi.getPending.GET', backendPermissionKey: 'backend.DocumentValidationController.getPendingDocuments.GET', module: 'document_validation' },
  { frontendPermissionApi: 'documentsApi.approve.PUT', backendPermissionKey: 'backend.DocumentValidationController.approveDocument.PUT', module: 'document_validation' },
  { frontendPermissionApi: 'documentsApi.reject.PUT', backendPermissionKey: 'backend.DocumentValidationController.rejectDocument.PUT', module: 'document_validation' },

  // ─── Service Fees ─────────────────────────────────────────────────
  { frontendPermissionApi: 'serviceFeesApi.getAll.GET', backendPermissionKey: 'backend.ServiceFeeController.getAll.GET', module: 'service_fees' },
  { frontendPermissionApi: 'serviceFeesApi.create.POST', backendPermissionKey: 'backend.ServiceFeeController.create.POST', module: 'service_fees' },
  { frontendPermissionApi: 'serviceFeesApi.update.PUT', backendPermissionKey: 'backend.ServiceFeeController.update.PUT', module: 'service_fees' },
  { frontendPermissionApi: 'serviceFeesApi.remove.DELETE', backendPermissionKey: 'backend.ServiceFeeController.remove.DELETE', module: 'service_fees' },

  // ─── Cancellation Rules ───────────────────────────────────────────
  { frontendPermissionApi: 'cancellationRulesApi.getForUser.GET', backendPermissionKey: 'backend.CancellationRuleController.getForUser.GET', module: 'cancellation_rules' },
  { frontendPermissionApi: 'cancellationRulesApi.create.POST', backendPermissionKey: 'backend.CancellationRuleController.create.POST', module: 'cancellation_rules' },
  { frontendPermissionApi: 'cancellationRulesApi.update.PUT', backendPermissionKey: 'backend.CancellationRuleController.update.PUT', module: 'cancellation_rules' },
  { frontendPermissionApi: 'cancellationRulesApi.remove.DELETE', backendPermissionKey: 'backend.CancellationRuleController.remove.DELETE', module: 'cancellation_rules' },

  // ─── Host Fee Absorption ──────────────────────────────────────────
  { frontendPermissionApi: 'hostFeeAbsorptionApi.getMine.GET', backendPermissionKey: 'backend.HostFeeAbsorptionController.getForHost.GET', module: 'fee_absorption' },
  { frontendPermissionApi: 'hostFeeAbsorptionApi.getForHost.GET', backendPermissionKey: 'backend.HostFeeAbsorptionController.getForHost.GET', module: 'fee_absorption' },
  { frontendPermissionApi: 'hostFeeAbsorptionApi.create.POST', backendPermissionKey: 'backend.HostFeeAbsorptionController.create.POST', module: 'fee_absorption' },
  { frontendPermissionApi: 'hostFeeAbsorptionApi.update.PUT', backendPermissionKey: 'backend.HostFeeAbsorptionController.update.PUT', module: 'fee_absorption' },
  { frontendPermissionApi: 'hostFeeAbsorptionApi.remove.DELETE', backendPermissionKey: 'backend.HostFeeAbsorptionController.remove.DELETE', module: 'fee_absorption' },

  // ─── Payout Accounts ──────────────────────────────────────────────
  { frontendPermissionApi: 'payoutAccountsApi.getForHost.GET', backendPermissionKey: 'backend.PayoutAccountController.getForHost.GET', module: 'payout_accounts' },
  { frontendPermissionApi: 'payoutAccountsApi.create.POST', backendPermissionKey: 'backend.PayoutAccountController.create.POST', module: 'payout_accounts' },
  { frontendPermissionApi: 'payoutAccountsApi.update.PUT', backendPermissionKey: 'backend.PayoutAccountController.update.PUT', module: 'payout_accounts' },
  { frontendPermissionApi: 'payoutAccountsApi.remove.DELETE', backendPermissionKey: 'backend.PayoutAccountController.remove.DELETE', module: 'payout_accounts' },

  // ─── Points Rules ─────────────────────────────────────────────────
  { frontendPermissionApi: 'pointsRulesApi.getAll.GET', backendPermissionKey: 'backend.PointsRuleController.getAll.GET', module: 'points_rules' },
  { frontendPermissionApi: 'pointsRulesApi.create.POST', backendPermissionKey: 'backend.PointsRuleController.create.POST', module: 'points_rules' },
  { frontendPermissionApi: 'pointsRulesApi.update.PUT', backendPermissionKey: 'backend.PointsRuleController.update.PUT', module: 'points_rules' },
  { frontendPermissionApi: 'pointsRulesApi.remove.DELETE', backendPermissionKey: 'backend.PointsRuleController.remove.DELETE', module: 'points_rules' },

  // ─── Invitations ──────────────────────────────────────────────────
  { frontendPermissionApi: 'invitationsApi.getAllowedRoles.GET', backendPermissionKey: 'backend.InvitationController.getAllowedRoles.GET', module: 'invitations' },
  { frontendPermissionApi: 'invitationsApi.getInvitations.GET', backendPermissionKey: 'backend.InvitationController.getInvitations.GET', module: 'invitations' },
  { frontendPermissionApi: 'invitationsApi.createInvitation.POST', backendPermissionKey: 'backend.InvitationController.createInvitation.POST', module: 'invitations' },
  { frontendPermissionApi: 'invitationsApi.cancelInvitation.PUT', backendPermissionKey: 'backend.InvitationController.cancelInvitation.PUT', module: 'invitations' },
  { frontendPermissionApi: 'invitationsApi.resendInvitation.POST', backendPermissionKey: 'backend.InvitationController.resendInvitation.POST', module: 'invitations' },

  // ─── Points ────────────────────────────────────────────────────────
  { frontendPermissionApi: 'pointsApi.getMySummary.GET', backendPermissionKey: 'backend.PointsController.getUserSummary.GET', module: 'points' },
  { frontendPermissionApi: 'pointsApi.getLeaderboard.GET', backendPermissionKey: 'backend.PointsController.getLeaderboard.GET', module: 'points' },

  // ─── Notifications ────────────────────────────────────────────────
  { frontendPermissionApi: 'notificationsApi.getAll.GET', backendPermissionKey: 'backend.NotificationController.findByUser.GET', module: 'notifications' },

  // ─── Referrals ────────────────────────────────────────────────────
  { frontendPermissionApi: 'referralsApi.getMyCode.GET', backendPermissionKey: 'backend.ReferralController.getUserReferrals.GET', module: 'referrals' },
  { frontendPermissionApi: 'referralsApi.createReferral.POST', backendPermissionKey: 'backend.ReferralController.createReferral.POST', module: 'referrals' },

  // ─── Support Chat ─────────────────────────────────────────────────
  { frontendPermissionApi: 'supportChatApi.getUserThreads.GET', backendPermissionKey: 'backend.SupportChatController.getUserThreads.GET', module: 'support' },
  { frontendPermissionApi: 'supportChatApi.createThread.POST', backendPermissionKey: 'backend.SupportChatController.createThread.POST', module: 'support' },
  { frontendPermissionApi: 'supportChatApi.getAdminThreads.GET', backendPermissionKey: 'backend.SupportChatController.getAdminThreads.GET', module: 'support' },

  // ─── RBAC Config ──────────────────────────────────────────────────
  { frontendPermissionApi: 'rbacConfigApi.getBackendPermissions.GET', backendPermissionKey: 'backend.RbacConfigController.listBackend.GET', module: 'rbac' },
  { frontendPermissionApi: 'rbacConfigApi.updateBackendPermission.PUT', backendPermissionKey: 'backend.RbacConfigController.updateBackend.PUT', module: 'rbac' },
  { frontendPermissionApi: 'rbacConfigApi.createBackendPermission.POST', backendPermissionKey: 'backend.RbacConfigController.createBackend.POST', module: 'rbac' },
  { frontendPermissionApi: 'rbacConfigApi.reloadCache.POST', backendPermissionKey: 'backend.RbacConfigController.reload.POST', module: 'rbac' },

  // ─── Roles ────────────────────────────────────────────────────────
  { frontendPermissionApi: 'rolesApi.getUserRoles.GET', backendPermissionKey: 'backend.RolesController.getUserRoles.GET', module: 'roles' },
  { frontendPermissionApi: 'rolesApi.setRole.PUT', backendPermissionKey: 'backend.RolesController.setRole.PUT', module: 'roles' },

  // ─── Assignments ──────────────────────────────────────────────────
  { frontendPermissionApi: 'assignmentsApi.getAll.GET', backendPermissionKey: 'backend.RolesController.getAssignments.GET', module: 'assignments' },
  { frontendPermissionApi: 'assignmentsApi.create.POST', backendPermissionKey: 'backend.RolesController.createAssignment.POST', module: 'assignments' },
  { frontendPermissionApi: 'assignmentsApi.remove.DELETE', backendPermissionKey: 'backend.RolesController.deleteAssignment.DELETE', module: 'assignments' },

  // ─── Rewards ──────────────────────────────────────────────────────
  { frontendPermissionApi: 'rewardsApi.getShopRewards.GET', backendPermissionKey: 'backend.RewardsController.getShopRewards.GET', module: 'rewards' },
  { frontendPermissionApi: 'rewardsApi.redeem.POST', backendPermissionKey: 'backend.RewardsController.redeem.POST', module: 'rewards' },
  { frontendPermissionApi: 'rewardsApi.getAll.GET', backendPermissionKey: 'backend.RewardsController.getAll.GET', module: 'rewards' },
  { frontendPermissionApi: 'rewardsApi.create.POST', backendPermissionKey: 'backend.RewardsController.create.POST', module: 'rewards' },

  // ─── Trust Recalculation ──────────────────────────────────────────
  { frontendPermissionApi: 'trustApi.recalculate.PUT', backendPermissionKey: 'backend.PropertiesController.recalculateTrust.PUT', module: 'properties' },

  // ─── Email Tracking ───────────────────────────────────────────────
  { frontendPermissionApi: 'emailTrackingApi.getStats.GET', backendPermissionKey: 'backend.EmailTrackingController.getStats.GET', module: 'email_tracking' },

  // ─── Permission Bindings (meta) ───────────────────────────────────
  { frontendPermissionApi: 'permissionBindingsApi.getAll.GET', backendPermissionKey: 'backend.PermissionBindingController.findAll.GET', module: 'rbac' },
  { frontendPermissionApi: 'permissionBindingsApi.getBindingMap.GET', backendPermissionKey: 'backend.PermissionBindingController.getBindingMap.GET', module: 'rbac' },
  { frontendPermissionApi: 'permissionBindingsApi.create.POST', backendPermissionKey: 'backend.PermissionBindingController.create.POST', module: 'rbac' },
  { frontendPermissionApi: 'permissionBindingsApi.remove.DELETE', backendPermissionKey: 'backend.PermissionBindingController.remove.DELETE', module: 'rbac' },
];

/**
 * Run the seed using an injected PermissionBindingService.
 */
export async function seedPermissionBindings(service: PermissionBindingService): Promise<{ created: number; errors: string[] }> {
  return service.bulkCreate(PERMISSION_BINDING_SEED);
}
