import React, { memo } from "react";
import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PermissionRoute } from "@/components/PermissionRoute";
import { MainLayout } from "@/modules/shared/layout/MainLayout";
import { useLoadingIntegration } from "@/modules/shared/hooks/useLoadingIntegration";
import { ErrorBoundary } from "@/modules/shared/components/ErrorBoundary";
import Index from "@/pages/Index";
import PropertyListing from "@/pages/PropertyListing";
import PropertyDetail from "@/pages/PropertyDetail";
import MyBookings from "@/pages/MyBookings";
import BookingPayment from "@/pages/BookingPayment";
import AddPropertyWizard from "@/modules/admin/pages/AddPropertyWizard";
import Auth from "@/modules/auth/auth.component";
import { OnboardingPage } from "@/modules/onboarding/OnboardingPage";
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
import { MyReferralsPage } from "@/modules/referrals/MyReferralsPage";
import { HostFeeAbsorptionPage } from "@/modules/admin/pages/HostFeeAbsorptionPage";
import { CancellationRulesPage } from "@/modules/admin/pages/CancellationRulesPage";
import { BookingCalendarPage } from "@/modules/admin/pages/BookingCalendarPage";
import { RbacSettingsPage } from "@/modules/admin/pages/RbacSettingsPage";
import RbacDebugPage from "@/modules/admin/pages/RbacDebugPage";
import EscrowAdminPage from "@/modules/admin/pages/EscrowAdminPage";
import BlamesAdminPage from "@/modules/admin/pages/BlamesAdminPage";
import HostReactivationPage from "@/modules/payments/pages/HostReactivationPage";
import MyDisputesPage from "@/modules/payments/pages/MyDisputesPage";
import DisputeDetailPage from "@/modules/payments/pages/DisputeDetailPage";
import PayoutsDashboardPage from "@/modules/payments/pages/PayoutsDashboardPage";

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


const PublicRoutes = () => (
  <>
    <Route path={PUBLIC_ROUTES.HOME} element={<ErrorBoundary><Index /></ErrorBoundary>} />
    <Route path={PUBLIC_ROUTES.LOGIN} element={<ProtectedRoute requireAuth={false}><ErrorBoundary><Auth /></ErrorBoundary></ProtectedRoute>} />
    <Route path={PUBLIC_ROUTES.ONBOARDING} element={<ProtectedRoute requireAuth={false}><ErrorBoundary><OnboardingPage /></ErrorBoundary></ProtectedRoute>} />
    <Route path={SSO_ROUTES.CALLBACK} element={<ErrorBoundary><SSOCallback /></ErrorBoundary>} />
    <Route path={PUBLIC_ROUTES.NOT_FOUND} element={<NotFound />} />
  </>
);

