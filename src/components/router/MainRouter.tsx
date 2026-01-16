import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import WallPreRouter from './WallPreRouter';
import AuthenticatedRoute from 'components/organisms/layouts/AuthenticatedRoute';
import ProtectedRoute from 'components/organisms/layouts/ProtectedRoute';
import InviteUserBlock from 'components/organisms/wall/InviteUserBlock';
import UsersMainBlock from 'components/organisms/wall/UsersMainBlock';
import UsersDetailsBlock from 'components/organisms/wall/user-details/UsersDetailsBlock';
import ActivateAccountPage from 'components/pages/ActivateAccountPage';
import CreateAccountPage from 'components/pages/CreateAccountPage';
import ExpiredEmailValidationLink from 'components/pages/expiration/ExpiredEmailValidationLink';
import ExpiredResetPasswordLink from 'components/pages/expiration/ExpiredResetPasswordLink';
import ForgotPasswordPage from 'components/pages/ForgotPasswordPage';
import HomePage from 'components/pages/HomePage';
import AccountCreationSuccess from 'components/pages/intermediary/AccountCreationSuccess';
import PaymentCanceled from 'components/pages/intermediary/PaymentCanceled';
import IntermediaryPage from 'components/pages/IntermediaryPage';
import LaunchPage from 'components/pages/LaunchPage';
import LoginPage from 'components/pages/LoginPage';
import CreateAdminAccountPage from 'components/pages/middlewares/CreateAdminAccountPage';
import NotFoundPage from 'components/pages/NotFoundPage';
import OnboardingForgotPasswordPage from 'components/pages/onboarding/beneficiary/OnboardingForgotPasswordPage';
import OnboardingGenericPage from 'components/pages/onboarding/beneficiary/OnboardingGenericPage';
import OnboardingLoginPage from 'components/pages/onboarding/beneficiary/OnboardingLoginPage';
import OnboardingRegisterPage from 'components/pages/onboarding/beneficiary/OnboardingRegisterPage';
import OnboardingWelcomePage from 'components/pages/onboarding/beneficiary/OnboardingWelcomePage';
import PasswordResetPage from 'components/pages/PasswordResetPage';
import PaymentMethodPage from 'components/pages/PaymentMethodPage';
import PersonalInformationPage from 'components/pages/PersonalInformationPage';
import PricingPage from 'components/pages/PricingPage';
import PlatformSettingsPage from 'components/pages/programs/PlatformSettingsPage';
// import AiComponentPage from 'components/pages/programs/AIComponentPage';
import SubscriptionPage from 'components/pages/SubscriptionPage';
import TailoredFormPage from 'components/pages/TailoredFormPage';
import BeneficiaryDeclarationListPage from 'components/pages/wall/BeneficiaryDeclarationListPage';
import MetricsPage from 'components/pages/wall/MetricsPage';
import PointConversionPage from 'components/pages/wall/PointConversionPage';
import BootBypassPage from 'components/pages/boot/BootBypassPage';
import WelcomePage from 'components/pages/WelcomePage';
import CommunicationPreRouter from 'components/router/CommunicationPreRouter';
import ProgramPreRouter from 'components/router/ProgramPreRouter';
import UserDeclarationPreRouter from 'components/router/UserDeclarationPreRouter';
import WelcomePageCustom from 'components/router/WelcomePageCustom';
import {
  ACTIVATE_ACCOUNT_ROUTE,
  AI_ROUTE,
  ALL_ROUTES,
  CREATE_ACCOUNT_ROUTE,
  CREATE_ADMIN_ACCOUNT_ROUTE,
  EMAIL_TOKEN_EXPIRED_LINK_ROUTE,
  FORGOT_PASSWORD_PAGE_ROUTE,
  INTERMEDIARY_WELCOME_PAGE,
  LAUNCH_BASE,
  LAUNCH_FIRST,
  LAUNCH_ROUTE,
  LOGIN_PAGE_ROUTE,
  METRICS_ROUTE,
  ONBOARDING_BENEFICIARY_FORGOT_PASSWORD_PAGE_ROUTE,
  ONBOARDING_BENEFICIARY_LOGIN_ROUTE,
  ONBOARDING_BENEFICIARY_REGISTER_ROUTE,
  ONBOARDING_GENERIC_ROUTE,
  ONBOARDING_SUCCESS,
  ONBOARDING_WELCOME_PROGRAM_ROUTE,
  PAGE_NOT_FOUND,
  PASSWORD_RESET_ROUTE,
  PAYMENT_CANCELED,
  PAYMENT_METHOD,
  PAYMENT_SUCCESS,
  PERSONAL_INFORMATION_ROUTE,
  PLATFORMS_ROUTE,
  PRICING_ROUTE,
  RESET_PASSWORD_EXPIRED_LINK_ROUTE,
  ROOT,
  SETTINGS,
  SUBSCRIPTION_ROUTE,
  TAILORED_ROUTE,
  USER_DECLARATIONS_ROUTE,
  USERS_DETAILS_ROUTE,
  USERS_ROUTE,
  VOICEFLOW_GOOGLE_ANALYTICS,
  WALL_BENEFICIARY_DECLARATIONS_ROUTE,
  WALL_COMMUNICATION_MAIN_ROUTE,
  WALL_GENERIC_ROUTE,
  WALL_HYPER_ADMIN_PAYOUT_ROUTE,
  WALL_INVITE_USERS_ROUTE,
  WALL_PROGRAM_ROUTE,
  WELCOME_PAGE_ROUTE,
  ONBOARDING_CUSTOM_WELCOME,
  CHECKOUT_STRIPE,
  RETURN_STRIPE
} from 'constants/routes';
import { ALL_ADMIN_ROLES, ALL_ROLES_EXCEPT_BENEFICIARY, ROLE } from 'constants/security/access';
import AiComponentPage from 'components/pages/programs/ia/AIComponentPage';
import CheckoutStripePage from 'components/pages/stripe/CheckoutStripePage';
import ReturnBackStripePage from 'components/pages/stripe/ReturnBackStripePage';

