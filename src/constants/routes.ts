import { ADMIN, UUID } from 'constants/general';
import { ID, NAME } from 'constants/landing';
import { BENEFICIARY_POINTS, CREATE_DECLARATION, DECLARATIONS, RANKING, USERS_DETAILS } from 'constants/api';
import { USER_DECLARATION_SOURCE } from './api/declarations';
import { CONTENT } from './wall/design';
import { LAUNCH_CONTENTS_FIRST, LAUNCH_CONTENTS_SIX, LAUNCH_DESIGN_FIRST } from './wall/launch';

export const ROOT = '/';
export const PRICING_ROUTE = '/pricing';
export const PAGE_NOT_FOUND = '/not-found';
export const VOICEFLOW_GOOGLE_ANALYTICS = '/setYoowinAnalytics';
export const WELCOME_ROUTE = '/welcome';
export const RESET_PASSWORD_EXPIRED_LINK_ROUTE = '/expired-link';
export const EMAIL_TOKEN_EXPIRED_LINK_ROUTE = '/expired-confirmation';
export const ALL_ROUTES = '*';
export const TYPE = ':type';
export const TOKEN = 'token';

export const CHECKOUT_STRIPE = '/checkout-stripe';
export const RETURN_STRIPE = '/return-stripe';

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
export const LAUNCH = 'launch';
export const TAILORED = 'tailored';
export const WALL = 'wall';
export const METRICS = 'metrics';
export const PASSWORD_RESET = 'passwordReset';
export const FORGOT_PASSWORD = 'forgotPassword';
export const LOGIN = 'login';
export const PREMIUM = 'premium';
export const ACCESS = 'access';
export const BEST_SELLER = 'best seller';
export const INTERNATIONAL = 'international';
export const FREEMIUM = 'freemium';
export const CHALLENGE = 'challenge';
export const PERSONAL_INFORMATION = 'personal-information';
export const SUBSCRIPTION = 'subscription';
export const ACTIVATE_ACCOUNT = 'activate-account';
export const VIEW_MODE = { PARAM: 'viewMode', CURRENT_ID: 'currentId', CREATE: 'create', EDIT: 'edit' };
export const PLATFORM_ID = 'platformId';
export const SETTINGS = '/settings';
export const ECARD_CONVERSION = '/ecard/conversion';
export const NOTIFICATIONS = 'notifications';
export const COMMUNICATION = 'communication';
export const EMAIL = 'email';
export const USER_DECLARATIONS = 'user-declarations';
export const PAYOUT = 'payout';
export const AI = 'ai';

export const USERS_WALL = 'users';
export const DASHBOARD_WALL = 'dashboard';
export const PAYMENT_WALL = 'payment';
export const DECLARATIONS_WALL = 'declarations';
export const AGENDA_WALL = 'agenda';

export const WALL_ROUTE = `/${WALL}`;
export const RAG_ROUTE = '/ia_upload_knowledge';
export const RESET_NAMESPACE_RAG_ROUTE = '/delete-namespace';
export const SEND_EMAIL_RESET_NAMESPACE_RAG_ROUTE = '/send_email';
export const SET_RAG_INDEX_ROUTE = '/ragIndex/setRagIndexDocs';
export const GET_RAG_INDEX_ROUTE = '/ragIndex/getRagIndexDocs';
export const GET_RAG_TOKENS_COUNT_ROUTE = '/get_tokens_count';
export const GET_RAG_TOKENS_COUNT_FILE_ROUTE = '/get_file_tokens_count';
export const RESET_RAG_INDEX_ROUTE = '/ragIndex/resetRagIndexDocs';
export const RAG_ROUTE_LINK = '/index_link';
export const METRICS_ROUTE = `/${METRICS}`;
export const WALL_GENERIC_ROUTE = `${WALL_ROUTE}/:beneficiaryPage?`;
export const WALL_BENEFICIARY_RANKING_ROUTE = `${WALL_ROUTE}/${RANKING}`;
export const WALL_BENEFICIARY_CREATE_DECLARATION_ROUTE = `${WALL_ROUTE}/${CREATE_DECLARATION}`;
export const WALL_BENEFICIARY_DECLARATIONS_ROUTE = `/${DECLARATIONS}`;
export const WALL_HYPER_ADMIN_PAYOUT_ROUTE = `/${PAYOUT}`;
export const WALL_ADMIN_AI_ROUTE = `/${AI}`;
export const EMAIL_ACTIVATION = 'email-activation';
export const CREATE_ACCOUNT = 'create-account';
export const CREATE_ADMIN_DEFAULT_ACCOUNT_ROUTE = '/create-account';
export const CREATE_ACCOUNT_FREEMIUM = `/${CREATE_ACCOUNT}/${FREEMIUM}`;
export const PAYMENT_METHOD = '/payment-method';
export const PAYMENT = '/payment';
export const ONBOARDING = '/onboarding';
export const SUCCESS = '/success';
export const CANCELED = '/canceled';
export const WALL_PROGRAM_ROUTE = '/programs';
export const WALL_PROGRAM_JOIN_ROUTE = '/programs/join';
export const WALL_COMMUNICATION_MAIN_ROUTE = `/${COMMUNICATION}/${EMAIL}/:communicationTab`;
export const WALL_COMMUNICATION_EMAIL_CAMPAIGNS_ROUTE = `/${COMMUNICATION}/${EMAIL}/email-campaigns`;
export const WALL_COMMUNICATION_USER_LIST_ROUTE = `/${COMMUNICATION}/${EMAIL}/user-list`;
export const WALL_BENEFICIARY_POINTS_ROUTE = `${WALL_ROUTE}/${BENEFICIARY_POINTS}`;
export const PLATFORMS_ROUTE = '/platforms';
export const AI_ROUTE = '/ai';
export const WELCOME_LAUNCH_ROUTE = `${WELCOME_ROUTE}/${LAUNCH}`;

