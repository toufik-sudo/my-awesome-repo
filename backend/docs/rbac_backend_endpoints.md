# RBAC Backend Endpoints Inventory

> Auto-generated from rbac.seed.ts — Last updated: 2026-04-06

## Legend
- ✅ OK — endpoint exists in controller and is registered in seed
- ⚠️ À faire — endpoint exists in controller but NOT in seed
- ❌ Seed orphan — seed entry references non-existent method

## Backend Permission Keys

### AppController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ⚠️ À faire | — | ? | getHello | Not in seed |
| ⚠️ À faire | — | ? | getInitHello | Not in seed |

### AuthController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ⚠️ À faire | — | ? | activateUser | Not in seed |
| ⚠️ À faire | — | ? | getProfile | Not in seed |
| ⚠️ À faire | — | ? | login | Not in seed |
| ⚠️ À faire | — | ? | logout | Not in seed |
| ⚠️ À faire | — | ? | refresh | Not in seed |
| ⚠️ À faire | — | ? | registerUser | Not in seed |

### BadgeController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.BadgeController.checkUnlocks.POST` | POST | checkUnlocks | Registered |
| ✅ OK | `backend.BadgeController.getAllBadges.GET` | GET | getAllBadges | Registered |
| ✅ OK | `backend.BadgeController.getMyBadges.GET` | GET | getMyBadges | Registered |
| ✅ OK | `backend.BadgeController.getMyProgress.GET` | GET | getMyProgress | Registered |

### BookingsController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.BookingsController.accept.PUT` | PUT | accept | Registered |
| ✅ OK | `backend.BookingsController.checkAvailability.GET` | GET | checkAvailability | Registered |
| ✅ OK | `backend.BookingsController.counterOffer.PUT` | PUT | counterOffer | Registered |
| ✅ OK | `backend.BookingsController.create.POST` | POST | create | Registered |
| ✅ OK | `backend.BookingsController.decline.PUT` | PUT | decline | Registered |
| ✅ OK | `backend.BookingsController.findAll.GET` | GET | findAll | Registered |
| ✅ OK | `backend.BookingsController.findOne.GET` | GET | findOne | Registered |
| ✅ OK | `backend.BookingsController.getMyBookings.GET` | GET | getMyBookings | Registered |
| ✅ OK | `backend.BookingsController.refund.PUT` | PUT | refund | Registered |
| ✅ OK | `backend.BookingsController.updateStatus.PUT` | PUT | updateStatus | Registered |

### CancellationRuleController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.CancellationRuleController.create.POST` | POST | create | Registered |
| ✅ OK | `backend.CancellationRuleController.getForHost.GET` | GET | getForHost | Registered |
| ✅ OK | `backend.CancellationRuleController.getMine.GET` | GET | getMine | Registered |
| ✅ OK | `backend.CancellationRuleController.remove.DELETE` | DELETE | remove | Registered |
| ✅ OK | `backend.CancellationRuleController.update.PUT` | PUT | update | Registered |

### CommentsController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.CommentsController.createComment.POST` | POST | createComment | Registered |
| ✅ OK | `backend.CommentsController.deleteComment.DELETE` | DELETE | deleteComment | Registered |
| ✅ OK | `backend.CommentsController.getComments.GET` | GET | getComments | Registered |
| ✅ OK | `backend.CommentsController.getReplies.GET` | GET | getReplies | Registered |
| ✅ OK | `backend.CommentsController.updateComment.PUT` | PUT | updateComment | Registered |

### DashboardController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.DashboardController.getDashboard.GET` | GET | getDashboard | Registered |

### DocumentValidationController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.DocumentValidationController.approveDocument.PUT` | PUT | approveDocument | Registered |
| ✅ OK | `backend.DocumentValidationController.getPendingDocuments.GET` | GET | getPendingDocuments | Registered |
| ✅ OK | `backend.DocumentValidationController.rejectDocument.PUT` | PUT | rejectDocument | Registered |
| ✅ OK | `backend.DocumentValidationController.submitForValidation.POST` | POST | submitForValidation | Registered |

