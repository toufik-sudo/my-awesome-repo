# Frontend API Permissions Audit

> Generated: 2026-04-07
> Source: `backend/src/seeds/seed-permission-bindings.ts` + frontend `*.api.ts` files

## Legend

| Status | Meaning |
|--------|---------|
| ✅ OK | Binding exists in seed, maps frontend API → backend permission |
| ❌ Not yet | No binding — needs to be added |

---

## Properties (`propertiesApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `propertiesApi.getAll.GET` | `backend.PropertiesController.findAll.GET` | ✅ OK |
| `propertiesApi.getById.GET` | `backend.PropertiesController.findOne.GET` | ✅ OK |
| `propertiesApi.create.POST` | `backend.PropertiesController.create.POST` | ✅ OK |
| `propertiesApi.update.PUT` | `backend.PropertiesController.update.PUT` | ✅ OK |
| `propertiesApi.updatePrices.PUT` | `backend.PropertiesController.update.PUT` | ✅ OK |
| `propertiesApi.updatePhotos.PUT` | `backend.PropertiesController.update.PUT` | ✅ OK |
| `propertiesApi.updateAvailability.PUT` | `backend.PropertiesController.updateAvailability.PUT` | ✅ OK |
| `propertiesApi.delete.DELETE` | `backend.PropertiesController.delete.DELETE` | ✅ OK |
| `propertiesApi.getAvailability.GET` | `backend.PropertiesController.getAvailability.GET` | ✅ OK |

## Property Groups (`groupsApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `groupsApi.getAll.GET` | `backend.PropertyGroupsController.findAll.GET` | ✅ OK |
| `groupsApi.getOne.GET` | `backend.PropertyGroupsController.findOne.GET` | ✅ OK |
| `groupsApi.create.POST` | `backend.PropertyGroupsController.create.POST` | ✅ OK |
| `groupsApi.update.PUT` | `backend.PropertyGroupsController.update.PUT` | ✅ OK |
| `groupsApi.remove.DELETE` | `backend.PropertyGroupsController.remove.DELETE` | ✅ OK |

## Bookings (`bookingsApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `bookingsApi.create.POST` | `backend.BookingsController.create.POST` | ✅ OK |
| `bookingsApi.getAll.GET` | `backend.BookingsController.findAll.GET` | ✅ OK |
| `bookingsApi.getById.GET` | `backend.BookingsController.findOne.GET` | ✅ OK |
| `bookingsApi.getByGuest.GET` | `backend.BookingsController.findByGuest.GET` | ✅ OK |
| `bookingsApi.updateStatus.PUT` | `backend.BookingsController.updateStatus.PUT` | ✅ OK |
| `bookingsApi.decline.PUT` | `backend.BookingsController.decline.PUT` | ✅ OK |
| `bookingsApi.counterOffer.POST` | `backend.BookingsController.counterOffer.POST` | ✅ OK |
| `bookingsApi.checkAvailability.GET` | `backend.BookingsController.checkAvailability.GET` | ✅ OK |

## Tourism Services (`servicesApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `servicesApi.getAll.GET` | `backend.TourismServicesController.findAll.GET` | ✅ OK |
| `servicesApi.getById.GET` | `backend.TourismServicesController.findOne.GET` | ✅ OK |
| `servicesApi.create.POST` | `backend.TourismServicesController.create.POST` | ✅ OK |
| `servicesApi.update.PUT` | `backend.TourismServicesController.update.PUT` | ✅ OK |
| `servicesApi.remove.DELETE` | `backend.TourismServicesController.remove.DELETE` | ✅ OK |

## Service Bookings (`serviceBookingsApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `serviceBookingsApi.create.POST` | `backend.ServiceBookingsController.create.POST` | ✅ OK |
| `serviceBookingsApi.getProviderBookings.GET` | `backend.ServiceBookingsController.getProviderBookings.GET` | ✅ OK |
| `serviceBookingsApi.accept.PUT` | `backend.ServiceBookingsController.accept.PUT` | ✅ OK |
| `serviceBookingsApi.decline.PUT` | `backend.ServiceBookingsController.decline.PUT` | ✅ OK |

## Reviews (`reviewsApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `reviewsApi.getByProperty.GET` | `backend.ReviewsController.findByProperty.GET` | ✅ OK |
| `reviewsApi.create.POST` | `backend.ReviewsController.create.POST` | ✅ OK |

