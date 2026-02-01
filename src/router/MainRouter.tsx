import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ALL_ADMIN_ROLES } from '@/constants/security/access';

// Route constants
import {
  ROOT,
  PAGE_NOT_FOUND,
  ALL_ROUTES,
  LOGIN_PAGE_ROUTE,
  FORGOT_PASSWORD_PAGE_ROUTE,
  PASSWORD_RESET_ROUTE,
  ACTIVATE_ACCOUNT_ROUTE,
  CREATE_ACCOUNT_ROUTE,
  WALL_ROUTE,
  WALL_PROGRAM_ROUTE,
  WELCOME_PAGE_ROUTE,
  ONBOARDING_SUCCESS,
  DECLARATIONS_ROUTE,
  SETTINGS,
  NOTIFICATIONS_ROUTE,
  LAUNCH_ROUTE,
  LAUNCH_FIRST,
  PRICING_ROUTE,
  SUBSCRIPTION_ROUTE,
  METRICS_ROUTE,
  USERS_ROUTE,
  USER_DECLARATIONS_ROUTE,
  USER_DECLARATION_ADD_FORM_ROUTE,
  PAYMENT_METHOD,
  PERSONAL_INFORMATION_ROUTE,
  ONBOARDING_BENEFICIARY_REGISTER_ROUTE,
  ONBOARDING,
  RESET_PASSWORD_EXPIRED_LINK_ROUTE,
  EMAIL_TOKEN_EXPIRED_LINK_ROUTE,
  AI_ROUTE,
} from '@/constants/routes';

// Pages
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import RewardsConfigDemo from '@/pages/RewardsConfigDemo';

// Auth feature
import {
  AuthenticatedRoute,
  ProtectedRoute,
  LoginPage,
  ForgotPasswordPage,
  PasswordResetPage,
  ActivateAccountPage,
  CreateAccountPage,
} from '@/features/auth';

// Wall feature
import { 
  DashboardLayout, 
  WallPage, 
  ProgramsPage, 
  RankingPage, 
  PointsPage,
  MetricsPage,
  PointConversionPage,
  BeneficiaryDeclarationListPage,
  CreateBeneficiaryDeclarationPage,
} from '@/features/wall';

// Onboarding feature
import { 
  WelcomePage, 
  AccountSuccessPage, 
  SubscriptionPage,
  RegisterPage,
  PaymentMethodPage,
  PersonalInformationPage,
} from '@/features/onboarding';

// Landing feature
import { PricingPage } from '@/features/landing';
import { UsersPage } from '@/features/users';

// Declarations feature
import { DeclarationsPage, BeneficiaryDeclarationsPage, CreateDeclarationPage } from '@/features/declarations';

// Settings feature
import { SettingsPage } from '@/features/settings';

// Launch feature
import { 
  LaunchPage,
  GoalOptionsPage,
  CubeOptionsPage,
  FullCubePage,
  ResultsPage,
  ProductsPage,
  DesignPage,
  ECardPage,
  FinalStepPage,
} from '@/features/launch';

// Notifications feature
import { NotificationsPage } from '@/features/notifications';

// AI feature
import { AiManagementPage } from '@/features/ai';

/**
 * Main Application Router
 * Configures all routes for the application including:
 * - Public routes (landing, pricing)
 * - Auth routes (login, register, password reset)
 * - Onboarding routes (registration flow)
 * - Protected dashboard routes (wall, declarations, settings)
 * - Launch wizard routes (program creation)
 */