### EmailTrackingController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.EmailTrackingController.getAnalytics.GET` | GET | getAnalytics | Registered |
| ⚠️ À faire | — | ? | for | Not in seed |
| ⚠️ À faire | — | ? | handleClick | Not in seed |
| ⚠️ À faire | — | ? | handleJsVerify | Not in seed |
| ⚠️ À faire | — | ? | handlePixel | Not in seed |
| ⚠️ À faire | — | ? | handleWebhook | Not in seed |
| ⚠️ À faire | — | ? | if | Not in seed |
| ⚠️ À faire | — | ? | if | Not in seed |
| ⚠️ À faire | — | ? | if | Not in seed |
| ⚠️ À faire | — | ? | if | Not in seed |
| ⚠️ À faire | — | ? | return | Not in seed |

### FavoritesController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.FavoritesController.checkFavorite.GET` | GET | checkFavorite | Registered |
| ✅ OK | `backend.FavoritesController.findMyFavorites.GET` | GET | findMyFavorites | Registered |
| ✅ OK | `backend.FavoritesController.remove.DELETE` | DELETE | remove | Registered |
| ✅ OK | `backend.FavoritesController.toggle.POST` | POST | toggle | Registered |

### HostFeeAbsorptionController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.HostFeeAbsorptionController.create.POST` | POST | create | Registered |
| ✅ OK | `backend.HostFeeAbsorptionController.getForHost.GET` | GET | getForHost | Registered |
| ✅ OK | `backend.HostFeeAbsorptionController.getMyAbsorptions.GET` | GET | getMyAbsorptions | Registered |
| ✅ OK | `backend.HostFeeAbsorptionController.remove.DELETE` | DELETE | remove | Registered |
| ✅ OK | `backend.HostFeeAbsorptionController.update.PUT` | PUT | update | Registered |

### HyperManagementController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.HyperManagementController.archiveProperty.DELETE` | DELETE | archiveProperty | Registered |
| ✅ OK | `backend.HyperManagementController.archiveService.DELETE` | DELETE | archiveService | Registered |
| ✅ OK | `backend.HyperManagementController.archiveUser.DELETE` | DELETE | archiveUser | Registered |
| ✅ OK | `backend.HyperManagementController.deleteProperty.DELETE` | DELETE | deleteProperty | Registered |
| ✅ OK | `backend.HyperManagementController.deleteService.DELETE` | DELETE | deleteService | Registered |
| ✅ OK | `backend.HyperManagementController.pauseProperty.PUT` | PUT | pauseProperty | Registered |
| ✅ OK | `backend.HyperManagementController.pauseService.PUT` | PUT | pauseService | Registered |
| ✅ OK | `backend.HyperManagementController.pauseUser.PUT` | PUT | pauseUser | Registered |
| ✅ OK | `backend.HyperManagementController.reactivateUser.PUT` | PUT | reactivateUser | Registered |
| ✅ OK | `backend.HyperManagementController.resumeProperty.PUT` | PUT | resumeProperty | Registered |
| ✅ OK | `backend.HyperManagementController.resumeService.PUT` | PUT | resumeService | Registered |
| ✅ OK | `backend.HyperManagementController.resumeUser.PUT` | PUT | resumeUser | Registered |

### InvitationController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.InvitationController.accept.POST` | POST | accept | Registered |
| ✅ OK | `backend.InvitationController.cancel.DELETE` | DELETE | cancel | Registered |
| ✅ OK | `backend.InvitationController.convertGuestToUser.POST` | POST | convertGuestToUser | Registered |
| ✅ OK | `backend.InvitationController.create.POST` | POST | create | Registered |
| ✅ OK | `backend.InvitationController.getAll.GET` | GET | getAll | Registered |
| ✅ OK | `backend.InvitationController.getAllowedRoles.GET` | GET | getAllowedRoles | Registered |
| ✅ OK | `backend.InvitationController.resend.POST` | POST | resend | Registered |

