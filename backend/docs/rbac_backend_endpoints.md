# RBAC Backend Endpoints Inventory

> Auto-generated from rbac.seed.ts — Last updated: 2026-04-06

## Legend
- ✅ OK — endpoint exists in controller and is registered in seed
- ⚠️ À faire — endpoint exists in controller but NOT in seed
- ❌ Seed orphan — seed entry references non-existent method

## Excluded Controllers (no PermissionGuard needed)
- `AppController` — health check endpoints
- `AuthController` — login/register/refresh (public or JWT-only)
- `SSOController` — OAuth token exchange (public)
- `SessionController` — placeholder, no active endpoints

## Backend Permission Keys

### BadgeController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.BadgeController.checkUnlocks.POST` | POST | checkUnlocks |
| ✅ OK | `backend.BadgeController.getAllBadges.GET` | GET | getAllBadges |
| ✅ OK | `backend.BadgeController.getMyBadges.GET` | GET | getMyBadges |
| ✅ OK | `backend.BadgeController.getMyProgress.GET` | GET | getMyProgress |

### BookingsController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.BookingsController.accept.PUT` | PUT | accept |
| ✅ OK | `backend.BookingsController.checkAvailability.GET` | GET | checkAvailability |
| ✅ OK | `backend.BookingsController.counterOffer.PUT` | PUT | counterOffer |
| ✅ OK | `backend.BookingsController.create.POST` | POST | create |
| ✅ OK | `backend.BookingsController.decline.PUT` | PUT | decline |
| ✅ OK | `backend.BookingsController.findAll.GET` | GET | findAll |
| ✅ OK | `backend.BookingsController.findOne.GET` | GET | findOne |
| ✅ OK | `backend.BookingsController.getMyBookings.GET` | GET | getMyBookings |
| ✅ OK | `backend.BookingsController.refund.PUT` | PUT | refund |
| ✅ OK | `backend.BookingsController.updateStatus.PUT` | PUT | updateStatus |

### CancellationRuleController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.CancellationRuleController.create.POST` | POST | create |
| ✅ OK | `backend.CancellationRuleController.getForHost.GET` | GET | getForHost |
| ✅ OK | `backend.CancellationRuleController.getMine.GET` | GET | getMine |
| ✅ OK | `backend.CancellationRuleController.remove.DELETE` | DELETE | remove |
| ✅ OK | `backend.CancellationRuleController.update.PUT` | PUT | update |

### CommentsController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.CommentsController.createComment.POST` | POST | createComment |
| ✅ OK | `backend.CommentsController.deleteComment.DELETE` | DELETE | deleteComment |
| ✅ OK | `backend.CommentsController.getComments.GET` | GET | getComments |
| ✅ OK | `backend.CommentsController.getReplies.GET` | GET | getReplies |
| ✅ OK | `backend.CommentsController.updateComment.PUT` | PUT | updateComment |

### DashboardController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.DashboardController.getDashboard.GET` | GET | getDashboard |

### DocumentValidationController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.DocumentValidationController.approveDocument.PUT` | PUT | approveDocument |
| ✅ OK | `backend.DocumentValidationController.getPendingDocuments.GET` | GET | getPendingDocuments |
| ✅ OK | `backend.DocumentValidationController.rejectDocument.PUT` | PUT | rejectDocument |
| ✅ OK | `backend.DocumentValidationController.submitForValidation.POST` | POST | submitForValidation |

### EmailTrackingController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.EmailTrackingController.getAnalytics.GET` | GET | getAnalytics |
| ⚠️ À faire | — | ? | handleClick |
| ⚠️ À faire | — | ? | handleJsVerify |
| ⚠️ À faire | — | ? | handlePixel |
| ⚠️ À faire | — | ? | handleWebhook |

