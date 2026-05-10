/**
 * Seed script for rbac_permission_bindings table.
 * Maps frontend API call keys to their corresponding backend API permission keys.
 * Also seeds the UI→API cross-reference (rbac_frontend_permissions ↔ rbac_permission_bindings).
 *
 * Standalone — does NOT inject PermissionBindingService.
 * Run via: npx ts-node -r tsconfig-paths/register src/scripts/seed-permission-bindings.ts
 */

import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { generateUiPermissionKey } from '../rbac/utils/generate-ui-permission-key';

dotenvConfig({ path: '.env' });

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

// ─── Frontend API → Backend Permission Key ──────────────────────────────────

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
    { frontendPermissionApi: 'propertiesApi.updatePrices.PUT', backendPermissionKey: 'backend.PropertiesController.updatePrices.PUT', module: 'properties' },
    { frontendPermissionApi: 'propertiesApi.updatePhotos.PUT', backendPermissionKey: 'backend.PropertiesController.updatePhotos.PUT', module: 'properties' },
    { frontendPermissionApi: 'propertiesApi.updateAvailability.PUT', backendPermissionKey: 'backend.PropertiesController.updateAvailability.PUT', module: 'properties' },
    { frontendPermissionApi: 'propertiesApi.delete.DELETE', backendPermissionKey: 'backend.PropertiesController.remove.DELETE', module: 'properties' },
    { frontendPermissionApi: 'propertiesApi.getAvailability.GET', backendPermissionKey: 'backend.PropertiesController.getAvailability.GET', module: 'properties' },
    { frontendPermissionApi: 'propertiesApi.subscribePromoAlert.POST', backendPermissionKey: 'backend.PropertiesController.subscribePromoAlert.POST', module: 'properties' },
    { frontendPermissionApi: 'propertiesApi.unsubscribePromoAlert.DELETE', backendPermissionKey: 'backend.PropertiesController.unsubscribePromoAlert.DELETE', module: 'properties' },
    { frontendPermissionApi: 'propertiesApi.getPromos.GET', backendPermissionKey: 'backend.PropertiesController.getPromos.GET', module: 'properties' },

    // ─── Saved Search Alerts ───────────────────────────────────────────
    { frontendPermissionApi: 'savedSearchAlertsApi.getAll.GET', backendPermissionKey: 'backend.PropertiesController.getMyAlerts.GET', module: 'properties' },
    { frontendPermissionApi: 'savedSearchAlertsApi.create.POST', backendPermissionKey: 'backend.PropertiesController.createAlert.POST', module: 'properties' },
    { frontendPermissionApi: 'savedSearchAlertsApi.update.PUT', backendPermissionKey: 'backend.PropertiesController.updateAlert.PUT', module: 'properties' },
    { frontendPermissionApi: 'savedSearchAlertsApi.delete.DELETE', backendPermissionKey: 'backend.PropertiesController.deleteAlert.DELETE', module: 'properties' },

    // ─── Property Groups ───────────────────────────────────────────────
    { frontendPermissionApi: 'groupsApi.getAll.GET', backendPermissionKey: 'backend.PropertyGroupsController.findAll.GET', module: 'property_groups' },
    { frontendPermissionApi: 'groupsApi.getOne.GET', backendPermissionKey: 'backend.PropertyGroupsController.findOne.GET', module: 'property_groups' },
    { frontendPermissionApi: 'groupsApi.create.POST', backendPermissionKey: 'backend.PropertyGroupsController.create.POST', module: 'property_groups' },
    { frontendPermissionApi: 'groupsApi.update.PUT', backendPermissionKey: 'backend.PropertyGroupsController.update.PUT', module: 'property_groups' },
    { frontendPermissionApi: 'groupsApi.remove.DELETE', backendPermissionKey: 'backend.PropertyGroupsController.remove.DELETE', module: 'property_groups' },
    { frontendPermissionApi: 'groupsApi.getProperties.GET', backendPermissionKey: 'backend.PropertyGroupsController.getGroupProperties.GET', module: 'property_groups' },
    { frontendPermissionApi: 'groupsApi.addProperty.POST', backendPermissionKey: 'backend.PropertyGroupsController.addProperty.POST', module: 'property_groups' },
    { frontendPermissionApi: 'groupsApi.removeProperty.DELETE', backendPermissionKey: 'backend.PropertyGroupsController.removeProperty.DELETE', module: 'property_groups' },

    // ─── Bookings ──────────────────────────────────────────────────────
    { frontendPermissionApi: 'bookingsApi.create.POST', backendPermissionKey: 'backend.BookingsController.create.POST', module: 'bookings' },
    { frontendPermissionApi: 'bookingsApi.getHostBookings.GET', backendPermissionKey: 'backend.BookingsController.findAll.GET', module: 'bookings' },
    { frontendPermissionApi: 'bookingsApi.getOne.GET', backendPermissionKey: 'backend.BookingsController.findOne.GET', module: 'bookings' },
    { frontendPermissionApi: 'bookingsApi.getMyBookings.GET', backendPermissionKey: 'backend.BookingsController.getMyBookings.GET', module: 'bookings' },
    { frontendPermissionApi: 'bookingsApi.cancel.PUT', backendPermissionKey: 'backend.BookingsController.updateStatus.PUT', module: 'bookings' },
    { frontendPermissionApi: 'bookingsApi.accept.PUT', backendPermissionKey: 'backend.BookingsController.accept.PUT', module: 'bookings' },
    { frontendPermissionApi: 'bookingsApi.decline.PUT', backendPermissionKey: 'backend.BookingsController.decline.PUT', module: 'bookings' },
    { frontendPermissionApi: 'bookingsApi.counterOffer.PUT', backendPermissionKey: 'backend.BookingsController.counterOffer.PUT', module: 'bookings' },
    { frontendPermissionApi: 'bookingsApi.checkAvailability.GET', backendPermissionKey: 'backend.BookingsController.checkAvailability.GET', module: 'bookings' },

    // ─── Tourism Services ──────────────────────────────────────────────
    { frontendPermissionApi: 'tourismServicesApi.getAll.GET', backendPermissionKey: 'backend.TourismServicesController.findAll.GET', module: 'services' },
    { frontendPermissionApi: 'tourismServicesApi.getById.GET', backendPermissionKey: 'backend.TourismServicesController.findOne.GET', module: 'services' },
    { frontendPermissionApi: 'tourismServicesApi.create.POST', backendPermissionKey: 'backend.TourismServicesController.create.POST', module: 'services' },
    { frontendPermissionApi: 'tourismServicesApi.update.PUT', backendPermissionKey: 'backend.TourismServicesController.update.PUT', module: 'services' },
    { frontendPermissionApi: 'tourismServicesApi.delete.DELETE', backendPermissionKey: 'backend.TourismServicesController.remove.DELETE', module: 'services' },
    { frontendPermissionApi: 'tourismServicesApi.getCategories.GET', backendPermissionKey: 'backend.TourismServicesController.getCategories.GET', module: 'services' },
    { frontendPermissionApi: 'tourismServicesApi.uploadDocument.POST', backendPermissionKey: 'backend.TourismServicesController.uploadDocument.POST', module: 'services' },
    { frontendPermissionApi: 'tourismServicesApi.getDocuments.GET', backendPermissionKey: 'backend.TourismServicesController.getDocuments.GET', module: 'services' },

    // ─── Service Bookings ──────────────────────────────────────────────
    { frontendPermissionApi: 'serviceBookingsApi.create.POST', backendPermissionKey: 'backend.ServiceBookingsController.create.POST', module: 'service_bookings' },
    { frontendPermissionApi: 'serviceBookingsApi.getMyBookings.GET', backendPermissionKey: 'backend.ServiceBookingsController.getMyBookings.GET', module: 'service_bookings' },
    { frontendPermissionApi: 'serviceBookingsApi.getProviderBookings.GET', backendPermissionKey: 'backend.ServiceBookingsController.getProviderBookings.GET', module: 'service_bookings' },
    { frontendPermissionApi: 'serviceBookingsApi.getOne.GET', backendPermissionKey: 'backend.ServiceBookingsController.getOne.GET', module: 'service_bookings' },
    { frontendPermissionApi: 'serviceBookingsApi.accept.PUT', backendPermissionKey: 'backend.ServiceBookingsController.accept.PUT', module: 'service_bookings' },
    { frontendPermissionApi: 'serviceBookingsApi.decline.PUT', backendPermissionKey: 'backend.ServiceBookingsController.decline.PUT', module: 'service_bookings' },
    { frontendPermissionApi: 'serviceBookingsApi.cancel.PUT', backendPermissionKey: 'backend.ServiceBookingsController.cancel.PUT', module: 'service_bookings' },
    { frontendPermissionApi: 'serviceBookingsApi.getAvailability.GET', backendPermissionKey: 'backend.ServiceBookingsController.getAvailability.GET', module: 'service_bookings' },
    { frontendPermissionApi: 'serviceBookingsApi.setAvailability.POST', backendPermissionKey: 'backend.ServiceBookingsController.setAvailability.POST', module: 'service_bookings' },
    { frontendPermissionApi: 'serviceBookingsApi.bulkSetAvailability.POST', backendPermissionKey: 'backend.ServiceBookingsController.bulkSetAvailability.POST', module: 'service_bookings' },

    // ─── Service Groups ────────────────────────────────────────────────
    { frontendPermissionApi: 'serviceGroupsApi.getAll.GET', backendPermissionKey: 'backend.ServiceGroupsController.findAll.GET', module: 'service_groups' },
    { frontendPermissionApi: 'serviceGroupsApi.getOne.GET', backendPermissionKey: 'backend.ServiceGroupsController.findOne.GET', module: 'service_groups' },
    { frontendPermissionApi: 'serviceGroupsApi.create.POST', backendPermissionKey: 'backend.ServiceGroupsController.create.POST', module: 'service_groups' },
    { frontendPermissionApi: 'serviceGroupsApi.update.PUT', backendPermissionKey: 'backend.ServiceGroupsController.update.PUT', module: 'service_groups' },
    { frontendPermissionApi: 'serviceGroupsApi.remove.DELETE', backendPermissionKey: 'backend.ServiceGroupsController.remove.DELETE', module: 'service_groups' },
    { frontendPermissionApi: 'serviceGroupsApi.getServices.GET', backendPermissionKey: 'backend.ServiceGroupsController.getServices.GET', module: 'service_groups' },
    { frontendPermissionApi: 'serviceGroupsApi.addService.POST', backendPermissionKey: 'backend.ServiceGroupsController.addService.POST', module: 'service_groups' },
    { frontendPermissionApi: 'serviceGroupsApi.removeService.DELETE', backendPermissionKey: 'backend.ServiceGroupsController.removeService.DELETE', module: 'service_groups' },

    // ─── Reviews ───────────────────────────────────────────────────────
    { frontendPermissionApi: 'reviewsApi.getByProperty.GET', backendPermissionKey: 'backend.ReviewsController.findByProperty.GET', module: 'reviews' },
    { frontendPermissionApi: 'reviewsApi.getOne.GET', backendPermissionKey: 'backend.ReviewsController.findOne.GET', module: 'reviews' },
    { frontendPermissionApi: 'reviewsApi.create.POST', backendPermissionKey: 'backend.ReviewsController.create.POST', module: 'reviews' },
    { frontendPermissionApi: 'reviewsApi.replyToReview.POST', backendPermissionKey: 'backend.ReviewsController.reply.POST', module: 'reviews' },

    // ─── Comments ──────────────────────────────────────────────────────
    { frontendPermissionApi: 'commentsApi.getComments.GET', backendPermissionKey: 'backend.CommentsController.getComments.GET', module: 'comments' },
    { frontendPermissionApi: 'commentsApi.getReplies.GET', backendPermissionKey: 'backend.CommentsController.getReplies.GET', module: 'comments' },
    { frontendPermissionApi: 'commentsApi.create.POST', backendPermissionKey: 'backend.CommentsController.createComment.POST', module: 'comments' },
    { frontendPermissionApi: 'commentsApi.update.PUT', backendPermissionKey: 'backend.CommentsController.updateComment.PUT', module: 'comments' },
    { frontendPermissionApi: 'commentsApi.delete.DELETE', backendPermissionKey: 'backend.CommentsController.deleteComment.DELETE', module: 'comments' },

    // ─── Reactions ─────────────────────────────────────────────────────
    { frontendPermissionApi: 'reactionsApi.get.GET', backendPermissionKey: 'backend.ReactionsController.getReactions.GET', module: 'reactions' },
    { frontendPermissionApi: 'reactionsApi.toggle.POST', backendPermissionKey: 'backend.ReactionsController.toggleReaction.POST', module: 'reactions' },
    { frontendPermissionApi: 'reactionsApi.remove.DELETE', backendPermissionKey: 'backend.ReactionsController.removeReaction.DELETE', module: 'reactions' },

    // ─── Favorites ─────────────────────────────────────────────────────
    { frontendPermissionApi: 'favoritesApi.getMyFavorites.GET', backendPermissionKey: 'backend.FavoritesController.findMyFavorites.GET', module: 'favorites' },
    { frontendPermissionApi: 'favoritesApi.checkFavorite.GET', backendPermissionKey: 'backend.FavoritesController.checkFavorite.GET', module: 'favorites' },
    { frontendPermissionApi: 'favoritesApi.toggle.POST', backendPermissionKey: 'backend.FavoritesController.toggle.POST', module: 'favorites' },
    { frontendPermissionApi: 'favoritesApi.remove.DELETE', backendPermissionKey: 'backend.FavoritesController.remove.DELETE', module: 'favorites' },

    // ─── Payments ──────────────────────────────────────────────────────
    { frontendPermissionApi: 'paymentsApi.getTransferAccounts.GET', backendPermissionKey: 'backend.PaymentsController.getTransferAccounts.GET', module: 'payments' },
    { frontendPermissionApi: 'paymentsApi.getAllTransferAccounts.GET', backendPermissionKey: 'backend.PaymentsController.getAllTransferAccounts.GET', module: 'payments' },
    { frontendPermissionApi: 'paymentsApi.upsertTransferAccount.POST', backendPermissionKey: 'backend.PaymentsController.upsertTransferAccount.POST', module: 'payments' },
    { frontendPermissionApi: 'paymentsApi.deleteTransferAccount.DELETE', backendPermissionKey: 'backend.PaymentsController.deleteTransferAccount.DELETE', module: 'payments' },
    { frontendPermissionApi: 'paymentsApi.uploadReceipt.POST', backendPermissionKey: 'backend.PaymentsController.uploadReceipt.POST', module: 'payments' },
    { frontendPermissionApi: 'paymentsApi.getPendingReceipts.GET', backendPermissionKey: 'backend.PaymentsController.getPendingReceipts.GET', module: 'payments' },
    { frontendPermissionApi: 'paymentsApi.getReceiptsByBooking.GET', backendPermissionKey: 'backend.PaymentsController.getReceiptsByBooking.GET', module: 'payments' },
    { frontendPermissionApi: 'paymentsApi.approveReceipt.PUT', backendPermissionKey: 'backend.PaymentsController.approveReceipt.PUT', module: 'payments' },
    { frontendPermissionApi: 'paymentsApi.rejectReceipt.PUT', backendPermissionKey: 'backend.PaymentsController.rejectReceipt.PUT', module: 'payments' },
    { frontendPermissionApi: 'paymentsApi.createPaymentIntent.POST', backendPermissionKey: 'backend.PaymentsController.createPaymentIntent.POST', module: 'payments' },

    // ─── Dashboard ─────────────────────────────────────────────────────
    { frontendPermissionApi: 'dashboardApi.getDashboard.GET', backendPermissionKey: 'backend.DashboardController.getDashboard.GET', module: 'dashboard' },
    { frontendPermissionApi: 'statsApi.getDashboardStats.GET', backendPermissionKey: 'backend.RolesController.getStats.GET', module: 'dashboard' },

    // ─── Metrics ───────────────────────────────────────────────────────
    { frontendPermissionApi: 'metricsApi.getUsers.GET', backendPermissionKey: 'backend.MetricsController.getUsers.GET', module: 'metrics' },
    { frontendPermissionApi: 'metricsApi.getBookings.GET', backendPermissionKey: 'backend.MetricsController.getBookings.GET', module: 'metrics' },
    { frontendPermissionApi: 'metricsApi.getProperties.GET', backendPermissionKey: 'backend.MetricsController.getProperties.GET', module: 'metrics' },
    { frontendPermissionApi: 'metricsApi.getServices.GET', backendPermissionKey: 'backend.MetricsController.getServices.GET', module: 'metrics' },
    { frontendPermissionApi: 'metricsApi.getRevenue.GET', backendPermissionKey: 'backend.MetricsController.getRevenue.GET', module: 'metrics' },
    { frontendPermissionApi: 'metricsApi.getSummary.GET', backendPermissionKey: 'backend.MetricsController.getSummary.GET', module: 'metrics' },

    // ─── Hyper Management ──────────────────────────────────────────────
    { frontendPermissionApi: 'hyperManagementApi.pauseProperty.PUT', backendPermissionKey: 'backend.HyperManagementController.pauseProperty.PUT', module: 'hyper_management' },
    { frontendPermissionApi: 'hyperManagementApi.resumeProperty.PUT', backendPermissionKey: 'backend.HyperManagementController.resumeProperty.PUT', module: 'hyper_management' },
    { frontendPermissionApi: 'hyperManagementApi.archiveProperty.DELETE', backendPermissionKey: 'backend.HyperManagementController.archiveProperty.DELETE', module: 'hyper_management' },
    { frontendPermissionApi: 'hyperManagementApi.deleteProperty.DELETE', backendPermissionKey: 'backend.HyperManagementController.deleteProperty.DELETE', module: 'hyper_management' },
    { frontendPermissionApi: 'hyperManagementApi.pauseService.PUT', backendPermissionKey: 'backend.HyperManagementController.pauseService.PUT', module: 'hyper_management' },
    { frontendPermissionApi: 'hyperManagementApi.resumeService.PUT', backendPermissionKey: 'backend.HyperManagementController.resumeService.PUT', module: 'hyper_management' },
    { frontendPermissionApi: 'hyperManagementApi.archiveService.DELETE', backendPermissionKey: 'backend.HyperManagementController.archiveService.DELETE', module: 'hyper_management' },
    { frontendPermissionApi: 'hyperManagementApi.deleteService.DELETE', backendPermissionKey: 'backend.HyperManagementController.deleteService.DELETE', module: 'hyper_management' },
    { frontendPermissionApi: 'hyperManagementApi.pauseUser.PUT', backendPermissionKey: 'backend.HyperManagementController.pauseUser.PUT', module: 'hyper_management' },
    { frontendPermissionApi: 'hyperManagementApi.resumeUser.PUT', backendPermissionKey: 'backend.HyperManagementController.resumeUser.PUT', module: 'hyper_management' },
    { frontendPermissionApi: 'hyperManagementApi.archiveUser.DELETE', backendPermissionKey: 'backend.HyperManagementController.archiveUser.DELETE', module: 'hyper_management' },
    { frontendPermissionApi: 'hyperManagementApi.reactivateUser.PUT', backendPermissionKey: 'backend.HyperManagementController.reactivateUser.PUT', module: 'hyper_management' },

    // ─── Document Validation ──────────────────────────────────────────
    { frontendPermissionApi: 'documentsApi.getPending.GET', backendPermissionKey: 'backend.DocumentValidationController.getPendingDocuments.GET', module: 'document_validation' },
    { frontendPermissionApi: 'documentsApi.submitForValidation.POST', backendPermissionKey: 'backend.DocumentValidationController.submitForValidation.POST', module: 'document_validation' },
    { frontendPermissionApi: 'documentsApi.approve.PUT', backendPermissionKey: 'backend.DocumentValidationController.approveDocument.PUT', module: 'document_validation' },
    { frontendPermissionApi: 'documentsApi.reject.PUT', backendPermissionKey: 'backend.DocumentValidationController.rejectDocument.PUT', module: 'document_validation' },
    // { frontendPermissionApi: 'documentsApi.upload.POST', backendPermissionKey: 'backend.DocumentValidationController.uploadDocument.POST', module: 'document_validation' },
    // { frontendPermissionApi: 'documentsApi.getByProperty.GET', backendPermissionKey: 'backend.DocumentValidationController.getByProperty.GET', module: 'document_validation' },

    // ─── Service Fees ─────────────────────────────────────────────────
    { frontendPermissionApi: 'serviceFeesApi.getAll.GET', backendPermissionKey: 'backend.ServiceFeeController.getAll.GET', module: 'service_fees' },
    { frontendPermissionApi: 'serviceFeesApi.create.POST', backendPermissionKey: 'backend.ServiceFeeController.create.POST', module: 'service_fees' },
    { frontendPermissionApi: 'serviceFeesApi.update.PUT', backendPermissionKey: 'backend.ServiceFeeController.update.PUT', module: 'service_fees' },
    { frontendPermissionApi: 'serviceFeesApi.remove.DELETE', backendPermissionKey: 'backend.ServiceFeeController.remove.DELETE', module: 'service_fees' },

    // ─── Cancellation Rules ───────────────────────────────────────────
    { frontendPermissionApi: 'cancellationRulesApi.getMine.GET', backendPermissionKey: 'backend.CancellationRuleController.getMine.GET', module: 'cancellation_rules' },
    { frontendPermissionApi: 'cancellationRulesApi.getAll.GET', backendPermissionKey: 'backend.CancellationRuleController.getAll.GET', module: 'cancellation_rules' },
    { frontendPermissionApi: 'cancellationRulesApi.getForHost.GET', backendPermissionKey: 'backend.CancellationRuleController.getForHost.GET', module: 'cancellation_rules' },
    { frontendPermissionApi: 'cancellationRulesApi.create.POST', backendPermissionKey: 'backend.CancellationRuleController.create.POST', module: 'cancellation_rules' },
    { frontendPermissionApi: 'cancellationRulesApi.update.PUT', backendPermissionKey: 'backend.CancellationRuleController.update.PUT', module: 'cancellation_rules' },
    { frontendPermissionApi: 'cancellationRulesApi.remove.DELETE', backendPermissionKey: 'backend.CancellationRuleController.remove.DELETE', module: 'cancellation_rules' },

    // ─── Host Fee Absorption ──────────────────────────────────────────
    { frontendPermissionApi: 'hostFeeAbsorptionApi.getMine.GET', backendPermissionKey: 'backend.HostFeeAbsorptionController.getMyAbsorptions.GET', module: 'fee_absorption' },
    { frontendPermissionApi: 'hostFeeAbsorptionApi.getForHost.GET', backendPermissionKey: 'backend.HostFeeAbsorptionController.getForHost.GET', module: 'fee_absorption' },
    { frontendPermissionApi: 'hostFeeAbsorptionApi.create.POST', backendPermissionKey: 'backend.HostFeeAbsorptionController.create.POST', module: 'fee_absorption' },
    { frontendPermissionApi: 'hostFeeAbsorptionApi.update.PUT', backendPermissionKey: 'backend.HostFeeAbsorptionController.update.PUT', module: 'fee_absorption' },
    { frontendPermissionApi: 'hostFeeAbsorptionApi.remove.DELETE', backendPermissionKey: 'backend.HostFeeAbsorptionController.remove.DELETE', module: 'fee_absorption' },

    // ─── Payout Accounts ──────────────────────────────────────────────
    { frontendPermissionApi: 'payoutAccountsApi.getMine.GET', backendPermissionKey: 'backend.PayoutAccountController.getMine.GET', module: 'payout_accounts' },
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
    { frontendPermissionApi: 'invitationsApi.getAll.GET', backendPermissionKey: 'backend.InvitationController.getAll.GET', module: 'invitations' },
    { frontendPermissionApi: 'invitationsApi.create.POST', backendPermissionKey: 'backend.InvitationController.create.POST', module: 'invitations' },
    { frontendPermissionApi: 'invitationsApi.cancel.DELETE', backendPermissionKey: 'backend.InvitationController.cancel.DELETE', module: 'invitations' },
    { frontendPermissionApi: 'invitationsApi.resend.POST', backendPermissionKey: 'backend.InvitationController.resend.POST', module: 'invitations' },
    { frontendPermissionApi: 'invitationsApi.convertGuestToUser.POST', backendPermissionKey: 'backend.InvitationController.convertGuestToUser.POST', module: 'invitations' },
    { frontendPermissionApi: 'invitationsApi.updateUserStatus.PUT', backendPermissionKey: 'backend.RolesController.updateUserStatus.PUT', module: 'roles' },
    { frontendPermissionApi: 'invitationsApi.deleteUser.DELETE', backendPermissionKey: 'backend.RolesController.deleteUser.DELETE', module: 'invitations' },

    // ─── Points ────────────────────────────────────────────────────────
    { frontendPermissionApi: 'pointsApi.getMySummary.GET', backendPermissionKey: 'backend.PointsController.getMySummary.GET', module: 'points' },
    { frontendPermissionApi: 'pointsApi.getMyTransactions.GET', backendPermissionKey: 'backend.PointsController.getMyTransactions.GET', module: 'points' },
    { frontendPermissionApi: 'pointsApi.getLeaderboard.GET', backendPermissionKey: 'backend.PointsController.getLeaderboard.GET', module: 'points' },
    { frontendPermissionApi: 'pointsApi.adminAward.POST', backendPermissionKey: 'backend.PointsController.adminAward.POST', module: 'points' },
    { frontendPermissionApi: 'pointsApi.adminDeduct.POST', backendPermissionKey: 'backend.PointsController.adminDeduct.POST', module: 'points' },
    { frontendPermissionApi: 'pointsApi.getUserPoints.GET', backendPermissionKey: 'backend.PointsController.getUserPoints.GET', module: 'points' },

    // ─── Badges ────────────────────────────────────────────────────────
    { frontendPermissionApi: 'badgesApi.getAll.GET', backendPermissionKey: 'backend.BadgeController.getAllBadges.GET', module: 'badges' },
    { frontendPermissionApi: 'badgesApi.getMine.GET', backendPermissionKey: 'backend.BadgeController.getMyBadges.GET', module: 'badges' },
    { frontendPermissionApi: 'badgesApi.getProgress.GET', backendPermissionKey: 'backend.BadgeController.getMyProgress.GET', module: 'badges' },
    { frontendPermissionApi: 'badgesApi.checkUnlocks.POST', backendPermissionKey: 'backend.BadgeController.checkUnlocks.POST', module: 'badges' },

    // ─── Notifications ────────────────────────────────────────────────
    { frontendPermissionApi: 'notificationsApi.getAll.GET', backendPermissionKey: 'backend.NotificationController.get.GET', module: 'notifications' },
    { frontendPermissionApi: 'notificationsApi.getNew.GET', backendPermissionKey: 'backend.NotificationController.getNew.GET', module: 'notifications' },
    { frontendPermissionApi: 'notificationsApi.markRead.PUT', backendPermissionKey: 'backend.NotificationController.markRead.PUT', module: 'notifications' },
    { frontendPermissionApi: 'notificationsApi.markAllRead.PUT', backendPermissionKey: 'backend.NotificationController.markAllRead.PUT', module: 'notifications' },
    { frontendPermissionApi: 'notificationsApi.delete.DELETE', backendPermissionKey: 'backend.NotificationController.delete.DELETE', module: 'notifications' },

    // ─── Referrals ────────────────────────────────────────────────────
    { frontendPermissionApi: 'referralsApi.getMyCode.GET', backendPermissionKey: 'backend.ReferralController.getMyCode.GET', module: 'referrals' },
    { frontendPermissionApi: 'referralsApi.create.POST', backendPermissionKey: 'backend.ReferralController.createReferral.POST', module: 'referrals' },
    { frontendPermissionApi: 'referralsApi.getMyReferrals.GET', backendPermissionKey: 'backend.ReferralController.getMyReferrals.GET', module: 'referrals' },
    { frontendPermissionApi: 'referralsApi.getStats.GET', backendPermissionKey: 'backend.ReferralController.getMyStats.GET', module: 'referrals' },
    { frontendPermissionApi: 'referralsApi.completeSignup.POST', backendPermissionKey: 'backend.ReferralController.completeSignup.POST', module: 'referrals' },
    { frontendPermissionApi: 'referralsApi.shareProperty.POST', backendPermissionKey: 'backend.ReferralController.shareProperty.POST', module: 'referrals' },
    { frontendPermissionApi: 'referralsApi.getShareStats.GET', backendPermissionKey: 'backend.ReferralController.getShareStats.GET', module: 'referrals' },
    { frontendPermissionApi: 'referralsApi.getScoped.GET', backendPermissionKey: 'backend.ReferralController.getScopedReferrals.GET', module: 'referrals' },

    // ─── Chat ─────────────────────────────────────────────────────────
    // { frontendPermissionApi: 'chatApi.getConversation.GET', backendPermissionKey: 'backend.ChatController.getConversation.GET', module: 'chat' },
    // { frontendPermissionApi: 'chatApi.sendMessage.POST', backendPermissionKey: 'backend.ChatController.sendMessage.POST', module: 'chat' },
    // { frontendPermissionApi: 'chatApi.getMessages.GET', backendPermissionKey: 'backend.ChatController.getMessages.GET', module: 'chat' },

    // ─── Support Chat ─────────────────────────────────────────────────
    { frontendPermissionApi: 'supportApi.createThread.POST', backendPermissionKey: 'backend.SupportChatController.createThread.POST', module: 'support' },
    { frontendPermissionApi: 'supportApi.getMyThreads.GET', backendPermissionKey: 'backend.SupportChatController.getMyThreads.GET', module: 'support' },
    { frontendPermissionApi: 'supportApi.getAdminThreads.GET', backendPermissionKey: 'backend.SupportChatController.getAdminThreads.GET', module: 'support' },
    { frontendPermissionApi: 'supportApi.getThread.GET', backendPermissionKey: 'backend.SupportChatController.getThread.GET', module: 'support' },
    { frontendPermissionApi: 'supportApi.getMessages.GET', backendPermissionKey: 'backend.SupportChatController.getMessages.GET', module: 'support' },
    { frontendPermissionApi: 'supportApi.sendMessage.POST', backendPermissionKey: 'backend.SupportChatController.sendMessage.POST', module: 'support' },
    { frontendPermissionApi: 'supportApi.updateStatus.PATCH', backendPermissionKey: 'backend.SupportChatController.updateStatus.PATCH', module: 'support' },
    { frontendPermissionApi: 'supportApi.assignThread.PATCH', backendPermissionKey: 'backend.SupportChatController.assignThread.PATCH', module: 'support' },
    { frontendPermissionApi: 'supportApi.markRead.POST', backendPermissionKey: 'backend.SupportChatController.markRead.POST', module: 'support' },

    // ─── Rankings ─────────────────────────────────────────────────────
    { frontendPermissionApi: 'rankingsApi.getRankings.GET', backendPermissionKey: 'backend.RankingsController.getRankings.GET', module: 'rankings' },
    { frontendPermissionApi: 'rankingsApi.getMyRank.GET', backendPermissionKey: 'backend.RankingsController.getMyRank.GET', module: 'rankings' },

    // ─── Profiles ─────────────────────────────────────────────────────
    { frontendPermissionApi: 'profilesApi.findMyProfile.GET', backendPermissionKey: 'backend.ProfilesController.findMyProfile.GET', module: 'profiles' },
    { frontendPermissionApi: 'profilesApi.updateMyProfile.PUT', backendPermissionKey: 'backend.ProfilesController.updateMyProfile.PUT', module: 'profiles' },

    // ─── Settings ─────────────────────────────────────────────────────
    { frontendPermissionApi: 'settingsApi.getSettings.GET', backendPermissionKey: 'backend.SettingsController.getSettings.GET', module: 'settings' },
    { frontendPermissionApi: 'settingsApi.updatePreferences.PUT', backendPermissionKey: 'backend.SettingsController.updatePreferences.PUT', module: 'settings' },
    { frontendPermissionApi: 'settingsApi.updateNotifications.PUT', backendPermissionKey: 'backend.SettingsController.updateNotifications.PUT', module: 'settings' },
    { frontendPermissionApi: 'settingsApi.updateAccount.PUT', backendPermissionKey: 'backend.SettingsController.updateAccount.PUT', module: 'settings' },
    { frontendPermissionApi: 'settingsApi.changePassword.PUT', backendPermissionKey: 'backend.SettingsController.changePassword.PUT', module: 'settings' },

    // ─── RBAC Config ──────────────────────────────────────────────────
    { frontendPermissionApi: 'rbacConfigApi.getBackendPermissions.GET', backendPermissionKey: 'backend.RbacConfigController.listBackend.GET', module: 'rbac' },
    { frontendPermissionApi: 'rbacConfigApi.updateBackendPermission.PUT', backendPermissionKey: 'backend.RbacConfigController.updateBackend.PUT', module: 'rbac' },
    { frontendPermissionApi: 'rbacConfigApi.createBackendPermission.POST', backendPermissionKey: 'backend.RbacConfigController.createBackend.POST', module: 'rbac' },
    { frontendPermissionApi: 'rbacConfigApi.reloadCache.POST', backendPermissionKey: 'backend.RbacConfigController.reloadCache.POST', module: 'rbac' },
    { frontendPermissionApi: 'rbacConfigApi.getFrontendPermissions.GET', backendPermissionKey: 'backend.RbacConfigController.listFrontend.GET', module: 'rbac' },
    { frontendPermissionApi: 'rbacConfigApi.updateFrontendPermission.PUT', backendPermissionKey: 'backend.RbacConfigController.updateFrontend.PUT', module: 'rbac' },
    { frontendPermissionApi: 'rbacConfigApi.createFrontendPermission.POST', backendPermissionKey: 'backend.RbacConfigController.createFrontend.POST', module: 'rbac' },

    // ─── Roles ────────────────────────────────────────────────────────
    { frontendPermissionApi: 'rolesApi.getUserRoles.GET', backendPermissionKey: 'backend.RolesController.getUserRoles.GET', module: 'roles' },
    { frontendPermissionApi: 'rolesApi.assignRole.POST', backendPermissionKey: 'backend.RolesController.assignRole.POST', module: 'roles' },
    { frontendPermissionApi: 'rolesApi.removeRole.DELETE', backendPermissionKey: 'backend.RolesController.removeRole.DELETE', module: 'roles' },
    { frontendPermissionApi: 'rolesApi.getAllUsers.GET', backendPermissionKey: 'backend.RolesController.getAllUsers.GET', module: 'roles' },

    // ─── Assignments ──────────────────────────────────────────────────
    { frontendPermissionApi: 'assignmentsApi.getAll.GET', backendPermissionKey: 'backend.RolesController.getAllAssignments.GET', module: 'assignments' },
    { frontendPermissionApi: 'assignmentsApi.create.POST', backendPermissionKey: 'backend.RolesController.assignManager.POST', module: 'assignments' },
    { frontendPermissionApi: 'assignmentsApi.remove.DELETE', backendPermissionKey: 'backend.RolesController.removeAssignment.DELETE', module: 'assignments' },
    { frontendPermissionApi: 'assignmentsApi.getPermissions.GET', backendPermissionKey: 'backend.RolesController.getManagerPermissions.GET', module: 'assignments' },
    { frontendPermissionApi: 'assignmentsApi.setPermissions.POST', backendPermissionKey: 'backend.RolesController.setManagerPermissions.POST', module: 'assignments' },

    // ─── Rewards ──────────────────────────────────────────────────────
    { frontendPermissionApi: 'rewardsApi.getShop.GET', backendPermissionKey: 'backend.RewardsController.getShop.GET', module: 'rewards' },
    { frontendPermissionApi: 'rewardsApi.getAll.GET', backendPermissionKey: 'backend.RewardsController.getAll.GET', module: 'rewards' },
    { frontendPermissionApi: 'rewardsApi.getById.GET', backendPermissionKey: 'backend.RewardsController.getById.GET', module: 'rewards' },
    { frontendPermissionApi: 'rewardsApi.create.POST', backendPermissionKey: 'backend.RewardsController.create.POST', module: 'rewards' },
    { frontendPermissionApi: 'rewardsApi.update.PUT', backendPermissionKey: 'backend.RewardsController.update.PUT', module: 'rewards' },
    { frontendPermissionApi: 'rewardsApi.remove.DELETE', backendPermissionKey: 'backend.RewardsController.remove.DELETE', module: 'rewards' },
    { frontendPermissionApi: 'rewardsApi.redeem.POST', backendPermissionKey: 'backend.RewardsController.redeem.POST', module: 'rewards' },
    { frontendPermissionApi: 'rewardsApi.getMyRedemptions.GET', backendPermissionKey: 'backend.RewardsController.getMyRedemptions.GET', module: 'rewards' },
    { frontendPermissionApi: 'rewardsApi.useRedemption.POST', backendPermissionKey: 'backend.RewardsController.useRedemption.POST', module: 'rewards' },
    { frontendPermissionApi: 'rewardsApi.cancelRedemption.DELETE', backendPermissionKey: 'backend.RewardsController.cancelRedemption.DELETE', module: 'rewards' },
    { frontendPermissionApi: 'rewardsApi.getAllRedemptions.GET', backendPermissionKey: 'backend.RewardsController.getAllRedemptions.GET', module: 'rewards' },

    // ─── Trust Recalculation ──────────────────────────────────────────
    { frontendPermissionApi: 'trustApi.recalculate.PUT', backendPermissionKey: 'backend.PropertiesController.recalculateTrust.PUT', module: 'properties' },

    // ─── Email Tracking ───────────────────────────────────────────────
    { frontendPermissionApi: 'emailTrackingApi.getAnalytics.GET', backendPermissionKey: 'backend.EmailTrackingController.getAnalytics.GET', module: 'email_tracking' },

    // ─── Permission Bindings (meta) ───────────────────────────────────
    { frontendPermissionApi: 'permissionBindingsApi.getAll.GET', backendPermissionKey: 'backend.PermissionBindingController.findAll.GET', module: 'rbac' },
    { frontendPermissionApi: 'permissionBindingsApi.getBindingMap.GET', backendPermissionKey: 'backend.PermissionBindingController.getBindingMap.GET', module: 'rbac' },
    { frontendPermissionApi: 'permissionBindingsApi.create.POST', backendPermissionKey: 'backend.PermissionBindingController.create.POST', module: 'rbac' },
    { frontendPermissionApi: 'permissionBindingsApi.remove.DELETE', backendPermissionKey: 'backend.PermissionBindingController.remove.DELETE', module: 'rbac' },

    // ─── Auth ─────────────────────────────────────────────────────────
    { frontendPermissionApi: 'authApi.login.POST', backendPermissionKey: 'backend.AuthController.login.POST', module: 'auth' },
    { frontendPermissionApi: 'authApi.logout.POST', backendPermissionKey: 'backend.AuthController.logout.POST', module: 'auth' },
    { frontendPermissionApi: 'authApi.register.POST', backendPermissionKey: 'backend.AuthController.registerUser.POST', module: 'auth' },
    { frontendPermissionApi: 'authApi.refresh.POST', backendPermissionKey: 'backend.AuthController.refresh.POST', module: 'auth' },
    { frontendPermissionApi: 'authApi.getProfile.POST', backendPermissionKey: 'backend.AuthController.getProfile.POST', module: 'auth' },

    // ─── User ─────────────────────────────────────────────────────────
    { frontendPermissionApi: 'userApi.updateLanguage.PUT', backendPermissionKey: 'backend.UserController.updateLanguage.PUT', module: 'user' },
    { frontendPermissionApi: 'userApi.updateAvatar.PUT', backendPermissionKey: 'backend.UserController.uploadAvatar.POST', module: 'user' },
    { frontendPermissionApi: 'userApi.completeProfile.PUT', backendPermissionKey: 'backend.UserController.completeProfile.POST', module: 'user' },
  ];

