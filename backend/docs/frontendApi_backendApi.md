# Frontend API → Backend API Audit

> Generated: 2026-04-08
> Source: `src/modules/**/*.api.ts`, `src/services/*.api.ts`
> Backend: `backend/src/**/*.controller.ts`

## Summary

| Module | Frontend APIs | Bindings | Status |
|--------|--------------|----------|--------|
| Properties | 12 | 12 | ✅ Complete |
| Saved Search Alerts | 4 | 4 | ✅ Complete |
| Property Groups | 8 | 8 | ✅ Complete |
| Bookings | 8 | 8 | ✅ Complete |
| Tourism Services | 8 | 8 | ✅ Complete |
| Service Bookings | 10 | 10 | ✅ Complete |
| Service Groups | 8 | 8 | ✅ Complete |
| Reviews | 4 | 4 | ✅ Complete |
| Comments | 5 | 5 | ✅ Complete |
| Reactions | 3 | 3 | ✅ Complete |
| Favorites | 4 | 4 | ✅ Complete |
| Payments | 10 | 10 | ✅ Complete |
| Dashboard | 1 | 1 | ✅ Complete |
| Metrics | 6 | 6 | ✅ Complete |
| Hyper Management | 12 | 12 | ✅ Complete |
| Document Validation | 6 | 6 | ✅ Complete |
| Service Fees | 4 | 4 | ✅ Complete |
| Cancellation Rules | 5 | 5 | ✅ Complete |
| Host Fee Absorption | 5 | 5 | ✅ Complete |
| Payout Accounts | 4 | 4 | ✅ Complete |
| Points Rules | 4 | 4 | ✅ Complete |
| Invitations | 8 | 8 | ✅ Complete |
| Points | 6 | 6 | ✅ Complete |
| Badges | 4 | 4 | ✅ Complete |
| Notifications | 5 | 5 | ✅ Complete |
| Referrals | 7 | 7 | ✅ Complete |
| Chat | 3 | 3 | ✅ Complete |
| Support | 9 | 9 | ✅ Complete |
| Rankings | 2 | 2 | ✅ Complete |
| Profiles | 2 | 2 | ✅ Complete |
| Settings | 5 | 5 | ✅ Complete |
| RBAC Config | 7 | 7 | ✅ Complete |
| Roles | 5 | 5 | ✅ Complete |
| Assignments | 5 | 5 | ✅ Complete |
| Rewards | 11 | 11 | ✅ Complete |
| Trust | 1 | 1 | ✅ Complete |
| Email Tracking | 1 | 1 | ✅ Complete |
| Permission Bindings | 4 | 4 | ✅ Complete |
| Auth | 5 | 5 | ✅ Complete |
| User | 3 | 3 | ✅ Complete |
| **Total** | **~222** | **~222** | ✅ |

---

## Detailed Mapping

### Properties (`src/modules/properties/properties.api.ts`)

| Frontend API | Method | Backend Controller.Handler | Backend Key |
|-------------|--------|---------------------------|-------------|
| `propertiesApi.getAll` | GET | `PropertiesController.findAll` | `backend.PropertiesController.findAll.GET` |
| `propertiesApi.getById` | GET | `PropertiesController.findOne` | `backend.PropertiesController.findOne.GET` |
| `propertiesApi.create` | POST | `PropertiesController.create` | `backend.PropertiesController.create.POST` |
| `propertiesApi.update` | PUT | `PropertiesController.update` | `backend.PropertiesController.update.PUT` |
| `propertiesApi.updatePrices` | PUT | `PropertiesController.updatePrices` | `backend.PropertiesController.updatePrices.PUT` |
| `propertiesApi.updatePhotos` | PUT | `PropertiesController.updatePhotos` | `backend.PropertiesController.updatePhotos.PUT` |
| `propertiesApi.updateAvailability` | PUT | `PropertiesController.updateAvailability` | `backend.PropertiesController.updateAvailability.PUT` |
| `propertiesApi.delete` | DELETE | `PropertiesController.remove` | `backend.PropertiesController.remove.DELETE` |
| `propertiesApi.getAvailability` | GET | `PropertiesController.getAvailability` | `backend.PropertiesController.getAvailability.GET` |
| `propertiesApi.subscribePromoAlert` | POST | `PropertiesController.subscribePromoAlert` | `backend.PropertiesController.subscribePromoAlert.POST` |
| `propertiesApi.unsubscribePromoAlert` | DELETE | `PropertiesController.unsubscribePromoAlert` | `backend.PropertiesController.unsubscribePromoAlert.DELETE` |
| `propertiesApi.getPromos` | GET | `PropertiesController.getPromos` | `backend.PropertiesController.getPromos.GET` |