### FavoritesController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.FavoritesController.checkFavorite.GET` | GET | checkFavorite |
| ✅ OK | `backend.FavoritesController.findMyFavorites.GET` | GET | findMyFavorites |
| ✅ OK | `backend.FavoritesController.remove.DELETE` | DELETE | remove |
| ✅ OK | `backend.FavoritesController.toggle.POST` | POST | toggle |

### HostFeeAbsorptionController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.HostFeeAbsorptionController.create.POST` | POST | create |
| ✅ OK | `backend.HostFeeAbsorptionController.getForHost.GET` | GET | getForHost |
| ✅ OK | `backend.HostFeeAbsorptionController.getMyAbsorptions.GET` | GET | getMyAbsorptions |
| ✅ OK | `backend.HostFeeAbsorptionController.remove.DELETE` | DELETE | remove |
| ✅ OK | `backend.HostFeeAbsorptionController.update.PUT` | PUT | update |

### HyperManagementController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.HyperManagementController.archiveProperty.DELETE` | DELETE | archiveProperty |
| ✅ OK | `backend.HyperManagementController.archiveService.DELETE` | DELETE | archiveService |
| ✅ OK | `backend.HyperManagementController.archiveUser.DELETE` | DELETE | archiveUser |
| ✅ OK | `backend.HyperManagementController.deleteProperty.DELETE` | DELETE | deleteProperty |
| ✅ OK | `backend.HyperManagementController.deleteService.DELETE` | DELETE | deleteService |
| ✅ OK | `backend.HyperManagementController.pauseProperty.PUT` | PUT | pauseProperty |
| ✅ OK | `backend.HyperManagementController.pauseService.PUT` | PUT | pauseService |
| ✅ OK | `backend.HyperManagementController.pauseUser.PUT` | PUT | pauseUser |
| ✅ OK | `backend.HyperManagementController.reactivateUser.PUT` | PUT | reactivateUser |
| ✅ OK | `backend.HyperManagementController.resumeProperty.PUT` | PUT | resumeProperty |
| ✅ OK | `backend.HyperManagementController.resumeService.PUT` | PUT | resumeService |
| ✅ OK | `backend.HyperManagementController.resumeUser.PUT` | PUT | resumeUser |

### InvitationController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.InvitationController.accept.POST` | POST | accept |
| ✅ OK | `backend.InvitationController.cancel.DELETE` | DELETE | cancel |
| ✅ OK | `backend.InvitationController.convertGuestToUser.POST` | POST | convertGuestToUser |
| ✅ OK | `backend.InvitationController.create.POST` | POST | create |
| ✅ OK | `backend.InvitationController.getAll.GET` | GET | getAll |
| ✅ OK | `backend.InvitationController.getAllowedRoles.GET` | GET | getAllowedRoles |
| ✅ OK | `backend.InvitationController.resend.POST` | POST | resend |

### MetricsController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.MetricsController.getBookings.GET` | GET | getBookings |
| ✅ OK | `backend.MetricsController.getProperties.GET` | GET | getProperties |
| ✅ OK | `backend.MetricsController.getRevenue.GET` | GET | getRevenue |
| ✅ OK | `backend.MetricsController.getServices.GET` | GET | getServices |
| ✅ OK | `backend.MetricsController.getSummary.GET` | GET | getSummary |
| ✅ OK | `backend.MetricsController.getUsers.GET` | GET | getUsers |

### NotificationController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.NotificationController.get.GET` | GET | get |
| ✅ OK | `backend.NotificationController.getNew.GET` | GET | getNew |

### PaymentsController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.PaymentsController.approveReceipt.PUT` | PUT | approveReceipt |
| ✅ OK | `backend.PaymentsController.deleteTransferAccount.DELETE` | DELETE | deleteTransferAccount |
| ✅ OK | `backend.PaymentsController.getAllTransferAccounts.GET` | GET | getAllTransferAccounts |
| ✅ OK | `backend.PaymentsController.getPendingReceipts.GET` | GET | getPendingReceipts |
| ✅ OK | `backend.PaymentsController.getReceiptsByBooking.GET` | GET | getReceiptsByBooking |
| ✅ OK | `backend.PaymentsController.getTransferAccounts.GET` | GET | getTransferAccounts |
| ✅ OK | `backend.PaymentsController.rejectReceipt.PUT` | PUT | rejectReceipt |
| ✅ OK | `backend.PaymentsController.uploadReceipt.POST` | POST | uploadReceipt |
| ✅ OK | `backend.PaymentsController.upsertTransferAccount.POST` | POST | upsertTransferAccount |

