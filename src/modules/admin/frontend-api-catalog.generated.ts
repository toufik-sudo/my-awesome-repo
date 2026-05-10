/* Auto-generated from src/modules api services */
export interface FrontendApiCatalogEntry {
  service: string;
  fn: string;
  method: string;
  endpoint_url: string;
  frontendPermissionApi: string;
}

export const FRONTEND_API_CATALOG: FrontendApiCatalogEntry[] = [
  {
    "service": "badgesApi",
    "fn": "checkUnlocks",
    "method": "POST",
    "endpoint_url": "/badges/me/check",
    "frontendPermissionApi": "badgesApi.checkUnlocks.POST"
  },
  {
    "service": "badgesApi",
    "fn": "getAll",
    "method": "GET",
    "endpoint_url": "/badges",
    "frontendPermissionApi": "badgesApi.getAll.GET"
  },
  {
    "service": "badgesApi",
    "fn": "getMine",
    "method": "GET",
    "endpoint_url": "/badges/me",
    "frontendPermissionApi": "badgesApi.getMine.GET"
  },
  {
    "service": "badgesApi",
    "fn": "getProgress",
    "method": "GET",
    "endpoint_url": "/badges/me/progress",
    "frontendPermissionApi": "badgesApi.getProgress.GET"
  },
  {
    "service": "bookingsApi",
    "fn": "accept",
    "method": "PUT",
    "endpoint_url": "/bookings/:id/accept",
    "frontendPermissionApi": "bookingsApi.accept.PUT"
  },
  {
    "service": "bookingsApi",
    "fn": "cancel",
    "method": "PUT",
    "endpoint_url": "/bookings/:id/status",
    "frontendPermissionApi": "bookingsApi.cancel.PUT"
  },
  {
    "service": "bookingsApi",
    "fn": "checkAvailability",
    "method": "GET",
    "endpoint_url": "/bookings/availability/:propertyId",
    "frontendPermissionApi": "bookingsApi.checkAvailability.GET"
  },
  {
    "service": "bookingsApi",
    "fn": "counterOffer",
    "method": "PUT",
    "endpoint_url": "/bookings/:data.id/counter-offer",
    "frontendPermissionApi": "bookingsApi.counterOffer.PUT"
  },
  {
    "service": "bookingsApi",
    "fn": "create",
    "method": "POST",
    "endpoint_url": "/bookings",
    "frontendPermissionApi": "bookingsApi.create.POST"
  },
  {
    "service": "bookingsApi",
    "fn": "decline",
    "method": "PUT",
    "endpoint_url": "/bookings/:id/decline",
    "frontendPermissionApi": "bookingsApi.decline.PUT"
  },
  {
    "service": "bookingsApi",
    "fn": "getHostBookings",
    "method": "GET",
    "endpoint_url": "/bookings?:params.toString()",
    "frontendPermissionApi": "bookingsApi.getHostBookings.GET"
  },
  {
    "service": "bookingsApi",
    "fn": "getMyBookings",
    "method": "GET",
    "endpoint_url": "/bookings/my",
    "frontendPermissionApi": "bookingsApi.getMyBookings.GET"
  },
  {
    "service": "bookingsApi",
    "fn": "getOne",
    "method": "GET",
    "endpoint_url": "/bookings/:id",
    "frontendPermissionApi": "bookingsApi.getOne.GET"
  },
  {
    "service": "cancellationRulesApi",
    "fn": "create",
    "method": "POST",
    "endpoint_url": "/cancellation-rules",
    "frontendPermissionApi": "cancellationRulesApi.create.POST"
  },
  {
    "service": "cancellationRulesApi",
    "fn": "getAll",
    "method": "GET",
    "endpoint_url": ":/cancellation-rules/all",
    "frontendPermissionApi": "cancellationRulesApi.getAll.GET"
  },
  {
    "service": "cancellationRulesApi",
    "fn": "getForHost",
    "method": "GET",
    "endpoint_url": ":/cancellation-rules/host/:hostId",
    "frontendPermissionApi": "cancellationRulesApi.getForHost.GET"
  },
  {
    "service": "cancellationRulesApi",
    "fn": "getMine",
    "method": "GET",
    "endpoint_url": "/cancellation-rules",
    "frontendPermissionApi": "cancellationRulesApi.getMine.GET"
  },
  {
    "service": "cancellationRulesApi",
    "fn": "update",
    "method": "PUT",
    "endpoint_url": ":/cancellation-rules/:id",
    "frontendPermissionApi": "cancellationRulesApi.update.PUT"
  },
  {
    "service": "chatApi",
    "fn": "getConversation",
    "method": "GET",
    "endpoint_url": "/chat/:bookingId",
    "frontendPermissionApi": "chatApi.getConversation.GET"
  },
  {
    "service": "chatApi",
    "fn": "getMessages",
    "method": "GET",
    "endpoint_url": "/chat/:bookingId/messages",
    "frontendPermissionApi": "chatApi.getMessages.GET"
  },
  {
    "service": "chatApi",
    "fn": "sendMessage",
    "method": "POST",
    "endpoint_url": "/chat/:data.bookingId/messages",
    "frontendPermissionApi": "chatApi.sendMessage.POST"
  },
  {
    "service": "emailTrackingApi",
    "fn": "getAnalytics",
    "method": "GET",
    "endpoint_url": "/email-tracking/analytics?days=:days",
    "frontendPermissionApi": "emailTrackingApi.getAnalytics.GET"
  },
  {
    "service": "hostFeeAbsorptionApi",
    "fn": "checkAbsorption",
    "method": "POST",
    "endpoint_url": ":/host-fee-absorptions/check",
    "frontendPermissionApi": "hostFeeAbsorptionApi.checkAbsorption.POST"
  },
  {
    "service": "hostFeeAbsorptionApi",
    "fn": "create",
    "method": "POST",
    "endpoint_url": "/host-fee-absorptions",
    "frontendPermissionApi": "hostFeeAbsorptionApi.create.POST"
  },
  {
    "service": "hostFeeAbsorptionApi",
    "fn": "getForHost",
    "method": "GET",
    "endpoint_url": ":/host-fee-absorptions/host/:hostId",
    "frontendPermissionApi": "hostFeeAbsorptionApi.getForHost.GET"
  },
  {
    "service": "hostFeeAbsorptionApi",
    "fn": "getMine",
    "method": "GET",
    "endpoint_url": "/host-fee-absorptions",
    "frontendPermissionApi": "hostFeeAbsorptionApi.getMine.GET"
  },
  {
    "service": "hostFeeAbsorptionApi",
    "fn": "update",
    "method": "PUT",
    "endpoint_url": ":/host-fee-absorptions/:id",
    "frontendPermissionApi": "hostFeeAbsorptionApi.update.PUT"
  },
  {
    "service": "hyperManagementApi",
    "fn": "archiveProperty",
    "method": "DELETE",
    "endpoint_url": ":/hyper/properties/:id/archive",
    "frontendPermissionApi": "hyperManagementApi.archiveProperty.DELETE"
  },
  {
    "service": "hyperManagementApi",
    "fn": "archiveService",
    "method": "DELETE",
    "endpoint_url": ":/hyper/services/:id/archive",
    "frontendPermissionApi": "hyperManagementApi.archiveService.DELETE"
  },
  {
    "service": "hyperManagementApi",
    "fn": "archiveUser",
    "method": "DELETE",
    "endpoint_url": ":/hyper/users/:id/archive",
    "frontendPermissionApi": "hyperManagementApi.archiveUser.DELETE"
  },
  {
    "service": "hyperManagementApi",
    "fn": "deleteProperty",
    "method": "DELETE",
    "endpoint_url": ":/hyper/properties/:id",
    "frontendPermissionApi": "hyperManagementApi.deleteProperty.DELETE"
  },
  {
    "service": "hyperManagementApi",
    "fn": "deleteService",
    "method": "DELETE",
    "endpoint_url": ":/hyper/services/:id",
    "frontendPermissionApi": "hyperManagementApi.deleteService.DELETE"
  },
  {
    "service": "hyperManagementApi",
    "fn": "pauseProperty",
    "method": "PUT",
    "endpoint_url": ":/hyper/properties/:id/pause",
    "frontendPermissionApi": "hyperManagementApi.pauseProperty.PUT"
  },
  {
    "service": "hyperManagementApi",
    "fn": "pauseService",
    "method": "PUT",
    "endpoint_url": ":/hyper/services/:id/pause",
    "frontendPermissionApi": "hyperManagementApi.pauseService.PUT"
  },
  {
    "service": "hyperManagementApi",
    "fn": "pauseUser",
    "method": "PUT",
    "endpoint_url": ":/hyper/users/:id/pause",
    "frontendPermissionApi": "hyperManagementApi.pauseUser.PUT"
  },
  {
    "service": "hyperManagementApi",
    "fn": "reactivateUser",
    "method": "PUT",
    "endpoint_url": ":/hyper/users/:id/reactivate",
    "frontendPermissionApi": "hyperManagementApi.reactivateUser.PUT"
  },
  {
    "service": "hyperManagementApi",
    "fn": "resumeProperty",
    "method": "PUT",
    "endpoint_url": ":/hyper/properties/:id/resume",
    "frontendPermissionApi": "hyperManagementApi.resumeProperty.PUT"
  },
  {
    "service": "hyperManagementApi",
    "fn": "resumeService",
    "method": "PUT",
    "endpoint_url": ":/hyper/services/:id/resume",
    "frontendPermissionApi": "hyperManagementApi.resumeService.PUT"
  },
  {
    "service": "hyperManagementApi",
    "fn": "resumeUser",
    "method": "PUT",
    "endpoint_url": ":/hyper/users/:id/resume",
    "frontendPermissionApi": "hyperManagementApi.resumeUser.PUT"
  },
  {
    "service": "metricsApi",
    "fn": "getRevenue",
    "method": "GET",
    "endpoint_url": ":/metrics/revenue",
    "frontendPermissionApi": "metricsApi.getRevenue.GET"
  },
  {
    "service": "metricsApi",
    "fn": "getSummary",
    "method": "GET",
    "endpoint_url": ":/metrics/summary",
    "frontendPermissionApi": "metricsApi.getSummary.GET"
  },
  {
    "service": "paymentsApi",
    "fn": "approveReceipt",
    "method": "PUT",
    "endpoint_url": ":/payments/receipts/:id/approve",
    "frontendPermissionApi": "paymentsApi.approveReceipt.PUT"
  },
  {
    "service": "paymentsApi",
    "fn": "createPaymentIntent",
    "method": "POST",
    "endpoint_url": ":/payments/stripe/intent",
    "frontendPermissionApi": "paymentsApi.createPaymentIntent.POST"
  },
  {
    "service": "paymentsApi",
    "fn": "getAllTransferAccounts",
    "method": "GET",
    "endpoint_url": ":/payments/transfer-accounts/all",
    "frontendPermissionApi": "paymentsApi.getAllTransferAccounts.GET"
  },
  {
    "service": "paymentsApi",
    "fn": "getPendingReceipts",
    "method": "GET",
    "endpoint_url": ":/payments/receipts/pending",
    "frontendPermissionApi": "paymentsApi.getPendingReceipts.GET"
  },
  {
    "service": "paymentsApi",
    "fn": "getReceiptsByBooking",
    "method": "GET",
    "endpoint_url": ":/payments/receipts/booking/:bookingId",
    "frontendPermissionApi": "paymentsApi.getReceiptsByBooking.GET"
  },
  {
    "service": "paymentsApi",
    "fn": "getTransferAccounts",
    "method": "GET",
    "endpoint_url": ":/payments/transfer-accounts",
    "frontendPermissionApi": "paymentsApi.getTransferAccounts.GET"
  },
  {
    "service": "paymentsApi",
    "fn": "rejectReceipt",
    "method": "PUT",
    "endpoint_url": ":/payments/receipts/:id/reject",
    "frontendPermissionApi": "paymentsApi.rejectReceipt.PUT"
  },
  {
    "service": "paymentsApi",
    "fn": "uploadReceipt",
    "method": "POST",
    "endpoint_url": ":/payments/receipts",
    "frontendPermissionApi": "paymentsApi.uploadReceipt.POST"
  },
  {
    "service": "paymentsApi",
    "fn": "upsertTransferAccount",
    "method": "POST",
    "endpoint_url": ":/payments/transfer-accounts",
    "frontendPermissionApi": "paymentsApi.upsertTransferAccount.POST"
  },
  {
    "service": "payoutAccountsApi",
    "fn": "create",
    "method": "POST",
    "endpoint_url": "/payout-accounts",
    "frontendPermissionApi": "payoutAccountsApi.create.POST"
  },
  {
    "service": "payoutAccountsApi",
    "fn": "getAll",
    "method": "GET",
    "endpoint_url": ":/payout-accounts/all",
    "frontendPermissionApi": "payoutAccountsApi.getAll.GET"
  },
  {
    "service": "payoutAccountsApi",
    "fn": "getMine",
    "method": "GET",
    "endpoint_url": "/payout-accounts",
    "frontendPermissionApi": "payoutAccountsApi.getMine.GET"
  },
  {
    "service": "payoutAccountsApi",
    "fn": "update",
    "method": "PUT",
    "endpoint_url": ":/payout-accounts/:id",
    "frontendPermissionApi": "payoutAccountsApi.update.PUT"
  },
  {
    "service": "permissionBindingsApi",
    "fn": "bulkCreate",
    "method": "POST",
    "endpoint_url": ":/rbac-config/bindings/bulk",
    "frontendPermissionApi": "permissionBindingsApi.bulkCreate.POST"
  },
  {
    "service": "permissionBindingsApi",
    "fn": "create",
    "method": "POST",
    "endpoint_url": "/rbac-config/bindings",
    "frontendPermissionApi": "permissionBindingsApi.create.POST"
  },
  {
    "service": "permissionBindingsApi",
    "fn": "createByKeys",
    "method": "POST",
    "endpoint_url": ":/rbac-config/bindings/by-keys",
    "frontendPermissionApi": "permissionBindingsApi.createByKeys.POST"
  },
  {
    "service": "permissionBindingsApi",
    "fn": "getAll",
    "method": "GET",
    "endpoint_url": "/rbac-config/bindings",
    "frontendPermissionApi": "permissionBindingsApi.getAll.GET"
  },
  {
    "service": "permissionBindingsApi",
    "fn": "getBindingMap",
    "method": "GET",
    "endpoint_url": ":/rbac-config/bindings/map",
    "frontendPermissionApi": "permissionBindingsApi.getBindingMap.GET"
  },
  {
    "service": "permissionBindingsApi",
    "fn": "getByBackendKey",
    "method": "GET",
    "endpoint_url": ":/rbac-config/bindings/backend/:encodeURIComponent(key)",
    "frontendPermissionApi": "permissionBindingsApi.getByBackendKey.GET"
  },
  {
    "service": "permissionBindingsApi",
    "fn": "getByFrontendApi",
    "method": "GET",
    "endpoint_url": ":/rbac-config/bindings/frontend-api/:encodeURIComponent(key)",
    "frontendPermissionApi": "permissionBindingsApi.getByFrontendApi.GET"
  },
  {
    "service": "permissionBindingsApi",
    "fn": "remove",
    "method": "DELETE",
    "endpoint_url": ":/rbac-config/bindings/:id",
    "frontendPermissionApi": "permissionBindingsApi.remove.DELETE"
  },
  {
    "service": "permissionBindingsApi",
    "fn": "update",
    "method": "PUT",
    "endpoint_url": ":/rbac-config/bindings/:id",
    "frontendPermissionApi": "permissionBindingsApi.update.PUT"
  },
  {
    "service": "pointsApi",
    "fn": "adminAward",
    "method": "POST",
    "endpoint_url": ":/points/admin/award",
    "frontendPermissionApi": "pointsApi.adminAward.POST"
  },
  {
    "service": "pointsApi",
    "fn": "adminDeduct",
    "method": "POST",
    "endpoint_url": ":/points/admin/deduct",
    "frontendPermissionApi": "pointsApi.adminDeduct.POST"
  },
  {
    "service": "pointsApi",
    "fn": "getLeaderboard",
    "method": "GET",
    "endpoint_url": ":/points/leaderboard",
    "frontendPermissionApi": "pointsApi.getLeaderboard.GET"
  },
  {
    "service": "pointsApi",
    "fn": "getMySummary",
    "method": "GET",
    "endpoint_url": ":/points/me",
    "frontendPermissionApi": "pointsApi.getMySummary.GET"
  },
  {
    "service": "pointsApi",
    "fn": "getMyTransactions",
    "method": "GET",
    "endpoint_url": ":/points/me/transactions",
    "frontendPermissionApi": "pointsApi.getMyTransactions.GET"
  },
  {
    "service": "pointsApi",
    "fn": "getUserPoints",
    "method": "GET",
    "endpoint_url": ":/points/user/:userId",
    "frontendPermissionApi": "pointsApi.getUserPoints.GET"
  },
  {
    "service": "pointsRulesApi",
    "fn": "create",
    "method": "POST",
    "endpoint_url": "/points-rules",
    "frontendPermissionApi": "pointsRulesApi.create.POST"
  },
  {
    "service": "pointsRulesApi",
    "fn": "getAll",
    "method": "GET",
    "endpoint_url": "/points-rules",
    "frontendPermissionApi": "pointsRulesApi.getAll.GET"
  },
  {
    "service": "pointsRulesApi",
    "fn": "getByRole",
    "method": "GET",
    "endpoint_url": ":/points-rules/role/:role",
    "frontendPermissionApi": "pointsRulesApi.getByRole.GET"
  },
  {
    "service": "pointsRulesApi",
    "fn": "getConversion",
    "method": "GET",
    "endpoint_url": ":/points-rules/conversion",
    "frontendPermissionApi": "pointsRulesApi.getConversion.GET"
  },
  {
    "service": "pointsRulesApi",
    "fn": "getDefaults",
    "method": "GET",
    "endpoint_url": ":/points-rules/defaults",
    "frontendPermissionApi": "pointsRulesApi.getDefaults.GET"
  },
  {
    "service": "pointsRulesApi",
    "fn": "getEarning",
    "method": "GET",
    "endpoint_url": ":/points-rules/earning",
    "frontendPermissionApi": "pointsRulesApi.getEarning.GET"
  },
  {
    "service": "pointsRulesApi",
    "fn": "update",
    "method": "PUT",
    "endpoint_url": ":/points-rules/:ruleId",
    "frontendPermissionApi": "pointsRulesApi.update.PUT"
  },
  {
    "service": "propertiesApi",
    "fn": "create",
    "method": "POST",
    "endpoint_url": "/properties",
    "frontendPermissionApi": "propertiesApi.create.POST"
  },
  {
    "service": "propertiesApi",
    "fn": "create",
    "method": "POST",
    "endpoint_url": "/alerts/saved-searches",
    "frontendPermissionApi": "propertiesApi.create.POST"
  },
  {
    "service": "propertiesApi",
    "fn": "delete",
    "method": "DELETE",
    "endpoint_url": "/properties/:id",
    "frontendPermissionApi": "propertiesApi.delete.DELETE"
  },
  {
    "service": "propertiesApi",
    "fn": "delete",
    "method": "DELETE",
    "endpoint_url": "/alerts/saved-searches/:id",
    "frontendPermissionApi": "propertiesApi.delete.DELETE"
  },
  {
    "service": "propertiesApi",
    "fn": "getAll",
    "method": "GET",
    "endpoint_url": "/properties?:params.toString()",
    "frontendPermissionApi": "propertiesApi.getAll.GET"
  },
  {
    "service": "propertiesApi",
    "fn": "getAll",
    "method": "GET",
    "endpoint_url": "/alerts/saved-searches",
    "frontendPermissionApi": "propertiesApi.getAll.GET"
  },
  {
    "service": "propertiesApi",
    "fn": "getAvailability",
    "method": "GET",
    "endpoint_url": "/properties/:id/availability",
    "frontendPermissionApi": "propertiesApi.getAvailability.GET"
  },
  {
    "service": "propertiesApi",
    "fn": "getById",
    "method": "GET",
    "endpoint_url": "/properties/:id",
    "frontendPermissionApi": "propertiesApi.getById.GET"
  },
  {
    "service": "propertiesApi",
    "fn": "getPromos",
    "method": "GET",
    "endpoint_url": "/properties/:id/promos",
    "frontendPermissionApi": "propertiesApi.getPromos.GET"
  },
  {
    "service": "propertiesApi",
    "fn": "subscribePromoAlert",
    "method": "POST",
    "endpoint_url": "/properties/:id/promo-alerts",
    "frontendPermissionApi": "propertiesApi.subscribePromoAlert.POST"
  },
  {
    "service": "propertiesApi",
    "fn": "unsubscribePromoAlert",
    "method": "DELETE",
    "endpoint_url": "/properties/:id/promo-alerts",
    "frontendPermissionApi": "propertiesApi.unsubscribePromoAlert.DELETE"
  },
  {
    "service": "propertiesApi",
    "fn": "update",
    "method": "PUT",
    "endpoint_url": "/properties/:id",
    "frontendPermissionApi": "propertiesApi.update.PUT"
  },
  {
    "service": "propertiesApi",
    "fn": "update",
    "method": "PUT",
    "endpoint_url": "/alerts/saved-searches/:id",
    "frontendPermissionApi": "propertiesApi.update.PUT"
  },
  {
    "service": "propertiesApi",
    "fn": "updateAvailability",
    "method": "PUT",
    "endpoint_url": "/properties/:id/availability",
    "frontendPermissionApi": "propertiesApi.updateAvailability.PUT"
  },
  {
    "service": "propertiesApi",
    "fn": "updatePhotos",
    "method": "PUT",
    "endpoint_url": "/properties/:id/photos",
    "frontendPermissionApi": "propertiesApi.updatePhotos.PUT"
  },
  {
    "service": "propertiesApi",
    "fn": "updatePrices",
    "method": "PUT",
    "endpoint_url": "/properties/:id/prices",
    "frontendPermissionApi": "propertiesApi.updatePrices.PUT"
  },
  {
    "service": "rbacConfigApi",
    "fn": "bulkUpdateBackend",
    "method": "PUT",
    "endpoint_url": ":/rbac-config/backend",
    "frontendPermissionApi": "rbacConfigApi.bulkUpdateBackend.PUT"
  },
  {
    "service": "rbacConfigApi",
    "fn": "bulkUpdateFrontend",
    "method": "PUT",
    "endpoint_url": ":/rbac-config/frontend",
    "frontendPermissionApi": "rbacConfigApi.bulkUpdateFrontend.PUT"
  },
  {
    "service": "rbacConfigApi",
    "fn": "checkPermission",
    "method": "GET",
    "endpoint_url": ":/rbac-config/check?role=:role&permission=:permission",
    "frontendPermissionApi": "rbacConfigApi.checkPermission.GET"
  },
  {
    "service": "rbacConfigApi",
    "fn": "createBackendPermission",
    "method": "POST",
    "endpoint_url": ":/rbac-config/backend",
    "frontendPermissionApi": "rbacConfigApi.createBackendPermission.POST"
  },
  {
    "service": "rbacConfigApi",
    "fn": "createFrontendPermission",
    "method": "POST",
    "endpoint_url": ":/rbac-config/frontend",
    "frontendPermissionApi": "rbacConfigApi.createFrontendPermission.POST"
  },
  {
    "service": "rbacConfigApi",
    "fn": "getBackendPermissions",
    "method": "GET",
    "endpoint_url": ":/rbac-config/backend",
    "frontendPermissionApi": "rbacConfigApi.getBackendPermissions.GET"
  },
  {
    "service": "rbacConfigApi",
    "fn": "getFrontendPermissions",
    "method": "GET",
    "endpoint_url": ":/rbac-config/frontend",
    "frontendPermissionApi": "rbacConfigApi.getFrontendPermissions.GET"
  },
  {
    "service": "rbacConfigApi",
    "fn": "getRoles",
    "method": "GET",
    "endpoint_url": ":/rbac-config/roles",
    "frontendPermissionApi": "rbacConfigApi.getRoles.GET"
  },
  {
    "service": "rbacConfigApi",
    "fn": "getStatus",
    "method": "GET",
    "endpoint_url": ":/rbac-config/status",
    "frontendPermissionApi": "rbacConfigApi.getStatus.GET"
  },
  {
    "service": "rbacConfigApi",
    "fn": "reloadCache",
    "method": "POST",
    "endpoint_url": ":/rbac-config/reload",
    "frontendPermissionApi": "rbacConfigApi.reloadCache.POST"
  },
  {
    "service": "rbacConfigApi",
    "fn": "updateBackendPermission",
    "method": "PUT",
    "endpoint_url": ":/rbac-config/backend/:id",
    "frontendPermissionApi": "rbacConfigApi.updateBackendPermission.PUT"
  },
  {
    "service": "rbacConfigApi",
    "fn": "updateFrontendPermission",
    "method": "PUT",
    "endpoint_url": ":/rbac-config/frontend/:id",
    "frontendPermissionApi": "rbacConfigApi.updateFrontendPermission.PUT"
  },
  {
    "service": "referralsApi",
    "fn": "completeSignup",
    "method": "POST",
    "endpoint_url": ":/referrals/signup/:code",
    "frontendPermissionApi": "referralsApi.completeSignup.POST"
  },
  {
    "service": "referralsApi",
    "fn": "create",
    "method": "POST",
    "endpoint_url": "/referrals",
    "frontendPermissionApi": "referralsApi.create.POST"
  },
  {
    "service": "referralsApi",
    "fn": "getMyCode",
    "method": "GET",
    "endpoint_url": ":/referrals/code",
    "frontendPermissionApi": "referralsApi.getMyCode.GET"
  },
  {
    "service": "referralsApi",
    "fn": "getMyReferrals",
    "method": "GET",
    "endpoint_url": "/referrals",
    "frontendPermissionApi": "referralsApi.getMyReferrals.GET"
  },
  {
    "service": "referralsApi",
    "fn": "getShareStats",
    "method": "GET",
    "endpoint_url": ":/referrals/share/:propertyId/stats",
    "frontendPermissionApi": "referralsApi.getShareStats.GET"
  },
  {
    "service": "referralsApi",
    "fn": "getStats",
    "method": "GET",
    "endpoint_url": ":/referrals/stats",
    "frontendPermissionApi": "referralsApi.getStats.GET"
  },
  {
    "service": "referralsApi",
    "fn": "shareProperty",
    "method": "POST",
    "endpoint_url": ":/referrals/share",
    "frontendPermissionApi": "referralsApi.shareProperty.POST"
  },
  {
    "service": "reviewsApi",
    "fn": "create",
    "method": "POST",
    "endpoint_url": "/reviews",
    "frontendPermissionApi": "reviewsApi.create.POST"
  },
  {
    "service": "reviewsApi",
    "fn": "getByProperty",
    "method": "GET",
    "endpoint_url": "/reviews/property/:propertyId",
    "frontendPermissionApi": "reviewsApi.getByProperty.GET"
  },
  {
    "service": "reviewsApi",
    "fn": "getOne",
    "method": "GET",
    "endpoint_url": "/reviews/:id",
    "frontendPermissionApi": "reviewsApi.getOne.GET"
  },
  {
    "service": "reviewsApi",
    "fn": "replyToReview",
    "method": "POST",
    "endpoint_url": "/reviews/:reviewId/reply",
    "frontendPermissionApi": "reviewsApi.replyToReview.POST"
  },
  {
    "service": "rewardsApi",
    "fn": "cancelRedemption",
    "method": "DELETE",
    "endpoint_url": ":/rewards/redemptions/:redemptionId/cancel",
    "frontendPermissionApi": "rewardsApi.cancelRedemption.DELETE"
  },
  {
    "service": "rewardsApi",
    "fn": "create",
    "method": "POST",
    "endpoint_url": "/rewards",
    "frontendPermissionApi": "rewardsApi.create.POST"
  },
  {
    "service": "rewardsApi",
    "fn": "getAll",
    "method": "GET",
    "endpoint_url": "/rewards",
    "frontendPermissionApi": "rewardsApi.getAll.GET"
  },
  {
    "service": "rewardsApi",
    "fn": "getAllRedemptions",
    "method": "GET",
    "endpoint_url": ":/rewards/admin/redemptions",
    "frontendPermissionApi": "rewardsApi.getAllRedemptions.GET"
  },
  {
    "service": "rewardsApi",
    "fn": "getById",
    "method": "GET",
    "endpoint_url": ":/rewards/:id",
    "frontendPermissionApi": "rewardsApi.getById.GET"
  },
  {
    "service": "rewardsApi",
    "fn": "getMyRedemptions",
    "method": "GET",
    "endpoint_url": ":/rewards/me/redemptions",
    "frontendPermissionApi": "rewardsApi.getMyRedemptions.GET"
  },
  {
    "service": "rewardsApi",
    "fn": "getShop",
    "method": "GET",
    "endpoint_url": ":/rewards/shop",
    "frontendPermissionApi": "rewardsApi.getShop.GET"
  },
  {
    "service": "rewardsApi",
    "fn": "redeem",
    "method": "POST",
    "endpoint_url": ":/rewards/:rewardId/redeem",
    "frontendPermissionApi": "rewardsApi.redeem.POST"
  },
  {
    "service": "rewardsApi",
    "fn": "update",
    "method": "PUT",
    "endpoint_url": ":/rewards/:id",
    "frontendPermissionApi": "rewardsApi.update.PUT"
  },
  {
    "service": "rewardsApi",
    "fn": "useRedemption",
    "method": "POST",
    "endpoint_url": ":/rewards/redemptions/:code/use",
    "frontendPermissionApi": "rewardsApi.useRedemption.POST"
  },
  {
    "service": "rolesApi",
    "fn": "addProperty",
    "method": "POST",
    "endpoint_url": ":/property-groups/:groupId/properties",
    "frontendPermissionApi": "rolesApi.addProperty.POST"
  },
  {
    "service": "rolesApi",
    "fn": "approve",
    "method": "PUT",
    "endpoint_url": ":/documents/:docId/approve",
    "frontendPermissionApi": "rolesApi.approve.PUT"
  },
  {
    "service": "rolesApi",
    "fn": "assignRole",
    "method": "POST",
    "endpoint_url": ":/roles/assign",
    "frontendPermissionApi": "rolesApi.assignRole.POST"
  },
  {
    "service": "rolesApi",
    "fn": "convertGuestToUser",
    "method": "POST",
    "endpoint_url": ":/roles/invitations/convert-guest-to-user",
    "frontendPermissionApi": "rolesApi.convertGuestToUser.POST"
  },
  {
    "service": "rolesApi",
    "fn": "create",
    "method": "POST",
    "endpoint_url": "/property-groups",
    "frontendPermissionApi": "rolesApi.create.POST"
  },
  {
    "service": "rolesApi",
    "fn": "create",
    "method": "POST",
    "endpoint_url": ":/roles/invitations",
    "frontendPermissionApi": "rolesApi.create.POST"
  },
  {
    "service": "rolesApi",
    "fn": "getAll",
    "method": "GET",
    "endpoint_url": ":/roles/assignments",
    "frontendPermissionApi": "rolesApi.getAll.GET"
  },
  {
    "service": "rolesApi",
    "fn": "getAll",
    "method": "GET",
    "endpoint_url": "/property-groups",
    "frontendPermissionApi": "rolesApi.getAll.GET"
  },
  {
    "service": "rolesApi",
    "fn": "getAll",
    "method": "GET",
    "endpoint_url": ":/roles/invitations",
    "frontendPermissionApi": "rolesApi.getAll.GET"
  },
  {
    "service": "rolesApi",
    "fn": "getAllUsers",
    "method": "GET",
    "endpoint_url": ":/roles/users",
    "frontendPermissionApi": "rolesApi.getAllUsers.GET"
  },
  {
    "service": "rolesApi",
    "fn": "getAllowedRoles",
    "method": "GET",
    "endpoint_url": ":/roles/invitations/allowed-roles",
    "frontendPermissionApi": "rolesApi.getAllowedRoles.GET"
  },
  {
    "service": "rolesApi",
    "fn": "getByProperty",
    "method": "GET",
    "endpoint_url": ":/properties/:propertyId/documents",
    "frontendPermissionApi": "rolesApi.getByProperty.GET"
  },
  {
    "service": "rolesApi",
    "fn": "getDashboardStats",
    "method": "GET",
    "endpoint_url": ":/roles/stats",
    "frontendPermissionApi": "rolesApi.getDashboardStats.GET"
  },
  {
    "service": "rolesApi",
    "fn": "getGuestPermissions",
    "method": "GET",
    "endpoint_url": ":/roles/guest/:guestId/permissions",
    "frontendPermissionApi": "rolesApi.getGuestPermissions.GET"
  },
  {
    "service": "rolesApi",
    "fn": "getHyperManagerPermissions",
    "method": "GET",
    "endpoint_url": ":/roles/hyper-manager/:hyperManagerId/permissions",
    "frontendPermissionApi": "rolesApi.getHyperManagerPermissions.GET"
  },
  {
    "service": "rolesApi",
    "fn": "getManagerPermissions",
    "method": "GET",
    "endpoint_url": ":/roles/manager/:managerId/permissions",
    "frontendPermissionApi": "rolesApi.getManagerPermissions.GET"
  },
  {
    "service": "rolesApi",
    "fn": "getOne",
    "method": "GET",
    "endpoint_url": ":/property-groups/:id",
    "frontendPermissionApi": "rolesApi.getOne.GET"
  },
  {
    "service": "rolesApi",
    "fn": "getPending",
    "method": "GET",
    "endpoint_url": ":/documents/pending",
    "frontendPermissionApi": "rolesApi.getPending.GET"
  },
  {
    "service": "rolesApi",
    "fn": "getProperties",
    "method": "GET",
    "endpoint_url": ":/property-groups/:groupId/properties",
    "frontendPermissionApi": "rolesApi.getProperties.GET"
  },
  {
    "service": "rolesApi",
    "fn": "getUserRoles",
    "method": "GET",
    "endpoint_url": ":/roles/user/:userId",
    "frontendPermissionApi": "rolesApi.getUserRoles.GET"
  },
  {
    "service": "rolesApi",
    "fn": "recalculate",
    "method": "PUT",
    "endpoint_url": ":/properties/:propertyId/recalculate-trust",
    "frontendPermissionApi": "rolesApi.recalculate.PUT"
  },
  {
    "service": "rolesApi",
    "fn": "reject",
    "method": "PUT",
    "endpoint_url": ":/documents/:docId/reject",
    "frontendPermissionApi": "rolesApi.reject.PUT"
  },
  {
    "service": "rolesApi",
    "fn": "resend",
    "method": "POST",
    "endpoint_url": ":/roles/invitations/:invitationId/resend",
    "frontendPermissionApi": "rolesApi.resend.POST"
  },
  {
    "service": "rolesApi",
    "fn": "setGuestPermissions",
    "method": "POST",
    "endpoint_url": ":/roles/guest/permissions",
    "frontendPermissionApi": "rolesApi.setGuestPermissions.POST"
  },
  {
    "service": "rolesApi",
    "fn": "setHyperManagerPermissions",
    "method": "POST",
    "endpoint_url": ":/roles/hyper-manager/permissions",
    "frontendPermissionApi": "rolesApi.setHyperManagerPermissions.POST"
  },
  {
    "service": "rolesApi",
    "fn": "setManagerPermissions",
    "method": "POST",
    "endpoint_url": ":/roles/manager/permissions",
    "frontendPermissionApi": "rolesApi.setManagerPermissions.POST"
  },
  {
    "service": "rolesApi",
    "fn": "submitForValidation",
    "method": "POST",
    "endpoint_url": ":/documents/:docId/validate",
    "frontendPermissionApi": "rolesApi.submitForValidation.POST"
  },
  {
    "service": "rolesApi",
    "fn": "update",
    "method": "PUT",
    "endpoint_url": ":/property-groups/:id",
    "frontendPermissionApi": "rolesApi.update.PUT"
  },
  {
    "service": "rolesApi",
    "fn": "updateUserStatus",
    "method": "PUT",
    "endpoint_url": ":/roles/users/:userId/status",
    "frontendPermissionApi": "rolesApi.updateUserStatus.PUT"
  },
  {
    "service": "rolesApi",
    "fn": "upload",
    "method": "POST",
    "endpoint_url": ":/documents/upload",
    "frontendPermissionApi": "rolesApi.upload.POST"
  },
  {
    "service": "serviceBookingsApi",
    "fn": "accept",
    "method": "PUT",
    "endpoint_url": "/service-bookings/:id/accept",
    "frontendPermissionApi": "serviceBookingsApi.accept.PUT"
  },
  {
    "service": "serviceBookingsApi",
    "fn": "addService",
    "method": "POST",
    "endpoint_url": "/service-groups/:groupId/services",
    "frontendPermissionApi": "serviceBookingsApi.addService.POST"
  },
  {
    "service": "serviceBookingsApi",
    "fn": "bulkSetAvailability",
    "method": "POST",
    "endpoint_url": "/service-bookings/availability/:serviceId/bulk",
    "frontendPermissionApi": "serviceBookingsApi.bulkSetAvailability.POST"
  },
  {
    "service": "serviceBookingsApi",
    "fn": "cancel",
    "method": "PUT",
    "endpoint_url": "/service-bookings/:id/cancel",
    "frontendPermissionApi": "serviceBookingsApi.cancel.PUT"
  },
  {
    "service": "serviceBookingsApi",
    "fn": "create",
    "method": "POST",
    "endpoint_url": "/service-bookings",
    "frontendPermissionApi": "serviceBookingsApi.create.POST"
  },
  {
    "service": "serviceBookingsApi",
    "fn": "create",
    "method": "POST",
    "endpoint_url": "/service-groups",
    "frontendPermissionApi": "serviceBookingsApi.create.POST"
  },
  {
    "service": "serviceBookingsApi",
    "fn": "decline",
    "method": "PUT",
    "endpoint_url": "/service-bookings/:id/decline",
    "frontendPermissionApi": "serviceBookingsApi.decline.PUT"
  },
  {
    "service": "serviceBookingsApi",
    "fn": "getAll",
    "method": "GET",
    "endpoint_url": "/service-groups",
    "frontendPermissionApi": "serviceBookingsApi.getAll.GET"
  },
  {
    "service": "serviceBookingsApi",
    "fn": "getAvailability",
    "method": "GET",
    "endpoint_url": "/service-bookings/availability/:serviceId",
    "frontendPermissionApi": "serviceBookingsApi.getAvailability.GET"
  },
  {
    "service": "serviceBookingsApi",
    "fn": "getMyBookings",
    "method": "GET",
    "endpoint_url": "/service-bookings/my",
    "frontendPermissionApi": "serviceBookingsApi.getMyBookings.GET"
  },
  {
    "service": "serviceBookingsApi",
    "fn": "getOne",
    "method": "GET",
    "endpoint_url": "/service-bookings/:id",
    "frontendPermissionApi": "serviceBookingsApi.getOne.GET"
  },
  {
    "service": "serviceBookingsApi",
    "fn": "getOne",
    "method": "GET",
    "endpoint_url": "/service-groups/:id",
    "frontendPermissionApi": "serviceBookingsApi.getOne.GET"
  },
  {
    "service": "serviceBookingsApi",
    "fn": "getProviderBookings",
    "method": "GET",
    "endpoint_url": "/service-bookings/provider",
    "frontendPermissionApi": "serviceBookingsApi.getProviderBookings.GET"
  },
  {
    "service": "serviceBookingsApi",
    "fn": "getServices",
    "method": "GET",
    "endpoint_url": "/service-groups/:groupId/services",
    "frontendPermissionApi": "serviceBookingsApi.getServices.GET"
  },
  {
    "service": "serviceBookingsApi",
    "fn": "setAvailability",
    "method": "POST",
    "endpoint_url": "/service-bookings/availability/:serviceId",
    "frontendPermissionApi": "serviceBookingsApi.setAvailability.POST"
  },
  {
    "service": "serviceBookingsApi",
    "fn": "update",
    "method": "PUT",
    "endpoint_url": "/service-groups/:id",
    "frontendPermissionApi": "serviceBookingsApi.update.PUT"
  },
  {
    "service": "serviceFeesApi",
    "fn": "calculate",
    "method": "POST",
    "endpoint_url": ":/service-fees/calculate",
    "frontendPermissionApi": "serviceFeesApi.calculate.POST"
  },
  {
    "service": "serviceFeesApi",
    "fn": "create",
    "method": "POST",
    "endpoint_url": "/service-fees",
    "frontendPermissionApi": "serviceFeesApi.create.POST"
  },
  {
    "service": "serviceFeesApi",
    "fn": "getAll",
    "method": "GET",
    "endpoint_url": "/service-fees",
    "frontendPermissionApi": "serviceFeesApi.getAll.GET"
  },
  {
    "service": "serviceFeesApi",
    "fn": "getDefault",
    "method": "GET",
    "endpoint_url": ":/service-fees/default",
    "frontendPermissionApi": "serviceFeesApi.getDefault.GET"
  },
  {
    "service": "serviceFeesApi",
    "fn": "getForHost",
    "method": "GET",
    "endpoint_url": ":/service-fees/host/:hostId",
    "frontendPermissionApi": "serviceFeesApi.getForHost.GET"
  },
  {
    "service": "serviceFeesApi",
    "fn": "update",
    "method": "PUT",
    "endpoint_url": ":/service-fees/:ruleId",
    "frontendPermissionApi": "serviceFeesApi.update.PUT"
  },
  {
    "service": "supportApi",
    "fn": "assignThread",
    "method": "PATCH",
    "endpoint_url": "/support/threads/:threadId/assign",
    "frontendPermissionApi": "supportApi.assignThread.PATCH"
  },
  {
    "service": "supportApi",
    "fn": "createThread",
    "method": "POST",
    "endpoint_url": "/support/threads",
    "frontendPermissionApi": "supportApi.createThread.POST"
  },
  {
    "service": "supportApi",
    "fn": "getThread",
    "method": "GET",
    "endpoint_url": "/support/threads/:threadId",
    "frontendPermissionApi": "supportApi.getThread.GET"
  },
  {
    "service": "supportApi",
    "fn": "markRead",
    "method": "POST",
    "endpoint_url": "/support/threads/:threadId/read",
    "frontendPermissionApi": "supportApi.markRead.POST"
  },
  {
    "service": "supportApi",
    "fn": "sendMessage",
    "method": "POST",
    "endpoint_url": "/support/threads/:threadId/messages",
    "frontendPermissionApi": "supportApi.sendMessage.POST"
  },
  {
    "service": "supportApi",
    "fn": "updateStatus",
    "method": "PATCH",
    "endpoint_url": "/support/threads/:threadId/status",
    "frontendPermissionApi": "supportApi.updateStatus.PATCH"
  },
  {
    "service": "tourismServicesApi",
    "fn": "create",
    "method": "POST",
    "endpoint_url": "/services",
    "frontendPermissionApi": "tourismServicesApi.create.POST"
  },
  {
    "service": "tourismServicesApi",
    "fn": "delete",
    "method": "DELETE",
    "endpoint_url": "/services/:id",
    "frontendPermissionApi": "tourismServicesApi.delete.DELETE"
  },
  {
    "service": "tourismServicesApi",
    "fn": "getAll",
    "method": "GET",
    "endpoint_url": "/services?:params.toString()",
    "frontendPermissionApi": "tourismServicesApi.getAll.GET"
  },
  {
    "service": "tourismServicesApi",
    "fn": "getById",
    "method": "GET",
    "endpoint_url": "/services/:id",
    "frontendPermissionApi": "tourismServicesApi.getById.GET"
  },
  {
    "service": "tourismServicesApi",
    "fn": "getDocuments",
    "method": "GET",
    "endpoint_url": "/services/:serviceId/documents",
    "frontendPermissionApi": "tourismServicesApi.getDocuments.GET"
  },
  {
    "service": "tourismServicesApi",
    "fn": "update",
    "method": "PUT",
    "endpoint_url": "/services/:id",
    "frontendPermissionApi": "tourismServicesApi.update.PUT"
  },
  {
    "service": "tourismServicesApi",
    "fn": "uploadDocument",
    "method": "POST",
    "endpoint_url": "/services/:serviceId/documents",
    "frontendPermissionApi": "tourismServicesApi.uploadDocument.POST"
  }
];