## Comments (`commentsApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `commentsApi.getComments.GET` | `backend.CommentsController.getComments.GET` | ✅ OK |
| `commentsApi.create.POST` | `backend.CommentsController.create.POST` | ✅ OK |
| `commentsApi.update.PUT` | `backend.CommentsController.update.PUT` | ✅ OK |
| `commentsApi.delete.DELETE` | `backend.CommentsController.delete.DELETE` | ✅ OK |

## Favorites (`favoritesApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `favoritesApi.getMyFavorites.GET` | `backend.FavoritesController.findByUser.GET` | ✅ OK |
| `favoritesApi.toggle.POST` | `backend.FavoritesController.toggle.POST` | ✅ OK |

## Payments (`paymentsApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `paymentsApi.getPendingReceipts.GET` | `backend.PaymentsController.getPendingReceipts.GET` | ✅ OK |
| `paymentsApi.approveReceipt.PUT` | `backend.PaymentsController.approveReceipt.PUT` | ✅ OK |
| `paymentsApi.rejectReceipt.PUT` | `backend.PaymentsController.rejectReceipt.PUT` | ✅ OK |
| `paymentsApi.uploadReceipt.POST` | `backend.PaymentsController.uploadReceipt.POST` | ✅ OK |
| `paymentsApi.getTransferAccounts.GET` | `backend.PaymentsController.getTransferAccounts.GET` | ✅ OK |
| `paymentsApi.getAllTransferAccounts.GET` | `backend.PaymentsController.getAllTransferAccounts.GET` | ✅ OK |
| `paymentsApi.upsertTransferAccount.POST` | `backend.PaymentsController.upsertTransferAccount.POST` | ✅ OK |
| `paymentsApi.deleteTransferAccount.DELETE` | `backend.PaymentsController.deleteTransferAccount.DELETE` | ✅ OK |

## Dashboard

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `dashboardApi.getDashboard.GET` | `backend.DashboardController.getDashboard.GET` | ✅ OK |

## Metrics (`metricsApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `metricsApi.getUsers.GET` | `backend.MetricsController.getDetailedUsers.GET` | ✅ OK |
| `metricsApi.getBookings.GET` | `backend.MetricsController.getDetailedBookings.GET` | ✅ OK |
| `metricsApi.getProperties.GET` | `backend.MetricsController.getDetailedProperties.GET` | ✅ OK |
| `metricsApi.getServices.GET` | `backend.MetricsController.getDetailedServices.GET` | ✅ OK |
| `metricsApi.getRevenue.GET` | `backend.MetricsController.getRevenueBreakdown.GET` | ✅ OK |
| `metricsApi.getSummary.GET` | `backend.MetricsController.getPlatformSummary.GET` | ✅ OK |

## Hyper Management (`hyperManagementApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `hyperManagementApi.pauseProperty.PUT` | `backend.HyperManagementController.pauseProperty.PUT` | ✅ OK |
| `hyperManagementApi.resumeProperty.PUT` | `backend.HyperManagementController.resumeProperty.PUT` | ✅ OK |
| `hyperManagementApi.archiveProperty.PUT` | `backend.HyperManagementController.archiveProperty.PUT` | ✅ OK |
| `hyperManagementApi.deleteProperty.DELETE` | `backend.HyperManagementController.deleteProperty.DELETE` | ✅ OK |
| `hyperManagementApi.pauseUser.PUT` | `backend.HyperManagementController.pauseUser.PUT` | ✅ OK |
| `hyperManagementApi.resumeUser.PUT` | `backend.HyperManagementController.resumeUser.PUT` | ✅ OK |
| `hyperManagementApi.archiveUser.PUT` | `backend.HyperManagementController.archiveUser.PUT` | ✅ OK |

## Document Validation (`documentsApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `documentsApi.getPending.GET` | `backend.DocumentValidationController.getPendingDocuments.GET` | ✅ OK |
| `documentsApi.approve.PUT` | `backend.DocumentValidationController.approveDocument.PUT` | ✅ OK |
| `documentsApi.reject.PUT` | `backend.DocumentValidationController.rejectDocument.PUT` | ✅ OK |

## Service Fees (`serviceFeesApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `serviceFeesApi.getAll.GET` | `backend.ServiceFeeController.getAll.GET` | ✅ OK |
| `serviceFeesApi.create.POST` | `backend.ServiceFeeController.create.POST` | ✅ OK |
| `serviceFeesApi.update.PUT` | `backend.ServiceFeeController.update.PUT` | ✅ OK |
| `serviceFeesApi.remove.DELETE` | `backend.ServiceFeeController.remove.DELETE` | ✅ OK |