const MainRouter: React.FC = () => {
  return (
    <Routes>
      {/* =====================================================
          PUBLIC ROUTES
          ===================================================== */}
      <Route path={ROOT} element={<Index />} />
      <Route path="/rewards-config" element={<RewardsConfigDemo />} />
      <Route path={PRICING_ROUTE} element={<PricingPage />} />
      <Route path={SUBSCRIPTION_ROUTE} element={<SubscriptionPage />} />

      {/* =====================================================
          AUTH ROUTES (redirect if already logged in)
          ===================================================== */}
      <Route 
        path={LOGIN_PAGE_ROUTE} 
        element={
          <AuthenticatedRoute>
            <LoginPage />
          </AuthenticatedRoute>
        } 
      />
      <Route 
        path={FORGOT_PASSWORD_PAGE_ROUTE} 
        element={
          <AuthenticatedRoute>
            <ForgotPasswordPage />
          </AuthenticatedRoute>
        } 
      />
      <Route 
        path={PASSWORD_RESET_ROUTE} 
        element={
          <AuthenticatedRoute>
            <PasswordResetPage />
          </AuthenticatedRoute>
        } 
      />
      <Route path={ACTIVATE_ACCOUNT_ROUTE} element={<ActivateAccountPage />} />
      <Route 
        path={CREATE_ACCOUNT_ROUTE} 
        element={
          <AuthenticatedRoute>
            <CreateAccountPage />
          </AuthenticatedRoute>
        } 
      />
      
      {/* Expired link routes */}
      <Route path={RESET_PASSWORD_EXPIRED_LINK_ROUTE} element={<NotFound />} />
      <Route path={EMAIL_TOKEN_EXPIRED_LINK_ROUTE} element={<NotFound />} />

      {/* =====================================================
          ONBOARDING ROUTES
          ===================================================== */}
      <Route path={WELCOME_PAGE_ROUTE} element={<WelcomePage />} />
      <Route path={ONBOARDING_BENEFICIARY_REGISTER_ROUTE} element={<RegisterPage />} />
      
      <Route 
        path={ONBOARDING_SUCCESS} 
        element={
          <ProtectedRoute>
            <AccountSuccessPage translationPrefix="onboarding.success" />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path={PERSONAL_INFORMATION_ROUTE} 
        element={
          <ProtectedRoute>
            <PersonalInformationPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path={PAYMENT_METHOD} 
        element={
          <ProtectedRoute>
            <PaymentMethodPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Onboarding sub-routes */}
      <Route 
        path={`${ONBOARDING}/personal-info`} 
        element={
          <ProtectedRoute>
            <PersonalInformationPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={`${ONBOARDING}/payment`} 
        element={
          <ProtectedRoute>
            <PaymentMethodPage />
          </ProtectedRoute>
        } 
      />

      {/* =====================================================
          PROTECTED WALL/DASHBOARD ROUTES
          ===================================================== */}
      <Route 
        path={WALL_ROUTE} 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Nested wall routes */}
        <Route index element={<WallPage />} />
        <Route path="ranking" element={<RankingPage />} />
        <Route path="points" element={<PointsPage />} />
        <Route path="point-conversion" element={<PointConversionPage />} />
      </Route>
      
      {/* Programs Route */}
      <Route 
        path={WALL_PROGRAM_ROUTE} 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProgramsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Users Routes */}
      <Route 
        path={USERS_ROUTE} 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <UsersPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Metrics Route */}
      <Route 
        path={METRICS_ROUTE} 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MetricsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* =====================================================
          DECLARATIONS ROUTES
          ===================================================== */}
      <Route 
        path={DECLARATIONS_ROUTE} 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DeclarationsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/declarations/my" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <BeneficiaryDeclarationsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/declarations/create" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CreateDeclarationPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Beneficiary declaration routes (from wall feature) */}
      <Route 
        path={USER_DECLARATIONS_ROUTE} 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <BeneficiaryDeclarationListPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path={USER_DECLARATION_ADD_FORM_ROUTE} 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CreateBeneficiaryDeclarationPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* =====================================================
          SETTINGS ROUTES
          ===================================================== */}
      <Route 
        path={SETTINGS} 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path={`${SETTINGS}/:tab`} 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* =====================================================
          NOTIFICATIONS ROUTE
          ===================================================== */}
      <Route 
        path={NOTIFICATIONS_ROUTE} 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <NotificationsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* =====================================================
          LAUNCH WIZARD ROUTES
          ===================================================== */}
      {/* Main launch route with step params */}
      <Route 
        path={LAUNCH_ROUTE} 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <LaunchPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Launch wizard step pages */}
      <Route 
        path="/launch/goals" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GoalOptionsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/launch/cube" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CubeOptionsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/launch/cube/full" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <FullCubePage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/launch/results" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ResultsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/launch/products" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProductsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/launch/design" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DesignPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/launch/ecard" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ECardPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/launch/final" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <FinalStepPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Redirect /launch to first step */}
      <Route 
        path="/launch" 
        element={<Navigate to={LAUNCH_FIRST} replace />} 
      />

      {/* =====================================================
          AI MANAGEMENT ROUTES
          ===================================================== */}
      <Route 
        path={AI_ROUTE} 
        element={
          <ProtectedRoute authorizedRoles={ALL_ADMIN_ROLES}>
            <DashboardLayout>
              <AiManagementPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* =====================================================
          404 - NOT FOUND
          ===================================================== */}
      <Route path={PAGE_NOT_FOUND} element={<NotFound />} />
      <Route path={ALL_ROUTES} element={<Navigate to={PAGE_NOT_FOUND} replace />} />
    </Routes>
  );
};

export default MainRouter;