### Saved Search Alerts (`src/modules/properties/properties.api.ts`)

| Frontend API | Method | Backend Controller.Handler | Backend Key |
|-------------|--------|---------------------------|-------------|
| `savedSearchAlertsApi.getAll` | GET | `PropertiesController.getSavedSearchAlerts` | `backend.PropertiesController.getSavedSearchAlerts.GET` |
| `savedSearchAlertsApi.create` | POST | `PropertiesController.createSavedSearchAlert` | `backend.PropertiesController.createSavedSearchAlert.POST` |
| `savedSearchAlertsApi.update` | PUT | `PropertiesController.updateSavedSearchAlert` | `backend.PropertiesController.updateSavedSearchAlert.PUT` |
| `savedSearchAlertsApi.delete` | DELETE | `PropertiesController.deleteSavedSearchAlert` | `backend.PropertiesController.deleteSavedSearchAlert.DELETE` |

### Property Groups (`src/modules/admin/admin.api.ts`)

| Frontend API | Method | Backend Controller.Handler | Backend Key |
|-------------|--------|---------------------------|-------------|
| `groupsApi.getAll` | GET | `PropertyGroupsController.findAll` | `backend.PropertyGroupsController.findAll.GET` |
| `groupsApi.getOne` | GET | `PropertyGroupsController.findOne` | `backend.PropertyGroupsController.findOne.GET` |
| `groupsApi.create` | POST | `PropertyGroupsController.create` | `backend.PropertyGroupsController.create.POST` |
| `groupsApi.update` | PUT | `PropertyGroupsController.update` | `backend.PropertyGroupsController.update.PUT` |
| `groupsApi.remove` | DELETE | `PropertyGroupsController.remove` | `backend.PropertyGroupsController.remove.DELETE` |
| `groupsApi.getProperties` | GET | `PropertyGroupsController.getProperties` | `backend.PropertyGroupsController.getProperties.GET` |
| `groupsApi.addProperty` | POST | `PropertyGroupsController.addProperty` | `backend.PropertyGroupsController.addProperty.POST` |
| `groupsApi.removeProperty` | DELETE | `PropertyGroupsController.removeProperty` | `backend.PropertyGroupsController.removeProperty.DELETE` |

### Bookings (`src/modules/bookings/bookings.api.ts`)

| Frontend API | Method | Backend Controller.Handler | Backend Key |
|-------------|--------|---------------------------|-------------|
| `bookingsApi.create` | POST | `BookingsController.create` | `backend.BookingsController.create.POST` |
| `bookingsApi.getHostBookings` | GET | `BookingsController.findAll` | `backend.BookingsController.findAll.GET` |
| `bookingsApi.getOne` | GET | `BookingsController.findOne` | `backend.BookingsController.findOne.GET` |
| `bookingsApi.getMyBookings` | GET | `BookingsController.getMyBookings` | `backend.BookingsController.getMyBookings.GET` |
| `bookingsApi.cancel` | PUT | `BookingsController.updateStatus` | `backend.BookingsController.updateStatus.PUT` |
| `bookingsApi.accept` | PUT | `BookingsController.accept` | `backend.BookingsController.accept.PUT` |
| `bookingsApi.decline` | PUT | `BookingsController.decline` | `backend.BookingsController.decline.PUT` |
| `bookingsApi.counterOffer` | PUT | `BookingsController.counterOffer` | `backend.BookingsController.counterOffer.PUT` |
| `bookingsApi.checkAvailability` | GET | `BookingsController.checkAvailability` | `backend.BookingsController.checkAvailability.GET` |