### PayoutAccountController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.PayoutAccountController.create.POST` | POST | create |
| ✅ OK | `backend.PayoutAccountController.getAll.GET` | GET | getAll |
| ✅ OK | `backend.PayoutAccountController.getMine.GET` | GET | getMine |
| ✅ OK | `backend.PayoutAccountController.remove.DELETE` | DELETE | remove |
| ✅ OK | `backend.PayoutAccountController.update.PUT` | PUT | update |

### PointsController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.PointsController.adminAward.POST` | POST | adminAward |
| ✅ OK | `backend.PointsController.adminDeduct.POST` | POST | adminDeduct |
| ✅ OK | `backend.PointsController.getLeaderboard.GET` | GET | getLeaderboard |
| ✅ OK | `backend.PointsController.getMySummary.GET` | GET | getMySummary |
| ✅ OK | `backend.PointsController.getMyTransactions.GET` | GET | getMyTransactions |
| ✅ OK | `backend.PointsController.getUserPoints.GET` | GET | getUserPoints |

### PointsRuleController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.PointsRuleController.create.POST` | POST | create |
| ✅ OK | `backend.PointsRuleController.getAll.GET` | GET | getAll |
| ✅ OK | `backend.PointsRuleController.getByRole.GET` | GET | getByRole |
| ✅ OK | `backend.PointsRuleController.getConversion.GET` | GET | getConversion |
| ✅ OK | `backend.PointsRuleController.getDefaults.GET` | GET | getDefaults |
| ✅ OK | `backend.PointsRuleController.getEarning.GET` | GET | getEarning |
| ✅ OK | `backend.PointsRuleController.remove.DELETE` | DELETE | remove |
| ✅ OK | `backend.PointsRuleController.update.PUT` | PUT | update |

### ProfilesController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.ProfilesController.findMyProfile.GET` | GET | findMyProfile |
| ✅ OK | `backend.ProfilesController.updateMyProfile.PUT` | PUT | updateMyProfile |

### PropertiesController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.PropertiesController.create.POST` | POST | create |
| ✅ OK | `backend.PropertiesController.createAlert.POST` | POST | createAlert |
| ✅ OK | `backend.PropertiesController.createPromo.POST` | POST | createPromo |
| ✅ OK | `backend.PropertiesController.deleteAlert.DELETE` | DELETE | deleteAlert |
| ✅ OK | `backend.PropertiesController.deletePromo.DELETE` | DELETE | deletePromo |
| ✅ OK | `backend.PropertiesController.findAll.GET` | GET | findAll |
| ✅ OK | `backend.PropertiesController.findOne.GET` | GET | findOne |
| ✅ OK | `backend.PropertiesController.getAvailability.GET` | GET | getAvailability |
| ✅ OK | `backend.PropertiesController.getMyAlerts.GET` | GET | getMyAlerts |
| ✅ OK | `backend.PropertiesController.getPromos.GET` | GET | getPromos |
| ✅ OK | `backend.PropertiesController.recalculateTrust.PUT` | PUT | recalculateTrust |
| ✅ OK | `backend.PropertiesController.remove.DELETE` | DELETE | remove |
| ✅ OK | `backend.PropertiesController.subscribePromoAlert.POST` | POST | subscribePromoAlert |
| ✅ OK | `backend.PropertiesController.unsubscribePromoAlert.DELETE` | DELETE | unsubscribePromoAlert |
| ✅ OK | `backend.PropertiesController.update.PUT` | PUT | update |
| ✅ OK | `backend.PropertiesController.updateAlert.PUT` | PUT | updateAlert |
| ✅ OK | `backend.PropertiesController.updateAvailability.PUT` | PUT | updateAvailability |
| ✅ OK | `backend.PropertiesController.updatePhotos.PUT` | PUT | updatePhotos |
| ✅ OK | `backend.PropertiesController.updatePrices.PUT` | PUT | updatePrices |