const PropertyRoutes = () => (
  <>
    <Route path={PROPERTY_ROUTES.LIST} element={<PermissionRoute componentName="PropertyListPage"><MainLayout><ErrorBoundary><PropertyListing /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={PROPERTY_ROUTES.DETAIL} element={<ProtectedRoute><MainLayout><ErrorBoundary><PropertyDetail /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={PROPERTY_ROUTES.NEW} element={<PermissionRoute componentName="AddPropertyWizard"><MainLayout><ErrorBoundary><AddPropertyWizard /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={PROPERTY_ROUTES.EDIT} element={<PermissionRoute componentName="AddPropertyWizard"><MainLayout><ErrorBoundary><AddPropertyWizard /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={SERVICE_ROUTES.LIST} element={<PermissionRoute componentName="ServiceListPage"><MainLayout><ErrorBoundary><ServiceListing /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={SERVICE_ROUTES.DETAIL} element={<ProtectedRoute><MainLayout><ErrorBoundary><ServiceDetail /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={SERVICE_ROUTES.NEW} element={<PermissionRoute componentName="AddServiceWizard"><MainLayout><ErrorBoundary><AddServiceWizard /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={SERVICE_ROUTES.EDIT} element={<PermissionRoute componentName="AddServiceWizard"><MainLayout><ErrorBoundary><AddServiceWizard /></ErrorBoundary></MainLayout></PermissionRoute>} />
  </>
);

const BookingRoutes = () => (
  <>
    <Route path={BOOKING_ROUTES.LIST} element={<PermissionRoute componentName="BookingsPage" elementType="Tab"><MainLayout><ErrorBoundary><MyBookings /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path="/bookings/:id/pay" element={<ProtectedRoute><MainLayout><ErrorBoundary><BookingPayment /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={BOOKING_ROUTES.HOST} element={<PermissionRoute componentName="HostBookings"><MainLayout><ErrorBoundary><HostBookings /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={BOOKING_ROUTES.HISTORY} element={<PermissionRoute componentName="BookingHistory"><MainLayout><ErrorBoundary><BookingHistory /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={BOOKING_ROUTES.CHAT} element={<ProtectedRoute><MainLayout><ErrorBoundary><BookingChat /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={BOOKING_ROUTES.CALENDAR} element={<PermissionRoute componentName="BookingCalendarPage"><MainLayout><ErrorBoundary><BookingCalendarPage /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={SUPPORT_ROUTES.INBOX} element={<PermissionRoute componentName="SupportInbox"><MainLayout><ErrorBoundary><SupportInbox /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={SUPPORT_ROUTES.THREAD} element={<ProtectedRoute><MainLayout><ErrorBoundary><SupportThreadChat /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={SUPPORT_ROUTES.REVIEW} element={<PermissionRoute componentName="SupportInbox"><MainLayout><ErrorBoundary><SupportInbox /></ErrorBoundary></MainLayout></PermissionRoute>} />
  </>
);

const AdminRoutes = () => (
  <>
    <Route path={DASHBOARD_ROUTES.HYPER} element={<PermissionRoute componentName="HyperDashboard"><MainLayout><ErrorBoundary><HyperDashboard /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={DASHBOARD_ROUTES.ADMIN} element={<PermissionRoute check={p => p.canUI('ui.AdminDashboard.Page.View') || p.canUI('ui.ManagerDashboard.Page.View')}><MainLayout><ErrorBoundary><AdminManagerDashboard /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={DASHBOARD_ROUTES.GUEST} element={<PermissionRoute componentName="GuestDashboard"><MainLayout><ErrorBoundary><GuestDashboard /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={DASHBOARD_ROUTES.USER} element={<PermissionRoute componentName="UserDashboard"><MainLayout><ErrorBoundary><UserDashboard /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={LEGACY_ROUTES.HYPER_ADMIN} element={<Navigate to={DASHBOARD_ROUTES.HYPER} replace />} />
    <Route path={LEGACY_ROUTES.ADMIN} element={<Navigate to={DASHBOARD_ROUTES.ADMIN} replace />} />
    <Route path={LEGACY_ROUTES.MANAGER} element={<Navigate to={DASHBOARD_ROUTES.ADMIN} replace />} />
    <Route path={ADMIN_ROUTES.VERIFICATION_REVIEW} element={<PermissionRoute componentName="VerificationReview"><MainLayout><ErrorBoundary><VerificationReview /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={ADMIN_ROUTES.DOCUMENT_VALIDATION} element={<PermissionRoute componentName="VerificationReview"><MainLayout><ErrorBoundary><VerificationReview /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={ADMIN_ROUTES.PAYMENT_VALIDATION} element={<PermissionRoute check={p => p.canUI('ui.PaymentsPage.Page.View')}><MainLayout><ErrorBoundary><PaymentValidation /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={ADMIN_ROUTES.EMAIL_ANALYTICS} element={<PermissionRoute componentName="EmailAnalyticsPage"><MainLayout><ErrorBoundary><EmailAnalyticsPage /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={ADMIN_ROUTES.FEE_ABSORPTION} element={<PermissionRoute componentName="HostFeeAbsorptionPage"><MainLayout><ErrorBoundary><HostFeeAbsorptionPage /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={ADMIN_ROUTES.CANCELLATION_RULES} element={<PermissionRoute componentName="CancellationRulesPage"><MainLayout><ErrorBoundary><CancellationRulesPage /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={ADMIN_ROUTES.RBAC_SETTINGS} element={<PermissionRoute componentName="RbacSettings"><MainLayout><ErrorBoundary><RbacSettingsPage /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={ADMIN_ROUTES.RBAC_DEBUG} element={<PermissionRoute componentName="RbacDebugPage"><MainLayout><ErrorBoundary><RbacDebugPage /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={ADMIN_ROUTES.ESCROW} element={<PermissionRoute componentName="EscrowAdminPage"><MainLayout><ErrorBoundary><EscrowAdminPage /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={ADMIN_ROUTES.HOST_REACTIVATION} element={<PermissionRoute componentName="HostReactivationPage"><MainLayout><ErrorBoundary><HostReactivationPage /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={ADMIN_ROUTES.PAYOUTS_DASHBOARD} element={<PermissionRoute componentName="PayoutsDashboardPage"><MainLayout><ErrorBoundary><PayoutsDashboardPage /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={ADMIN_ROUTES.MY_DISPUTES} element={<PermissionRoute componentName="MyDisputesPage"><MainLayout><ErrorBoundary><MyDisputesPage /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={ADMIN_ROUTES.DISPUTE_DETAIL} element={<PermissionRoute componentName="DisputeDetailPage"><MainLayout><ErrorBoundary><DisputeDetailPage /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path="/admin/blames" element={<MainLayout><ErrorBoundary><BlamesAdminPage /></ErrorBoundary></MainLayout>} />
  </>
);

const DashboardRoutes = () => (
  <>
    <Route path={DASHBOARD_ROUTES.ROOT} element={<ProtectedRoute><MainLayout><ErrorBoundary><DashboardWithRedirect /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path={DASHBOARD_ROUTES.POINTS} element={<PermissionRoute componentName="PointsPage"><MainLayout><ErrorBoundary><PointsPage /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={DASHBOARD_ROUTES.REFERRALS} element={<PermissionRoute componentName="ReferralsPage"><MainLayout><ErrorBoundary><MyReferralsPage /></ErrorBoundary></MainLayout></PermissionRoute>} />
    <Route path={DASHBOARD_ROUTES.SETTINGS} element={<PermissionRoute componentName="SettingsPage"><MainLayout><ErrorBoundary><Settings /></ErrorBoundary></MainLayout></PermissionRoute>} />
  </>
);

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
      {/* {DemoRoutes()} */}
    </RouterRoutes>
  );
});

Routes.displayName = 'Routes';