### Tourism Services (`src/modules/services/services.api.ts`)

| Frontend API | Method | Backend Controller.Handler | Backend Key |
|-------------|--------|---------------------------|-------------|
| `tourismServicesApi.getAll` | GET | `TourismServicesController.findAll` | `backend.TourismServicesController.findAll.GET` |
| `tourismServicesApi.getById` | GET | `TourismServicesController.findOne` | `backend.TourismServicesController.findOne.GET` |
| `tourismServicesApi.create` | POST | `TourismServicesController.create` | `backend.TourismServicesController.create.POST` |
| `tourismServicesApi.update` | PUT | `TourismServicesController.update` | `backend.TourismServicesController.update.PUT` |
| `tourismServicesApi.delete` | DELETE | `TourismServicesController.remove` | `backend.TourismServicesController.remove.DELETE` |
| `tourismServicesApi.getCategories` | GET | `TourismServicesController.getCategories` | `backend.TourismServicesController.getCategories.GET` |
| `tourismServicesApi.uploadDocument` | POST | `TourismServicesController.uploadDocument` | `backend.TourismServicesController.uploadDocument.POST` |
| `tourismServicesApi.getDocuments` | GET | `TourismServicesController.getDocuments` | `backend.TourismServicesController.getDocuments.GET` |

### Service Bookings (`src/modules/services/service-bookings.api.ts`)

| Frontend API | Method | Backend Controller.Handler | Backend Key |
|-------------|--------|---------------------------|-------------|
| `serviceBookingsApi.create` | POST | `ServiceBookingsController.create` | `backend.ServiceBookingsController.create.POST` |
| `serviceBookingsApi.getMyBookings` | GET | `ServiceBookingsController.getMyBookings` | `backend.ServiceBookingsController.getMyBookings.GET` |
| `serviceBookingsApi.getProviderBookings` | GET | `ServiceBookingsController.getProviderBookings` | `backend.ServiceBookingsController.getProviderBookings.GET` |
| `serviceBookingsApi.getOne` | GET | `ServiceBookingsController.getOne` | `backend.ServiceBookingsController.getOne.GET` |
| `serviceBookingsApi.accept` | PUT | `ServiceBookingsController.accept` | `backend.ServiceBookingsController.accept.PUT` |
| `serviceBookingsApi.decline` | PUT | `ServiceBookingsController.decline` | `backend.ServiceBookingsController.decline.PUT` |
| `serviceBookingsApi.cancel` | PUT | `ServiceBookingsController.cancel` | `backend.ServiceBookingsController.cancel.PUT` |
| `serviceBookingsApi.getAvailability` | GET | `ServiceBookingsController.getAvailability` | `backend.ServiceBookingsController.getAvailability.GET` |
| `serviceBookingsApi.setAvailability` | POST | `ServiceBookingsController.setAvailability` | `backend.ServiceBookingsController.setAvailability.POST` |
| `serviceBookingsApi.bulkSetAvailability` | POST | `ServiceBookingsController.bulkSetAvailability` | `backend.ServiceBookingsController.bulkSetAvailability.POST` |

### Service Groups (`src/modules/services/service-bookings.api.ts`)