### MetricsController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ❌ Orphan | `backend.MetricsController.getBookings.GET` | GET | getBookings | Method not found in controller |
| ✅ OK | `backend.MetricsController.getProperties.GET` | GET | getProperties | Registered |
| ❌ Orphan | `backend.MetricsController.getRevenue.GET` | GET | getRevenue | Method not found in controller |
| ✅ OK | `backend.MetricsController.getServices.GET` | GET | getServices | Registered |
| ✅ OK | `backend.MetricsController.getSummary.GET` | GET | getSummary | Registered |
| ❌ Orphan | `backend.MetricsController.getUsers.GET` | GET | getUsers | Method not found in controller |
| ⚠️ À faire | — | ? | if | Not in seed |
| ⚠️ À faire | — | ? | if | Not in seed |

### NotificationController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.NotificationController.get.GET` | GET | get | Registered |
| ✅ OK | `backend.NotificationController.getNew.GET` | GET | getNew | Registered |

### PaymentsController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.PaymentsController.approveReceipt.PUT` | PUT | approveReceipt | Registered |
| ✅ OK | `backend.PaymentsController.deleteTransferAccount.DELETE` | DELETE | deleteTransferAccount | Registered |
| ✅ OK | `backend.PaymentsController.getAllTransferAccounts.GET` | GET | getAllTransferAccounts | Registered |
| ✅ OK | `backend.PaymentsController.getPendingReceipts.GET` | GET | getPendingReceipts | Registered |
| ✅ OK | `backend.PaymentsController.getReceiptsByBooking.GET` | GET | getReceiptsByBooking | Registered |
| ✅ OK | `backend.PaymentsController.getTransferAccounts.GET` | GET | getTransferAccounts | Registered |
| ✅ OK | `backend.PaymentsController.rejectReceipt.PUT` | PUT | rejectReceipt | Registered |
| ✅ OK | `backend.PaymentsController.uploadReceipt.POST` | POST | uploadReceipt | Registered |
| ✅ OK | `backend.PaymentsController.upsertTransferAccount.POST` | POST | upsertTransferAccount | Registered |

### PayoutAccountController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.PayoutAccountController.create.POST` | POST | create | Registered |
| ✅ OK | `backend.PayoutAccountController.getAll.GET` | GET | getAll | Registered |
| ✅ OK | `backend.PayoutAccountController.getMine.GET` | GET | getMine | Registered |
| ✅ OK | `backend.PayoutAccountController.remove.DELETE` | DELETE | remove | Registered |
| ✅ OK | `backend.PayoutAccountController.update.PUT` | PUT | update | Registered |

### PointsController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.PointsController.adminAward.POST` | POST | adminAward | Registered |
| ✅ OK | `backend.PointsController.adminDeduct.POST` | POST | adminDeduct | Registered |
| ✅ OK | `backend.PointsController.getLeaderboard.GET` | GET | getLeaderboard | Registered |
| ✅ OK | `backend.PointsController.getMySummary.GET` | GET | getMySummary | Registered |
| ✅ OK | `backend.PointsController.getMyTransactions.GET` | GET | getMyTransactions | Registered |
| ✅ OK | `backend.PointsController.getUserPoints.GET` | GET | getUserPoints | Registered |

### PointsRuleController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.PointsRuleController.create.POST` | POST | create | Registered |
| ✅ OK | `backend.PointsRuleController.getAll.GET` | GET | getAll | Registered |
| ✅ OK | `backend.PointsRuleController.getByRole.GET` | GET | getByRole | Registered |
| ✅ OK | `backend.PointsRuleController.getConversion.GET` | GET | getConversion | Registered |
| ✅ OK | `backend.PointsRuleController.getDefaults.GET` | GET | getDefaults | Registered |
| ✅ OK | `backend.PointsRuleController.getEarning.GET` | GET | getEarning | Registered |
| ✅ OK | `backend.PointsRuleController.remove.DELETE` | DELETE | remove | Registered |
| ✅ OK | `backend.PointsRuleController.update.PUT` | PUT | update | Registered |