### PropertyGroupsController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.PropertyGroupsController.addProperty.POST` | POST | addProperty |
| ✅ OK | `backend.PropertyGroupsController.create.POST` | POST | create |
| ✅ OK | `backend.PropertyGroupsController.findAll.GET` | GET | findAll |
| ✅ OK | `backend.PropertyGroupsController.findOne.GET` | GET | findOne |
| ✅ OK | `backend.PropertyGroupsController.getGroupProperties.GET` | GET | getGroupProperties |
| ✅ OK | `backend.PropertyGroupsController.remove.DELETE` | DELETE | remove |
| ✅ OK | `backend.PropertyGroupsController.removeProperty.DELETE` | DELETE | removeProperty |
| ✅ OK | `backend.PropertyGroupsController.update.PUT` | PUT | update |

### RankingsController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.RankingsController.getMyRank.GET` | GET | getMyRank |
| ✅ OK | `backend.RankingsController.getRankings.GET` | GET | getRankings |

### RbacConfigController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.RbacConfigController.bulkUpdateBackend.PUT` | PUT | bulkUpdateBackend |
| ✅ OK | `backend.RbacConfigController.bulkUpdateFrontend.PUT` | PUT | bulkUpdateFrontend |
| ✅ OK | `backend.RbacConfigController.check.GET` | GET | check |
| ✅ OK | `backend.RbacConfigController.createBackend.POST` | POST | createBackend |
| ✅ OK | `backend.RbacConfigController.createFrontend.POST` | POST | createFrontend |
| ✅ OK | `backend.RbacConfigController.getBackendByRole.GET` | GET | getBackendByRole |
| ✅ OK | `backend.RbacConfigController.getFrontendByRole.GET` | GET | getFrontendByRole |
| ✅ OK | `backend.RbacConfigController.getRoles.GET` | GET | getRoles |
| ✅ OK | `backend.RbacConfigController.listBackend.GET` | GET | listBackend |
| ✅ OK | `backend.RbacConfigController.listFrontend.GET` | GET | listFrontend |
| ✅ OK | `backend.RbacConfigController.reloadCache.POST` | POST | reloadCache |
| ✅ OK | `backend.RbacConfigController.status.GET` | GET | status |
| ✅ OK | `backend.RbacConfigController.updateBackend.PUT` | PUT | updateBackend |
| ✅ OK | `backend.RbacConfigController.updateFrontend.PUT` | PUT | updateFrontend |

### ReactionsController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.ReactionsController.getReactions.GET` | GET | getReactions |
| ✅ OK | `backend.ReactionsController.removeReaction.DELETE` | DELETE | removeReaction |
| ✅ OK | `backend.ReactionsController.toggleReaction.POST` | POST | toggleReaction |

### ReferralController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.ReferralController.completeSignup.POST` | POST | completeSignup |
| ✅ OK | `backend.ReferralController.createReferral.POST` | POST | createReferral |
| ✅ OK | `backend.ReferralController.getMyCode.GET` | GET | getMyCode |
| ✅ OK | `backend.ReferralController.getMyReferrals.GET` | GET | getMyReferrals |
| ✅ OK | `backend.ReferralController.getMyStats.GET` | GET | getMyStats |
| ✅ OK | `backend.ReferralController.getShareStats.GET` | GET | getShareStats |
| ✅ OK | `backend.ReferralController.shareProperty.POST` | POST | shareProperty |

