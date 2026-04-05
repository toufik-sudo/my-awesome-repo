import React, { memo } from "react";
import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MainLayout } from "@/modules/shared/layout/MainLayout";
import { useLoadingIntegration } from "@/modules/shared/hooks/useLoadingIntegration";
import { ErrorBoundary } from "@/modules/shared/components/ErrorBoundary";
import Index from "@/pages/Index";
import PropertyListing from "@/pages/PropertyListing";
import PropertyDetail from "@/pages/PropertyDetail";
import MyBookings from "@/pages/MyBookings";
import AddPropertyWizard from "@/modules/admin/pages/AddPropertyWizard";
import Auth from "@/modules/auth/auth.component";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/modules/dashboard/Dashboard";
import { HyperDashboard } from "@/modules/dashboard/HyperDashboard";
import { AdminManagerDashboard } from "@/modules/dashboard/AdminManagerDashboard";
import { GuestDashboard } from "@/modules/dashboard/GuestDashboard";
import { UserDashboard } from "@/modules/dashboard/UserDashboard";
import { ComponentsDemo } from "@/modules/demo/pages/ComponentsDemo";
import { FilterDemo } from "@/modules/demo/pages/FilterDemo";
import { GridDemo } from "@/modules/demo/pages/GridDemo";
import { TabsDemo } from "@/modules/demo/pages/TabsDemo";
import { ComboboxDemo } from "@/modules/demo/pages/ComboboxDemo";
import { ChartsDemo } from "@/modules/demo/pages/ChartsDemo";
import { Settings } from "@/modules/settings/settings.component";
import { SSOCallback, SSO_ROUTES } from "@/modules/shared/sso";
import { VerificationReview } from "@/modules/admin/pages/VerificationReview";
import { useDashboardRedirect } from "@/modules/admin/pages/DashboardRedirect";
import { EmailAnalyticsPage } from "@/modules/admin/pages/EmailAnalyticsPage";
import { HostBookings } from "@/modules/bookings/pages/HostBookings";
import { BookingHistory } from "@/modules/bookings/pages/BookingHistory";
import { BookingChat } from "@/modules/chat/pages/BookingChat";
import { SupportInbox } from "@/modules/support/pages/SupportInbox";
import { SupportThreadChat } from "@/modules/support/pages/SupportThreadChat";
import { PaymentValidation } from "@/modules/payments/pages/PaymentValidation";
import { useSocketNotifications } from "@/modules/notifications/useSocketNotifications";
import ServiceListing from "@/pages/ServiceListing";
import ServiceDetail from "@/pages/ServiceDetail";
import AddServiceWizard from "@/modules/admin/pages/AddServiceWizard";
import PointsPage from "@/pages/PointsPage";
import { HostFeeAbsorptionPage } from "@/modules/admin/pages/HostFeeAbsorptionPage";
import { CancellationRulesPage } from "@/modules/admin/pages/CancellationRulesPage";
import { BookingCalendarPage } from "@/modules/admin/pages/BookingCalendarPage";
import { RbacSettingsPage } from "@/modules/admin/pages/RbacSettingsPage";

import {
  PUBLIC_ROUTES,
  PROPERTY_ROUTES,
  SERVICE_ROUTES,
  BOOKING_ROUTES,
  SUPPORT_ROUTES,
  DASHBOARD_ROUTES,
  ADMIN_ROUTES,
  LEGACY_ROUTES,
  DEMO_ROUTES,
} from './routes.constants';

import { PermissionRoute } from '@/components/PermissionRoute';
import type { AppRole } from '@/modules/auth/auth.types';

const HYPER_ROLES: AppRole[] = ['hyper_admin', 'hyper_manager'];
const ADMIN_ROLE_LIST: AppRole[] = ['hyper_admin', 'hyper_manager', 'admin'];
const MANAGER_ROLES: AppRole[] = ['hyper_admin', 'hyper_manager', 'admin', 'manager'];
/** Roles that can make bookings */
const BOOKING_ROLES: AppRole[] = ['manager', 'guest', 'user'];