### ProfilesController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.ProfilesController.findMyProfile.GET` | GET | findMyProfile | Registered |
| ✅ OK | `backend.ProfilesController.updateMyProfile.PUT` | PUT | updateMyProfile | Registered |

### PropertiesController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.PropertiesController.create.POST` | POST | create | Registered |
| ✅ OK | `backend.PropertiesController.createAlert.POST` | POST | createAlert | Registered |
| ✅ OK | `backend.PropertiesController.createPromo.POST` | POST | createPromo | Registered |
| ✅ OK | `backend.PropertiesController.deleteAlert.DELETE` | DELETE | deleteAlert | Registered |
| ✅ OK | `backend.PropertiesController.deletePromo.DELETE` | DELETE | deletePromo | Registered |
| ✅ OK | `backend.PropertiesController.findAll.GET` | GET | findAll | Registered |
| ✅ OK | `backend.PropertiesController.findOne.GET` | GET | findOne | Registered |
| ✅ OK | `backend.PropertiesController.getAvailability.GET` | GET | getAvailability | Registered |
| ✅ OK | `backend.PropertiesController.getMyAlerts.GET` | GET | getMyAlerts | Registered |
| ✅ OK | `backend.PropertiesController.getPromos.GET` | GET | getPromos | Registered |
| ✅ OK | `backend.PropertiesController.recalculateTrust.PUT` | PUT | recalculateTrust | Registered |
| ✅ OK | `backend.PropertiesController.remove.DELETE` | DELETE | remove | Registered |
| ✅ OK | `backend.PropertiesController.subscribePromoAlert.POST` | POST | subscribePromoAlert | Registered |
| ✅ OK | `backend.PropertiesController.unsubscribePromoAlert.DELETE` | DELETE | unsubscribePromoAlert | Registered |
| ✅ OK | `backend.PropertiesController.update.PUT` | PUT | update | Registered |
| ✅ OK | `backend.PropertiesController.updateAlert.PUT` | PUT | updateAlert | Registered |
| ✅ OK | `backend.PropertiesController.updateAvailability.PUT` | PUT | updateAvailability | Registered |
| ✅ OK | `backend.PropertiesController.updatePhotos.PUT` | PUT | updatePhotos | Registered |
| ✅ OK | `backend.PropertiesController.updatePrices.PUT` | PUT | updatePrices | Registered |

### PropertyGroupsController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.PropertyGroupsController.addProperty.POST` | POST | addProperty | Registered |
| ✅ OK | `backend.PropertyGroupsController.create.POST` | POST | create | Registered |
| ✅ OK | `backend.PropertyGroupsController.findAll.GET` | GET | findAll | Registered |
| ✅ OK | `backend.PropertyGroupsController.findOne.GET` | GET | findOne | Registered |
| ✅ OK | `backend.PropertyGroupsController.getGroupProperties.GET` | GET | getGroupProperties | Registered |
| ✅ OK | `backend.PropertyGroupsController.remove.DELETE` | DELETE | remove | Registered |
| ✅ OK | `backend.PropertyGroupsController.removeProperty.DELETE` | DELETE | removeProperty | Registered |
| ✅ OK | `backend.PropertyGroupsController.update.PUT` | PUT | update | Registered |

### RankingsController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.RankingsController.getMyRank.GET` | GET | getMyRank | Registered |
| ✅ OK | `backend.RankingsController.getRankings.GET` | GET | getRankings | Registered |

