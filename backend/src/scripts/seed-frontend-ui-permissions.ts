/**
 * Seed script for rbac_frontend_permissions — comprehensive UI element mapping.
 * Maps ALL frontend UI elements (pages, tabs, buttons, modals, dropdowns, widgets)
 * to permission keys using generateUiPermissionKey().
 *
 * Standalone — no service injection needed.
 * Run: npx ts-node -r tsconfig-paths/register src/scripts/seed-frontend-ui-permissions.ts
 */

import { DataSource } from 'typeorm';
import { generateUiPermissionKey } from '../rbac/utils/generate-ui-permission-key';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
});

// ─── Role Groups ──────────────────────────────────────────────────────────────
const ALL = ['hyper_admin', 'hyper_manager', 'admin', 'manager', 'user', 'guest'];
const HYPER = ['hyper_admin', 'hyper_manager'];
const HOST = ['hyper_admin', 'hyper_manager', 'admin', 'manager'];
const ADMIN_UP = ['hyper_admin', 'hyper_manager', 'admin'];
const AUTHENTICATED = ALL;
const BOOKERS = ['manager', 'user', 'guest'];

interface UiPerm {
  component: string;
  sub_view?: string;
  element_type?: string;
  action_name?: string;
  user_roles: string[];
  module: string;
  description: string;
}

// ─── Complete UI Permission Map ───────────────────────────────────────────────