// ─── UI Permission Key → Frontend API Cross-Reference ────────────────────────
// Maps each UI element (button, icon, page) to the API calls it triggers.
// This enables canActionWithApis(uiKey, ...apiKeys) checks in the frontend.

export const UI_TO_API_MAP: Record<string, string[]> = {
  // ═══ PROPERTY PAGES ═══
  [generateUiPermissionKey('PropertyListPage', undefined, 'Page', 'View')]: ['propertiesApi.getAll.GET'],
  [generateUiPermissionKey('PropertyListPage', 'Header', 'Button', 'Add')]: ['propertiesApi.create.POST'],
  [generateUiPermissionKey('PropertyListPage', 'Card', 'Button', 'Edit')]: ['propertiesApi.update.PUT', 'propertiesApi.updatePrices.PUT', 'propertiesApi.updatePhotos.PUT'],
  [generateUiPermissionKey('PropertyListPage', 'Card', 'Button', 'Delete')]: ['propertiesApi.delete.DELETE'],
  [generateUiPermissionKey('PropertyListPage', 'Card', 'Button', 'Pause')]: ['propertiesApi.update.PUT'],
  [generateUiPermissionKey('PropertyListPage', 'Card', 'Button', 'Duplicate')]: ['propertiesApi.create.POST'],

  [generateUiPermissionKey('PropertyDetailPage', undefined, 'Page', 'View')]: ['propertiesApi.getById.GET', 'propertiesApi.getAvailability.GET'],
  [generateUiPermissionKey('PropertyDetailPage', 'Actions', 'Button', 'Edit')]: ['propertiesApi.update.PUT'],
  [generateUiPermissionKey('PropertyDetailPage', 'Actions', 'Button', 'Delete')]: ['propertiesApi.delete.DELETE'],
  [generateUiPermissionKey('PropertyDetailPage', 'Actions', 'Button', 'Pause')]: ['propertiesApi.update.PUT'],
  [generateUiPermissionKey('PropertyDetailPage', 'Actions', 'Button', 'Duplicate')]: ['propertiesApi.create.POST'],
  [generateUiPermissionKey('PropertyDetailPage', 'Actions', 'Button', 'Share')]: ['referralsApi.shareProperty.POST'],
  [generateUiPermissionKey('PropertyDetailPage', 'Actions', 'Button', 'Favorite')]: ['favoritesApi.toggle.POST'],
  [generateUiPermissionKey('PropertyDetailPage', 'Booking', 'Modal', 'Open')]: ['bookingsApi.checkAvailability.GET', 'bookingsApi.create.POST'],
  [generateUiPermissionKey('PropertyDetailPage', 'Reviews', 'Section', 'View')]: ['reviewsApi.getByProperty.GET'],
  [generateUiPermissionKey('PropertyDetailPage', 'Reviews', 'Button', 'Add')]: ['reviewsApi.create.POST'],
  [generateUiPermissionKey('PropertyDetailPage', 'Comments', 'Section', 'View')]: ['commentsApi.getComments.GET'],
  [generateUiPermissionKey('PropertyDetailPage', 'Comments', 'Button', 'Add')]: ['commentsApi.create.POST'],
  [generateUiPermissionKey('PropertyDetailPage', 'PromoAlerts', 'Button', 'Subscribe')]: ['propertiesApi.subscribePromoAlert.POST'],
  [generateUiPermissionKey('PropertyDetailPage', 'PromoAlerts', 'Button', 'Unsubscribe')]: ['propertiesApi.unsubscribePromoAlert.DELETE'],
  [generateUiPermissionKey('PropertyDetailPage', 'Documents', 'Section', 'View')]: ['documentsApi.getByProperty.GET'],
  [generateUiPermissionKey('PropertyDetailPage', 'Documents', 'Button', 'Upload')]: ['documentsApi.upload.POST'],
  [generateUiPermissionKey('PropertyDetailPage', 'TrustScore', 'Button', 'Recalculate')]: ['trustApi.recalculate.PUT'],

  [generateUiPermissionKey('AddPropertyWizard', undefined, 'Page', 'View')]: ['propertiesApi.create.POST'],
  [generateUiPermissionKey('AddPropertyWizard', 'Form', 'Button', 'Submit')]: ['propertiesApi.create.POST'],

  // SavedSearchAlerts
  [generateUiPermissionKey('SavedSearchAlerts', undefined, 'Page', 'View')]: ['savedSearchAlertsApi.getAll.GET'],
  [generateUiPermissionKey('SavedSearchAlerts', 'Header', 'Button', 'Create')]: ['savedSearchAlertsApi.create.POST'],
  [generateUiPermissionKey('SavedSearchAlerts', 'Card', 'Button', 'Edit')]: ['savedSearchAlertsApi.update.PUT'],
  [generateUiPermissionKey('SavedSearchAlerts', 'Card', 'Button', 'Delete')]: ['savedSearchAlertsApi.delete.DELETE'],

  // ═══ SERVICE PAGES ═══
  [generateUiPermissionKey('ServiceListPage', undefined, 'Page', 'View')]: ['tourismServicesApi.getAll.GET'],
  [generateUiPermissionKey('ServiceListPage', 'Header', 'Button', 'Add')]: ['tourismServicesApi.create.POST'],
  [generateUiPermissionKey('ServiceListPage', 'Card', 'Button', 'Edit')]: ['tourismServicesApi.update.PUT'],
  [generateUiPermissionKey('ServiceListPage', 'Card', 'Button', 'Delete')]: ['tourismServicesApi.delete.DELETE'],
  [generateUiPermissionKey('ServiceListPage', 'Card', 'Button', 'Pause')]: ['tourismServicesApi.update.PUT'],
  [generateUiPermissionKey('ServiceListPage', 'Card', 'Button', 'Duplicate')]: ['tourismServicesApi.create.POST'],

  [generateUiPermissionKey('ServiceDetailPage', undefined, 'Page', 'View')]: ['tourismServicesApi.getById.GET'],
  [generateUiPermissionKey('ServiceDetailPage', 'Actions', 'Button', 'Edit')]: ['tourismServicesApi.update.PUT'],
  [generateUiPermissionKey('ServiceDetailPage', 'Actions', 'Button', 'Delete')]: ['tourismServicesApi.delete.DELETE'],
  [generateUiPermissionKey('ServiceDetailPage', 'Actions', 'Button', 'Pause')]: ['tourismServicesApi.update.PUT'],
  [generateUiPermissionKey('ServiceDetailPage', 'Actions', 'Button', 'Duplicate')]: ['tourismServicesApi.create.POST'],
  [generateUiPermissionKey('ServiceDetailPage', 'Booking', 'Modal', 'Open')]: ['serviceBookingsApi.getAvailability.GET', 'serviceBookingsApi.create.POST'],
  [generateUiPermissionKey('ServiceDetailPage', 'Documents', 'Section', 'View')]: ['tourismServicesApi.getDocuments.GET'],
  [generateUiPermissionKey('ServiceDetailPage', 'Documents', 'Button', 'Upload')]: ['tourismServicesApi.uploadDocument.POST'],
  [generateUiPermissionKey('ServiceDetailPage', 'Availability', 'Button', 'Set')]: ['serviceBookingsApi.setAvailability.POST'],

  [generateUiPermissionKey('AddServiceWizard', undefined, 'Page', 'View')]: ['tourismServicesApi.create.POST'],
  [generateUiPermissionKey('AddServiceWizard', 'Form', 'Button', 'Submit')]: ['tourismServicesApi.create.POST'],

  // ═══ BOOKING PAGES ═══
  [generateUiPermissionKey('BookingsPage', undefined, 'Tab', 'View')]: ['bookingsApi.getHostBookings.GET'],
  [generateUiPermissionKey('BookingsPage', 'Detail', 'Button', 'Accept')]: ['bookingsApi.accept.PUT'],
  [generateUiPermissionKey('BookingsPage', 'Detail', 'Button', 'Reject')]: ['bookingsApi.decline.PUT'],
  [generateUiPermissionKey('BookingsPage', 'Detail', 'Button', 'CounterOffer')]: ['bookingsApi.counterOffer.PUT'],

  [generateUiPermissionKey('BookingCalendarPage', undefined, 'Page', 'View')]: ['bookingsApi.getHostBookings.GET', 'serviceBookingsApi.getProviderBookings.GET'],

  [generateUiPermissionKey('BookingModal', undefined, 'Modal', 'Open')]: ['bookingsApi.checkAvailability.GET'],
  [generateUiPermissionKey('BookingModal', 'Form', 'Button', 'Submit')]: ['bookingsApi.create.POST'],

  [generateUiPermissionKey('BookingHistory', undefined, 'Page', 'View')]: ['bookingsApi.getMyBookings.GET'],
  [generateUiPermissionKey('BookingHistory', 'Detail', 'Button', 'Cancel')]: ['bookingsApi.cancel.PUT'],

  [generateUiPermissionKey('HostBookings', undefined, 'Page', 'View')]: ['bookingsApi.getHostBookings.GET'],
  [generateUiPermissionKey('HostBookings', 'Actions', 'Button', 'Accept')]: ['bookingsApi.accept.PUT'],
  [generateUiPermissionKey('HostBookings', 'Actions', 'Button', 'Reject')]: ['bookingsApi.decline.PUT'],

  [generateUiPermissionKey('ServiceBookingForm', undefined, 'Modal', 'Open')]: ['serviceBookingsApi.getAvailability.GET'],
  [generateUiPermissionKey('ServiceBookingForm', 'Form', 'Button', 'Submit')]: ['serviceBookingsApi.create.POST'],

  // ═══ DASHBOARD ═══
  [generateUiPermissionKey('Dashboard', undefined, 'Page', 'View')]: ['dashboardApi.getDashboard.GET', 'statsApi.getDashboardStats.GET'],
  [generateUiPermissionKey('Dashboard', 'Analytics', 'Tab', 'View')]: ['metricsApi.getBookings.GET', 'metricsApi.getRevenue.GET', 'metricsApi.getSummary.GET'],
  [generateUiPermissionKey('Dashboard', 'Payments', 'Tab', 'View')]: ['paymentsApi.getPendingReceipts.GET'],

  [generateUiPermissionKey('HyperDashboard', undefined, 'Page', 'View')]: ['dashboardApi.getDashboard.GET', 'metricsApi.getSummary.GET'],
  [generateUiPermissionKey('HyperDashboard', 'PaymentValidation', 'Button', 'Approve')]: ['paymentsApi.approveReceipt.PUT'],
  [generateUiPermissionKey('HyperDashboard', 'PaymentValidation', 'Button', 'Reject')]: ['paymentsApi.rejectReceipt.PUT'],
  [generateUiPermissionKey('HyperDashboard', 'Users', 'Button', 'Pause')]: ['hyperManagementApi.pauseUser.PUT'],
  [generateUiPermissionKey('HyperDashboard', 'Users', 'Button', 'Archive')]: ['hyperManagementApi.archiveUser.DELETE'],
  [generateUiPermissionKey('HyperDashboard', 'Properties', 'Button', 'Pause')]: ['hyperManagementApi.pauseProperty.PUT'],
  [generateUiPermissionKey('HyperDashboard', 'Properties', 'Button', 'Archive')]: ['hyperManagementApi.archiveProperty.DELETE'],
  [generateUiPermissionKey('HyperDashboard', 'Properties', 'Button', 'Delete')]: ['hyperManagementApi.deleteProperty.DELETE'],
  [generateUiPermissionKey('HyperDashboard', 'Services', 'Button', 'Pause')]: ['hyperManagementApi.pauseService.PUT'],
  [generateUiPermissionKey('HyperDashboard', 'Services', 'Button', 'Archive')]: ['hyperManagementApi.archiveService.DELETE'],
  [generateUiPermissionKey('HyperDashboard', 'Verification', 'Button', 'Approve')]: ['documentsApi.approve.PUT'],
  [generateUiPermissionKey('HyperDashboard', 'Verification', 'Button', 'Reject')]: ['documentsApi.reject.PUT'],
  [generateUiPermissionKey('HyperDashboard', 'Assignments', 'Button', 'Create')]: ['assignmentsApi.create.POST'],
  [generateUiPermissionKey('HyperDashboard', 'Assignments', 'Button', 'Delete')]: ['assignmentsApi.remove.DELETE'],

  // ═══ ADMIN / USERS ═══
  [generateUiPermissionKey('UsersPage', undefined, 'Tab', 'View')]: ['rolesApi.getAllUsers.GET'],
  [generateUiPermissionKey('UsersPage', 'List', 'Button', 'Invite')]: ['invitationsApi.create.POST'],
  [generateUiPermissionKey('UsersPage', 'List', 'Button', 'ConvertGuest')]: ['invitationsApi.convertGuestToUser.POST'],
  [generateUiPermissionKey('UsersPage', 'List', 'Button', 'UpdateStatus')]: ['invitationsApi.updateUserStatus.PUT'],
  [generateUiPermissionKey('UsersPage', 'List', 'Button', 'DeleteUser')]: ['invitationsApi.deleteUser.DELETE'],
  [generateUiPermissionKey('UsersPage', 'Detail', 'Button', 'AssignRole')]: ['rolesApi.assignRole.POST'],
  [generateUiPermissionKey('UsersPage', 'Detail', 'Button', 'RemoveRole')]: ['rolesApi.removeRole.DELETE'],
  [generateUiPermissionKey('UsersPage', 'Detail', 'Button', 'ManagePermissions')]: ['assignmentsApi.getPermissions.GET', 'assignmentsApi.setPermissions.POST'],

  // ManagerAssignments
  [generateUiPermissionKey('ManagerAssignments', undefined, 'Page', 'View')]: ['assignmentsApi.getAll.GET', 'assignmentsApi.getPermissions.GET'],
  [generateUiPermissionKey('ManagerAssignments', 'Header', 'Button', 'Create')]: ['assignmentsApi.create.POST'],
  [generateUiPermissionKey('ManagerAssignments', 'List', 'Button', 'Delete')]: ['assignmentsApi.remove.DELETE'],
  [generateUiPermissionKey('ManagerAssignments', 'Detail', 'Button', 'EditPermissions')]: ['assignmentsApi.setPermissions.POST'],

  // RBAC
  [generateUiPermissionKey('RbacSettings', undefined, 'Page', 'View')]: ['rbacConfigApi.getFrontendPermissions.GET', 'rbacConfigApi.getBackendPermissions.GET', 'permissionBindingsApi.getAll.GET'],
  [generateUiPermissionKey('RbacSettings', undefined, 'Page', 'Edit')]: ['rbacConfigApi.updateFrontendPermission.PUT', 'rbacConfigApi.updateBackendPermission.PUT'],
  [generateUiPermissionKey('RbacSettings', 'Actions', 'Button', 'Save')]: ['rbacConfigApi.updateFrontendPermission.PUT', 'rbacConfigApi.updateBackendPermission.PUT'],
  [generateUiPermissionKey('RbacSettings', 'Actions', 'Button', 'ReloadCache')]: ['rbacConfigApi.reloadCache.POST'],

  // ═══ FEES & RULES ═══
  [generateUiPermissionKey('ServiceFeesPage', undefined, 'Page', 'View')]: ['serviceFeesApi.getAll.GET'],
  [generateUiPermissionKey('ServiceFeesPage', 'Header', 'Button', 'Add')]: ['serviceFeesApi.create.POST'],
  [generateUiPermissionKey('ServiceFeesPage', 'Card', 'Button', 'Edit')]: ['serviceFeesApi.update.PUT'],
  [generateUiPermissionKey('ServiceFeesPage', 'Card', 'Button', 'Delete')]: ['serviceFeesApi.remove.DELETE'],

  [generateUiPermissionKey('HostFeeAbsorptionPage', undefined, 'Page', 'View')]: ['hostFeeAbsorptionApi.getMine.GET'],
  [generateUiPermissionKey('HostFeeAbsorptionPage', 'Header', 'Button', 'Add')]: ['hostFeeAbsorptionApi.create.POST'],
  [generateUiPermissionKey('HostFeeAbsorptionPage', 'Card', 'Button', 'Edit')]: ['hostFeeAbsorptionApi.update.PUT'],
  [generateUiPermissionKey('HostFeeAbsorptionPage', 'Card', 'Button', 'Delete')]: ['hostFeeAbsorptionApi.remove.DELETE'],

  [generateUiPermissionKey('CancellationRulesPage', undefined, 'Page', 'View')]: ['cancellationRulesApi.getMine.GET'],
  [generateUiPermissionKey('CancellationRulesPage', 'Header', 'Button', 'Add')]: ['cancellationRulesApi.create.POST'],
  [generateUiPermissionKey('CancellationRulesPage', 'Card', 'Button', 'Edit')]: ['cancellationRulesApi.update.PUT'],
  [generateUiPermissionKey('CancellationRulesPage', 'Card', 'Button', 'Delete')]: ['cancellationRulesApi.remove.DELETE'],

  // ═══ POINTS & REWARDS ═══
  [generateUiPermissionKey('PointsRulesPage', undefined, 'Page', 'View')]: ['pointsRulesApi.getAll.GET'],
  [generateUiPermissionKey('PointsRulesPage', 'Header', 'Button', 'Add')]: ['pointsRulesApi.create.POST'],
  [generateUiPermissionKey('PointsRulesPage', 'Card', 'Button', 'Edit')]: ['pointsRulesApi.update.PUT'],
  [generateUiPermissionKey('PointsRulesPage', 'Card', 'Button', 'Delete')]: ['pointsRulesApi.remove.DELETE'],

  [generateUiPermissionKey('PointsPage', undefined, 'Page', 'View')]: ['pointsApi.getMySummary.GET', 'pointsApi.getMyTransactions.GET'],
  [generateUiPermissionKey('PointsPage', 'Leaderboard', 'Widget', 'View')]: ['pointsApi.getLeaderboard.GET'],
  [generateUiPermissionKey('PointsPage', 'Admin', 'Button', 'Award')]: ['pointsApi.adminAward.POST'],
  [generateUiPermissionKey('PointsPage', 'Admin', 'Button', 'Deduct')]: ['pointsApi.adminDeduct.POST'],

  [generateUiPermissionKey('RewardsPage', undefined, 'Page', 'View')]: ['rewardsApi.getShop.GET', 'rewardsApi.getMyRedemptions.GET'],
  [generateUiPermissionKey('RewardsPage', 'Detail', 'Button', 'Redeem')]: ['rewardsApi.redeem.POST'],
  [generateUiPermissionKey('RewardsPage', 'Admin', 'Button', 'Create')]: ['rewardsApi.create.POST'],
  [generateUiPermissionKey('RewardsPage', 'Admin', 'Button', 'Edit')]: ['rewardsApi.update.PUT'],
  [generateUiPermissionKey('RewardsPage', 'Admin', 'Button', 'Delete')]: ['rewardsApi.remove.DELETE'],
  [generateUiPermissionKey('RewardsPage', 'Redemptions', 'Button', 'Use')]: ['rewardsApi.useRedemption.POST'],
  [generateUiPermissionKey('RewardsPage', 'Redemptions', 'Button', 'Cancel')]: ['rewardsApi.cancelRedemption.DELETE'],

  // ═══ REFERRALS ═══
  [generateUiPermissionKey('ReferralsPage', undefined, 'Page', 'View')]: ['referralsApi.getMyCode.GET', 'referralsApi.getMyReferrals.GET'],
  [generateUiPermissionKey('ReferralsPage', 'Stats', 'Widget', 'View')]: ['referralsApi.getStats.GET'],
  [generateUiPermissionKey('ReferralsPage', 'Actions', 'Button', 'Create')]: ['referralsApi.create.POST'],
  [generateUiPermissionKey('ReferralsPage', 'Actions', 'Button', 'ShareProperty')]: ['referralsApi.shareProperty.POST'],

  // ═══ COMMUNICATION ═══
  [generateUiPermissionKey('ChatPage', undefined, 'Page', 'View')]: ['chatApi.getConversation.GET', 'chatApi.getMessages.GET'],
  [generateUiPermissionKey('ChatPage', 'Thread', 'Button', 'Send')]: ['chatApi.sendMessage.POST'],

  [generateUiPermissionKey('SupportInbox', undefined, 'Page', 'View')]: ['supportApi.getAdminThreads.GET'],
  [generateUiPermissionKey('SupportInbox', 'Thread', 'Button', 'Reply')]: ['supportApi.sendMessage.POST'],
  [generateUiPermissionKey('SupportInbox', 'Thread', 'Dropdown', 'ChangeStatus')]: ['supportApi.updateStatus.PATCH'],
  [generateUiPermissionKey('SupportInbox', 'Thread', 'Dropdown', 'Assign')]: ['supportApi.assignThread.PATCH'],
  [generateUiPermissionKey('SupportInbox', 'UserThreads', 'Button', 'Create')]: ['supportApi.createThread.POST'],

  // ═══ PAYOUT ═══
  [generateUiPermissionKey('PayoutAccountsPage', undefined, 'Page', 'View')]: ['payoutAccountsApi.getMine.GET'],
  [generateUiPermissionKey('PayoutAccountsPage', 'Header', 'Button', 'Add')]: ['payoutAccountsApi.create.POST'],
  [generateUiPermissionKey('PayoutAccountsPage', 'Card', 'Button', 'Edit')]: ['payoutAccountsApi.update.PUT'],
  [generateUiPermissionKey('PayoutAccountsPage', 'Card', 'Button', 'Delete')]: ['payoutAccountsApi.remove.DELETE'],

  // ═══ PAYMENTS ═══
  [generateUiPermissionKey('PaymentsPage', undefined, 'Page', 'View')]: ['paymentsApi.getPendingReceipts.GET'],
  [generateUiPermissionKey('PaymentsPage', 'TransferAccounts', 'Button', 'Create')]: ['paymentsApi.upsertTransferAccount.POST'],
  [generateUiPermissionKey('PaymentsPage', 'TransferAccounts', 'Button', 'Delete')]: ['paymentsApi.deleteTransferAccount.DELETE'],
  [generateUiPermissionKey('PaymentsPage', 'Receipts', 'Button', 'Upload')]: ['paymentsApi.uploadReceipt.POST'],

  // ═══ GROUPS ═══
  [generateUiPermissionKey('PropertyGroupsManagement', undefined, 'Page', 'View')]: ['groupsApi.getAll.GET'],
  [generateUiPermissionKey('PropertyGroupsManagement', 'Header', 'Button', 'Create')]: ['groupsApi.create.POST'],
  [generateUiPermissionKey('PropertyGroupsManagement', 'Card', 'Button', 'Edit')]: ['groupsApi.update.PUT'],
  [generateUiPermissionKey('PropertyGroupsManagement', 'Card', 'Button', 'Delete')]: ['groupsApi.remove.DELETE'],
  [generateUiPermissionKey('PropertyGroupsManagement', 'Detail', 'Button', 'AddProperty')]: ['groupsApi.addProperty.POST'],
  [generateUiPermissionKey('PropertyGroupsManagement', 'Detail', 'Button', 'RemoveProperty')]: ['groupsApi.removeProperty.DELETE'],

  [generateUiPermissionKey('ServiceGroupsManagement', undefined, 'Page', 'View')]: ['serviceGroupsApi.getAll.GET'],
  [generateUiPermissionKey('ServiceGroupsManagement', 'Header', 'Button', 'Create')]: ['serviceGroupsApi.create.POST'],
  [generateUiPermissionKey('ServiceGroupsManagement', 'Card', 'Button', 'Edit')]: ['serviceGroupsApi.update.PUT'],
  [generateUiPermissionKey('ServiceGroupsManagement', 'Card', 'Button', 'Delete')]: ['serviceGroupsApi.remove.DELETE'],

  // ═══ VERIFICATION ═══
  [generateUiPermissionKey('VerificationReview', undefined, 'Page', 'View')]: ['documentsApi.getPending.GET'],
  [generateUiPermissionKey('VerificationReview', 'Actions', 'Button', 'Approve')]: ['documentsApi.approve.PUT'],
  [generateUiPermissionKey('VerificationReview', 'Actions', 'Button', 'Reject')]: ['documentsApi.reject.PUT'],
  [generateUiPermissionKey('VerificationReview', 'Actions', 'Button', 'Submit')]: ['documentsApi.submitForValidation.POST'],
  [generateUiPermissionKey('VerificationReview', 'Documents', 'Button', 'Upload')]: ['documentsApi.upload.POST'],

  // ═══ EMAIL ANALYTICS ═══
  [generateUiPermissionKey('EmailAnalyticsPage', undefined, 'Page', 'View')]: ['emailTrackingApi.getAnalytics.GET'],

  // ═══ SETTINGS ═══
  [generateUiPermissionKey('SettingsPage', undefined, 'Page', 'View')]: ['settingsApi.getSettings.GET'],
  [generateUiPermissionKey('SettingsPage', 'Profile', 'Section', 'Edit')]: ['settingsApi.updatePreferences.PUT'],
  [generateUiPermissionKey('SettingsPage', 'Notifications', 'Section', 'Edit')]: ['settingsApi.updateNotifications.PUT'],
  [generateUiPermissionKey('SettingsPage', 'Account', 'Section', 'Edit')]: ['settingsApi.updateAccount.PUT'],
  [generateUiPermissionKey('SettingsPage', 'Password', 'Button', 'Change')]: ['settingsApi.changePassword.PUT'],

  // ═══ PROFILES ═══
  [generateUiPermissionKey('ProfilePage', undefined, 'Page', 'View')]: ['profilesApi.findMyProfile.GET'],
  [generateUiPermissionKey('ProfilePage', 'Actions', 'Button', 'Edit')]: ['profilesApi.updateMyProfile.PUT'],
  [generateUiPermissionKey('ProfilePage', 'Avatar', 'Button', 'Upload')]: ['userApi.updateAvatar.PUT'],

  // ═══ NOTIFICATIONS ═══
  [generateUiPermissionKey('NotificationsPage', 'Actions', 'Button', 'MarkRead')]: ['notificationsApi.markRead.PUT'],
  [generateUiPermissionKey('NotificationsPage', 'Actions', 'Button', 'MarkAllRead')]: ['notificationsApi.markAllRead.PUT'],
  [generateUiPermissionKey('NotificationsPage', 'Actions', 'Button', 'Delete')]: ['notificationsApi.delete.DELETE'],

  // ═══ BADGES ═══
  [generateUiPermissionKey('BadgesPage', undefined, 'Page', 'View')]: ['badgesApi.getAll.GET'],
  [generateUiPermissionKey('BadgesPage', 'MyBadges', 'Widget', 'View')]: ['badgesApi.getMine.GET'],
  [generateUiPermissionKey('BadgesPage', 'Progress', 'Widget', 'View')]: ['badgesApi.getProgress.GET'],
  [generateUiPermissionKey('BadgesPage', 'Actions', 'Button', 'CheckUnlocks')]: ['badgesApi.checkUnlocks.POST'],

  // ═══ SHARED COMPONENTS ═══
  [generateUiPermissionKey('ProductCard', 'Actions', 'Button', 'Favorite')]: ['favoritesApi.toggle.POST'],
  [generateUiPermissionKey('ProductCard', 'Actions', 'Button', 'Share')]: ['referralsApi.shareProperty.POST'],
  [generateUiPermissionKey('ProductModal', 'Actions', 'Button', 'Book')]: ['bookingsApi.create.POST'],
  [generateUiPermissionKey('DynamicComments', 'Form', 'Button', 'Post')]: ['commentsApi.create.POST'],
  [generateUiPermissionKey('DynamicComments', 'Item', 'Button', 'Edit')]: ['commentsApi.update.PUT'],
  [generateUiPermissionKey('DynamicComments', 'Item', 'Button', 'Delete')]: ['commentsApi.delete.DELETE'],
  [generateUiPermissionKey('DynamicComments', 'Item', 'Button', 'Reply')]: ['commentsApi.create.POST'],
  [generateUiPermissionKey('DynamicReactions', 'Actions', 'Button', 'Toggle')]: ['reactionsApi.toggle.POST'],
  [generateUiPermissionKey('Basket', 'Actions', 'Button', 'Checkout')]: ['paymentsApi.createPaymentIntent.POST'],
};