### RbacConfigController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.RbacConfigController.bulkUpdateBackend.PUT` | PUT | bulkUpdateBackend | Registered |
| ✅ OK | `backend.RbacConfigController.bulkUpdateFrontend.PUT` | PUT | bulkUpdateFrontend | Registered |
| ✅ OK | `backend.RbacConfigController.check.GET` | GET | check | Registered |
| ✅ OK | `backend.RbacConfigController.createBackend.POST` | POST | createBackend | Registered |
| ✅ OK | `backend.RbacConfigController.createFrontend.POST` | POST | createFrontend | Registered |
| ✅ OK | `backend.RbacConfigController.getBackendByRole.GET` | GET | getBackendByRole | Registered |
| ✅ OK | `backend.RbacConfigController.getFrontendByRole.GET` | GET | getFrontendByRole | Registered |
| ✅ OK | `backend.RbacConfigController.getRoles.GET` | GET | getRoles | Registered |
| ✅ OK | `backend.RbacConfigController.listBackend.GET` | GET | listBackend | Registered |
| ✅ OK | `backend.RbacConfigController.listFrontend.GET` | GET | listFrontend | Registered |
| ✅ OK | `backend.RbacConfigController.reloadCache.POST` | POST | reloadCache | Registered |
| ✅ OK | `backend.RbacConfigController.status.GET` | GET | status | Registered |
| ✅ OK | `backend.RbacConfigController.updateBackend.PUT` | PUT | updateBackend | Registered |
| ✅ OK | `backend.RbacConfigController.updateFrontend.PUT` | PUT | updateFrontend | Registered |

### ReactionsController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.ReactionsController.getReactions.GET` | GET | getReactions | Registered |
| ✅ OK | `backend.ReactionsController.removeReaction.DELETE` | DELETE | removeReaction | Registered |
| ✅ OK | `backend.ReactionsController.toggleReaction.POST` | POST | toggleReaction | Registered |

### ReferralController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.ReferralController.completeSignup.POST` | POST | completeSignup | Registered |
| ✅ OK | `backend.ReferralController.createReferral.POST` | POST | createReferral | Registered |
| ✅ OK | `backend.ReferralController.getMyCode.GET` | GET | getMyCode | Registered |
| ✅ OK | `backend.ReferralController.getMyReferrals.GET` | GET | getMyReferrals | Registered |
| ✅ OK | `backend.ReferralController.getMyStats.GET` | GET | getMyStats | Registered |
| ✅ OK | `backend.ReferralController.getShareStats.GET` | GET | getShareStats | Registered |
| ✅ OK | `backend.ReferralController.shareProperty.POST` | POST | shareProperty | Registered |

### ReviewsController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.ReviewsController.create.POST` | POST | create | Registered |
| ✅ OK | `backend.ReviewsController.findByProperty.GET` | GET | findByProperty | Registered |
| ✅ OK | `backend.ReviewsController.findOne.GET` | GET | findOne | Registered |
| ✅ OK | `backend.ReviewsController.reply.POST` | POST | reply | Registered |

### RewardsController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.RewardsController.cancelRedemption.PUT` | PUT | cancelRedemption | Registered |
| ✅ OK | `backend.RewardsController.create.POST` | POST | create | Registered |
| ✅ OK | `backend.RewardsController.getAll.GET` | GET | getAll | Registered |
| ✅ OK | `backend.RewardsController.getAllRedemptions.GET` | GET | getAllRedemptions | Registered |
| ✅ OK | `backend.RewardsController.getById.GET` | GET | getById | Registered |
| ✅ OK | `backend.RewardsController.getMyRedemptions.GET` | GET | getMyRedemptions | Registered |
| ✅ OK | `backend.RewardsController.getShop.GET` | GET | getShop | Registered |
| ✅ OK | `backend.RewardsController.redeem.POST` | POST | redeem | Registered |
| ✅ OK | `backend.RewardsController.remove.DELETE` | DELETE | remove | Registered |
| ✅ OK | `backend.RewardsController.update.PUT` | PUT | update | Registered |
| ✅ OK | `backend.RewardsController.useRedemption.PUT` | PUT | useRedemption | Registered |