## Cancellation Rules (`cancellationRulesApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `cancellationRulesApi.getForUser.GET` | `backend.CancellationRuleController.getForUser.GET` | ✅ OK |
| `cancellationRulesApi.create.POST` | `backend.CancellationRuleController.create.POST` | ✅ OK |
| `cancellationRulesApi.update.PUT` | `backend.CancellationRuleController.update.PUT` | ✅ OK |
| `cancellationRulesApi.remove.DELETE` | `backend.CancellationRuleController.remove.DELETE` | ✅ OK |

## Host Fee Absorption (`hostFeeAbsorptionApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `hostFeeAbsorptionApi.getMine.GET` | `backend.HostFeeAbsorptionController.getForHost.GET` | ✅ OK |
| `hostFeeAbsorptionApi.getForHost.GET` | `backend.HostFeeAbsorptionController.getForHost.GET` | ✅ OK |
| `hostFeeAbsorptionApi.create.POST` | `backend.HostFeeAbsorptionController.create.POST` | ✅ OK |
| `hostFeeAbsorptionApi.update.PUT` | `backend.HostFeeAbsorptionController.update.PUT` | ✅ OK |
| `hostFeeAbsorptionApi.remove.DELETE` | `backend.HostFeeAbsorptionController.remove.DELETE` | ✅ OK |

## Payout Accounts (`payoutAccountsApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `payoutAccountsApi.getForHost.GET` | `backend.PayoutAccountController.getForHost.GET` | ✅ OK |
| `payoutAccountsApi.create.POST` | `backend.PayoutAccountController.create.POST` | ✅ OK |
| `payoutAccountsApi.update.PUT` | `backend.PayoutAccountController.update.PUT` | ✅ OK |
| `payoutAccountsApi.remove.DELETE` | `backend.PayoutAccountController.remove.DELETE` | ✅ OK |

## Points Rules (`pointsRulesApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `pointsRulesApi.getAll.GET` | `backend.PointsRuleController.getAll.GET` | ✅ OK |
| `pointsRulesApi.create.POST` | `backend.PointsRuleController.create.POST` | ✅ OK |
| `pointsRulesApi.update.PUT` | `backend.PointsRuleController.update.PUT` | ✅ OK |
| `pointsRulesApi.remove.DELETE` | `backend.PointsRuleController.remove.DELETE` | ✅ OK |

## Invitations (`invitationsApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `invitationsApi.getAllowedRoles.GET` | `backend.InvitationController.getAllowedRoles.GET` | ✅ OK |
| `invitationsApi.getInvitations.GET` | `backend.InvitationController.getInvitations.GET` | ✅ OK |
| `invitationsApi.createInvitation.POST` | `backend.InvitationController.createInvitation.POST` | ✅ OK |
| `invitationsApi.cancelInvitation.PUT` | `backend.InvitationController.cancelInvitation.PUT` | ✅ OK |
| `invitationsApi.resendInvitation.POST` | `backend.InvitationController.resendInvitation.POST` | ✅ OK |

## Points (`pointsApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `pointsApi.getMySummary.GET` | `backend.PointsController.getUserSummary.GET` | ✅ OK |
| `pointsApi.getLeaderboard.GET` | `backend.PointsController.getLeaderboard.GET` | ✅ OK |

## Notifications

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `notificationsApi.getAll.GET` | `backend.NotificationController.findByUser.GET` | ✅ OK |

## Referrals (`referralsApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `referralsApi.getMyCode.GET` | `backend.ReferralController.getUserReferrals.GET` | ✅ OK |
| `referralsApi.createReferral.POST` | `backend.ReferralController.createReferral.POST` | ✅ OK |

## Support Chat

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `supportChatApi.getUserThreads.GET` | `backend.SupportChatController.getUserThreads.GET` | ✅ OK |
| `supportChatApi.createThread.POST` | `backend.SupportChatController.createThread.POST` | ✅ OK |
| `supportChatApi.getAdminThreads.GET` | `backend.SupportChatController.getAdminThreads.GET` | ✅ OK |