const UI_PERMISSIONS: UiPerm[] = [
  // ══════════════════════════════════════════════════════════════════════
  // PROPERTY PAGES
  // ══════════════════════════════════════════════════════════════════════

  // PropertyListPage
  { component: 'PropertyListPage', element_type: 'Page', action_name: 'View', user_roles: ALL, module: 'properties', description: 'View property listing page' },
  { component: 'PropertyListPage', sub_view: 'Header', element_type: 'Button', action_name: 'Add', user_roles: ['admin'], module: 'properties', description: 'Add property button' },
  { component: 'PropertyListPage', sub_view: 'Card', element_type: 'Button', action_name: 'Edit', user_roles: ['admin', 'manager'], module: 'properties', description: 'Edit property button' },
  { component: 'PropertyListPage', sub_view: 'Card', element_type: 'Button', action_name: 'Delete', user_roles: ['hyper_admin', 'admin'], module: 'properties', description: 'Delete property button' },
  { component: 'PropertyListPage', sub_view: 'Card', element_type: 'Button', action_name: 'Pause', user_roles: ['admin', 'manager'], module: 'properties', description: 'Pause property button' },
  { component: 'PropertyListPage', sub_view: 'Card', element_type: 'Button', action_name: 'Duplicate', user_roles: ['admin'], module: 'properties', description: 'Duplicate property button' },
  { component: 'PropertyListPage', sub_view: 'Map', element_type: 'Widget', action_name: 'View', user_roles: ALL, module: 'properties', description: 'View map on property list' },
  { component: 'PropertyListPage', sub_view: 'Filter', element_type: 'Dropdown', action_name: 'Filter', user_roles: ALL, module: 'properties', description: 'Filter properties dropdown' },
  { component: 'PropertyListPage', sub_view: 'Filter', element_type: 'Dropdown', action_name: 'Sort', user_roles: ALL, module: 'properties', description: 'Sort properties dropdown' },

  // PropertyDetailPage
  { component: 'PropertyDetailPage', element_type: 'Page', action_name: 'View', user_roles: ALL, module: 'properties', description: 'View property detail page' },
  { component: 'PropertyDetailPage', sub_view: 'Actions', element_type: 'Button', action_name: 'Edit', user_roles: ['admin', 'manager'], module: 'properties', description: 'Edit property from detail' },
  { component: 'PropertyDetailPage', sub_view: 'Actions', element_type: 'Button', action_name: 'Delete', user_roles: ['hyper_admin', 'admin'], module: 'properties', description: 'Delete property from detail' },
  { component: 'PropertyDetailPage', sub_view: 'Actions', element_type: 'Button', action_name: 'Pause', user_roles: ['admin', 'manager'], module: 'properties', description: 'Pause property from detail' },
  { component: 'PropertyDetailPage', sub_view: 'Actions', element_type: 'Button', action_name: 'Duplicate', user_roles: ['admin'], module: 'properties', description: 'Duplicate from detail' },
  { component: 'PropertyDetailPage', sub_view: 'Actions', element_type: 'Button', action_name: 'Share', user_roles: AUTHENTICATED, module: 'referrals', description: 'Share property button' },
  { component: 'PropertyDetailPage', sub_view: 'Actions', element_type: 'Button', action_name: 'Favorite', user_roles: AUTHENTICATED, module: 'properties', description: 'Add to favorites' },
  { component: 'PropertyDetailPage', sub_view: 'Booking', element_type: 'Modal', action_name: 'Open', user_roles: BOOKERS, module: 'bookings', description: 'Open booking modal' },
  { component: 'PropertyDetailPage', sub_view: 'Reviews', element_type: 'Section', action_name: 'View', user_roles: ALL, module: 'reviews', description: 'View reviews section' },
  { component: 'PropertyDetailPage', sub_view: 'Reviews', element_type: 'Button', action_name: 'Add', user_roles: ['user', 'guest'], module: 'reviews', description: 'Add review button' },
  { component: 'PropertyDetailPage', sub_view: 'Comments', element_type: 'Section', action_name: 'View', user_roles: AUTHENTICATED, module: 'comments', description: 'View comments section' },
  { component: 'PropertyDetailPage', sub_view: 'Comments', element_type: 'Button', action_name: 'Add', user_roles: AUTHENTICATED, module: 'comments', description: 'Add comment button' },
  { component: 'PropertyDetailPage', sub_view: 'Gallery', element_type: 'Widget', action_name: 'View', user_roles: ALL, module: 'properties', description: 'View photo gallery' },
  { component: 'PropertyDetailPage', sub_view: 'Pricing', element_type: 'Section', action_name: 'View', user_roles: ALL, module: 'properties', description: 'View pricing section' },
  { component: 'PropertyDetailPage', sub_view: 'Availability', element_type: 'Widget', action_name: 'View', user_roles: ALL, module: 'properties', description: 'View availability calendar' },
  { component: 'PropertyDetailPage', sub_view: 'PromoAlerts', element_type: 'Button', action_name: 'Subscribe', user_roles: AUTHENTICATED, module: 'properties', description: 'Subscribe to promo alerts' },
  { component: 'PropertyDetailPage', sub_view: 'PromoAlerts', element_type: 'Button', action_name: 'Unsubscribe', user_roles: AUTHENTICATED, module: 'properties', description: 'Unsubscribe from promo alerts' },
  { component: 'PropertyDetailPage', sub_view: 'Documents', element_type: 'Section', action_name: 'View', user_roles: ['admin', 'manager'], module: 'documents', description: 'View property documents' },
  { component: 'PropertyDetailPage', sub_view: 'Documents', element_type: 'Button', action_name: 'Upload', user_roles: ['admin'], module: 'documents', description: 'Upload property document' },
  { component: 'PropertyDetailPage', sub_view: 'TrustScore', element_type: 'Button', action_name: 'Recalculate', user_roles: ['admin'], module: 'properties', description: 'Recalculate trust score' },

  // AddPropertyWizard
  { component: 'AddPropertyWizard', element_type: 'Page', action_name: 'View', user_roles: ['admin'], module: 'properties', description: 'Access add property wizard' },
  { component: 'AddPropertyWizard', sub_view: 'Form', element_type: 'Button', action_name: 'Submit', user_roles: ['admin'], module: 'properties', description: 'Submit new property' },

  // SavedSearchAlerts
  { component: 'SavedSearchAlerts', element_type: 'Page', action_name: 'View', user_roles: AUTHENTICATED, module: 'properties', description: 'View saved search alerts' },
  { component: 'SavedSearchAlerts', sub_view: 'Header', element_type: 'Button', action_name: 'Create', user_roles: AUTHENTICATED, module: 'properties', description: 'Create saved search alert' },
  { component: 'SavedSearchAlerts', sub_view: 'Card', element_type: 'Button', action_name: 'Edit', user_roles: AUTHENTICATED, module: 'properties', description: 'Edit saved search alert' },
  { component: 'SavedSearchAlerts', sub_view: 'Card', element_type: 'Button', action_name: 'Delete', user_roles: AUTHENTICATED, module: 'properties', description: 'Delete saved search alert' },

  // ══════════════════════════════════════════════════════════════════════
  // SERVICE PAGES
  // ══════════════════════════════════════════════════════════════════════

  // ServiceListPage
  { component: 'ServiceListPage', element_type: 'Page', action_name: 'View', user_roles: ALL, module: 'services', description: 'View service listing page' },
  { component: 'ServiceListPage', sub_view: 'Header', element_type: 'Button', action_name: 'Add', user_roles: ['admin'], module: 'services', description: 'Add service button' },
  { component: 'ServiceListPage', sub_view: 'Card', element_type: 'Button', action_name: 'Edit', user_roles: ['admin', 'manager'], module: 'services', description: 'Edit service button' },
  { component: 'ServiceListPage', sub_view: 'Card', element_type: 'Button', action_name: 'Delete', user_roles: ['hyper_admin', 'admin'], module: 'services', description: 'Delete service button' },
  { component: 'ServiceListPage', sub_view: 'Card', element_type: 'Button', action_name: 'Pause', user_roles: ['admin', 'manager'], module: 'services', description: 'Pause service button' },
  { component: 'ServiceListPage', sub_view: 'Card', element_type: 'Button', action_name: 'Duplicate', user_roles: ['admin'], module: 'services', description: 'Duplicate service button' },
  { component: 'ServiceListPage', sub_view: 'Map', element_type: 'Widget', action_name: 'View', user_roles: ALL, module: 'services', description: 'View map on service list' },
  { component: 'ServiceListPage', sub_view: 'Filter', element_type: 'Dropdown', action_name: 'Filter', user_roles: ALL, module: 'services', description: 'Filter services dropdown' },
  { component: 'ServiceListPage', sub_view: 'Filter', element_type: 'Dropdown', action_name: 'Sort', user_roles: ALL, module: 'services', description: 'Sort services dropdown' },

  // ServiceDetailPage
  { component: 'ServiceDetailPage', element_type: 'Page', action_name: 'View', user_roles: ALL, module: 'services', description: 'View service detail page' },
  { component: 'ServiceDetailPage', sub_view: 'Actions', element_type: 'Button', action_name: 'Edit', user_roles: ['admin', 'manager'], module: 'services', description: 'Edit service from detail' },
  { component: 'ServiceDetailPage', sub_view: 'Actions', element_type: 'Button', action_name: 'Delete', user_roles: ['hyper_admin', 'admin'], module: 'services', description: 'Delete service from detail' },
  { component: 'ServiceDetailPage', sub_view: 'Actions', element_type: 'Button', action_name: 'Pause', user_roles: ['admin', 'manager'], module: 'services', description: 'Pause service from detail' },
  { component: 'ServiceDetailPage', sub_view: 'Actions', element_type: 'Button', action_name: 'Duplicate', user_roles: ['admin'], module: 'services', description: 'Duplicate from detail' },
  { component: 'ServiceDetailPage', sub_view: 'Booking', element_type: 'Modal', action_name: 'Open', user_roles: BOOKERS, module: 'service_bookings', description: 'Open service booking modal' },
  { component: 'ServiceDetailPage', sub_view: 'Reviews', element_type: 'Section', action_name: 'View', user_roles: ALL, module: 'reviews', description: 'View service reviews' },
  { component: 'ServiceDetailPage', sub_view: 'Documents', element_type: 'Section', action_name: 'View', user_roles: ['admin', 'manager'], module: 'services', description: 'View service documents' },
  { component: 'ServiceDetailPage', sub_view: 'Documents', element_type: 'Button', action_name: 'Upload', user_roles: ['admin'], module: 'services', description: 'Upload service document' },
  { component: 'ServiceDetailPage', sub_view: 'Availability', element_type: 'Widget', action_name: 'View', user_roles: ALL, module: 'service_bookings', description: 'View service availability' },
  { component: 'ServiceDetailPage', sub_view: 'Availability', element_type: 'Button', action_name: 'Set', user_roles: ['admin', 'manager'], module: 'service_bookings', description: 'Set service availability' },

  // AddServiceWizard
  { component: 'AddServiceWizard', element_type: 'Page', action_name: 'View', user_roles: ['admin'], module: 'services', description: 'Access add service wizard' },
  { component: 'AddServiceWizard', sub_view: 'Form', element_type: 'Button', action_name: 'Submit', user_roles: ['admin'], module: 'services', description: 'Submit new service' },

  // ══════════════════════════════════════════════════════════════════════
  // BOOKING PAGES
  // ══════════════════════════════════════════════════════════════════════

  // BookingsPage
  { component: 'BookingsPage', element_type: 'Tab', action_name: 'View', user_roles: HOST, module: 'bookings', description: 'Show bookings tab' },
  { component: 'BookingsPage', sub_view: 'Detail', element_type: 'Button', action_name: 'Accept', user_roles: ['admin', 'manager'], module: 'bookings', description: 'Accept booking button' },
  { component: 'BookingsPage', sub_view: 'Detail', element_type: 'Button', action_name: 'Reject', user_roles: ['admin', 'manager'], module: 'bookings', description: 'Reject booking button' },
  { component: 'BookingsPage', sub_view: 'Detail', element_type: 'Button', action_name: 'Refund', user_roles: ['hyper_admin', 'admin'], module: 'bookings', description: 'Refund booking button' },
  { component: 'BookingsPage', sub_view: 'Detail', element_type: 'Button', action_name: 'CounterOffer', user_roles: ['admin', 'manager'], module: 'bookings', description: 'Counter-offer button' },
  { component: 'BookingsPage', sub_view: 'List', element_type: 'Dropdown', action_name: 'FilterStatus', user_roles: HOST, module: 'bookings', description: 'Filter bookings by status' },
  { component: 'BookingsPage', sub_view: 'List', element_type: 'Dropdown', action_name: 'FilterProperty', user_roles: HOST, module: 'bookings', description: 'Filter bookings by property' },

  // BookingCalendarPage
  { component: 'BookingCalendarPage', element_type: 'Page', action_name: 'View', user_roles: HOST, module: 'bookings', description: 'View booking calendar' },
  { component: 'BookingCalendarPage', sub_view: 'Filters', element_type: 'Dropdown', action_name: 'FilterStatus', user_roles: HOST, module: 'bookings', description: 'Calendar filter by status' },
  { component: 'BookingCalendarPage', sub_view: 'Filters', element_type: 'Dropdown', action_name: 'FilterProperty', user_roles: HOST, module: 'bookings', description: 'Calendar filter by property' },
  { component: 'BookingCalendarPage', sub_view: 'Filters', element_type: 'Dropdown', action_name: 'FilterService', user_roles: HOST, module: 'bookings', description: 'Calendar filter by service' },
  { component: 'BookingCalendarPage', sub_view: 'Filters', element_type: 'Dropdown', action_name: 'FilterHost', user_roles: HYPER, module: 'bookings', description: 'Calendar filter by host (hyper only)' },

  // BookingModal
  { component: 'BookingModal', element_type: 'Modal', action_name: 'Open', user_roles: BOOKERS, module: 'bookings', description: 'Open booking modal' },
  { component: 'BookingModal', sub_view: 'Form', element_type: 'Button', action_name: 'Submit', user_roles: BOOKERS, module: 'bookings', description: 'Submit booking' },

  // BookingHistory (user side)
  { component: 'BookingHistory', element_type: 'Page', action_name: 'View', user_roles: AUTHENTICATED, module: 'bookings', description: 'View booking history' },
  { component: 'BookingHistory', sub_view: 'Detail', element_type: 'Button', action_name: 'Cancel', user_roles: AUTHENTICATED, module: 'bookings', description: 'Cancel own booking' },

  // HostBookings
  { component: 'HostBookings', element_type: 'Page', action_name: 'View', user_roles: HOST, module: 'bookings', description: 'View host bookings management' },
  { component: 'HostBookings', sub_view: 'Actions', element_type: 'Button', action_name: 'Accept', user_roles: ['admin', 'manager'], module: 'bookings', description: 'Accept booking (host)' },
  { component: 'HostBookings', sub_view: 'Actions', element_type: 'Button', action_name: 'Reject', user_roles: ['admin', 'manager'], module: 'bookings', description: 'Reject booking (host)' },
  { component: 'HostBookings', sub_view: 'Actions', element_type: 'Button', action_name: 'Refund', user_roles: ['hyper_admin', 'admin'], module: 'bookings', description: 'Refund booking (host)' },

  // ServiceBookingForm
  { component: 'ServiceBookingForm', element_type: 'Modal', action_name: 'Open', user_roles: BOOKERS, module: 'service_bookings', description: 'Open service booking form' },
  { component: 'ServiceBookingForm', sub_view: 'Form', element_type: 'Button', action_name: 'Submit', user_roles: BOOKERS, module: 'service_bookings', description: 'Submit service booking' },

  // ══════════════════════════════════════════════════════════════════════
  // DASHBOARD PAGES
  // ══════════════════════════════════════════════════════════════════════

  // Dashboard
  { component: 'Dashboard', element_type: 'Page', action_name: 'View', user_roles: AUTHENTICATED, module: 'dashboard', description: 'Access dashboard' },
  { component: 'Dashboard', sub_view: 'Analytics', element_type: 'Tab', action_name: 'View', user_roles: ADMIN_UP, module: 'dashboard', description: 'View analytics tab' },
  { component: 'Dashboard', sub_view: 'Payments', element_type: 'Tab', action_name: 'View', user_roles: ADMIN_UP, module: 'dashboard', description: 'View payments tab' },
  { component: 'Dashboard', sub_view: 'Revenue', element_type: 'Widget', action_name: 'View', user_roles: ADMIN_UP, module: 'dashboard', description: 'View revenue widget' },
  { component: 'Dashboard', sub_view: 'Bookings', element_type: 'Widget', action_name: 'View', user_roles: HOST, module: 'dashboard', description: 'View bookings widget' },
  { component: 'Dashboard', sub_view: 'Properties', element_type: 'Widget', action_name: 'View', user_roles: HOST, module: 'dashboard', description: 'View properties widget' },

  // HyperDashboard
  { component: 'HyperDashboard', element_type: 'Page', action_name: 'View', user_roles: HYPER, module: 'dashboard', description: 'Access hyper dashboard' },
  { component: 'HyperDashboard', sub_view: 'PaymentValidation', element_type: 'Tab', action_name: 'View', user_roles: HYPER, module: 'dashboard', description: 'Payment validation tab' },
  { component: 'HyperDashboard', sub_view: 'PaymentValidation', element_type: 'Button', action_name: 'Approve', user_roles: HYPER, module: 'payments', description: 'Approve payment receipt' },
  { component: 'HyperDashboard', sub_view: 'PaymentValidation', element_type: 'Button', action_name: 'Reject', user_roles: HYPER, module: 'payments', description: 'Reject payment receipt' },
  { component: 'HyperDashboard', sub_view: 'Users', element_type: 'Tab', action_name: 'View', user_roles: HYPER, module: 'dashboard', description: 'Users management tab' },
  { component: 'HyperDashboard', sub_view: 'Users', element_type: 'Button', action_name: 'Pause', user_roles: HYPER, module: 'hyper', description: 'Pause user' },
  { component: 'HyperDashboard', sub_view: 'Users', element_type: 'Button', action_name: 'Archive', user_roles: HYPER, module: 'hyper', description: 'Archive user' },
  { component: 'HyperDashboard', sub_view: 'Properties', element_type: 'Tab', action_name: 'View', user_roles: HYPER, module: 'dashboard', description: 'Properties management tab' },
  { component: 'HyperDashboard', sub_view: 'Properties', element_type: 'Button', action_name: 'Pause', user_roles: HYPER, module: 'hyper', description: 'Pause property (hyper)' },
  { component: 'HyperDashboard', sub_view: 'Properties', element_type: 'Button', action_name: 'Archive', user_roles: HYPER, module: 'hyper', description: 'Archive property (hyper)' },
  { component: 'HyperDashboard', sub_view: 'Properties', element_type: 'Button', action_name: 'Delete', user_roles: ['hyper_admin'], module: 'hyper', description: 'Delete property permanently' },
  { component: 'HyperDashboard', sub_view: 'Services', element_type: 'Tab', action_name: 'View', user_roles: HYPER, module: 'dashboard', description: 'Services management tab' },
  { component: 'HyperDashboard', sub_view: 'Services', element_type: 'Button', action_name: 'Pause', user_roles: HYPER, module: 'hyper', description: 'Pause service (hyper)' },
  { component: 'HyperDashboard', sub_view: 'Services', element_type: 'Button', action_name: 'Archive', user_roles: HYPER, module: 'hyper', description: 'Archive service (hyper)' },
  { component: 'HyperDashboard', sub_view: 'Verification', element_type: 'Tab', action_name: 'View', user_roles: HYPER, module: 'dashboard', description: 'Verification tab' },
  { component: 'HyperDashboard', sub_view: 'Verification', element_type: 'Button', action_name: 'Approve', user_roles: HYPER, module: 'documents', description: 'Approve document' },
  { component: 'HyperDashboard', sub_view: 'Verification', element_type: 'Button', action_name: 'Reject', user_roles: HYPER, module: 'documents', description: 'Reject document' },
  { component: 'HyperDashboard', sub_view: 'Assignments', element_type: 'Tab', action_name: 'View', user_roles: HYPER, module: 'dashboard', description: 'Assignments tab' },
  { component: 'HyperDashboard', sub_view: 'Assignments', element_type: 'Button', action_name: 'Create', user_roles: HYPER, module: 'roles', description: 'Create assignment' },
  { component: 'HyperDashboard', sub_view: 'Assignments', element_type: 'Button', action_name: 'Delete', user_roles: HYPER, module: 'roles', description: 'Remove assignment' },

  // AdminDashboard
  { component: 'AdminDashboard', element_type: 'Page', action_name: 'View', user_roles: ADMIN_UP, module: 'dashboard', description: 'Access admin dashboard' },

  // ManagerDashboard
  { component: 'ManagerDashboard', element_type: 'Page', action_name: 'View', user_roles: ['manager', 'hyper_manager'], module: 'dashboard', description: 'Access manager dashboard' },

  // UserDashboard
  { component: 'UserDashboard', element_type: 'Page', action_name: 'View', user_roles: ['user', 'guest'], module: 'dashboard', description: 'Access user dashboard' },

  // GuestDashboard
  { component: 'GuestDashboard', element_type: 'Page', action_name: 'View', user_roles: ['guest'], module: 'dashboard', description: 'Access guest dashboard' },

  // ══════════════════════════════════════════════════════════════════════
  // ADMIN / USERS PAGES
  // ══════════════════════════════════════════════════════════════════════

  // UsersPage
  { component: 'UsersPage', element_type: 'Tab', action_name: 'View', user_roles: HYPER, module: 'users', description: 'Show users tab' },
  { component: 'UsersPage', sub_view: 'List', element_type: 'Button', action_name: 'Invite', user_roles: ADMIN_UP, module: 'users', description: 'Invite user button' },
  { component: 'UsersPage', sub_view: 'List', element_type: 'Button', action_name: 'ConvertGuest', user_roles: ['admin'], module: 'users', description: 'Convert guest to user' },
  { component: 'UsersPage', sub_view: 'List', element_type: 'Button', action_name: 'UpdateStatus', user_roles: ADMIN_UP, module: 'users', description: 'Update user status' },
  { component: 'UsersPage', sub_view: 'List', element_type: 'Button', action_name: 'DeleteUser', user_roles: ['hyper_admin'], module: 'users', description: 'Delete user permanently' },
  { component: 'UsersPage', sub_view: 'Detail', element_type: 'Button', action_name: 'AssignRole', user_roles: ['hyper_admin', 'admin'], module: 'users', description: 'Assign role button' },
  { component: 'UsersPage', sub_view: 'Detail', element_type: 'Button', action_name: 'RemoveRole', user_roles: ['hyper_admin', 'admin'], module: 'users', description: 'Remove role button' },
  { component: 'UsersPage', sub_view: 'Detail', element_type: 'Button', action_name: 'ManagePermissions', user_roles: ['hyper_admin', 'admin'], module: 'users', description: 'Manage permissions button' },
  { component: 'UsersPage', sub_view: 'Detail', element_type: 'Modal', action_name: 'ViewProfile', user_roles: ADMIN_UP, module: 'users', description: 'View user profile modal' },
  { component: 'UsersPage', sub_view: 'Filter', element_type: 'Dropdown', action_name: 'FilterRole', user_roles: HYPER, module: 'users', description: 'Filter users by role' },
  { component: 'UsersPage', sub_view: 'Filter', element_type: 'Dropdown', action_name: 'FilterStatus', user_roles: HYPER, module: 'users', description: 'Filter users by status' },

  // ManagerAssignments
  { component: 'ManagerAssignments', element_type: 'Page', action_name: 'View', user_roles: ADMIN_UP, module: 'roles', description: 'View manager assignments' },
  { component: 'ManagerAssignments', sub_view: 'Header', element_type: 'Button', action_name: 'Create', user_roles: ['admin'], module: 'roles', description: 'Create assignment button' },
  { component: 'ManagerAssignments', sub_view: 'List', element_type: 'Button', action_name: 'Delete', user_roles: ['admin'], module: 'roles', description: 'Delete assignment button' },
  { component: 'ManagerAssignments', sub_view: 'Detail', element_type: 'Button', action_name: 'EditPermissions', user_roles: ['admin'], module: 'roles', description: 'Edit assignment permissions' },
  { component: 'ManagerAssignments', sub_view: 'Detail', element_type: 'Button', action_name: 'SetPermissions', user_roles: ['admin'], module: 'roles', description: 'Set manager permissions' },
  { component: 'ManagerAssignments', sub_view: 'Modal', element_type: 'Dropdown', action_name: 'SelectManager', user_roles: ['admin', 'hyper_admin'], module: 'roles', description: 'Select manager dropdown' },
  { component: 'ManagerAssignments', sub_view: 'Modal', element_type: 'Dropdown', action_name: 'SelectScope', user_roles: ['admin', 'hyper_admin'], module: 'roles', description: 'Select scope dropdown' },

  // RolesManagement
  { component: 'RolesManagement', element_type: 'Page', action_name: 'View', user_roles: HYPER, module: 'roles', description: 'View roles management' },

  // ══════════════════════════════════════════════════════════════════════
  // RBAC SETTINGS
  // ══════════════════════════════════════════════════════════════════════

  { component: 'RbacSettings', element_type: 'Page', action_name: 'View', user_roles: HYPER, module: 'rbac', description: 'View RBAC settings' },
  { component: 'RbacSettings', element_type: 'Page', action_name: 'Edit', user_roles: ['hyper_admin'], module: 'rbac', description: 'Edit RBAC settings' },
  { component: 'RbacSettings', sub_view: 'Matrix', element_type: 'Toggle', action_name: 'TogglePermission', user_roles: ['hyper_admin'], module: 'rbac', description: 'Toggle permission in matrix' },
  { component: 'RbacSettings', sub_view: 'Matrix', element_type: 'Dropdown', action_name: 'SetScope', user_roles: ['hyper_admin'], module: 'rbac', description: 'Set permission scope' },
  { component: 'RbacSettings', sub_view: 'Actions', element_type: 'Button', action_name: 'Save', user_roles: ['hyper_admin'], module: 'rbac', description: 'Save RBAC changes' },
  { component: 'RbacSettings', sub_view: 'Actions', element_type: 'Button', action_name: 'ReloadCache', user_roles: ['hyper_admin'], module: 'rbac', description: 'Reload RBAC cache' },

  // ══════════════════════════════════════════════════════════════════════
  // FEES & RULES PAGES
  // ══════════════════════════════════════════════════════════════════════

  // ServiceFeesPage
  { component: 'ServiceFeesPage', element_type: 'Page', action_name: 'View', user_roles: HYPER, module: 'fees', description: 'View service fees page' },
  { component: 'ServiceFeesPage', sub_view: 'Header', element_type: 'Button', action_name: 'Add', user_roles: ['hyper_admin'], module: 'fees', description: 'Add fee rule' },
  { component: 'ServiceFeesPage', sub_view: 'Card', element_type: 'Button', action_name: 'Edit', user_roles: ['hyper_admin'], module: 'fees', description: 'Edit fee rule' },
  { component: 'ServiceFeesPage', sub_view: 'Card', element_type: 'Button', action_name: 'Delete', user_roles: ['hyper_admin'], module: 'fees', description: 'Delete fee rule' },

  // HostFeeAbsorptionPage
  { component: 'HostFeeAbsorptionPage', element_type: 'Page', action_name: 'View', user_roles: ['admin'], module: 'fees', description: 'View fee absorption page' },
  { component: 'HostFeeAbsorptionPage', sub_view: 'Header', element_type: 'Button', action_name: 'Add', user_roles: ['admin'], module: 'fees', description: 'Add absorption rule' },
  { component: 'HostFeeAbsorptionPage', sub_view: 'Card', element_type: 'Button', action_name: 'Edit', user_roles: ['admin'], module: 'fees', description: 'Edit absorption rule' },
  { component: 'HostFeeAbsorptionPage', sub_view: 'Card', element_type: 'Button', action_name: 'Delete', user_roles: ['admin'], module: 'fees', description: 'Delete absorption rule' },

  // CancellationRulesPage
  { component: 'CancellationRulesPage', element_type: 'Page', action_name: 'View', user_roles: ['admin'], module: 'fees', description: 'View cancellation rules' },
  { component: 'CancellationRulesPage', sub_view: 'Header', element_type: 'Button', action_name: 'Add', user_roles: ['admin'], module: 'fees', description: 'Add cancellation rule' },
  { component: 'CancellationRulesPage', sub_view: 'Card', element_type: 'Button', action_name: 'Edit', user_roles: ['admin'], module: 'fees', description: 'Edit cancellation rule' },
  { component: 'CancellationRulesPage', sub_view: 'Card', element_type: 'Button', action_name: 'Delete', user_roles: ['admin'], module: 'fees', description: 'Delete cancellation rule' },

  // ══════════════════════════════════════════════════════════════════════
  // POINTS & REWARDS
  // ══════════════════════════════════════════════════════════════════════

  // PointsRulesPage
  { component: 'PointsRulesPage', element_type: 'Page', action_name: 'View', user_roles: HYPER, module: 'points', description: 'View points rules' },
  { component: 'PointsRulesPage', sub_view: 'Header', element_type: 'Button', action_name: 'Add', user_roles: ['hyper_admin'], module: 'points', description: 'Add points rule' },
  { component: 'PointsRulesPage', sub_view: 'Card', element_type: 'Button', action_name: 'Edit', user_roles: ['hyper_admin'], module: 'points', description: 'Edit points rule' },
  { component: 'PointsRulesPage', sub_view: 'Card', element_type: 'Button', action_name: 'Delete', user_roles: ['hyper_admin'], module: 'points', description: 'Delete points rule' },

  // PointsPage
  { component: 'PointsPage', element_type: 'Page', action_name: 'View', user_roles: AUTHENTICATED, module: 'points', description: 'View my points page' },
  { component: 'PointsPage', sub_view: 'Leaderboard', element_type: 'Widget', action_name: 'View', user_roles: AUTHENTICATED, module: 'points', description: 'View leaderboard' },
  { component: 'PointsPage', sub_view: 'Transactions', element_type: 'Widget', action_name: 'View', user_roles: AUTHENTICATED, module: 'points', description: 'View transaction history' },
  { component: 'PointsPage', sub_view: 'Admin', element_type: 'Button', action_name: 'Award', user_roles: ADMIN_UP, module: 'points', description: 'Award points to user' },
  { component: 'PointsPage', sub_view: 'Admin', element_type: 'Button', action_name: 'Deduct', user_roles: ADMIN_UP, module: 'points', description: 'Deduct points from user' },
  { component: 'PointsPage', sub_view: 'Admin', element_type: 'Button', action_name: 'ViewUser', user_roles: ADMIN_UP, module: 'points', description: 'View user points' },

  // RewardsPage
  { component: 'RewardsPage', element_type: 'Page', action_name: 'View', user_roles: AUTHENTICATED, module: 'rewards', description: 'View rewards page' },
  { component: 'RewardsPage', sub_view: 'Detail', element_type: 'Button', action_name: 'Redeem', user_roles: BOOKERS, module: 'rewards', description: 'Redeem reward' },
  { component: 'RewardsPage', sub_view: 'Admin', element_type: 'Button', action_name: 'Create', user_roles: HYPER, module: 'rewards', description: 'Create reward' },
  { component: 'RewardsPage', sub_view: 'Admin', element_type: 'Button', action_name: 'Edit', user_roles: HYPER, module: 'rewards', description: 'Edit reward' },
  { component: 'RewardsPage', sub_view: 'Admin', element_type: 'Button', action_name: 'Delete', user_roles: HYPER, module: 'rewards', description: 'Delete reward' },
  { component: 'RewardsPage', sub_view: 'Redemptions', element_type: 'Widget', action_name: 'View', user_roles: AUTHENTICATED, module: 'rewards', description: 'View my redemptions' },
  { component: 'RewardsPage', sub_view: 'Redemptions', element_type: 'Button', action_name: 'Use', user_roles: AUTHENTICATED, module: 'rewards', description: 'Use redemption code' },
  { component: 'RewardsPage', sub_view: 'Redemptions', element_type: 'Button', action_name: 'Cancel', user_roles: AUTHENTICATED, module: 'rewards', description: 'Cancel redemption' },
  { component: 'RewardsPage', sub_view: 'AdminRedemptions', element_type: 'Widget', action_name: 'View', user_roles: HYPER, module: 'rewards', description: 'View all redemptions (admin)' },

  // Badges
  { component: 'BadgesPage', element_type: 'Page', action_name: 'View', user_roles: AUTHENTICATED, module: 'badges', description: 'View badges page' },
  { component: 'BadgesPage', sub_view: 'MyBadges', element_type: 'Widget', action_name: 'View', user_roles: AUTHENTICATED, module: 'badges', description: 'View my badges' },
  { component: 'BadgesPage', sub_view: 'Progress', element_type: 'Widget', action_name: 'View', user_roles: AUTHENTICATED, module: 'badges', description: 'View badge progress' },
  { component: 'BadgesPage', sub_view: 'Actions', element_type: 'Button', action_name: 'CheckUnlocks', user_roles: AUTHENTICATED, module: 'badges', description: 'Check badge unlocks' },

  // ══════════════════════════════════════════════════════════════════════
  // REFERRALS
  // ══════════════════════════════════════════════════════════════════════

  { component: 'ReferralsPage', element_type: 'Page', action_name: 'View', user_roles: AUTHENTICATED, module: 'referrals', description: 'View referrals page' },
  { component: 'ReferralsPage', sub_view: 'Actions', element_type: 'Button', action_name: 'CopyLink', user_roles: AUTHENTICATED, module: 'referrals', description: 'Copy referral link' },
  { component: 'ReferralsPage', sub_view: 'Stats', element_type: 'Widget', action_name: 'View', user_roles: AUTHENTICATED, module: 'referrals', description: 'View referral stats' },
  { component: 'ReferralsPage', sub_view: 'Actions', element_type: 'Button', action_name: 'Create', user_roles: AUTHENTICATED, module: 'referrals', description: 'Create referral' },
  { component: 'ReferralsPage', sub_view: 'Share', element_type: 'Button', action_name: 'ShareProperty', user_roles: AUTHENTICATED, module: 'referrals', description: 'Share property via referral' },

  // ══════════════════════════════════════════════════════════════════════
  // COMMUNICATION
  // ══════════════════════════════════════════════════════════════════════

  // ChatPage
  { component: 'ChatPage', element_type: 'Page', action_name: 'View', user_roles: AUTHENTICATED, module: 'communication', description: 'View chat page' },
  { component: 'ChatPage', element_type: 'Page', action_name: 'Reply', user_roles: ['admin', 'manager'], module: 'communication', description: 'Reply in chat' },
  { component: 'ChatPage', sub_view: 'Thread', element_type: 'Button', action_name: 'Send', user_roles: AUTHENTICATED, module: 'communication', description: 'Send message' },

  // ReviewsPage
  { component: 'ReviewsPage', element_type: 'Page', action_name: 'View', user_roles: ALL, module: 'communication', description: 'View reviews page' },
  { component: 'ReviewsPage', element_type: 'Page', action_name: 'Reply', user_roles: ['admin', 'manager'], module: 'communication', description: 'Reply to reviews' },

  // SupportInbox
  { component: 'SupportInbox', element_type: 'Page', action_name: 'View', user_roles: ADMIN_UP, module: 'support', description: 'View support inbox' },
  { component: 'SupportInbox', sub_view: 'Thread', element_type: 'Button', action_name: 'Reply', user_roles: ADMIN_UP, module: 'support', description: 'Reply to support thread' },
  { component: 'SupportInbox', sub_view: 'Thread', element_type: 'Dropdown', action_name: 'ChangeStatus', user_roles: ADMIN_UP, module: 'support', description: 'Change thread status' },
  { component: 'SupportInbox', sub_view: 'Thread', element_type: 'Dropdown', action_name: 'Assign', user_roles: ADMIN_UP, module: 'support', description: 'Assign thread' },
  { component: 'SupportInbox', sub_view: 'Thread', element_type: 'Button', action_name: 'MarkRead', user_roles: AUTHENTICATED, module: 'support', description: 'Mark thread as read' },
  { component: 'SupportInbox', sub_view: 'UserThreads', element_type: 'Widget', action_name: 'View', user_roles: AUTHENTICATED, module: 'support', description: 'View my support threads' },
  { component: 'SupportInbox', sub_view: 'UserThreads', element_type: 'Button', action_name: 'Create', user_roles: AUTHENTICATED, module: 'support', description: 'Create support thread' },

  // ══════════════════════════════════════════════════════════════════════
  // PAYOUT
  // ══════════════════════════════════════════════════════════════════════

  { component: 'PayoutAccountsPage', element_type: 'Page', action_name: 'View', user_roles: ['admin'], module: 'payout', description: 'View payout accounts' },
  { component: 'PayoutAccountsPage', sub_view: 'Header', element_type: 'Button', action_name: 'Add', user_roles: ['admin'], module: 'payout', description: 'Add payout account' },
  { component: 'PayoutAccountsPage', sub_view: 'Card', element_type: 'Button', action_name: 'Edit', user_roles: ['admin'], module: 'payout', description: 'Edit payout account' },
  { component: 'PayoutAccountsPage', sub_view: 'Card', element_type: 'Button', action_name: 'Delete', user_roles: ['admin'], module: 'payout', description: 'Delete payout account' },

  // ══════════════════════════════════════════════════════════════════════
  // PAYMENTS
  // ══════════════════════════════════════════════════════════════════════

  { component: 'PaymentsPage', element_type: 'Page', action_name: 'View', user_roles: ADMIN_UP, module: 'payments', description: 'View payments page' },
  { component: 'PaymentsPage', sub_view: 'TransferAccounts', element_type: 'Widget', action_name: 'View', user_roles: AUTHENTICATED, module: 'payments', description: 'View transfer accounts' },
  { component: 'PaymentsPage', sub_view: 'TransferAccounts', element_type: 'Button', action_name: 'Create', user_roles: ADMIN_UP, module: 'payments', description: 'Create transfer account' },
  { component: 'PaymentsPage', sub_view: 'TransferAccounts', element_type: 'Button', action_name: 'Delete', user_roles: ADMIN_UP, module: 'payments', description: 'Delete transfer account' },
  { component: 'PaymentsPage', sub_view: 'Receipts', element_type: 'Button', action_name: 'Upload', user_roles: AUTHENTICATED, module: 'payments', description: 'Upload payment receipt' },
  { component: 'PaymentsPage', sub_view: 'Receipts', element_type: 'Widget', action_name: 'ViewByBooking', user_roles: AUTHENTICATED, module: 'payments', description: 'View receipts by booking' },

  // ══════════════════════════════════════════════════════════════════════
  // GROUPS
  // ══════════════════════════════════════════════════════════════════════

  // PropertyGroupsManagement
  { component: 'PropertyGroupsManagement', element_type: 'Page', action_name: 'View', user_roles: ADMIN_UP, module: 'property_groups', description: 'View property groups' },
  { component: 'PropertyGroupsManagement', sub_view: 'Header', element_type: 'Button', action_name: 'Create', user_roles: ['admin'], module: 'property_groups', description: 'Create property group' },
  { component: 'PropertyGroupsManagement', sub_view: 'Card', element_type: 'Button', action_name: 'Edit', user_roles: ['admin'], module: 'property_groups', description: 'Edit property group' },
  { component: 'PropertyGroupsManagement', sub_view: 'Card', element_type: 'Button', action_name: 'Delete', user_roles: ['admin'], module: 'property_groups', description: 'Delete property group' },
  { component: 'PropertyGroupsManagement', sub_view: 'Detail', element_type: 'Button', action_name: 'AddProperty', user_roles: ['admin'], module: 'property_groups', description: 'Add property to group' },
  { component: 'PropertyGroupsManagement', sub_view: 'Detail', element_type: 'Button', action_name: 'RemoveProperty', user_roles: ['admin'], module: 'property_groups', description: 'Remove property from group' },

  // ServiceGroupsManagement
  { component: 'ServiceGroupsManagement', element_type: 'Page', action_name: 'View', user_roles: ADMIN_UP, module: 'service_groups', description: 'View service groups' },
  { component: 'ServiceGroupsManagement', sub_view: 'Header', element_type: 'Button', action_name: 'Create', user_roles: ['admin'], module: 'service_groups', description: 'Create service group' },
  { component: 'ServiceGroupsManagement', sub_view: 'Card', element_type: 'Button', action_name: 'Edit', user_roles: ['admin'], module: 'service_groups', description: 'Edit service group' },
  { component: 'ServiceGroupsManagement', sub_view: 'Card', element_type: 'Button', action_name: 'Delete', user_roles: ['admin'], module: 'service_groups', description: 'Delete service group' },
  { component: 'ServiceGroupsManagement', sub_view: 'Detail', element_type: 'Button', action_name: 'AddService', user_roles: ['admin'], module: 'service_groups', description: 'Add service to group' },
  { component: 'ServiceGroupsManagement', sub_view: 'Detail', element_type: 'Button', action_name: 'RemoveService', user_roles: ['admin'], module: 'service_groups', description: 'Remove service from group' },

  // GroupsManagement (combined view)
  { component: 'GroupsManagement', element_type: 'Page', action_name: 'View', user_roles: ADMIN_UP, module: 'groups', description: 'View groups management' },

  // ══════════════════════════════════════════════════════════════════════
  // VERIFICATION
  // ══════════════════════════════════════════════════════════════════════

  { component: 'VerificationReview', element_type: 'Page', action_name: 'View', user_roles: HYPER, module: 'documents', description: 'View verification review' },
  { component: 'VerificationReview', sub_view: 'Actions', element_type: 'Button', action_name: 'Approve', user_roles: HYPER, module: 'documents', description: 'Approve document' },
  { component: 'VerificationReview', sub_view: 'Actions', element_type: 'Button', action_name: 'Reject', user_roles: HYPER, module: 'documents', description: 'Reject document' },
  { component: 'VerificationReview', sub_view: 'Actions', element_type: 'Button', action_name: 'Submit', user_roles: ['admin'], module: 'documents', description: 'Submit document for validation' },
  { component: 'VerificationReview', sub_view: 'Documents', element_type: 'Button', action_name: 'Upload', user_roles: ['admin'], module: 'documents', description: 'Upload verification document' },

  // ══════════════════════════════════════════════════════════════════════
  // EMAIL ANALYTICS
  // ══════════════════════════════════════════════════════════════════════

  { component: 'EmailAnalyticsPage', element_type: 'Page', action_name: 'View', user_roles: ADMIN_UP, module: 'email_tracking', description: 'View email analytics' },

  // ══════════════════════════════════════════════════════════════════════
  // SETTINGS
  // ══════════════════════════════════════════════════════════════════════

  { component: 'SettingsPage', element_type: 'Page', action_name: 'View', user_roles: AUTHENTICATED, module: 'settings', description: 'View settings page' },
  { component: 'SettingsPage', sub_view: 'Profile', element_type: 'Section', action_name: 'Edit', user_roles: AUTHENTICATED, module: 'settings', description: 'Edit profile' },
  { component: 'SettingsPage', sub_view: 'Notifications', element_type: 'Section', action_name: 'Edit', user_roles: AUTHENTICATED, module: 'settings', description: 'Edit notification preferences' },
  { component: 'SettingsPage', sub_view: 'Alerts', element_type: 'Section', action_name: 'Edit', user_roles: AUTHENTICATED, module: 'settings', description: 'Edit alert preferences' },
  { component: 'SettingsPage', sub_view: 'Account', element_type: 'Section', action_name: 'Edit', user_roles: AUTHENTICATED, module: 'settings', description: 'Edit account settings' },
  { component: 'SettingsPage', sub_view: 'Password', element_type: 'Button', action_name: 'Change', user_roles: AUTHENTICATED, module: 'settings', description: 'Change password' },

  // ══════════════════════════════════════════════════════════════════════
  // PROFILES
  // ══════════════════════════════════════════════════════════════════════

  { component: 'ProfilePage', element_type: 'Page', action_name: 'View', user_roles: AUTHENTICATED, module: 'profiles', description: 'View own profile' },
  { component: 'ProfilePage', sub_view: 'Actions', element_type: 'Button', action_name: 'Edit', user_roles: AUTHENTICATED, module: 'profiles', description: 'Edit own profile' },
  { component: 'ProfilePage', sub_view: 'Avatar', element_type: 'Button', action_name: 'Upload', user_roles: AUTHENTICATED, module: 'profiles', description: 'Upload avatar' },

  // ══════════════════════════════════════════════════════════════════════
  // NOTIFICATIONS
  // ══════════════════════════════════════════════════════════════════════

  { component: 'NotificationsPage', element_type: 'Page', action_name: 'View', user_roles: AUTHENTICATED, module: 'notifications', description: 'View notifications' },
  { component: 'NotificationsPage', sub_view: 'Actions', element_type: 'Button', action_name: 'MarkRead', user_roles: AUTHENTICATED, module: 'notifications', description: 'Mark notification as read' },
  { component: 'NotificationsPage', sub_view: 'Actions', element_type: 'Button', action_name: 'MarkAllRead', user_roles: AUTHENTICATED, module: 'notifications', description: 'Mark all notifications as read' },
  { component: 'NotificationsPage', sub_view: 'Actions', element_type: 'Button', action_name: 'Delete', user_roles: AUTHENTICATED, module: 'notifications', description: 'Delete notification' },

  // ══════════════════════════════════════════════════════════════════════
  // RANKINGS
  // ══════════════════════════════════════════════════════════════════════

  { component: 'RankingsPage', element_type: 'Page', action_name: 'View', user_roles: ALL, module: 'rankings', description: 'View rankings leaderboard' },
  { component: 'RankingsPage', sub_view: 'MyRank', element_type: 'Widget', action_name: 'View', user_roles: AUTHENTICATED, module: 'rankings', description: 'View my rank' },

  // ══════════════════════════════════════════════════════════════════════
  // SHARED COMPONENTS
  // ══════════════════════════════════════════════════════════════════════

  // ProductCard (shared between properties/services)
  { component: 'ProductCard', sub_view: 'Actions', element_type: 'Button', action_name: 'Favorite', user_roles: AUTHENTICATED, module: 'shared', description: 'Favorite button on card' },
  { component: 'ProductCard', sub_view: 'Actions', element_type: 'Button', action_name: 'Share', user_roles: AUTHENTICATED, module: 'shared', description: 'Share button on card' },

  // ProductModal
  { component: 'ProductModal', element_type: 'Modal', action_name: 'View', user_roles: ALL, module: 'shared', description: 'View product modal' },
  { component: 'ProductModal', sub_view: 'Actions', element_type: 'Button', action_name: 'Book', user_roles: BOOKERS, module: 'shared', description: 'Book from product modal' },

  // DynamicComments
  { component: 'DynamicComments', sub_view: 'Form', element_type: 'Button', action_name: 'Post', user_roles: AUTHENTICATED, module: 'comments', description: 'Post comment' },
  { component: 'DynamicComments', sub_view: 'Item', element_type: 'Button', action_name: 'Edit', user_roles: AUTHENTICATED, module: 'comments', description: 'Edit own comment' },
  { component: 'DynamicComments', sub_view: 'Item', element_type: 'Button', action_name: 'Delete', user_roles: AUTHENTICATED, module: 'comments', description: 'Delete own comment' },
  { component: 'DynamicComments', sub_view: 'Item', element_type: 'Button', action_name: 'Reply', user_roles: AUTHENTICATED, module: 'comments', description: 'Reply to comment' },

  // DynamicReactions
  { component: 'DynamicReactions', sub_view: 'Actions', element_type: 'Button', action_name: 'Toggle', user_roles: AUTHENTICATED, module: 'reactions', description: 'Toggle reaction' },

  // Basket
  { component: 'Basket', element_type: 'Widget', action_name: 'View', user_roles: BOOKERS, module: 'bookings', description: 'View basket' },
  { component: 'Basket', sub_view: 'Actions', element_type: 'Button', action_name: 'Checkout', user_roles: BOOKERS, module: 'bookings', description: 'Checkout from basket' },

  // Notifications
  { component: 'NotificationsPanel', element_type: 'Widget', action_name: 'View', user_roles: AUTHENTICATED, module: 'notifications', description: 'View notifications panel' },

  // DynamicNavMenu
  { component: 'DynamicNavMenu', sub_view: 'Admin', element_type: 'Link', action_name: 'View', user_roles: ADMIN_UP, module: 'navigation', description: 'Admin menu section' },
  { component: 'DynamicNavMenu', sub_view: 'Hyper', element_type: 'Link', action_name: 'View', user_roles: HYPER, module: 'navigation', description: 'Hyper menu section' },
  { component: 'DynamicNavMenu', sub_view: 'Host', element_type: 'Link', action_name: 'View', user_roles: HOST, module: 'navigation', description: 'Host menu section' },
];