### RolesController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.RolesController.assignManager.POST` | POST | assignManager | Registered |
| ✅ OK | `backend.RolesController.assignRole.POST` | POST | assignRole | Registered |
| ✅ OK | `backend.RolesController.checkPermission.GET` | GET | checkPermission | Registered |
| ✅ OK | `backend.RolesController.deleteUser.DELETE` | DELETE | deleteUser | Registered |
| ✅ OK | `backend.RolesController.getAllAssignments.GET` | GET | getAllAssignments | Registered |
| ✅ OK | `backend.RolesController.getAllUsers.GET` | GET | getAllUsers | Registered |
| ✅ OK | `backend.RolesController.getManagerPermissions.GET` | GET | getManagerPermissions | Registered |
| ✅ OK | `backend.RolesController.getManagerProperties.GET` | GET | getManagerProperties | Registered |
| ✅ OK | `backend.RolesController.getStats.GET` | GET | getStats | Registered |
| ✅ OK | `backend.RolesController.getUserRoles.GET` | GET | getUserRoles | Registered |
| ✅ OK | `backend.RolesController.removeAssignment.DELETE` | DELETE | removeAssignment | Registered |
| ✅ OK | `backend.RolesController.removeRole.DELETE` | DELETE | removeRole | Registered |
| ✅ OK | `backend.RolesController.setPermissions.POST` | POST | setPermissions | Registered |
| ✅ OK | `backend.RolesController.updateUserStatus.PUT` | PUT | updateUserStatus | Registered |

### SSOController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ⚠️ À faire | — | ? | exchangeToken | Not in seed |
| ⚠️ À faire | — | ? | getUserInfo | Not in seed |
| ⚠️ À faire | — | ? | logout | Not in seed |
| ⚠️ À faire | — | ? | refreshToken | Not in seed |

### ServiceBookingsController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.ServiceBookingsController.accept.PUT` | PUT | accept | Registered |
| ✅ OK | `backend.ServiceBookingsController.bulkSetAvailability.POST` | POST | bulkSetAvailability | Registered |
| ✅ OK | `backend.ServiceBookingsController.cancel.PUT` | PUT | cancel | Registered |
| ✅ OK | `backend.ServiceBookingsController.create.POST` | POST | create | Registered |
| ✅ OK | `backend.ServiceBookingsController.decline.PUT` | PUT | decline | Registered |
| ✅ OK | `backend.ServiceBookingsController.getAvailability.GET` | GET | getAvailability | Registered |
| ✅ OK | `backend.ServiceBookingsController.getMyBookings.GET` | GET | getMyBookings | Registered |
| ✅ OK | `backend.ServiceBookingsController.getOne.GET` | GET | getOne | Registered |
| ✅ OK | `backend.ServiceBookingsController.getProviderBookings.GET` | GET | getProviderBookings | Registered |
| ✅ OK | `backend.ServiceBookingsController.setAvailability.POST` | POST | setAvailability | Registered |

### ServiceFeeController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.ServiceFeeController.calculate.POST` | POST | calculate | Registered |
| ✅ OK | `backend.ServiceFeeController.create.POST` | POST | create | Registered |
| ✅ OK | `backend.ServiceFeeController.getAll.GET` | GET | getAll | Registered |
| ✅ OK | `backend.ServiceFeeController.getDefault.GET` | GET | getDefault | Registered |
| ✅ OK | `backend.ServiceFeeController.getForHost.GET` | GET | getForHost | Registered |
| ✅ OK | `backend.ServiceFeeController.remove.DELETE` | DELETE | remove | Registered |
| ✅ OK | `backend.ServiceFeeController.update.PUT` | PUT | update | Registered |

