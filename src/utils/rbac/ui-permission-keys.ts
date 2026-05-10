/**
 * Frontend Permission Registry — mirrors backend seed + rbac_frontend_permissions table.
 *
 * All UI permission keys are generated via generateUiPermissionKey().
 * Import these constants in components instead of using hardcoded strings.
 */
import { generateUiPermissionKey } from './generate-ui-permission-key';

// ─── Property pages ──────────────────────────────────────────────────────────
export const UI_PERM = {
  // PropertyListPage
  PROPERTY_LIST_VIEW: generateUiPermissionKey('PropertyListPage', undefined, 'Page', 'View'),
  PROPERTY_ADD: generateUiPermissionKey('PropertyListPage', 'Header', 'Button', 'Add'),
  PROPERTY_EDIT: generateUiPermissionKey('PropertyListPage', 'Card', 'Button', 'Edit'),
  PROPERTY_DELETE: generateUiPermissionKey('PropertyListPage', 'Card', 'Button', 'Delete'),
  PROPERTY_PAUSE: generateUiPermissionKey('PropertyListPage', 'Card', 'Button', 'Pause'),
  PROPERTY_DUPLICATE: generateUiPermissionKey('PropertyListPage', 'Card', 'Button', 'Duplicate'),
  PROPERTY_MAP: generateUiPermissionKey('PropertyListPage', 'Map', 'Widget', 'View'),
  PROPERTY_FILTER: generateUiPermissionKey('PropertyListPage', 'Filter', 'Dropdown', 'Filter'),
  PROPERTY_SORT: generateUiPermissionKey('PropertyListPage', 'Filter', 'Dropdown', 'Sort'),

  // PropertyDetailPage
  PROPERTY_DETAIL_VIEW: generateUiPermissionKey('PropertyDetailPage', undefined, 'Page', 'View'),
  PROPERTY_DETAIL_EDIT: generateUiPermissionKey('PropertyDetailPage', 'Actions', 'Button', 'Edit'),
  PROPERTY_DETAIL_DELETE: generateUiPermissionKey('PropertyDetailPage', 'Actions', 'Button', 'Delete'),
  PROPERTY_DETAIL_PAUSE: generateUiPermissionKey('PropertyDetailPage', 'Actions', 'Button', 'Pause'),
  PROPERTY_DETAIL_DUPLICATE: generateUiPermissionKey('PropertyDetailPage', 'Actions', 'Button', 'Duplicate'),
  PROPERTY_SHARE: generateUiPermissionKey('PropertyDetailPage', 'Actions', 'Button', 'Share'),
  PROPERTY_FAVORITE: generateUiPermissionKey('PropertyDetailPage', 'Actions', 'Button', 'Favorite'),
  PROPERTY_BOOKING_MODAL: generateUiPermissionKey('PropertyDetailPage', 'Booking', 'Modal', 'Open'),
  PROPERTY_REVIEWS: generateUiPermissionKey('PropertyDetailPage', 'Reviews', 'Section', 'View'),
  PROPERTY_REVIEW_ADD: generateUiPermissionKey('PropertyDetailPage', 'Reviews', 'Button', 'Add'),
  PROPERTY_COMMENTS: generateUiPermissionKey('PropertyDetailPage', 'Comments', 'Section', 'View'),
  PROPERTY_COMMENT_ADD: generateUiPermissionKey('PropertyDetailPage', 'Comments', 'Button', 'Add'),
  PROPERTY_GALLERY: generateUiPermissionKey('PropertyDetailPage', 'Gallery', 'Widget', 'View'),
  PROPERTY_PRICING: generateUiPermissionKey('PropertyDetailPage', 'Pricing', 'Section', 'View'),
  PROPERTY_AVAILABILITY: generateUiPermissionKey('PropertyDetailPage', 'Availability', 'Widget', 'View'),

  // AddPropertyWizard
  ADD_PROPERTY_WIZARD: generateUiPermissionKey('AddPropertyWizard', undefined, 'Page', 'View'),
  ADD_PROPERTY_SUBMIT: generateUiPermissionKey('AddPropertyWizard', 'Form', 'Button', 'Submit'),

  // Services
  SERVICE_LIST_VIEW: generateUiPermissionKey('ServiceListPage', undefined, 'Page', 'View'),
  SERVICE_ADD: generateUiPermissionKey('ServiceListPage', 'Header', 'Button', 'Add'),
  SERVICE_EDIT: generateUiPermissionKey('ServiceListPage', 'Card', 'Button', 'Edit'),
  SERVICE_DELETE: generateUiPermissionKey('ServiceListPage', 'Card', 'Button', 'Delete'),
  SERVICE_PAUSE: generateUiPermissionKey('ServiceListPage', 'Card', 'Button', 'Pause'),
  SERVICE_DUPLICATE: generateUiPermissionKey('ServiceListPage', 'Card', 'Button', 'Duplicate'),
  SERVICE_MAP: generateUiPermissionKey('ServiceListPage', 'Map', 'Widget', 'View'),
  SERVICE_FILTER: generateUiPermissionKey('ServiceListPage', 'Filter', 'Dropdown', 'Filter'),
  SERVICE_SORT: generateUiPermissionKey('ServiceListPage', 'Filter', 'Dropdown', 'Sort'),

  // ServiceDetailPage
  SERVICE_DETAIL_VIEW: generateUiPermissionKey('ServiceDetailPage', undefined, 'Page', 'View'),
  SERVICE_DETAIL_EDIT: generateUiPermissionKey('ServiceDetailPage', 'Actions', 'Button', 'Edit'),
  SERVICE_DETAIL_DELETE: generateUiPermissionKey('ServiceDetailPage', 'Actions', 'Button', 'Delete'),
  SERVICE_DETAIL_PAUSE: generateUiPermissionKey('ServiceDetailPage', 'Actions', 'Button', 'Pause'),
  SERVICE_DETAIL_DUPLICATE: generateUiPermissionKey('ServiceDetailPage', 'Actions', 'Button', 'Duplicate'),
  SERVICE_BOOKING_MODAL: generateUiPermissionKey('ServiceDetailPage', 'Booking', 'Modal', 'Open'),
  SERVICE_REVIEWS: generateUiPermissionKey('ServiceDetailPage', 'Reviews', 'Section', 'View'),

  // AddServiceWizard
  ADD_SERVICE_WIZARD: generateUiPermissionKey('AddServiceWizard', undefined, 'Page', 'View'),
  ADD_SERVICE_SUBMIT: generateUiPermissionKey('AddServiceWizard', 'Form', 'Button', 'Submit'),

  // Bookings
  BOOKINGS_TAB: generateUiPermissionKey('BookingsPage', undefined, 'Tab', 'View'),
  BOOKING_ACCEPT: generateUiPermissionKey('BookingsPage', 'Detail', 'Button', 'Accept'),
  BOOKING_REJECT: generateUiPermissionKey('BookingsPage', 'Detail', 'Button', 'Reject'),
  BOOKING_REFUND: generateUiPermissionKey('BookingsPage', 'Detail', 'Button', 'Refund'),
  BOOKING_COUNTER_OFFER: generateUiPermissionKey('BookingsPage', 'Detail', 'Button', 'CounterOffer'),
  BOOKING_FILTER_STATUS: generateUiPermissionKey('BookingsPage', 'List', 'Dropdown', 'FilterStatus'),
  BOOKING_FILTER_PROPERTY: generateUiPermissionKey('BookingsPage', 'List', 'Dropdown', 'FilterProperty'),

  // BookingCalendarPage
  CALENDAR_VIEW: generateUiPermissionKey('BookingCalendarPage', undefined, 'Page', 'View'),
  CALENDAR_FILTER_STATUS: generateUiPermissionKey('BookingCalendarPage', 'Filters', 'Dropdown', 'FilterStatus'),
  CALENDAR_FILTER_PROPERTY: generateUiPermissionKey('BookingCalendarPage', 'Filters', 'Dropdown', 'FilterProperty'),
  CALENDAR_FILTER_SERVICE: generateUiPermissionKey('BookingCalendarPage', 'Filters', 'Dropdown', 'FilterService'),
  CALENDAR_FILTER_HOST: generateUiPermissionKey('BookingCalendarPage', 'Filters', 'Dropdown', 'FilterHost'),

  // BookingModal
  BOOKING_MODAL_OPEN: generateUiPermissionKey('BookingModal', undefined, 'Modal', 'Open'),
  BOOKING_MODAL_SUBMIT: generateUiPermissionKey('BookingModal', 'Form', 'Button', 'Submit'),

  // BookingHistory
  BOOKING_HISTORY_VIEW: generateUiPermissionKey('BookingHistory', undefined, 'Page', 'View'),
  BOOKING_HISTORY_CANCEL: generateUiPermissionKey('BookingHistory', 'Detail', 'Button', 'Cancel'),

  // HostBookings
  HOST_BOOKINGS_VIEW: generateUiPermissionKey('HostBookings', undefined, 'Page', 'View'),
  HOST_BOOKING_ACCEPT: generateUiPermissionKey('HostBookings', 'Actions', 'Button', 'Accept'),
  HOST_BOOKING_REJECT: generateUiPermissionKey('HostBookings', 'Actions', 'Button', 'Reject'),
  HOST_BOOKING_REFUND: generateUiPermissionKey('HostBookings', 'Actions', 'Button', 'Refund'),

  // ServiceBookingForm
  SERVICE_BOOKING_FORM_MODAL: generateUiPermissionKey('ServiceBookingForm', undefined, 'Modal', 'Open'),
  SERVICE_BOOKING_FORM_SUBMIT: generateUiPermissionKey('ServiceBookingForm', 'Form', 'Button', 'Submit'),

  // Dashboard
  DASHBOARD_VIEW: generateUiPermissionKey('Dashboard', undefined, 'Page', 'View'),
  ANALYTICS_TAB: generateUiPermissionKey('Dashboard', 'Analytics', 'Tab', 'View'),
  PAYMENTS_TAB: generateUiPermissionKey('Dashboard', 'Payments', 'Tab', 'View'),
  REVENUE_WIDGET: generateUiPermissionKey('Dashboard', 'Revenue', 'Widget', 'View'),
  BOOKINGS_WIDGET: generateUiPermissionKey('Dashboard', 'Bookings', 'Widget', 'View'),
  PROPERTIES_WIDGET: generateUiPermissionKey('Dashboard', 'Properties', 'Widget', 'View'),

  // HyperDashboard
  HYPER_DASHBOARD_VIEW: generateUiPermissionKey('HyperDashboard', undefined, 'Page', 'View'),
  HYPER_PAYMENT_VALIDATION: generateUiPermissionKey('HyperDashboard', 'PaymentValidation', 'Tab', 'View'),
  HYPER_PAYMENT_APPROVE: generateUiPermissionKey('HyperDashboard', 'PaymentValidation', 'Button', 'Approve'),
  HYPER_PAYMENT_REJECT: generateUiPermissionKey('HyperDashboard', 'PaymentValidation', 'Button', 'Reject'),
  HYPER_USERS_TAB: generateUiPermissionKey('HyperDashboard', 'Users', 'Tab', 'View'),
  HYPER_USER_PAUSE: generateUiPermissionKey('HyperDashboard', 'Users', 'Button', 'Pause'),
  HYPER_USER_ARCHIVE: generateUiPermissionKey('HyperDashboard', 'Users', 'Button', 'Archive'),
  HYPER_PROPERTIES_TAB: generateUiPermissionKey('HyperDashboard', 'Properties', 'Tab', 'View'),
  HYPER_PROPERTY_PAUSE: generateUiPermissionKey('HyperDashboard', 'Properties', 'Button', 'Pause'),
  HYPER_PROPERTY_ARCHIVE: generateUiPermissionKey('HyperDashboard', 'Properties', 'Button', 'Archive'),
  HYPER_PROPERTY_DELETE: generateUiPermissionKey('HyperDashboard', 'Properties', 'Button', 'Delete'),
  HYPER_SERVICES_TAB: generateUiPermissionKey('HyperDashboard', 'Services', 'Tab', 'View'),
  HYPER_SERVICE_PAUSE: generateUiPermissionKey('HyperDashboard', 'Services', 'Button', 'Pause'),
  HYPER_SERVICE_ARCHIVE: generateUiPermissionKey('HyperDashboard', 'Services', 'Button', 'Archive'),
  HYPER_VERIFICATION_TAB: generateUiPermissionKey('HyperDashboard', 'Verification', 'Tab', 'View'),
  HYPER_DOC_APPROVE: generateUiPermissionKey('HyperDashboard', 'Verification', 'Button', 'Approve'),
  HYPER_DOC_REJECT: generateUiPermissionKey('HyperDashboard', 'Verification', 'Button', 'Reject'),
  HYPER_ASSIGNMENTS_TAB: generateUiPermissionKey('HyperDashboard', 'Assignments', 'Tab', 'View'),
  HYPER_ASSIGNMENT_CREATE: generateUiPermissionKey('HyperDashboard', 'Assignments', 'Button', 'Create'),
  HYPER_ASSIGNMENT_DELETE: generateUiPermissionKey('HyperDashboard', 'Assignments', 'Button', 'Delete'),

  // AdminDashboard / ManagerDashboard / UserDashboard / GuestDashboard
  ADMIN_DASHBOARD_VIEW: generateUiPermissionKey('AdminDashboard', undefined, 'Page', 'View'),
  MANAGER_DASHBOARD_VIEW: generateUiPermissionKey('ManagerDashboard', undefined, 'Page', 'View'),
  USER_DASHBOARD_VIEW: generateUiPermissionKey('UserDashboard', undefined, 'Page', 'View'),
  GUEST_DASHBOARD_VIEW: generateUiPermissionKey('GuestDashboard', undefined, 'Page', 'View'),

  // Users
  USERS_TAB: generateUiPermissionKey('UsersPage', undefined, 'Tab', 'View'),
  USER_INVITE: generateUiPermissionKey('UsersPage', 'List', 'Button', 'Invite'),
  USER_CONVERT_GUEST: generateUiPermissionKey('UsersPage', 'List', 'Button', 'ConvertGuest'),
  USER_ASSIGN_ROLE: generateUiPermissionKey('UsersPage', 'Detail', 'Button', 'AssignRole'),
  USER_MANAGE_PERMS: generateUiPermissionKey('UsersPage', 'Detail', 'Button', 'ManagePermissions'),
  USER_PROFILE_MODAL: generateUiPermissionKey('UsersPage', 'Detail', 'Modal', 'ViewProfile'),
  USER_FILTER_ROLE: generateUiPermissionKey('UsersPage', 'Filter', 'Dropdown', 'FilterRole'),
  USER_FILTER_STATUS: generateUiPermissionKey('UsersPage', 'Filter', 'Dropdown', 'FilterStatus'),

  // ManagerAssignments
  ASSIGNMENTS_VIEW: generateUiPermissionKey('ManagerAssignments', undefined, 'Page', 'View'),
  ASSIGNMENT_CREATE: generateUiPermissionKey('ManagerAssignments', 'Header', 'Button', 'Create'),
  ASSIGNMENT_DELETE: generateUiPermissionKey('ManagerAssignments', 'List', 'Button', 'Delete'),
  ASSIGNMENT_EDIT_PERMS: generateUiPermissionKey('ManagerAssignments', 'Detail', 'Button', 'EditPermissions'),
  ASSIGNMENT_SELECT_MANAGER: generateUiPermissionKey('ManagerAssignments', 'Modal', 'Dropdown', 'SelectManager'),
  ASSIGNMENT_SELECT_SCOPE: generateUiPermissionKey('ManagerAssignments', 'Modal', 'Dropdown', 'SelectScope'),

  // RolesManagement
  ROLES_VIEW: generateUiPermissionKey('RolesManagement', undefined, 'Page', 'View'),

  // RBAC
  RBAC_VIEW: generateUiPermissionKey('RbacSettings', undefined, 'Page', 'View'),
  RBAC_EDIT: generateUiPermissionKey('RbacSettings', undefined, 'Page', 'Edit'),
  RBAC_TOGGLE: generateUiPermissionKey('RbacSettings', 'Matrix', 'Toggle', 'TogglePermission'),
  RBAC_SET_SCOPE: generateUiPermissionKey('RbacSettings', 'Matrix', 'Dropdown', 'SetScope'),
  RBAC_SAVE: generateUiPermissionKey('RbacSettings', 'Actions', 'Button', 'Save'),
  RBAC_RELOAD_CACHE: generateUiPermissionKey('RbacSettings', 'Actions', 'Button', 'ReloadCache'),

  // Fees
  SERVICE_FEES_VIEW: generateUiPermissionKey('ServiceFeesPage', undefined, 'Page', 'View'),
  SERVICE_FEES_ADD: generateUiPermissionKey('ServiceFeesPage', 'Header', 'Button', 'Add'),
  SERVICE_FEES_EDIT: generateUiPermissionKey('ServiceFeesPage', 'Card', 'Button', 'Edit'),
  SERVICE_FEES_DELETE: generateUiPermissionKey('ServiceFeesPage', 'Card', 'Button', 'Delete'),
  FEE_ABSORPTION_VIEW: generateUiPermissionKey('HostFeeAbsorptionPage', undefined, 'Page', 'View'),
  FEE_ABSORPTION_ADD: generateUiPermissionKey('HostFeeAbsorptionPage', 'Header', 'Button', 'Add'),
  FEE_ABSORPTION_EDIT: generateUiPermissionKey('HostFeeAbsorptionPage', 'Card', 'Button', 'Edit'),
  FEE_ABSORPTION_DELETE: generateUiPermissionKey('HostFeeAbsorptionPage', 'Card', 'Button', 'Delete'),
  CANCELLATION_RULES_VIEW: generateUiPermissionKey('CancellationRulesPage', undefined, 'Page', 'View'),
  CANCELLATION_RULES_ADD: generateUiPermissionKey('CancellationRulesPage', 'Header', 'Button', 'Add'),
  CANCELLATION_RULES_EDIT: generateUiPermissionKey('CancellationRulesPage', 'Card', 'Button', 'Edit'),
  CANCELLATION_RULES_DELETE: generateUiPermissionKey('CancellationRulesPage', 'Card', 'Button', 'Delete'),

  // Points / Rewards
  POINTS_RULES_VIEW: generateUiPermissionKey('PointsRulesPage', undefined, 'Page', 'View'),
  POINTS_RULES_ADD: generateUiPermissionKey('PointsRulesPage', 'Header', 'Button', 'Add'),
  POINTS_RULES_EDIT: generateUiPermissionKey('PointsRulesPage', 'Card', 'Button', 'Edit'),
  POINTS_RULES_DELETE: generateUiPermissionKey('PointsRulesPage', 'Card', 'Button', 'Delete'),
  POINTS_VIEW: generateUiPermissionKey('PointsPage', undefined, 'Page', 'View'),
  POINTS_LEADERBOARD: generateUiPermissionKey('PointsPage', 'Leaderboard', 'Widget', 'View'),
  REWARDS_VIEW: generateUiPermissionKey('RewardsPage', undefined, 'Page', 'View'),
  REWARD_REDEEM: generateUiPermissionKey('RewardsPage', 'Detail', 'Button', 'Redeem'),
  REWARD_CREATE: generateUiPermissionKey('RewardsPage', 'Admin', 'Button', 'Create'),
  REWARD_EDIT: generateUiPermissionKey('RewardsPage', 'Admin', 'Button', 'Edit'),
  REWARD_DELETE: generateUiPermissionKey('RewardsPage', 'Admin', 'Button', 'Delete'),

  // Referrals
  REFERRALS_VIEW: generateUiPermissionKey('ReferralsPage', undefined, 'Page', 'View'),
  REFERRAL_COPY_LINK: generateUiPermissionKey('ReferralsPage', 'Actions', 'Button', 'CopyLink'),
  REFERRAL_STATS: generateUiPermissionKey('ReferralsPage', 'Stats', 'Widget', 'View'),

  // Communication
  CHAT_VIEW: generateUiPermissionKey('ChatPage', undefined, 'Page', 'View'),
  CHAT_REPLY: generateUiPermissionKey('ChatPage', undefined, 'Page', 'Reply'),
  CHAT_SEND: generateUiPermissionKey('ChatPage', 'Thread', 'Button', 'Send'),
  REVIEWS_VIEW: generateUiPermissionKey('ReviewsPage', undefined, 'Page', 'View'),
  REVIEWS_REPLY: generateUiPermissionKey('ReviewsPage', undefined, 'Page', 'Reply'),

  // Support
  SUPPORT_INBOX_VIEW: generateUiPermissionKey('SupportInbox', undefined, 'Page', 'View'),
  SUPPORT_REPLY: generateUiPermissionKey('SupportInbox', 'Thread', 'Button', 'Reply'),
  SUPPORT_CHANGE_STATUS: generateUiPermissionKey('SupportInbox', 'Thread', 'Dropdown', 'ChangeStatus'),
  SUPPORT_ASSIGN: generateUiPermissionKey('SupportInbox', 'Thread', 'Dropdown', 'Assign'),

  // Payout
  PAYOUT_VIEW: generateUiPermissionKey('PayoutAccountsPage', undefined, 'Page', 'View'),
  PAYOUT_ADD: generateUiPermissionKey('PayoutAccountsPage', 'Header', 'Button', 'Add'),
  PAYOUT_EDIT: generateUiPermissionKey('PayoutAccountsPage', 'Card', 'Button', 'Edit'),
  PAYOUT_DELETE: generateUiPermissionKey('PayoutAccountsPage', 'Card', 'Button', 'Delete'),

  // Groups
  PROPERTY_GROUPS_VIEW: generateUiPermissionKey('PropertyGroupsManagement', undefined, 'Page', 'View'),
  PROPERTY_GROUP_CREATE: generateUiPermissionKey('PropertyGroupsManagement', 'Header', 'Button', 'Create'),
  PROPERTY_GROUP_EDIT: generateUiPermissionKey('PropertyGroupsManagement', 'Card', 'Button', 'Edit'),
  PROPERTY_GROUP_DELETE: generateUiPermissionKey('PropertyGroupsManagement', 'Card', 'Button', 'Delete'),
  PROPERTY_GROUP_ADD_PROP: generateUiPermissionKey('PropertyGroupsManagement', 'Detail', 'Button', 'AddProperty'),
  PROPERTY_GROUP_REMOVE_PROP: generateUiPermissionKey('PropertyGroupsManagement', 'Detail', 'Button', 'RemoveProperty'),
  SERVICE_GROUPS_VIEW: generateUiPermissionKey('ServiceGroupsManagement', undefined, 'Page', 'View'),
  SERVICE_GROUP_CREATE: generateUiPermissionKey('ServiceGroupsManagement', 'Header', 'Button', 'Create'),
  SERVICE_GROUP_EDIT: generateUiPermissionKey('ServiceGroupsManagement', 'Card', 'Button', 'Edit'),
  SERVICE_GROUP_DELETE: generateUiPermissionKey('ServiceGroupsManagement', 'Card', 'Button', 'Delete'),
  GROUPS_VIEW: generateUiPermissionKey('GroupsManagement', undefined, 'Page', 'View'),

  // Verification
  VERIFICATION_VIEW: generateUiPermissionKey('VerificationReview', undefined, 'Page', 'View'),
  VERIFICATION_APPROVE: generateUiPermissionKey('VerificationReview', 'Actions', 'Button', 'Approve'),
  VERIFICATION_REJECT: generateUiPermissionKey('VerificationReview', 'Actions', 'Button', 'Reject'),

  // Email Analytics
  EMAIL_ANALYTICS_VIEW: generateUiPermissionKey('EmailAnalyticsPage', undefined, 'Page', 'View'),

  // Settings
  SETTINGS_VIEW: generateUiPermissionKey('SettingsPage', undefined, 'Page', 'View'),
  SETTINGS_PROFILE: generateUiPermissionKey('SettingsPage', 'Profile', 'Section', 'Edit'),
  SETTINGS_NOTIFICATIONS: generateUiPermissionKey('SettingsPage', 'Notifications', 'Section', 'Edit'),
  SETTINGS_ALERTS: generateUiPermissionKey('SettingsPage', 'Alerts', 'Section', 'Edit'),

  // Shared components
  PRODUCT_CARD_FAVORITE: generateUiPermissionKey('ProductCard', 'Actions', 'Button', 'Favorite'),
  PRODUCT_CARD_SHARE: generateUiPermissionKey('ProductCard', 'Actions', 'Button', 'Share'),
  PRODUCT_MODAL_VIEW: generateUiPermissionKey('ProductModal', undefined, 'Modal', 'View'),
  PRODUCT_MODAL_BOOK: generateUiPermissionKey('ProductModal', 'Actions', 'Button', 'Book'),
  COMMENT_POST: generateUiPermissionKey('DynamicComments', 'Form', 'Button', 'Post'),
  COMMENT_EDIT: generateUiPermissionKey('DynamicComments', 'Item', 'Button', 'Edit'),
  COMMENT_DELETE: generateUiPermissionKey('DynamicComments', 'Item', 'Button', 'Delete'),
  COMMENT_REPLY: generateUiPermissionKey('DynamicComments', 'Item', 'Button', 'Reply'),
  REACTION_TOGGLE: generateUiPermissionKey('DynamicReactions', 'Actions', 'Button', 'Toggle'),
  BASKET_VIEW: generateUiPermissionKey('Basket', undefined, 'Widget', 'View'),
  BASKET_CHECKOUT: generateUiPermissionKey('Basket', 'Actions', 'Button', 'Checkout'),
  NOTIFICATIONS_VIEW: generateUiPermissionKey('NotificationsPanel', undefined, 'Widget', 'View'),

  // Navigation / Sidebar
  NAV_ADMIN: generateUiPermissionKey('DynamicNavMenu', 'Admin', 'Link', 'View'),
  NAV_HYPER: generateUiPermissionKey('DynamicNavMenu', 'Hyper', 'Link', 'View'),
  NAV_HOST: generateUiPermissionKey('DynamicNavMenu', 'Host', 'Link', 'View'),
  NAV_DASHBOARD: generateUiPermissionKey('Sidebar', 'Dashboard', 'Link', 'View'),
  NAV_PROPERTIES: generateUiPermissionKey('Sidebar', 'Properties', 'Link', 'View'),
  NAV_SERVICES: generateUiPermissionKey('Sidebar', 'Services', 'Link', 'View'),
  NAV_BOOKINGS: generateUiPermissionKey('Sidebar', 'Bookings', 'Link', 'View'),
  NAV_CALENDAR: generateUiPermissionKey('Sidebar', 'Calendar', 'Link', 'View'),
  NAV_POINTS: generateUiPermissionKey('Sidebar', 'Points', 'Link', 'View'),
  NAV_REQUESTS: generateUiPermissionKey('Sidebar', 'Requests', 'Link', 'View'),
  NAV_HISTORY: generateUiPermissionKey('Sidebar', 'History', 'Link', 'View'),
  NAV_SETTINGS: generateUiPermissionKey('Sidebar', 'Settings', 'Link', 'View'),
  NAV_SUPPORT: generateUiPermissionKey('Sidebar', 'Support', 'Link', 'View'),
  NAV_DEMO: generateUiPermissionKey('Sidebar', 'Demo', 'Link', 'View'),

  // Sidebar — full coverage of every nav item in src/config/navigation.config.ts
  NAV_HOME:                generateUiPermissionKey('Sidebar', 'Home',               'Link', 'View'),
  NAV_MY_BOOKINGS:         generateUiPermissionKey('Sidebar', 'MyBookings',         'Link', 'View'),
  NAV_COMPONENTS:          generateUiPermissionKey('Sidebar', 'Components',         'Link', 'View'),
  NAV_GRID_DEMO:           generateUiPermissionKey('Sidebar', 'GridDemo',           'Link', 'View'),
  NAV_FILTER_DEMO:         generateUiPermissionKey('Sidebar', 'FilterDemo',         'Link', 'View'),
  NAV_MAP:                 generateUiPermissionKey('Sidebar', 'Map',                'Link', 'View'),
  NAV_MAP_SEARCH:          generateUiPermissionKey('Sidebar', 'MapSearch',          'Link', 'View'),
  NAV_MAP_SAVED:           generateUiPermissionKey('Sidebar', 'MapSaved',           'Link', 'View'),
  NAV_CALENDAR_EVENTS:     generateUiPermissionKey('Sidebar', 'CalendarEvents',     'Link', 'View'),
  NAV_CALENDAR_BOOKINGS:   generateUiPermissionKey('Sidebar', 'CalendarBookings',   'Link', 'View'),
  NAV_PAGES:               generateUiPermissionKey('Sidebar', 'Pages',              'Link', 'View'),
  NAV_PAGES_LIST:          generateUiPermissionKey('Sidebar', 'PagesList',          'Link', 'View'),
  NAV_PAGES_CREATE:        generateUiPermissionKey('Sidebar', 'PagesCreate',        'Link', 'View'),
  NAV_MEDIA:               generateUiPermissionKey('Sidebar', 'Media',              'Link', 'View'),
  NAV_MESSAGES:            generateUiPermissionKey('Sidebar', 'Messages',           'Link', 'View'),
  NAV_MY_DISPUTES:         generateUiPermissionKey('Sidebar', 'MyDisputes',         'Link', 'View'),
  NAV_PAYMENT_VALIDATION:  generateUiPermissionKey('Sidebar', 'PaymentValidation',  'Link', 'View'),
  NAV_PAYOUTS:             generateUiPermissionKey('Sidebar', 'Payouts',            'Link', 'View'),
  NAV_ESCROW:              generateUiPermissionKey('Sidebar', 'Escrow',             'Link', 'View'),
  NAV_HOST_REACTIVATION:   generateUiPermissionKey('Sidebar', 'HostReactivation',   'Link', 'View'),
  NAV_BOOKING_CALENDAR:    generateUiPermissionKey('Sidebar', 'BookingCalendar',    'Link', 'View'),
  NAV_ADMIN_DASHBOARD:     generateUiPermissionKey('Sidebar', 'AdminDashboard',     'Link', 'View'),
  NAV_CANCELLATION_RULES:  generateUiPermissionKey('Sidebar', 'CancellationRules',  'Link', 'View'),
  NAV_SUPPORT_CHAT:        generateUiPermissionKey('Sidebar', 'SupportChat',        'Link', 'View'),
  NAV_USERS:               generateUiPermissionKey('Sidebar', 'Users',              'Link', 'View'),
  NAV_ANALYTICS:           generateUiPermissionKey('Sidebar', 'Analytics',          'Link', 'View'),
  NAV_SECURITY:            generateUiPermissionKey('Sidebar', 'Security',           'Link', 'View'),
  NAV_APPEARANCE:          generateUiPermissionKey('Sidebar', 'Appearance',         'Link', 'View'),
  NAV_RBAC_SETTINGS:       generateUiPermissionKey('Sidebar', 'RbacSettings',       'Link', 'View'),
  NAV_RBAC_DEBUG:          generateUiPermissionKey('Sidebar', 'RbacDebug',          'Link', 'View'),
  NAV_NOTIFICATIONS:       generateUiPermissionKey('Sidebar', 'Notifications',      'Link', 'View'),
  NAV_HELP:                generateUiPermissionKey('Sidebar', 'Help',               'Link', 'View'),
  NAV_PROFILE:             generateUiPermissionKey('Sidebar', 'Profile',            'Link', 'View'),
} as const;

/** All valid UI permission keys */
export const ALL_UI_KEYS = new Set(Object.values(UI_PERM));

export type UiPermissionKey = (typeof UI_PERM)[keyof typeof UI_PERM];