### ReviewsController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.ReviewsController.create.POST` | POST | create |
| ✅ OK | `backend.ReviewsController.findByProperty.GET` | GET | findByProperty |
| ✅ OK | `backend.ReviewsController.findOne.GET` | GET | findOne |
| ✅ OK | `backend.ReviewsController.reply.POST` | POST | reply |

### RewardsController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.RewardsController.cancelRedemption.PUT` | PUT | cancelRedemption |
| ✅ OK | `backend.RewardsController.create.POST` | POST | create |
| ✅ OK | `backend.RewardsController.getAll.GET` | GET | getAll |
| ✅ OK | `backend.RewardsController.getAllRedemptions.GET` | GET | getAllRedemptions |
| ✅ OK | `backend.RewardsController.getById.GET` | GET | getById |
| ✅ OK | `backend.RewardsController.getMyRedemptions.GET` | GET | getMyRedemptions |
| ✅ OK | `backend.RewardsController.getShop.GET` | GET | getShop |
| ✅ OK | `backend.RewardsController.redeem.POST` | POST | redeem |
| ✅ OK | `backend.RewardsController.remove.DELETE` | DELETE | remove |
| ✅ OK | `backend.RewardsController.update.PUT` | PUT | update |
| ✅ OK | `backend.RewardsController.useRedemption.PUT` | PUT | useRedemption |

### RolesController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.RolesController.assignManager.POST` | POST | assignManager |
| ✅ OK | `backend.RolesController.assignRole.POST` | POST | assignRole |
| ✅ OK | `backend.RolesController.checkPermission.GET` | GET | checkPermission |
| ✅ OK | `backend.RolesController.deleteUser.DELETE` | DELETE | deleteUser |
| ✅ OK | `backend.RolesController.getAllAssignments.GET` | GET | getAllAssignments |
| ✅ OK | `backend.RolesController.getAllUsers.GET` | GET | getAllUsers |
| ✅ OK | `backend.RolesController.getManagerPermissions.GET` | GET | getManagerPermissions |
| ✅ OK | `backend.RolesController.getManagerProperties.GET` | GET | getManagerProperties |
| ✅ OK | `backend.RolesController.getStats.GET` | GET | getStats |
| ✅ OK | `backend.RolesController.getUserRoles.GET` | GET | getUserRoles |
| ✅ OK | `backend.RolesController.removeAssignment.DELETE` | DELETE | removeAssignment |
| ✅ OK | `backend.RolesController.removeRole.DELETE` | DELETE | removeRole |
| ✅ OK | `backend.RolesController.setPermissions.POST` | POST | setPermissions |
| ✅ OK | `backend.RolesController.updateUserStatus.PUT` | PUT | updateUserStatus |

### ServiceBookingsController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.ServiceBookingsController.accept.PUT` | PUT | accept |
| ✅ OK | `backend.ServiceBookingsController.bulkSetAvailability.POST` | POST | bulkSetAvailability |
| ✅ OK | `backend.ServiceBookingsController.cancel.PUT` | PUT | cancel |
| ✅ OK | `backend.ServiceBookingsController.create.POST` | POST | create |
| ✅ OK | `backend.ServiceBookingsController.decline.PUT` | PUT | decline |
| ✅ OK | `backend.ServiceBookingsController.getAvailability.GET` | GET | getAvailability |
| ✅ OK | `backend.ServiceBookingsController.getMyBookings.GET` | GET | getMyBookings |
| ✅ OK | `backend.ServiceBookingsController.getOne.GET` | GET | getOne |
| ✅ OK | `backend.ServiceBookingsController.getProviderBookings.GET` | GET | getProviderBookings |
| ✅ OK | `backend.ServiceBookingsController.setAvailability.POST` | POST | setAvailability |

