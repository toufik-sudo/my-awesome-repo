# Backend ScopeCtx Audit — All Endpoints

Generated: 2026-04-07

| Controller | Endpoint | Method | Has `@Request()` | Has `scopeCtx` | Status |
|---|---|---|---|---|---|
| AppController | `getInitHello` | GET / | ✅ | ❌ | ❌ Not yet |
| BookingsController | `findAll` | GET / | ✅ | ✅ | ✅ OK |
| BookingsController | `getMyBookings` | GET my | ✅ | ✅ | ✅ OK |
| BookingsController | `findOne` | GET :id | ✅ | ✅ | ✅ OK |
| BookingsController | `create` | POST / | ✅ | ✅ | ✅ OK |
| BookingsController | `accept` | PUT :id/accept | ✅ | ✅ | ✅ OK |
| BookingsController | `decline` | PUT :id/decline | ✅ | ✅ | ✅ OK |
| BookingsController | `counterOffer` | PUT :id/counter-offer | ✅ | ✅ | ✅ OK |
| BookingsController | `refund` | PUT :id/refund | ✅ | ✅ | ✅ OK |
| BookingsController | `updateStatus` | PUT :id/status | ✅ | ✅ | ✅ OK |
| BookingsController | `checkAvailability` | GET availability/:propertyId | ❌ | ❌ | ⏭️ Public |
| MetricsController | `getUsers` | GET users | ✅ | ✅ | ✅ OK |
| MetricsController | `getBookings` | GET bookings | ✅ | ✅ | ✅ OK |
| MetricsController | `getProperties` | GET properties | ✅ | ✅ | ✅ OK |
| MetricsController | `getServices` | GET services | ✅ | ✅ | ✅ OK |
| MetricsController | `getRevenue` | GET revenue | ✅ | ✅ | ✅ OK |
| MetricsController | `getSummary` | GET summary | ✅ | ✅ | ✅ OK |
| CommentsController | `getComments` | GET :targetType/:targetId | ✅ | ✅ | ✅ OK |
| CommentsController | `getReplies` | GET :commentId/replies | ✅ | ✅ | ✅ OK |
| CommentsController | `createComment` | POST / | ✅ | ✅ | ✅ OK |
| CommentsController | `updateComment` | PUT :id | ✅ | ✅ | ✅ OK |
| CommentsController | `deleteComment` | DELETE :id | ✅ | ✅ | ✅ OK |
| FavoritesController | `findMyFavorites` | GET / | ✅ | ✅ | ✅ OK |
| FavoritesController | `checkFavorite` | GET check/:propertyId | ✅ | ✅ | ✅ OK |
| FavoritesController | `toggle` | POST :propertyId | ✅ | ✅ | ✅ OK |
| FavoritesController | `remove` | DELETE :propertyId | ✅ | ✅ | ✅ OK |
| EmailTrackingController | `handlePixel` | GET pixel | ✅ | ❌ | ⏭️ Public |
| EmailTrackingController | `handleClick` | GET click | ✅ | ❌ | ⏭️ Public |
| EmailTrackingController | `handleJsVerify` | POST js-verify | ✅ | ❌ | ⏭️ Public |
| EmailTrackingController | `handleWebhook` | POST webhook | ✅ | ❌ | ⏭️ Public |
| EmailTrackingController | `getAnalytics` | GET analytics | ❌ | ❌ | ❌ Not yet |
| BadgeController | `getAllBadges` | GET / | ✅ | ✅ | ✅ OK |
| BadgeController | `getMyBadges` | GET me | ✅ | ✅ | ✅ OK |
| BadgeController | `getMyProgress` | GET me/progress | ✅ | ✅ | ✅ OK |
| BadgeController | `checkUnlocks` | POST me/check | ✅ | ✅ | ✅ OK |
| PointsController | `getMySummary` | GET me | ✅ | ✅ | ✅ OK |
| PointsController | `getMyTransactions` | GET me/transactions | ✅ | ✅ | ✅ OK |
| PointsController | `getLeaderboard` | GET leaderboard | ✅ | ✅ | ✅ OK |
| PointsController | `adminAward` | POST admin/award | ✅ | ✅ | ✅ OK |
| PointsController | `adminDeduct` | POST admin/deduct | ✅ | ✅ | ✅ OK |
| PointsController | `getUserPoints` | GET user/:userId | ✅ | ✅ | ✅ OK |
| NotificationController | `get` | GET / | ✅ | ✅ | ✅ OK |
| NotificationController | `getNew` | GET new | ✅ | ✅ | ✅ OK |
| PaymentsController | `getTransferAccounts` | GET transfer-accounts | ✅ | ✅ | ✅ OK |
| PaymentsController | `getAllTransferAccounts` | GET transfer-accounts/all | ✅ | ✅ | ✅ OK |
| PaymentsController | `upsertTransferAccount` | POST transfer-accounts | ✅ | ✅ | ✅ OK |
| PaymentsController | `deleteTransferAccount` | DELETE transfer-accounts/:id | ✅ | ✅ | ✅ OK |
| PaymentsController | `uploadReceipt` | POST receipts | ✅ | ✅ | ✅ OK |
| PaymentsController | `getPendingReceipts` | GET receipts/pending | ✅ | ✅ | ✅ OK |
| PaymentsController | `getReceiptsByBooking` | GET receipts/booking/:bookingId | ✅ | ✅ | ✅ OK |
| PaymentsController | `approveReceipt` | PUT receipts/:id/approve | ✅ | ✅ | ✅ OK |
| PaymentsController | `rejectReceipt` | PUT receipts/:id/reject | ✅ | ✅ | ✅ OK |
| ProfilesController | `findMyProfile` | GET me | ✅ | ✅ | ✅ OK |
| ProfilesController | `updateMyProfile` | PUT me | ✅ | ✅ | ✅ OK |
| DashboardController | `getDashboard` | GET / | ✅ | ✅ | ✅ OK |
| DocumentValidationController | `submitForValidation` | POST :id/validate | ✅ | ✅ | ✅ OK |
| DocumentValidationController | `getPendingDocuments` | GET pending | ✅ | ✅ | ✅ OK |
| DocumentValidationController | `approveDocument` | PUT :id/approve | ✅ | ✅ | ✅ OK |
| DocumentValidationController | `rejectDocument` | PUT :id/reject | ✅ | ✅ | ✅ OK |
| HyperManagementController | `pauseProperty` | PUT properties/:id/pause | ✅ | ✅ | ✅ OK |
| HyperManagementController | `resumeProperty` | PUT properties/:id/resume | ✅ | ✅ | ✅ OK |
| HyperManagementController | `archiveProperty` | DELETE properties/:id/archive | ✅ | ✅ | ✅ OK |
| HyperManagementController | `deleteProperty` | DELETE properties/:id | ✅ | ✅ | ✅ OK |
| HyperManagementController | `pauseService` | PUT services/:id/pause | ✅ | ✅ | ✅ OK |
| HyperManagementController | `resumeService` | PUT services/:id/resume | ✅ | ✅ | ✅ OK |
| HyperManagementController | `archiveService` | DELETE services/:id/archive | ✅ | ✅ | ✅ OK |
| HyperManagementController | `deleteService` | DELETE services/:id | ✅ | ✅ | ✅ OK |
| HyperManagementController | `pauseUser` | PUT users/:id/pause | ✅ | ✅ | ✅ OK |
| HyperManagementController | `resumeUser` | PUT users/:id/resume | ✅ | ✅ | ✅ OK |
| HyperManagementController | `archiveUser` | DELETE users/:id/archive | ✅ | ✅ | ✅ OK |
| HyperManagementController | `reactivateUser` | PUT users/:id/reactivate | ✅ | ✅ | ✅ OK |
| PropertiesController | `findAll` | GET / | ✅ | ✅ | ✅ OK |
| PropertiesController | `findOne` | GET :id | ✅ | ✅ | ✅ OK |
| PropertiesController | `getAvailability` | GET :id/availability | ✅ | ✅ | ✅ OK |
| PropertiesController | `create` | POST / | ✅ | ✅ | ✅ OK |
| PropertiesController | `update` | PUT :id | ✅ | ✅ | ✅ OK |
| PropertiesController | `updatePrices` | PUT :id/prices | ✅ | ✅ | ✅ OK |
| PropertiesController | `updatePhotos` | PUT :id/photos | ✅ | ✅ | ✅ OK |
| PropertiesController | `updateAvailability` | PUT :id/availability | ✅ | ✅ | ✅ OK |
| PropertiesController | `createPromo` | POST :id/promos | ❌ | ❌ | ❌ Not yet |
| PropertiesController | `getPromos` | GET :id/promos | ❌ | ❌ | ⏭️ Public |
| PropertiesController | `deletePromo` | DELETE :id/promos/:promoId | ✅ | ✅ | ✅ OK |
| PropertiesController | `subscribePromoAlert` | POST :id/promo-alerts | ✅ | ✅ | ✅ OK |
| PropertiesController | `unsubscribePromoAlert` | DELETE :id/promo-alerts | ✅ | ✅ | ✅ OK |
| PropertiesController | `recalculateTrust` | PUT :id/recalculate-trust | ✅ | ✅ | ✅ OK |
| PropertiesController | `remove` | DELETE :id | ✅ | ✅ | ✅ OK |
| PropertiesController | `getMyAlerts` | GET / | ✅ | ✅ | ✅ OK |
| PropertiesController | `createAlert` | POST / | ✅ | ✅ | ✅ OK |
| PropertiesController | `updateAlert` | PUT :id | ✅ | ✅ | ✅ OK |
| PropertiesController | `deleteAlert` | DELETE :id | ✅ | ✅ | ✅ OK |
| PropertyGroupsController | `findAll` | GET / | ✅ | ✅ | ✅ OK |
| PropertyGroupsController | `findOne` | GET :id | ✅ | ✅ | ✅ OK |
| PropertyGroupsController | `create` | POST / | ✅ | ✅ | ✅ OK |
| PropertyGroupsController | `update` | PUT :id | ✅ | ✅ | ✅ OK |
| PropertyGroupsController | `remove` | DELETE :id | ✅ | ✅ | ✅ OK |
| PropertyGroupsController | `addProperty` | POST :id/properties | ✅ | ✅ | ✅ OK |
| PropertyGroupsController | `removeProperty` | DELETE :id/properties/:propertyId | ✅ | ✅ | ✅ OK |
| PropertyGroupsController | `getGroupProperties` | GET :id/properties | ❌ | ❌ | ❌ Not yet |
| RankingsController | `getRankings` | GET / | ✅ | ✅ | ✅ OK |
| RankingsController | `getMyRank` | GET me | ✅ | ✅ | ✅ OK |
| ReactionsController | `getReactions` | GET :targetType/:targetId | ✅ | ✅ | ✅ OK |
| ReactionsController | `toggleReaction` | POST / | ✅ | ✅ | ✅ OK |
| ReactionsController | `removeReaction` | DELETE :targetType/:targetId | ✅ | ✅ | ✅ OK |
| ReviewsController | `findByProperty` | GET property/:propertyId | ✅ | ✅ | ✅ OK |
| ReviewsController | `findOne` | GET :id | ✅ | ✅ | ✅ OK |
| ReviewsController | `create` | POST / | ✅ | ✅ | ✅ OK |
| ReviewsController | `reply` | POST :id/reply | ✅ | ✅ | ✅ OK |
| ServiceBookingsController | `create` | POST / | ✅ | ✅ | ✅ OK |
| ServiceBookingsController | `getMyBookings` | GET my | ✅ | ✅ | ✅ OK |
| ServiceBookingsController | `getProviderBookings` | GET provider | ✅ | ✅ | ✅ OK |
| ServiceBookingsController | `getOne` | GET :id | ✅ | ✅ | ✅ OK |
| ServiceBookingsController | `accept` | PUT :id/accept | ✅ | ✅ | ✅ OK |
| ServiceBookingsController | `decline` | PUT :id/decline | ✅ | ✅ | ✅ OK |
| ServiceBookingsController | `cancel` | PUT :id/cancel | ✅ | ✅ | ✅ OK |
| ServiceBookingsController | `getAvailability` | GET availability/:serviceId | ✅ | ✅ | ✅ OK |
| ServiceBookingsController | `setAvailability` | POST availability/:serviceId | ✅ | ✅ | ✅ OK |
| ServiceBookingsController | `bulkSetAvailability` | POST availability/:serviceId/bulk | ✅ | ✅ | ✅ OK |
| ServiceGroupsController | `findAll` | GET / | ✅ | ✅ | ✅ OK |
| ServiceGroupsController | `findOne` | GET :id | ✅ | ✅ | ✅ OK |
| ServiceGroupsController | `create` | POST / | ✅ | ✅ | ✅ OK |
| ServiceGroupsController | `update` | PUT :id | ❌ | ❌ | ❌ Not yet |
| ServiceGroupsController | `remove` | DELETE :id | ❌ | ❌ | ❌ Not yet |
| ServiceGroupsController | `getServices` | GET :id/services | ❌ | ❌ | ❌ Not yet |
| ServiceGroupsController | `addService` | POST :id/services | ❌ | ❌ | ❌ Not yet |
| ServiceGroupsController | `removeService` | DELETE :id/services/:serviceId | ❌ | ❌ | ❌ Not yet |
| TourismServicesController | `findAll` | GET / | ✅ | ✅ | ✅ OK |
| TourismServicesController | `getCategories` | GET categories | ✅ | ✅ | ✅ OK |
| TourismServicesController | `findOne` | GET :id | ✅ | ✅ | ✅ OK |
| TourismServicesController | `create` | POST / | ✅ | ✅ | ✅ OK |
| TourismServicesController | `update` | PUT :id | ✅ | ✅ | ✅ OK |
| TourismServicesController | `pause` | PUT :id/pause | ✅ | ✅ | ✅ OK |
| TourismServicesController | `remove` | DELETE :id | ✅ | ✅ | ✅ OK |
| SettingsController | `getSettings` | GET / | ✅ | ✅ | ✅ OK |
| SettingsController | `updatePreferences` | PUT preferences | ✅ | ✅ | ✅ OK |
| SettingsController | `updateNotifications` | PUT notifications | ✅ | ✅ | ✅ OK |
| SettingsController | `updateAccount` | PUT account | ✅ | ✅ | ✅ OK |
| SettingsController | `changePassword` | PUT password | ✅ | ✅ | ✅ OK |
| SSOController | `exchangeToken` | POST token | ❌ | ❌ | ⏭️ Public |
| SSOController | `getUserInfo` | GET userinfo | ❌ | ❌ | ⏭️ Public |
| SSOController | `refreshToken` | POST refresh | ❌ | ❌ | ⏭️ Public |
| SSOController | `logout` | POST logout | ❌ | ❌ | ⏭️ Public |
| SupportChatController | `createThread` | POST threads | ✅ | ✅ | ✅ OK |
| SupportChatController | `getMyThreads` | GET threads/mine | ✅ | ✅ | ✅ OK |
| SupportChatController | `getAdminThreads` | GET threads | ✅ | ✅ | ✅ OK |
| SupportChatController | `getThread` | GET threads/:threadId | ✅ | ✅ | ✅ OK |
| SupportChatController | `getMessages` | GET threads/:threadId/messages | ✅ | ✅ | ✅ OK |
| SupportChatController | `sendMessage` | POST threads/:threadId/messages | ✅ | ✅ | ✅ OK |
| SupportChatController | `updateStatus` | PATCH threads/:threadId/status | ✅ | ✅ | ✅ OK |
| SupportChatController | `assignThread` | PATCH threads/:threadId/assign | ✅ | ✅ | ✅ OK |
| SupportChatController | `markRead` | POST threads/:threadId/read | ✅ | ✅ | ✅ OK |
| AuthController | `login` | POST login | ✅ | ❌ | ⏭️ Public |
| AuthController | `logout` | POST logout | ✅ | ✅ | ✅ OK |
| AuthController | `refresh` | POST refresh | ✅ | ✅ | ✅ OK |
| AuthController | `registerUser` | POST registerUser | ✅ | ✅ | ✅ OK |
| AuthController | `activateUser` | POST activateUser | ✅ | ✅ | ✅ OK |
| AuthController | `getProfile` | POST profile | ✅ | ✅ | ✅ OK |
| CancellationRuleController | `getMine` | GET / | ✅ | ✅ | ✅ OK |
| CancellationRuleController | `getForHost` | GET host/:hostId | ✅ | ✅ | ✅ OK |
| CancellationRuleController | `create` | POST / | ✅ | ✅ | ✅ OK |
| CancellationRuleController | `update` | PUT :id | ✅ | ✅ | ✅ OK |
| CancellationRuleController | `remove` | DELETE :id | ✅ | ✅ | ✅ OK |
| HostFeeAbsorptionController | `getMyAbsorptions` | GET / | ✅ | ✅ | ✅ OK |
| HostFeeAbsorptionController | `getForHost` | GET host/:hostId | ✅ | ✅ | ✅ OK |
| HostFeeAbsorptionController | `create` | POST / | ✅ | ✅ | ✅ OK |
| HostFeeAbsorptionController | `update` | PUT :id | ✅ | ✅ | ✅ OK |
| HostFeeAbsorptionController | `remove` | DELETE :id | ✅ | ✅ | ✅ OK |
| InvitationController | `getAllowedRoles` | GET allowed-roles | ✅ | ✅ | ✅ OK |
| InvitationController | `create` | POST / | ✅ | ✅ | ✅ OK |
| InvitationController | `getAll` | GET / | ✅ | ✅ | ✅ OK |
| InvitationController | `cancel` | DELETE :id | ✅ | ✅ | ✅ OK |
| InvitationController | `resend` | POST :id/resend | ✅ | ✅ | ✅ OK |
| InvitationController | `accept` | POST accept/:token | ✅ | ✅ | ✅ OK |
| InvitationController | `convertGuestToUser` | POST convert-guest-to-user | ✅ | ✅ | ✅ OK |
| MetricsController | `getProperties` | GET properties | ✅ | ✅ | ✅ OK |
| MetricsController | `getServices` | GET services | ✅ | ✅ | ✅ OK |
| MetricsController | `getSummary` | GET summary | ✅ | ✅ | ✅ OK |
| PayoutAccountController | `getMine` | GET / | ✅ | ✅ | ✅ OK |
| PayoutAccountController | `getAll` | GET all | ✅ | ✅ | ✅ OK |
| PayoutAccountController | `create` | POST / | ✅ | ✅ | ✅ OK |
| PayoutAccountController | `update` | PUT :id | ✅ | ✅ | ✅ OK |
| PayoutAccountController | `remove` | DELETE :id | ✅ | ✅ | ✅ OK |
| PointsRuleController | `getAll` | GET / | ❌ | ❌ | ❌ Not yet |
| PointsRuleController | `getDefaults` | GET defaults | ❌ | ❌ | ❌ Not yet |
| PointsRuleController | `getEarning` | GET earning | ❌ | ❌ | ❌ Not yet |
| PointsRuleController | `getConversion` | GET conversion | ✅ | ✅ | ✅ OK |
| PointsRuleController | `getByRole` | GET role/:role | ✅ | ✅ | ✅ OK |
| PointsRuleController | `create` | POST / | ✅ | ✅ | ✅ OK |
| PointsRuleController | `update` | PUT :ruleId | ✅ | ✅ | ✅ OK |
| PointsRuleController | `remove` | DELETE :ruleId | ✅ | ✅ | ✅ OK |
| RbacConfigController | `listBackend` | GET backend | ❌ | ❌ | ❌ Not yet |
| RbacConfigController | `getBackendByRole` | GET backend/role/:role | ❌ | ❌ | ❌ Not yet |
| RbacConfigController | `updateBackend` | PUT backend/:id | ❌ | ❌ | ❌ Not yet |
| RbacConfigController | `bulkUpdateBackend` | PUT backend | ❌ | ❌ | ❌ Not yet |
| RbacConfigController | `createBackend` | POST backend | ❌ | ❌ | ❌ Not yet |
| RbacConfigController | `listFrontend` | GET frontend | ❌ | ❌ | ❌ Not yet |
| RbacConfigController | `getFrontendByRole` | GET frontend/role/:role | ❌ | ❌ | ❌ Not yet |
| RbacConfigController | `updateFrontend` | PUT frontend/:id | ❌ | ❌ | ❌ Not yet |
| RbacConfigController | `createFrontend` | POST frontend | ❌ | ❌ | ❌ Not yet |
| RbacConfigController | `bulkUpdateFrontend` | PUT frontend | ❌ | ❌ | ❌ Not yet |
| RbacConfigController | `getRoles` | GET roles | ❌ | ❌ | ❌ Not yet |
| RbacConfigController | `reloadCache` | POST reload | ❌ | ❌ | ❌ Not yet |
| RbacConfigController | `status` | GET status | ❌ | ❌ | ❌ Not yet |
| RbacConfigController | `check` | GET check | ❌ | ❌ | ❌ Not yet |
| ReferralController | `getMyCode` | GET code | ✅ | ✅ | ✅ OK |
| ReferralController | `createReferral` | POST / | ✅ | ✅ | ✅ OK |
| ReferralController | `getMyReferrals` | GET / | ✅ | ✅ | ✅ OK |
| ReferralController | `getMyStats` | GET stats | ✅ | ✅ | ✅ OK |
| ReferralController | `completeSignup` | POST signup/:code | ✅ | ✅ | ✅ OK |
| ReferralController | `shareProperty` | POST share | ✅ | ✅ | ✅ OK |
| ReferralController | `getShareStats` | GET share/:propertyId/stats | ❌ | ❌ | ❌ Not yet |
| RewardsController | `getShop` | GET shop | ❌ | ❌ | ❌ Not yet |
| RewardsController | `getAll` | GET / | ✅ | ❌ | ❌ Not yet |
| RewardsController | `getById` | GET :id | ✅ | ✅ | ✅ OK |
| RewardsController | `create` | POST / | ✅ | ✅ | ✅ OK |
| RewardsController | `update` | PUT :id | ✅ | ✅ | ✅ OK |
| RewardsController | `remove` | DELETE :id | ✅ | ✅ | ✅ OK |
| RewardsController | `redeem` | POST :id/redeem | ✅ | ✅ | ✅ OK |
| RewardsController | `getMyRedemptions` | GET me/redemptions | ✅ | ✅ | ✅ OK |
| RewardsController | `useRedemption` | POST redemptions/:code/use | ✅ | ✅ | ✅ OK |
| RewardsController | `cancelRedemption` | DELETE redemptions/:id/cancel | ✅ | ✅ | ✅ OK |
| RewardsController | `getAllRedemptions` | GET admin/redemptions | ❌ | ❌ | ❌ Not yet |
| RolesController | `getStats` | GET stats | ✅ | ✅ | ✅ OK |
| RolesController | `getUserRoles` | GET user/:userId | ✅ | ✅ | ✅ OK |
| RolesController | `assignRole` | POST assign | ✅ | ✅ | ✅ OK |
| RolesController | `removeRole` | DELETE user/:userId/:role | ✅ | ✅ | ✅ OK |
| RolesController | `setManagerPermissions` | POST manager/permissions | ✅ | ❌ | ❌ Not yet |
| RolesController | `getManagerPermissions` | GET manager/:managerId/permissions | ✅ | ✅ | ✅ OK |
| RolesController | `getManagerProperties` | GET manager/:managerId/properties | ✅ | ❌ | ❌ Not yet |
| RolesController | `setHyperManagerPermissions` | POST hyper-manager/permissions | ✅ | ❌ | ❌ Not yet |
| RolesController | `getHyperManagerPermissions` | GET hyper-manager/:hyperManagerId/permissions | ✅ | ❌ | ❌ Not yet |
| RolesController | `setGuestPermissions` | POST guest/permissions | ✅ | ❌ | ❌ Not yet |
| RolesController | `getGuestPermissions` | GET guest/:guestId/permissions | ✅ | ✅ | ✅ OK |
| RolesController | `getAllUsers` | GET users | ✅ | ✅ | ✅ OK |
| RolesController | `updateUserStatus` | PUT users/:userId/status | ✅ | ✅ | ✅ OK |
| RolesController | `deleteUser` | DELETE users/:userId | ✅ | ✅ | ✅ OK |
| RolesController | `getAllAssignments` | GET assignments | ✅ | ✅ | ✅ OK |
| RolesController | `removePermission` | DELETE assignments/:permissionId/:type | ✅ | ❌ | ❌ Not yet |
| RolesController | `checkPermission` | GET check/:userId/property/:propertyId/:permission | ❌ | ❌ | ❌ Not yet |
| ServiceFeeController | `getAll` | GET / | ❌ | ❌ | ❌ Not yet |
| ServiceFeeController | `getDefault` | GET default | ✅ | ✅ | ✅ OK |
| ServiceFeeController | `getForHost` | GET host/:hostId | ✅ | ✅ | ✅ OK |
| ServiceFeeController | `create` | POST / | ✅ | ✅ | ✅ OK |
| ServiceFeeController | `update` | PUT :ruleId | ✅ | ✅ | ✅ OK |
| ServiceFeeController | `remove` | DELETE :ruleId | ✅ | ✅ | ✅ OK |
| ServiceFeeController | `calculate` | POST calculate | ❌ | ❌ | ❌ Not yet |
| UserController | `updateLanguage` | PUT language | ✅ | ✅ | ✅ OK |
| UserController | `uploadAvatar` | POST avatar | ✅ | ✅ | ✅ OK |
| UserController | `deleteAvatar` | DELETE avatar | ✅ | ✅ | ✅ OK |
| UserController | `completeProfile` | POST profile/complete | ✅ | ✅ | ✅ OK |

## Summary

- **Total endpoints**: 249
- **✅ OK (scopeCtx)**: 199
- **⏭️ Public (no auth)**: 11
- **❌ Not yet**: 39
- **Coverage**: 84.3%