## RBAC Config (`rbacConfigApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `rbacConfigApi.getBackendPermissions.GET` | `backend.RbacConfigController.listBackend.GET` | ✅ OK |
| `rbacConfigApi.updateBackendPermission.PUT` | `backend.RbacConfigController.updateBackend.PUT` | ✅ OK |
| `rbacConfigApi.createBackendPermission.POST` | `backend.RbacConfigController.createBackend.POST` | ✅ OK |
| `rbacConfigApi.reloadCache.POST` | `backend.RbacConfigController.reload.POST` | ✅ OK |

## Roles (`rolesApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `rolesApi.getUserRoles.GET` | `backend.RolesController.getUserRoles.GET` | ✅ OK |
| `rolesApi.setRole.PUT` | `backend.RolesController.setRole.PUT` | ✅ OK |

## Assignments (`assignmentsApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `assignmentsApi.getAll.GET` | `backend.RolesController.getAssignments.GET` | ✅ OK |
| `assignmentsApi.create.POST` | `backend.RolesController.createAssignment.POST` | ✅ OK |
| `assignmentsApi.remove.DELETE` | `backend.RolesController.deleteAssignment.DELETE` | ✅ OK |

## Rewards (`rewardsApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `rewardsApi.getShopRewards.GET` | `backend.RewardsController.getShopRewards.GET` | ✅ OK |
| `rewardsApi.redeem.POST` | `backend.RewardsController.redeem.POST` | ✅ OK |
| `rewardsApi.getAll.GET` | `backend.RewardsController.getAll.GET` | ✅ OK |
| `rewardsApi.create.POST` | `backend.RewardsController.create.POST` | ✅ OK |

## Trust Recalculation (`trustApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `trustApi.recalculate.PUT` | `backend.PropertiesController.recalculateTrust.PUT` | ✅ OK |

## Email Tracking (`emailTrackingApi`)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `emailTrackingApi.getStats.GET` | `backend.EmailTrackingController.getStats.GET` | ✅ OK |

## Permission Bindings (meta)

| Frontend API Key | Backend Permission Key | Status |
|---|---|---|
| `permissionBindingsApi.getAll.GET` | `backend.PermissionBindingController.findAll.GET` | ✅ OK |
| `permissionBindingsApi.getBindingMap.GET` | `backend.PermissionBindingController.getBindingMap.GET` | ✅ OK |
| `permissionBindingsApi.create.POST` | `backend.PermissionBindingController.create.POST` | ✅ OK |
| `permissionBindingsApi.remove.DELETE` | `backend.PermissionBindingController.remove.DELETE` | ✅ OK |

---

## Summary

| Module | APIs Mapped | Status |
|--------|------------|--------|
| Properties | 9 | ✅ All OK |
| Property Groups | 5 | ✅ All OK |
| Bookings | 8 | ✅ All OK |
| Tourism Services | 5 | ✅ All OK |
| Service Bookings | 4 | ✅ All OK |
| Reviews | 2 | ✅ All OK |
| Comments | 4 | ✅ All OK |
| Favorites | 2 | ✅ All OK |
| Payments | 8 | ✅ All OK |
| Dashboard | 1 | ✅ All OK |
| Metrics | 6 | ✅ All OK |
| Hyper Management | 7 | ✅ All OK |
| Document Validation | 3 | ✅ All OK |
| Service Fees | 4 | ✅ All OK |
| Cancellation Rules | 4 | ✅ All OK |
| Host Fee Absorption | 5 | ✅ All OK |
| Payout Accounts | 4 | ✅ All OK |
| Points Rules | 4 | ✅ All OK |
| Invitations | 5 | ✅ All OK |
| Points | 2 | ✅ All OK |
| Notifications | 1 | ✅ All OK |
| Referrals | 2 | ✅ All OK |
| Support Chat | 3 | ✅ All OK |
| RBAC Config | 4 | ✅ All OK |
| Roles | 2 | ✅ All OK |
| Assignments | 3 | ✅ All OK |
| Rewards | 4 | ✅ All OK |
| Trust | 1 | ✅ All OK |
| Email Tracking | 1 | ✅ All OK |
| Permission Bindings | 4 | ✅ All OK |
| **TOTAL** | **116** | **✅ 100% mapped** |

## Architecture

```
Frontend API call
    ↓
useRoleAccess.guardApi('bookingsApi.create.POST', fn)
    ↓
bindingMap['bookingsApi.create.POST'] → [{ backendKey, roles }]
    ↓
role ∈ roles? → ✅ Execute API call
                → ❌ Show "Access denied" popup, block request
```
