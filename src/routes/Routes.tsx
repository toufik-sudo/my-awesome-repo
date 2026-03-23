import React, { memo } from "react";
import { Routes as RouterRoutes, Route } from "react-router-dom";
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
import { ComponentsDemo } from "@/modules/demo/pages/ComponentsDemo";
import { FilterDemo } from "@/modules/demo/pages/FilterDemo";
import { GridDemo } from "@/modules/demo/pages/GridDemo";
import { TabsDemo } from "@/modules/demo/pages/TabsDemo";
import { ComboboxDemo } from "@/modules/demo/pages/ComboboxDemo";
import { ChartsDemo } from "@/modules/demo/pages/ChartsDemo";
import { Settings } from "@/modules/settings/settings.component";
import { SSOCallback, SSO_ROUTES } from "@/modules/shared/sso";
import { AdminDashboard } from "@/modules/admin/pages/AdminDashboard";
import { VerificationReview } from "@/modules/admin/pages/VerificationReview";
import { HostBookings } from "@/modules/bookings/pages/HostBookings";
import { BookingHistory } from "@/modules/bookings/pages/BookingHistory";
import { BookingChat } from "@/modules/chat/pages/BookingChat";
import { SupportInbox } from "@/modules/support/pages/SupportInbox";
import { SupportThreadChat } from "@/modules/support/pages/SupportThreadChat";
import { PaymentValidation } from "@/modules/payments/pages/PaymentValidation";
import { useSocketNotifications } from "@/modules/notifications/useSocketNotifications";

// Route groups for cleaner organization
const PublicRoutes = () => (
  <>
    <Route path="/" element={<ErrorBoundary><Index /></ErrorBoundary>} />
    <Route path="/login" element={<ProtectedRoute requireAuth={false}><ErrorBoundary><Auth /></ErrorBoundary></ProtectedRoute>} />
    <Route path={SSO_ROUTES.CALLBACK} element={<ErrorBoundary><SSOCallback /></ErrorBoundary>} />
    <Route path="*" element={<NotFound />} />
  </>
);

const PropertyRoutes = () => (
  <>
    <Route path="/properties" element={<ProtectedRoute><ErrorBoundary><PropertyListing /></ErrorBoundary></ProtectedRoute>} />
    <Route path="/property/:id" element={<ProtectedRoute><ErrorBoundary><PropertyDetail /></ErrorBoundary></ProtectedRoute>} />
    <Route path="/properties/new" element={<ProtectedRoute requiredRoles={['admin', 'manager', 'hyper_manager', 'hyper_admin']}><ErrorBoundary><AddPropertyWizard /></ErrorBoundary></ProtectedRoute>} />
    <Route path="/properties/:id/edit" element={<ProtectedRoute requiredRoles={['admin', 'manager', 'hyper_manager', 'hyper_admin']}><ErrorBoundary><AddPropertyWizard /></ErrorBoundary></ProtectedRoute>} />
  </>
);

const BookingRoutes = () => (
  <>
    <Route path="/bookings" element={<ProtectedRoute><ErrorBoundary><MyBookings /></ErrorBoundary></ProtectedRoute>} />
    <Route path="/bookings/host" element={<ProtectedRoute requiredRoles={['admin', 'manager', 'hyper_manager']}><ErrorBoundary><HostBookings /></ErrorBoundary></ProtectedRoute>} />
    <Route path="/bookings/history" element={<ProtectedRoute requiredRoles={['admin', 'manager', 'hyper_manager', 'hyper_admin']}><ErrorBoundary><BookingHistory /></ErrorBoundary></ProtectedRoute>} />
    <Route path="/chat/:bookingId" element={<ProtectedRoute><ErrorBoundary><BookingChat /></ErrorBoundary></ProtectedRoute>} />
    <Route path="/support" element={<ProtectedRoute><ErrorBoundary><SupportInbox /></ErrorBoundary></ProtectedRoute>} />
    <Route path="/support/:threadId" element={<ProtectedRoute><ErrorBoundary><SupportThreadChat /></ErrorBoundary></ProtectedRoute>} />
    <Route path="/support/review/:reviewId" element={<ProtectedRoute><ErrorBoundary><SupportInbox /></ErrorBoundary></ProtectedRoute>} />
  </>
);

const AdminRoutes = () => (
  <>
    <Route path="/admin" element={<ProtectedRoute requiredRoles={['hyper_manager', 'admin']}><MainLayout><ErrorBoundary><AdminDashboard /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path="/admin/verification-review" element={<ProtectedRoute requiredRoles={['hyper_manager']}><MainLayout><ErrorBoundary><VerificationReview /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path="/admin/document-validation" element={<ProtectedRoute requiredRoles={['hyper_manager']}><MainLayout><ErrorBoundary><VerificationReview /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path="/admin/payment-validation" element={<ProtectedRoute requiredRoles={['hyper_manager']}><MainLayout><ErrorBoundary><PaymentValidation /></ErrorBoundary></MainLayout></ProtectedRoute>} />
  </>
);

const DashboardRoutes = () => (
  <>
    <Route path="/dashboard" element={<ProtectedRoute><ErrorBoundary><Dashboard /></ErrorBoundary></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><ErrorBoundary><Settings /></ErrorBoundary></ProtectedRoute>} />
  </>
);

const DemoRoutes = () => (
  <>
    <Route path="/demo" element={<ProtectedRoute><MainLayout><ErrorBoundary><ComponentsDemo /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path="/demo/filters" element={<ProtectedRoute><MainLayout><ErrorBoundary><FilterDemo /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path="/demo/grid" element={<ProtectedRoute><MainLayout><ErrorBoundary><GridDemo /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path="/demo/tabs" element={<ProtectedRoute><MainLayout><ErrorBoundary><TabsDemo /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path="/demo/combobox" element={<ProtectedRoute><MainLayout><ErrorBoundary><ComboboxDemo /></ErrorBoundary></MainLayout></ProtectedRoute>} />
    <Route path="/demo/charts" element={<ProtectedRoute><MainLayout><ErrorBoundary><ChartsDemo /></ErrorBoundary></MainLayout></ProtectedRoute>} />
  </>
);

export const Routes = memo(() => {
  useLoadingIntegration();
  useSocketNotifications(); // Real-time booking & chat notifications

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
