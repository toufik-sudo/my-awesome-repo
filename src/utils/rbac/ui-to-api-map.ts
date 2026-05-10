/**
 * UI Permission Key → Frontend API Keys cross-reference.
 * Maps each UI element (button, icon, page view) to the API calls it triggers.
 *
 * Used by canActionWithApis() in usePermissions to enforce:
 *   UI visibility (rbac_frontend_permissions) + API access (rbac_permission_bindings)
 *
 * Chain: UI_PERM key → canUI → UI_TO_API_MAP[key] → canCallApi for each API key
 */
import { generateUiPermissionKey } from './generate-ui-permission-key';

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