export const SUPER_USERS_ROUTES = [WALL_PROGRAM_ROUTE, PLATFORMS_ROUTE, METRICS_ROUTE, WALL_HYPER_ADMIN_PAYOUT_ROUTE, WALL_ADMIN_AI_ROUTE, WELCOME_LAUNCH_ROUTE];

//Wall routes
export const USERS_ROUTE = `/${USERS_WALL}`;
export const USERS_DETAILS_ROUTE = `${USERS_ROUTE}${USERS_DETAILS}`;
export const AGENDA_ROUTE = `/${WALL}/${AGENDA_WALL}`;
export const DASHBOARD_ROUTE = `/${WALL}/${DASHBOARD_WALL}`;
export const PAYMENT_SETTINGS_ROUTE = `/${WALL}${SETTINGS}${PAYMENT}`;

export const USER_DECLARATIONS_ROUTE = `/${USER_DECLARATIONS}`;
const USER_DECLARATION_FORM = '/add-declaration';
const USER_DECLARATION_UPLOAD = '/upload';
export const USER_DECLARATION_ADD_FORM_ROUTE = `${USER_DECLARATIONS_ROUTE}${USER_DECLARATION_FORM}`;
export const USER_DECLARATION_UPLOAD_ROUTE = `${USER_DECLARATIONS_ROUTE}${USER_DECLARATION_UPLOAD}`;
export const CREATE_DECLARATIONS_ROUTES = Object.freeze([
  {
    path: USER_DECLARATION_FORM,
    type: USER_DECLARATION_SOURCE.FORM
  },
  {
    path: USER_DECLARATION_UPLOAD,
    type: USER_DECLARATION_SOURCE.FILE_UPLOAD
  }
]);

// Routes
export const INTERMEDIARY_WELCOME_PAGE = `${WELCOME_ROUTE}/${TYPE}/`;
export const WELCOME_TAILORED_ROUTE = `${WELCOME_ROUTE}/${TAILORED}`;
// export const WELCOME_LAUNCH_ROUTE = `${WELCOME_ROUTE}/${LAUNCH}`;
export const WELCOME_FREEMIUM_LAUNCH_ROUTE = `${WELCOME_LAUNCH_ROUTE}?id=`;
export const WELCOME_EMAIL_ACTIVATION_ROUTE = `${WELCOME_ROUTE}/${EMAIL_ACTIVATION}`;
export const TAILORED_ROUTE = `/${TAILORED}`;
export const CREATE_ACCOUNT_ROUTE = `/${CREATE_ACCOUNT}/:${NAME}?/:${ID}?`;
export const CREATE_ADMIN_ACCOUNT_ROUTE = `/${ADMIN}/${PLATFORM}/:${PLATFORM_ID}`;
export const PASSWORD_RESET_ROUTE = `/password-reset/:${TOKEN}`;
export const ACTIVATE_ACCOUNT_ROUTE = `/${ACTIVATE_ACCOUNT}/:${UUID}/:${TOKEN}`;
export const PERSONAL_INFORMATION_ROUTE = `/${PERSONAL_INFORMATION}`;
export const SUBSCRIPTION_ROUTE = `/${SUBSCRIPTION}`;
export const WELCOME_PAGE_ROUTE = '/welcome-page';
export const LOGIN_PAGE_ROUTE = '/login';
export const FORGOT_PASSWORD_PAGE_ROUTE = '/forgot-password';
export const COMMUNICATION_FORM_EMAIL_CAMPAIGN_ROUTE = `${WALL_COMMUNICATION_EMAIL_CAMPAIGNS_ROUTE}/${VIEW_MODE.CREATE}`;
export const COMMUNICATION_FORM_USER_LIST_ROUTE = `${WALL_COMMUNICATION_USER_LIST_ROUTE}/:${VIEW_MODE.PARAM}/:${VIEW_MODE.CURRENT_ID}?`;
export const COMMUNICATION_FORM_CREATE_USER_LIST_ROUTE = `${WALL_COMMUNICATION_USER_LIST_ROUTE}/${VIEW_MODE.CREATE}`;
export const PAYMENT_SUCCESS = `${PAYMENT}${SUCCESS}`;
export const ONBOARDING_SUCCESS = `${ONBOARDING}${SUCCESS}`;
export const PAYMENT_CANCELED = `${PAYMENT}${CANCELED}`;
export const ONBOARDING_CUSTOM_WELCOME = '/customWall';