### ServiceGroupsController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.ServiceGroupsController.addService.POST` | POST | addService | Registered |
| ✅ OK | `backend.ServiceGroupsController.create.POST` | POST | create | Registered |
| ✅ OK | `backend.ServiceGroupsController.findAll.GET` | GET | findAll | Registered |
| ✅ OK | `backend.ServiceGroupsController.findOne.GET` | GET | findOne | Registered |
| ✅ OK | `backend.ServiceGroupsController.getServices.GET` | GET | getServices | Registered |
| ✅ OK | `backend.ServiceGroupsController.remove.DELETE` | DELETE | remove | Registered |
| ✅ OK | `backend.ServiceGroupsController.removeService.DELETE` | DELETE | removeService | Registered |
| ✅ OK | `backend.ServiceGroupsController.update.PUT` | PUT | update | Registered |

### SessionController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|

### SettingsController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.SettingsController.changePassword.PUT` | PUT | changePassword | Registered |
| ✅ OK | `backend.SettingsController.getSettings.GET` | GET | getSettings | Registered |
| ✅ OK | `backend.SettingsController.updateAccount.PUT` | PUT | updateAccount | Registered |
| ✅ OK | `backend.SettingsController.updateNotifications.PUT` | PUT | updateNotifications | Registered |
| ✅ OK | `backend.SettingsController.updatePreferences.PUT` | PUT | updatePreferences | Registered |

### SupportChatController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.SupportChatController.assignThread.PATCH` | PATCH | assignThread | Registered |
| ✅ OK | `backend.SupportChatController.createThread.POST` | POST | createThread | Registered |
| ✅ OK | `backend.SupportChatController.getAdminThreads.GET` | GET | getAdminThreads | Registered |
| ✅ OK | `backend.SupportChatController.getMessages.GET` | GET | getMessages | Registered |
| ✅ OK | `backend.SupportChatController.getMyThreads.GET` | GET | getMyThreads | Registered |
| ✅ OK | `backend.SupportChatController.getThread.GET` | GET | getThread | Registered |
| ✅ OK | `backend.SupportChatController.markRead.POST` | POST | markRead | Registered |
| ✅ OK | `backend.SupportChatController.sendMessage.POST` | POST | sendMessage | Registered |
| ✅ OK | `backend.SupportChatController.updateStatus.PATCH` | PATCH | updateStatus | Registered |

### TourismServicesController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.TourismServicesController.create.POST` | POST | create | Registered |
| ✅ OK | `backend.TourismServicesController.findAll.GET` | GET | findAll | Registered |
| ✅ OK | `backend.TourismServicesController.findOne.GET` | GET | findOne | Registered |
| ✅ OK | `backend.TourismServicesController.getCategories.GET` | GET | getCategories | Registered |
| ✅ OK | `backend.TourismServicesController.pause.PUT` | PUT | pause | Registered |
| ✅ OK | `backend.TourismServicesController.remove.DELETE` | DELETE | remove | Registered |
| ✅ OK | `backend.TourismServicesController.update.PUT` | PUT | update | Registered |

### UserController

| Status | Permission Key | Method | Handler | Description |
|--------|---------------|--------|---------|-------------|
| ✅ OK | `backend.UserController.completeProfile.POST` | POST | completeProfile | Registered |
| ✅ OK | `backend.UserController.deleteAvatar.DELETE` | DELETE | deleteAvatar | Registered |
| ✅ OK | `backend.UserController.updateLanguage.PUT` | PUT | updateLanguage | Registered |
| ✅ OK | `backend.UserController.uploadAvatar.POST` | POST | uploadAvatar | Registered |
| ⚠️ À faire | — | ? | for | Not in seed |
| ⚠️ À faire | — | ? | if | Not in seed |
| ⚠️ À faire | — | ? | if | Not in seed |
| ⚠️ À faire | — | ? | if | Not in seed |
| ⚠️ À faire | — | ? | if | Not in seed |

## Summary

| Status | Count |
|--------|-------|
| ✅ OK | 225 |
| ⚠️ À faire | 29 |
| ❌ Orphans | 3 |
| **Total endpoints** | **257** |