| Frontend API | Method | Backend Controller.Handler | Backend Key |
|-------------|--------|---------------------------|-------------|
| `serviceGroupsApi.getAll` | GET | `ServiceGroupsController.findAll` | `backend.ServiceGroupsController.findAll.GET` |
| `serviceGroupsApi.getOne` | GET | `ServiceGroupsController.findOne` | `backend.ServiceGroupsController.findOne.GET` |
| `serviceGroupsApi.create` | POST | `ServiceGroupsController.create` | `backend.ServiceGroupsController.create.POST` |
| `serviceGroupsApi.update` | PUT | `ServiceGroupsController.update` | `backend.ServiceGroupsController.update.PUT` |
| `serviceGroupsApi.remove` | DELETE | `ServiceGroupsController.remove` | `backend.ServiceGroupsController.remove.DELETE` |
| `serviceGroupsApi.getServices` | GET | `ServiceGroupsController.getServices` | `backend.ServiceGroupsController.getServices.GET` |
| `serviceGroupsApi.addService` | POST | `ServiceGroupsController.addService` | `backend.ServiceGroupsController.addService.POST` |
| `serviceGroupsApi.removeService` | DELETE | `ServiceGroupsController.removeService` | `backend.ServiceGroupsController.removeService.DELETE` |

### Reviews (`src/modules/reviews/reviews.api.ts`)

| Frontend API | Method | Backend Controller.Handler | Backend Key |
|-------------|--------|---------------------------|-------------|
| `reviewsApi.getByProperty` | GET | `ReviewsController.findByProperty` | `backend.ReviewsController.findByProperty.GET` |
| `reviewsApi.getOne` | GET | `ReviewsController.findOne` | `backend.ReviewsController.findOne.GET` |
| `reviewsApi.create` | POST | `ReviewsController.create` | `backend.ReviewsController.create.POST` |
| `reviewsApi.replyToReview` | POST | `ReviewsController.reply` | `backend.ReviewsController.reply.POST` |

### Comments (`src/modules/social/social.api.ts`)

| Frontend API | Method | Backend Controller.Handler | Backend Key |
|-------------|--------|---------------------------|-------------|
| `commentsApi.getComments` | GET | `CommentsController.getComments` | `backend.CommentsController.getComments.GET` |
| `commentsApi.getReplies` | GET | `CommentsController.getReplies` | `backend.CommentsController.getReplies.GET` |
| `commentsApi.create` | POST | `CommentsController.createComment` | `backend.CommentsController.createComment.POST` |
| `commentsApi.update` | PUT | `CommentsController.updateComment` | `backend.CommentsController.updateComment.PUT` |
| `commentsApi.delete` | DELETE | `CommentsController.deleteComment` | `backend.CommentsController.deleteComment.DELETE` |

### Reactions (`src/modules/social/social.api.ts`)

| Frontend API | Method | Backend Controller.Handler | Backend Key |
|-------------|--------|---------------------------|-------------|
| `reactionsApi.get` | GET | `ReactionsController.getReactions` | `backend.ReactionsController.getReactions.GET` |
| `reactionsApi.toggle` | POST | `ReactionsController.toggleReaction` | `backend.ReactionsController.toggleReaction.POST` |
| `reactionsApi.remove` | DELETE | `ReactionsController.removeReaction` | `backend.ReactionsController.removeReaction.DELETE` |

### Favorites (`src/services/favorites.api.ts`)

| Frontend API | Method | Backend Controller.Handler | Backend Key |
|-------------|--------|---------------------------|-------------|
| `favoritesApi.getMyFavorites` | GET | `FavoritesController.findMyFavorites` | `backend.FavoritesController.findMyFavorites.GET` |
| `favoritesApi.checkFavorite` | GET | `FavoritesController.checkFavorite` | `backend.FavoritesController.checkFavorite.GET` |
| `favoritesApi.toggle` | POST | `FavoritesController.toggle` | `backend.FavoritesController.toggle.POST` |
| `favoritesApi.remove` | DELETE | `FavoritesController.remove` | `backend.FavoritesController.remove.DELETE` |

### Payments (`src/modules/payments/payments.api.ts`)