// ─── Seed Runner ──────────────────────────────────────────────────────────────

async function seedFrontendUiPermissions(): Promise<void> {
  await AppDataSource.initialize();
  console.log('✅ Database connected');

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    let count = 0;
    const errors: string[] = [];

    for (const perm of UI_PERMISSIONS) {
      const permKey = generateUiPermissionKey(
        perm.component,
        perm.sub_view,
        perm.element_type,
        perm.action_name,
      );

      try {
        await queryRunner.query(
          `INSERT INTO rbac_frontend_permissions
            (id, permission_key, user_roles, component, sub_view, element_type, action_name, module, description, allowed)
           VALUES
            (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, true)
           ON DUPLICATE KEY UPDATE
            component    = VALUES(component),
            sub_view     = VALUES(sub_view),
            element_type = VALUES(element_type),
            action_name  = VALUES(action_name),
            module       = VALUES(module),
            description  = VALUES(description)`,
          [
            permKey,
            JSON.stringify(perm.user_roles),
            perm.component,
            perm.sub_view ?? null,
            perm.element_type ?? null,
            perm.action_name ?? null,
            perm.module,
            perm.description,
          ],
        );
        count++;
      } catch (err: any) {
        errors.push(`${permKey}: ${err.message}`);
      }
    }

    await queryRunner.commitTransaction();
    console.log(`✅ Frontend UI permissions seed complete — ${count} permissions seeded (total: ${UI_PERMISSIONS.length})`);
    if (errors.length) {
      console.warn(`⚠️ ${errors.length} errors:`, errors);
    }
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('❌ Frontend UI permissions seed failed:', error);
    throw error;
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

seedFrontendUiPermissions();