// ─── Standalone Seed Runner ──────────────────────────────────────────────────

async function seedPermissionBindings(): Promise<void> {
  await AppDataSource.initialize();
  console.log('✅ Database connected');

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    let created = 0;
    const errors: string[] = [];

    for (const binding of PERMISSION_BINDING_SEED) {
      try {
        await queryRunner.query(
          `INSERT INTO rbac_permission_bindings
            (id, frontendPermissionApi, backendPermissionId, endpoint_url, module, created_at, updated_at)
           VALUES
            (UUID(), ?, ?, (SELECT endpoint_url FROM rbac_backend_permissions WHERE permission_key = ? LIMIT 1), ?, NOW(), NOW())
           ON DUPLICATE KEY UPDATE
            endpoint_url = rbac_permission_bindings.endpoint_url,
            module = rbac_permission_bindings.module,
            updated_at = rbac_permission_bindings.updated_at`,
          [binding.frontendPermissionApi, binding.backendPermissionKey, binding.backendPermissionKey, binding.module],
        );
        created++;
      } catch (err: any) {
        errors.push(`${binding.frontendPermissionApi}: ${err.message}`);
      }
    }

    await queryRunner.commitTransaction();
    console.log(`✅ Permission bindings seed complete — ${created} bindings seeded (total: ${PERMISSION_BINDING_SEED.length})`);
    console.log(`📋 UI→API cross-reference: ${Object.keys(UI_TO_API_MAP).length} UI elements mapped`);
    if (errors.length) {
      console.warn(`⚠️ ${errors.length} errors:`, errors);
    }
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('❌ Permission bindings seed failed:', error);
    throw error;
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

seedPermissionBindings();