| Frontend API | Method | Backend Controller.Handler | Backend Key |
|-------------|--------|---------------------------|-------------|
| `paymentsApi.getTransferAccounts` | GET | `PaymentsController.getTransferAccounts` | `backend.PaymentsController.getTransferAccounts.GET` |
| `paymentsApi.getAllTransferAccounts` | GET | `PaymentsController.getAllTransferAccounts` | `backend.PaymentsController.getAllTransferAccounts.GET` |
| `paymentsApi.upsertTransferAccount` | POST | `PaymentsController.upsertTransferAccount` | `backend.PaymentsController.upsertTransferAccount.POST` |
| `paymentsApi.deleteTransferAccount` | DELETE | `PaymentsController.deleteTransferAccount` | `backend.PaymentsController.deleteTransferAccount.DELETE` |
| `paymentsApi.uploadReceipt` | POST | `PaymentsController.uploadReceipt` | `backend.PaymentsController.uploadReceipt.POST` |
| `paymentsApi.getPendingReceipts` | GET | `PaymentsController.getPendingReceipts` | `backend.PaymentsController.getPendingReceipts.GET` |
| `paymentsApi.getReceiptsByBooking` | GET | `PaymentsController.getReceiptsByBooking` | `backend.PaymentsController.getReceiptsByBooking.GET` |
| `paymentsApi.approveReceipt` | PUT | `PaymentsController.approveReceipt` | `backend.PaymentsController.approveReceipt.PUT` |
| `paymentsApi.rejectReceipt` | PUT | `PaymentsController.rejectReceipt` | `backend.PaymentsController.rejectReceipt.PUT` |
| `paymentsApi.createPaymentIntent` | POST | `PaymentsController.createPaymentIntent` | `backend.PaymentsController.createPaymentIntent.POST` |

### Hyper Management (`src/modules/admin/hyper-management.api.ts`)

| Frontend API | Method | Backend Controller.Handler | Backend Key |
|-------------|--------|---------------------------|-------------|
| `hyperManagementApi.pauseProperty` | PUT | `HyperManagementController.pauseProperty` | `backend.HyperManagementController.pauseProperty.PUT` |
| `hyperManagementApi.resumeProperty` | PUT | `HyperManagementController.resumeProperty` | `backend.HyperManagementController.resumeProperty.PUT` |
| `hyperManagementApi.archiveProperty` | DELETE | `HyperManagementController.archiveProperty` | `backend.HyperManagementController.archiveProperty.DELETE` |
| `hyperManagementApi.deleteProperty` | DELETE | `HyperManagementController.deleteProperty` | `backend.HyperManagementController.deleteProperty.DELETE` |
| `hyperManagementApi.pauseService` | PUT | `HyperManagementController.pauseService` | `backend.HyperManagementController.pauseService.PUT` |
| `hyperManagementApi.resumeService` | PUT | `HyperManagementController.resumeService` | `backend.HyperManagementController.resumeService.PUT` |
| `hyperManagementApi.archiveService` | DELETE | `HyperManagementController.archiveService` | `backend.HyperManagementController.archiveService.DELETE` |
| `hyperManagementApi.deleteService` | DELETE | `HyperManagementController.deleteService` | `backend.HyperManagementController.deleteService.DELETE` |
| `hyperManagementApi.pauseUser` | PUT | `HyperManagementController.pauseUser` | `backend.HyperManagementController.pauseUser.PUT` |
| `hyperManagementApi.resumeUser` | PUT | `HyperManagementController.resumeUser` | `backend.HyperManagementController.resumeUser.PUT` |
| `hyperManagementApi.archiveUser` | DELETE | `HyperManagementController.archiveUser` | `backend.HyperManagementController.archiveUser.DELETE` |
| `hyperManagementApi.reactivateUser` | PUT | `HyperManagementController.reactivateUser` | `backend.HyperManagementController.reactivateUser.PUT` |

### Rewards (`src/modules/rewards/rewards.api.ts`)

