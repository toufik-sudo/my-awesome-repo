// -----------------------------------------------------------------------------
// Application Routes Constants
// Migrated from old_app/src/constants/routes.ts
// -----------------------------------------------------------------------------

// Base routes
export const ROOT = '/';
export const PAGE_NOT_FOUND = '/not-found';
export const ALL_ROUTES = '*';

// Auth routes
export const LOGIN = '/login';
export const LOGIN_PAGE_ROUTE = '/login';
export const FORGOT_PASSWORD = '/forgot-password';
export const FORGOT_PASSWORD_PAGE_ROUTE = '/forgot-password';
export const PASSWORD_RESET_ROUTE = '/password-reset/:token';
export const ACTIVATE_ACCOUNT_ROUTE = '/activate-account/:uuid/:token';
export const CREATE_ACCOUNT = '/create-account';
export const CREATE_ACCOUNT_ROUTE = '/create-account/:name?/:id?';

// Wall route shortcuts
export const WALL = '/wall';

// Pricing & Payment
export const PRICING_ROUTE = '/pricing';
export const PAYMENT_METHOD = '/payment-method';
export const PAYMENT_SUCCESS = '/payment/success';
export const PAYMENT_CANCELED = '/payment/canceled';
export const CHECKOUT_STRIPE = '/checkout-stripe';
export const RETURN_STRIPE = '/return-stripe';

// Onboarding
export const ONBOARDING = '/onboarding';
export const ONBOARDING_SUCCESS = '/onboarding/success';
export const ONBOARDING_WELCOME_PROGRAM_ROUTE = '/programs/:programType/:programId/:customUrl';
export const ONBOARDING_BENEFICIARY_LOGIN_ROUTE = '/onboarding/login';
export const ONBOARDING_BENEFICIARY_FORGOT_PASSWORD_PAGE_ROUTE = '/onboarding/forgot-password';
export const ONBOARDING_BENEFICIARY_REGISTER_ROUTE = '/onboarding/register/:step?';
export const ONBOARDING_GENERIC_ROUTE = '/onboarding/welcome';
export const ONBOARDING_CUSTOM_WELCOME = '/customWall';

// Wall routes
export const WALL_ROUTE = '/wall';
export const WALL_GENERIC_ROUTE = '/wall/:beneficiaryPage?';

// Programs
export const WALL_PROGRAM_ROUTE = '/programs';
export const WALL_PROGRAM_JOIN_ROUTE = '/programs/join';

// Users
export const USERS_ROUTE = '/users';
export const USERS_DETAILS_ROUTE = '/users/details';
export const WALL_INVITE_USERS_ROUTE = '/users/invite-users';

// Declarations
export const DECLARATIONS_ROUTE = '/declarations';
export const WALL_BENEFICIARY_DECLARATIONS_ROUTE = '/declarations';
export const USER_DECLARATIONS_ROUTE = '/user-declarations';
export const USER_DECLARATION_ADD_FORM_ROUTE = '/user-declarations/add-declaration';
export const USER_DECLARATION_UPLOAD_ROUTE = '/user-declarations/upload';

// Launch
export const LAUNCH_BASE = '/launch';
export const LAUNCH_ROUTE = '/launch/:step/:stepIndex';
export const LAUNCH_FIRST = '/launch/program/1';
export const LAUNCH_PROGRAM_FIRST = '/launch/program/1';

// Communication
export const COMMUNICATION = 'communication';
export const EMAIL = 'email';
export const WALL_COMMUNICATION_MAIN_ROUTE = '/communication/email/:communicationTab';
export const WALL_COMMUNICATION_EMAIL_CAMPAIGNS_ROUTE = '/communication/email/email-campaigns';
export const WALL_COMMUNICATION_USER_LIST_ROUTE = '/communication/email/user-list';

// Platform & Settings
export const PLATFORMS_ROUTE = '/platforms';
export const SETTINGS = '/settings';
export const SETTINGS_ROUTE = '/settings';
export const PAYMENT_SETTINGS_ROUTE = '/wall/settings/payment';
export const DASHBOARD_ROUTE = '/dashboard';

// Metrics & Analytics
export const METRICS_ROUTE = '/metrics';
export const AI_ROUTE = '/ai';

// Misc
export const WELCOME_PAGE_ROUTE = '/welcome-page';
export const WELCOME_ROUTE = '/welcome';
export const INTERMEDIARY_WELCOME_PAGE = '/welcome/:type/';
export const TAILORED_ROUTE = '/tailored';
export const PERSONAL_INFORMATION_ROUTE = '/personal-information';
export const SUBSCRIPTION_ROUTE = '/subscription';
export const NOTIFICATIONS_ROUTE = '/notifications';

// Redirect step routes
export const REDIRECT_STEP_ROUTES: Record<string, string> = {
  '1': '/onboarding/step-1',
  '2': '/onboarding/step-2',
  '3': '/onboarding/step-3',
  '4': '/wall'
} as const;
export const WALL_HYPER_ADMIN_PAYOUT_ROUTE = '/payout';
export const WALL_BENEFICIARY_RANKING_ROUTE = '/ranking';

// Expiration
export const RESET_PASSWORD_EXPIRED_LINK_ROUTE = '/expired-link';
export const EMAIL_TOKEN_EXPIRED_LINK_ROUTE = '/expired-confirmation';

// Landing sections
export const LANDING = 'landing';
export const WHY_CHOOSE_US = 'whyChooseUs';
export const SERVICES = 'services';
export const FEATURES = 'features';
export const HOW_IT_WORKS = 'howItWorks';
export const VIDEO_SECTION = 'video';
export const PRICING = 'pricing';
export const PLATFORM = 'platform';
export const CONTACT = 'contact';
export const SIGN_UP = 'signUp';

export const LANDING_NAV_ELEMENTS = [SERVICES, WHY_CHOOSE_US, FEATURES, HOW_IT_WORKS, VIDEO_SECTION, PRICING, CONTACT];

// Redirect configuration
export const REDIRECT_MAPPING = {
  NOT_ACTIVATED: 0,
  SUBSCRIPTION_STEP: 1,
  PERSONAL_INFORMATION_STEP: 2,
  PAYMENT_METHOD_STEP: 3,
  PAYMENT_SUCCESS_STEP: 4,
  WALL_ROUTE_STEP: 5,
  NOT_PAID_STEP: 6
};

export const SUPER_USERS_ROUTES = [
  WALL_PROGRAM_ROUTE,
  PLATFORMS_ROUTE,
  METRICS_ROUTE,
  WALL_HYPER_ADMIN_PAYOUT_ROUTE,
  AI_ROUTE,
  `${WELCOME_ROUTE}/launch`
];