// Launch
const PROGRAM = 'program';
const RESULTS = 'results';
const PRODUCTS = 'products';
export const LAUNCH_BASE = '/launch';
export const LAUNCH_ROUTE = '/launch/:step/:stepIndex';
export const LAUNCH_FIRST = `${LAUNCH_BASE}/${PROGRAM}/1`;
export const LAUNCH_TO_SOCIAL_NETWORKS = LAUNCH_CONTENTS_SIX;
export const LAUNCH_TO_DESIGN = LAUNCH_DESIGN_FIRST;
export const LAUNCH_RESULTS_FIRST = `${LAUNCH_BASE}/${RESULTS}/1`;
export const LAUNCH_PRODUCTS_FIRST = `${LAUNCH_BASE}/${PRODUCTS}/1`;
export const LAUNCH_EDIT_ROUTE = `${LAUNCH_BASE}/${PROGRAM}/3`;
export const LAUNCH_USER_FIRST = `/launch/users/1`;

export const LANDING_NAV_ELEMENTS = [SERVICES, WHY_CHOOSE_US, FEATURES, HOW_IT_WORKS, VIDEO_SECTION, PRICING, CONTACT];
export const WELCOME_PAGES = [TAILORED, LAUNCH, EMAIL_ACTIVATION];

export const INVITE_USERS_ROUTE = `/invite-users`;
export const PROGRAM_RANKING_ROUTE = `/program-ranking`;
export const UPGRADE_PLAN = `/upgrade-plan`;
export const WALL_INVITE_USERS_ROUTE = `${USERS_ROUTE}${INVITE_USERS_ROUTE}`;
export const WALL_PROGRAM_RANKING_ROUTE = `${PROGRAM_RANKING_ROUTE}`;

export const NOTIFICATIONS_ROUTE = `/${NOTIFICATIONS}`;
export const WALL_NOTIFICATIONS_ROUTE = `/${WALL}${NOTIFICATIONS_ROUTE}`;

// ONBOARDING
export const ONBOARDING_WELCOME_PROGRAM_ROUTE = '/programs/:programType/:programId/:customUrl';
export const ONBOARDING_BENEFICIARY_LOGIN_ROUTE = '/onboarding/login';
export const ONBOARDING_BENEFICIARY_FORGOT_PASSWORD_PAGE_ROUTE = '/onboarding/forgot-password';
export const ONBOARDING_BENEFICIARY_REGISTER_BASE_ROUTE = '/onboarding/register/';
export const ONBOARDING_BENEFICIARY_REGISTER_ROUTE = `${ONBOARDING_BENEFICIARY_REGISTER_BASE_ROUTE}:step?`;
export const ONBOARDING_GENERIC = 'onboarding/welcome';
export const ONBOARDING_GENERIC_ROUTE = `/${ONBOARDING_GENERIC}`;

export const REDIRECT_STEP_ROUTES = [
  WELCOME_EMAIL_ACTIVATION_ROUTE,
  SUBSCRIPTION_ROUTE,
  PERSONAL_INFORMATION_ROUTE,
  PAYMENT_METHOD,
  PAYMENT_SUCCESS,
  WALL_ROUTE,
  PAYMENT_SETTINGS_ROUTE
];

export const REDIRECT_MAPPING = {
  NOT_ACTIVATED: 0,
  SUBSCRIPTION_STEP: 1,
  PERSONAL_INFORMATION_STEP: 2,
  PAYMENT_METHOD_STEP: 3,
  PAYMENT_SUCCESS_STEP: 4,
  WALL_ROUTE_STEP: 5,
  NOT_PAID_STEP: 6
};

export const EMAIL_SENT = 'activate';
export const EMAIL_CONFIRMED = 'activated';

export const PLATFORM_ID_QUERY = '?platformId=';