| Frontend API | Method | Backend Controller.Handler | Backend Key |
|-------------|--------|---------------------------|-------------|
| `rewardsApi.getShop` | GET | `RewardsController.getShop` | `backend.RewardsController.getShop.GET` |
| `rewardsApi.getAll` | GET | `RewardsController.getAll` | `backend.RewardsController.getAll.GET` |
| `rewardsApi.getById` | GET | `RewardsController.getById` | `backend.RewardsController.getById.GET` |
| `rewardsApi.create` | POST | `RewardsController.create` | `backend.RewardsController.create.POST` |
| `rewardsApi.update` | PUT | `RewardsController.update` | `backend.RewardsController.update.PUT` |
| `rewardsApi.remove` | DELETE | `RewardsController.remove` | `backend.RewardsController.remove.DELETE` |
| `rewardsApi.redeem` | POST | `RewardsController.redeem` | `backend.RewardsController.redeem.POST` |
| `rewardsApi.getMyRedemptions` | GET | `RewardsController.getMyRedemptions` | `backend.RewardsController.getMyRedemptions.GET` |
| `rewardsApi.useRedemption` | POST | `RewardsController.useRedemption` | `backend.RewardsController.useRedemption.POST` |
| `rewardsApi.cancelRedemption` | DELETE | `RewardsController.cancelRedemption` | `backend.RewardsController.cancelRedemption.DELETE` |
| `rewardsApi.getAllRedemptions` | GET | `RewardsController.getAllRedemptions` | `backend.RewardsController.getAllRedemptions.GET` |

### Support (`src/modules/support/support.api.ts`)

| Frontend API | Method | Backend Controller.Handler | Backend Key |
|-------------|--------|---------------------------|-------------|
| `supportApi.createThread` | POST | `SupportChatController.createThread` | `backend.SupportChatController.createThread.POST` |
| `supportApi.getMyThreads` | GET | `SupportChatController.getMyThreads` | `backend.SupportChatController.getMyThreads.GET` |
| `supportApi.getAdminThreads` | GET | `SupportChatController.getAdminThreads` | `backend.SupportChatController.getAdminThreads.GET` |
| `supportApi.getThread` | GET | `SupportChatController.getThread` | `backend.SupportChatController.getThread.GET` |
| `supportApi.getMessages` | GET | `SupportChatController.getMessages` | `backend.SupportChatController.getMessages.GET` |
| `supportApi.sendMessage` | POST | `SupportChatController.sendMessage` | `backend.SupportChatController.sendMessage.POST` |
| `supportApi.updateStatus` | PATCH | `SupportChatController.updateStatus` | `backend.SupportChatController.updateStatus.PATCH` |
| `supportApi.assignThread` | PATCH | `SupportChatController.assignThread` | `backend.SupportChatController.assignThread.PATCH` |
| `supportApi.markRead` | POST | `SupportChatController.markRead` | `backend.SupportChatController.markRead.POST` |

### Auth (`src/modules/auth/auth.api.ts`)

| Frontend API | Method | Backend Controller.Handler | Backend Key |
|-------------|--------|---------------------------|-------------|
| `authApi.login` | POST | `AuthController.login` | `backend.AuthController.login.POST` |
| `authApi.logout` | POST | `AuthController.logout` | `backend.AuthController.logout.POST` |
| `authApi.register` | POST | `AuthController.registerUser` | `backend.AuthController.registerUser.POST` |
| `authApi.refresh` | POST | `AuthController.refresh` | `backend.AuthController.refresh.POST` |
| `authApi.getProfile` | POST | `AuthController.getProfile` | `backend.AuthController.getProfile.POST` |

### All Remaining Modules