### ServiceFeeController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.ServiceFeeController.calculate.POST` | POST | calculate |
| ✅ OK | `backend.ServiceFeeController.create.POST` | POST | create |
| ✅ OK | `backend.ServiceFeeController.getAll.GET` | GET | getAll |
| ✅ OK | `backend.ServiceFeeController.getDefault.GET` | GET | getDefault |
| ✅ OK | `backend.ServiceFeeController.getForHost.GET` | GET | getForHost |
| ✅ OK | `backend.ServiceFeeController.remove.DELETE` | DELETE | remove |
| ✅ OK | `backend.ServiceFeeController.update.PUT` | PUT | update |

### ServiceGroupsController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.ServiceGroupsController.addService.POST` | POST | addService |
| ✅ OK | `backend.ServiceGroupsController.create.POST` | POST | create |
| ✅ OK | `backend.ServiceGroupsController.findAll.GET` | GET | findAll |
| ✅ OK | `backend.ServiceGroupsController.findOne.GET` | GET | findOne |
| ✅ OK | `backend.ServiceGroupsController.getServices.GET` | GET | getServices |
| ✅ OK | `backend.ServiceGroupsController.remove.DELETE` | DELETE | remove |
| ✅ OK | `backend.ServiceGroupsController.removeService.DELETE` | DELETE | removeService |
| ✅ OK | `backend.ServiceGroupsController.update.PUT` | PUT | update |

### SettingsController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.SettingsController.changePassword.PUT` | PUT | changePassword |
| ✅ OK | `backend.SettingsController.getSettings.GET` | GET | getSettings |
| ✅ OK | `backend.SettingsController.updateAccount.PUT` | PUT | updateAccount |
| ✅ OK | `backend.SettingsController.updateNotifications.PUT` | PUT | updateNotifications |
| ✅ OK | `backend.SettingsController.updatePreferences.PUT` | PUT | updatePreferences |

### SupportChatController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.SupportChatController.assignThread.PATCH` | PATCH | assignThread |
| ✅ OK | `backend.SupportChatController.createThread.POST` | POST | createThread |
| ✅ OK | `backend.SupportChatController.getAdminThreads.GET` | GET | getAdminThreads |
| ✅ OK | `backend.SupportChatController.getMessages.GET` | GET | getMessages |
| ✅ OK | `backend.SupportChatController.getMyThreads.GET` | GET | getMyThreads |
| ✅ OK | `backend.SupportChatController.getThread.GET` | GET | getThread |
| ✅ OK | `backend.SupportChatController.markRead.POST` | POST | markRead |
| ✅ OK | `backend.SupportChatController.sendMessage.POST` | POST | sendMessage |
| ✅ OK | `backend.SupportChatController.updateStatus.PATCH` | PATCH | updateStatus |

### TourismServicesController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.TourismServicesController.create.POST` | POST | create |
| ✅ OK | `backend.TourismServicesController.findAll.GET` | GET | findAll |
| ✅ OK | `backend.TourismServicesController.findOne.GET` | GET | findOne |
| ✅ OK | `backend.TourismServicesController.getCategories.GET` | GET | getCategories |
| ✅ OK | `backend.TourismServicesController.pause.PUT` | PUT | pause |
| ✅ OK | `backend.TourismServicesController.remove.DELETE` | DELETE | remove |
| ✅ OK | `backend.TourismServicesController.update.PUT` | PUT | update |

### UserController

| Status | Permission Key | Method | Handler |
|--------|---------------|--------|---------|
| ✅ OK | `backend.UserController.completeProfile.POST` | POST | completeProfile |
| ✅ OK | `backend.UserController.deleteAvatar.DELETE` | DELETE | deleteAvatar |
| ✅ OK | `backend.UserController.updateLanguage.PUT` | PUT | updateLanguage |
| ✅ OK | `backend.UserController.uploadAvatar.POST` | POST | uploadAvatar |

## Summary

| Status | Count |
|--------|-------|
| ✅ OK (registered) | 228 |
| ⚠️ À faire (missing from seed) | 4 |
| **Total endpoints tracked** | **232** |