const PublicRoutes = () => (
  <>
    <Route path={PUBLIC_ROUTES.HOME} element={<ErrorBoundary><Index /></ErrorBoundary>} />
    <Route path={PUBLIC_ROUTES.LOGIN} element={<ProtectedRoute requireAuth={false}><ErrorBoundary><Auth /></ErrorBoundary></ProtectedRoute>} />
    <Route path={SSO_ROUTES.CALLBACK} element={<ErrorBoundary><SSOCallback /></ErrorBoundary>} />
    <Route path={PUBLIC_ROUTES.NOT_FOUND} element={<NotFound />} />
  </>
);

const PropertyRoutes = () => (
  <>
    <Route path={PROPERTY_ROUTES.LIST} element={<ProtectedRoute><MainLayout><ErrorBoundary><PropertyListing /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={PROPERTY_ROUTES.DETAIL} element={<ProtectedRoute><MainLayout><ErrorBoundary><PropertyDetail /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={PROPERTY_ROUTES.NEW} element={<PermissionRoute requiredPermission="canCreateProperty"><MainLayout><ErrorBoundary><AddPropertyWizard /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={PROPERTY_ROUTES.EDIT} element={<PermissionRoute requiredPermission="canModifyProperty"><MainLayout><ErrorBoundary><AddPropertyWizard /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={SERVICE_ROUTES.LIST} element={<ProtectedRoute><MainLayout><ErrorBoundary><ServiceListing /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={SERVICE_ROUTES.DETAIL} element={<ProtectedRoute><MainLayout><ErrorBoundary><ServiceDetail /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={SERVICE_ROUTES.NEW} element={<PermissionRoute requiredPermission="canCreateService"><MainLayout><ErrorBoundary><AddServiceWizard /></ErrorBoundary></MainLayout></PermissionRoute>} />
  </>
);

const BookingRoutes = () => (
  <>
    <Route path={BOOKING_ROUTES.LIST} element={<ProtectedRoute requireBookingAccess><MainLayout><ErrorBoundary><MyBookings /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={BOOKING_ROUTES.HOST} element={<ProtectedRoute requiredRoles={MANAGER_ROLES}><MainLayout><ErrorBoundary><HostBookings /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={BOOKING_ROUTES.HISTORY} element={<ProtectedRoute requiredRoles={MANAGER_ROLES}><MainLayout><ErrorBoundary><BookingHistory /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={BOOKING_ROUTES.CHAT} element={<ProtectedRoute><MainLayout><ErrorBoundary><BookingChat /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={BOOKING_ROUTES.CALENDAR} element={<ProtectedRoute requiredRoles={MANAGER_ROLES}><MainLayout><ErrorBoundary><BookingCalendarPage /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={SUPPORT_ROUTES.INBOX} element={<ProtectedRoute requiredRoles={ADMIN_ROLE_LIST}><MainLayout><ErrorBoundary><SupportInbox /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={SUPPORT_ROUTES.THREAD} element={<ProtectedRoute><MainLayout><ErrorBoundary><SupportThreadChat /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={SUPPORT_ROUTES.REVIEW} element={<ProtectedRoute requiredRoles={ADMIN_ROLE_LIST}><MainLayout><ErrorBoundary><SupportInbox /></ErrorBoundary></MainLayout></ProtectedRoute>} />
  </>
);

const AdminRoutes = () => (
  <>
    <Route path={DASHBOARD_ROUTES.HYPER} element={<ProtectedRoute requiredRoles={HYPER_ROLES}><MainLayout><ErrorBoundary><HyperDashboard /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={DASHBOARD_ROUTES.ADMIN} element={<ProtectedRoute requiredRoles={MANAGER_ROLES}><MainLayout><ErrorBoundary><AdminManagerDashboard /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={DASHBOARD_ROUTES.GUEST} element={<ProtectedRoute requiredRoles={['guest']}><MainLayout><ErrorBoundary><GuestDashboard /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={DASHBOARD_ROUTES.USER} element={<ProtectedRoute requiredRoles={['user']}><MainLayout><ErrorBoundary><UserDashboard /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    {/* Legacy redirects */}
    <Route path={LEGACY_ROUTES.HYPER_ADMIN} element={<Navigate to={DASHBOARD_ROUTES.HYPER} replace />} />
    <Route path={LEGACY_ROUTES.ADMIN} element={<Navigate to={DASHBOARD_ROUTES.ADMIN} replace />} />
    <Route path={LEGACY_ROUTES.MANAGER} element={<Navigate to={DASHBOARD_ROUTES.ADMIN} replace />} />
    {/* Admin sub-pages */}
    <Route path={ADMIN_ROUTES.VERIFICATION_REVIEW} element={<ProtectedRoute requiredRoles={HYPER_ROLES}><MainLayout><ErrorBoundary><VerificationReview /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={ADMIN_ROUTES.DOCUMENT_VALIDATION} element={<ProtectedRoute requiredRoles={HYPER_ROLES}><MainLayout><ErrorBoundary><VerificationReview /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={ADMIN_ROUTES.PAYMENT_VALIDATION} element={<ProtectedRoute requiredRoles={HYPER_ROLES}><ErrorBoundary><PaymentValidation /></ErrorBoundary></ProtectedRoute>} />
    <Route path={ADMIN_ROUTES.EMAIL_ANALYTICS} element={<ProtectedRoute requiredRoles={ADMIN_ROLE_LIST}><MainLayout><ErrorBoundary><EmailAnalyticsPage /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={ADMIN_ROUTES.FEE_ABSORPTION} element={<ProtectedRoute requiredRoles={MANAGER_ROLES}><MainLayout><ErrorBoundary><HostFeeAbsorptionPage /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={ADMIN_ROUTES.CANCELLATION_RULES} element={<ProtectedRoute requiredRoles={MANAGER_ROLES}><MainLayout><ErrorBoundary><CancellationRulesPage /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={ADMIN_ROUTES.RBAC_SETTINGS} element={<ProtectedRoute requiredRoles={HYPER_ROLES}><MainLayout><ErrorBoundary><RbacSettingsPage /></ErrorBoundary></MainLayout></ProtectedRoute>} />
  </>
);

const DashboardRoutes = () => (
  <>
    <Route path={DASHBOARD_ROUTES.ROOT} element={<ProtectedRoute><MainLayout><ErrorBoundary><DashboardWithRedirect /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={DASHBOARD_ROUTES.POINTS} element={<ProtectedRoute><MainLayout><ErrorBoundary><PointsPage /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={DASHBOARD_ROUTES.SETTINGS} element={<ProtectedRoute><MainLayout><ErrorBoundary><Settings /></ErrorBoundary></MainLayout></ProtectedRoute>} />
  </>
);

/**
 * Smart dashboard: redirects role-specific users to their consolidated dashboard.
 */
const DashboardWithRedirect: React.FC = memo(() => {
  const redirectTo = useDashboardRedirect();
  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }
  return <Dashboard />;
});
DashboardWithRedirect.displayName = 'DashboardWithRedirect';

const DemoRoutes = () => (
  <>
    <Route path={DEMO_ROUTES.ROOT} element={<ProtectedRoute><MainLayout><ErrorBoundary><ComponentsDemo /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={DEMO_ROUTES.FILTERS} element={<ProtectedRoute><MainLayout><ErrorBoundary><FilterDemo /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={DEMO_ROUTES.GRID} element={<ProtectedRoute><MainLayout><ErrorBoundary><GridDemo /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={DEMO_ROUTES.TABS} element={<ProtectedRoute><MainLayout><ErrorBoundary><TabsDemo /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={DEMO_ROUTES.COMBOBOX} element={<ProtectedRoute><MainLayout><ErrorBoundary><ComboboxDemo /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={DEMO_ROUTES.CHARTS} element={<ProtectedRoute><MainLayout><ErrorBoundary><ChartsDemo /></ErrorBoundary></MainLayout></ProtectedRoute>} />
  </>
);

export const Routes = memo(() => {
  useLoadingIntegration();
  useSocketNotifications();

  return (
    <RouterRoutes>
      {PublicRoutes()}
      {PropertyRoutes()}
      {BookingRoutes()}
      {AdminRoutes()}
      {DashboardRoutes()}
      {DemoRoutes()}
    </RouterRoutes>
  );
});

Routes.displayName = 'Routes';