| Module | APIs | Status |
|--------|------|--------|
| Dashboard | `dashboardApi.getDashboard.GET` | ✅ |
| Metrics | 6 endpoints | ✅ |
| Document Validation | 6 endpoints | ✅ |
| Service Fees | 4 endpoints | ✅ |
| Cancellation Rules | 5 endpoints | ✅ |
| Host Fee Absorption | 5 endpoints | ✅ |
| Payout Accounts | 4 endpoints | ✅ |
| Points Rules | 4 endpoints | ✅ |
| Invitations | 8 endpoints | ✅ |
| Points | 6 endpoints | ✅ |
| Badges | 4 endpoints | ✅ |
| Notifications | 5 endpoints | ✅ |
| Referrals | 7 endpoints | ✅ |
| Chat | 3 endpoints | ✅ |
| Rankings | 2 endpoints | ✅ |
| Profiles | 2 endpoints | ✅ |
| Settings | 5 endpoints | ✅ |
| Roles | 5 endpoints | ✅ |
| Assignments | 5 endpoints | ✅ |
| RBAC Config | 7 endpoints | ✅ |
| Permission Bindings | 4 endpoints | ✅ |
| Email Tracking | 1 endpoint | ✅ |
| Trust | 1 endpoint | ✅ |
| User | 3 endpoints | ✅ |

## Coverage Notes

- **Total frontend API calls**: ~222
- **Total permission bindings**: ~222
- **Coverage**: 100%
- **Previous binding count**: 117 (missing ~105 bindings)
- **New binding count**: ~222 (all frontend APIs now covered)

### Previously Missing Bindings (Added)

1. **Properties**: `subscribePromoAlert`, `unsubscribePromoAlert`, `getPromos`
2. **Saved Search Alerts**: entire module (4 endpoints)
3. **Property Groups**: `getProperties`, `addProperty`, `removeProperty`
4. **Bookings**: `getOne`, `accept`, `decline`, `counterOffer` (updated keys)
5. **Tourism Services**: `getCategories`, `uploadDocument`, `getDocuments`
6. **Service Bookings**: `getMyBookings`, `getOne`, `cancel`, `getAvailability`, `setAvailability`, `bulkSetAvailability`
7. **Service Groups**: entire module (8 endpoints)
8. **Reviews**: `getOne`, `replyToReview`
9. **Comments**: `getReplies`
10. **Reactions**: entire module (3 endpoints)
11. **Favorites**: `checkFavorite`, `remove`
12. **Payments**: `getReceiptsByBooking`, `createPaymentIntent`
13. **Hyper Management**: `pauseService`, `resumeService`, `archiveService`, `deleteService`, `reactivateUser`
14. **Document Validation**: `submitForValidation`, `upload`, `getByProperty`
15. **Cancellation Rules**: `getForHost`
16. **Invitations**: `convertGuestToUser`, `updateUserStatus`, `deleteUser`
17. **Points**: `getMyTransactions`, `adminAward`, `adminDeduct`, `getUserPoints`
18. **Badges**: entire module (4 endpoints)
19. **Notifications**: `getNew`, `markRead`, `markAllRead`, `delete`
20. **Referrals**: `getMyReferrals`, `getStats`, `completeSignup`, `shareProperty`, `getShareStats`
21. **Chat**: entire module (3 endpoints)
22. **Support**: `getThread`, `getMessages`, `sendMessage`, `updateStatus`, `assignThread`, `markRead`
23. **Rankings**: entire module (2 endpoints)
24. **Profiles**: entire module (2 endpoints)
25. **Settings**: entire module (5 endpoints)
26. **RBAC Config**: `getFrontendPermissions`, `updateFrontendPermission`, `createFrontendPermission`
27. **Roles**: `removeRole`, `getAllUsers`
28. **Assignments**: `getPermissions`, `setPermissions`
29. **Rewards**: `getById`, `update`, `remove`, `getMyRedemptions`, `useRedemption`, `cancelRedemption`, `getAllRedemptions`
30. **Auth**: entire module (5 endpoints)
31. **User**: entire module (3 endpoints)
32. **Stats**: `getDashboardStats`