/**
 * Component with all route declarations
 *
 * @constructor
 */

const MainRouter = () => {
  return (
    <Switch>
      <Route exact path={CHECKOUT_STRIPE} component={CheckoutStripePage} />
      <Route exact path={RETURN_STRIPE} component={ReturnBackStripePage} />

      <Route exact path={ONBOARDING_CUSTOM_WELCOME} component={WelcomePageCustom} />
      <Route exact path={ONBOARDING_GENERIC_ROUTE} component={OnboardingGenericPage} />
      <Route exact path={ONBOARDING_WELCOME_PROGRAM_ROUTE} component={OnboardingWelcomePage} />
      <Route exact path={ONBOARDING_BENEFICIARY_REGISTER_ROUTE} component={OnboardingRegisterPage} />
      <AuthenticatedRoute exact path={ROOT} component={HomePage} />
      <Route exact path={PRICING_ROUTE} component={PricingPage} />
      <Route exact path={INTERMEDIARY_WELCOME_PAGE} component={IntermediaryPage} />
      <ProtectedRoute exact path={PAYMENT_SUCCESS} component={AccountCreationSuccess} />
      <ProtectedRoute
        exact
        path={ONBOARDING_SUCCESS}
        translationPrefix="onboarding.success"
        component={AccountCreationSuccess}
      />
      <ProtectedRoute exact path={PAYMENT_CANCELED} component={PaymentCanceled} />
      <Route exact path={WELCOME_PAGE_ROUTE} component={WelcomePage} />
      <AuthenticatedRoute exact path={TAILORED_ROUTE} component={TailoredFormPage} />
      <ProtectedRoute exact path={PAYMENT_METHOD} component={PaymentMethodPage} />
      <ProtectedRoute exact path={PERSONAL_INFORMATION_ROUTE} component={PersonalInformationPage} />
      <ProtectedRoute exact path={SUBSCRIPTION_ROUTE} component={SubscriptionPage} />

      {/* Authentication routes */}
      <AuthenticatedRoute exact path={PASSWORD_RESET_ROUTE} component={PasswordResetPage} />
      <AuthenticatedRoute exact path={RESET_PASSWORD_EXPIRED_LINK_ROUTE} component={ExpiredResetPasswordLink} />
      <Route exact path={EMAIL_TOKEN_EXPIRED_LINK_ROUTE} component={ExpiredEmailValidationLink} />
      <Route exact path={ACTIVATE_ACCOUNT_ROUTE} component={ActivateAccountPage} />
      <AuthenticatedRoute exact path={CREATE_ACCOUNT_ROUTE} component={CreateAccountPage} />
      <AuthenticatedRoute exact path={CREATE_ADMIN_ACCOUNT_ROUTE} component={CreateAdminAccountPage} />
      <AuthenticatedRoute exact path={LOGIN_PAGE_ROUTE} component={LoginPage} />
      <AuthenticatedRoute exact path={FORGOT_PASSWORD_PAGE_ROUTE} component={ForgotPasswordPage} />
      <AuthenticatedRoute exact path={ONBOARDING_BENEFICIARY_LOGIN_ROUTE} component={OnboardingLoginPage} />

      <AuthenticatedRoute
        exact
        path={ONBOARDING_BENEFICIARY_FORGOT_PASSWORD_PAGE_ROUTE}
        component={OnboardingForgotPasswordPage}
      />

      {/* Launch */}

      <ProtectedRoute authorizedRoles={ALL_ADMIN_ROLES} exact path={LAUNCH_ROUTE} component={LaunchPage} />
      <Redirect exact from={LAUNCH_BASE} to={LAUNCH_FIRST} />
      <Route exact path={PAGE_NOT_FOUND} component={NotFoundPage} />
      <Route exact path={VOICEFLOW_GOOGLE_ANALYTICS} component={BootBypassPage} />
      {/*User Declarations*/}
      <ProtectedRoute path={USER_DECLARATIONS_ROUTE} component={UserDeclarationPreRouter} />
      {/*Wall*/}
      <Route path={WALL_GENERIC_ROUTE} component={WallPreRouter} />
      <ProtectedRoute path={WALL_PROGRAM_ROUTE} component={ProgramPreRouter} />
      {/* <ProtectedRoute path={WALL_COMMUNICATION_MAIN_ROUTE} component={CommunicationPreRouter} /> */}
      <ProtectedRoute
        path={METRICS_ROUTE}
        component={MetricsPage}
        authorizedRoles={[ROLE.HYPER_ADMIN]}
        unauthorizedRedirectRoute={WALL_PROGRAM_ROUTE}
      />

      <ProtectedRoute
        path={`${PLATFORMS_ROUTE}/:hierarchicType${SETTINGS}/:id(\\d+)/:tab?`}
        component={PlatformSettingsPage}
        authorizedRoles={[ROLE.HYPER_ADMIN, ROLE.SUPER_ADMIN]}
        unauthorizedRedirectRoute={WALL_PROGRAM_ROUTE}
      />
      <ProtectedRoute
        path={AI_ROUTE}
        component={AiComponentPage}
        authorizedRoles={[ROLE.HYPER_ADMIN, ROLE.SUPER_ADMIN, ROLE.ADMIN]}
        unauthorizedRedirectRoute={WALL_PROGRAM_ROUTE}
      />

      {/*Users list*/}
      <ProtectedRoute
        authorizedRoles={ALL_ROLES_EXCEPT_BENEFICIARY}
        exact
        path={USERS_ROUTE}
        component={UsersMainBlock}
      />
      <ProtectedRoute
        authorizedRoles={ALL_ROLES_EXCEPT_BENEFICIARY}
        exact
        path={`${USERS_DETAILS_ROUTE}/:id`}
        component={UsersDetailsBlock}
      />
      <ProtectedRoute
        authorizedRoles={ALL_ROLES_EXCEPT_BENEFICIARY}
        exact
        path={WALL_INVITE_USERS_ROUTE}
        component={InviteUserBlock}
      />

      {/* <ProtectedRoute
        authorizedRoles={ALL_ROLES_EXCEPT_BENEFICIARY}
        path={WALL_COMMUNICATION_MAIN_ROUTE}
        component={CommunicationPreRouter}
      /> */}
      <ProtectedRoute
        authorizedRoles={[ROLE.BENEFICIARY]}
        exact
        path={WALL_BENEFICIARY_DECLARATIONS_ROUTE}
        component={BeneficiaryDeclarationListPage}
      />
      <ProtectedRoute
        authorizedRoles={[ROLE.HYPER_ADMIN]}
        exact
        path={WALL_HYPER_ADMIN_PAYOUT_ROUTE}
        component={PointConversionPage}
        unauthorizedRedirectRoute={WALL_PROGRAM_ROUTE}
      />
      <Redirect strict from={ALL_ROUTES} to={PAGE_NOT_FOUND} />

    </Switch>
  );
};

export default MainRouter;