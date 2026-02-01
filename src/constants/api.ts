// -----------------------------------------------------------------------------
// API Constants
// Migrated from old_app/src/constants/api/index.ts
// -----------------------------------------------------------------------------

export const APPLICATION_JSON = 'application/json';

export const TIMEOUT_PERIOD = parseInt(import.meta.env.VITE_AXIOS_TIMEOUT_PERIOD || '50000000');
export const MAX_TIMEOUT_PERIOD = 3600000;
export const HTTP_SUCCESS_STATUS = 200;
export const HTTP_POST_SUCCESS_STATUS = 201;
export const HTTP_USER_NOT_ACTIVATED = 1007;
export const TOKENS = '/tokens';

// Authentication endpoints
export const LOGIN_ENDPOINT = `${TOKENS}/login`;
export const FORGOT_PASSWORD_ENDPOINT = `${TOKENS}/resetPassword`;
export const RESET_PASSWORD_ENDPOINT = `/users/password`;
export const VALIDATE_TOKEN = `${TOKENS}/validate`;

// User endpoints
export const USERS_ENDPOINT = '/users';
export const USERS = `/users`;
export const USERS_DETAILS = `/usersDetails`;
export const UPDATE_USER_ENDPOINT = `/users`;
export const USERS_RANKING_ENDPOINT = `${USERS_ENDPOINT}/rankings`;
export const STATUS = `/status`;
export const SET_CURRENT_STEP = `/users/step`;

// Platform endpoints
export const PLATFORMS = '/platforms';
export const PLATFORM_ADMINISTRATORS = '/platformAdministrators';
export const PRICING_GET_ENDPOINT = '/platformTypes';

// Program endpoints
export const PROGRAMS_ENDPOINT = '/programs';
export const UPDATE_PROGRAMS_ENDPOINT = '/updateProgram';
export const UPDATE_PROGRAM_USER_ENDPOINT = '/programUsers';
export const GENERATE_URL_ENDPOINT = `/programs/customUrl`;

// File endpoints
export const UPLOAD_FILES_ENDPOINT = `/file/upload`;
export const UPLOAD_USERS_LIST = '/invitedUsersFile/upload';

// Communication endpoints
export const EMAIL_CAMPAIGN_ENDPOINT = '/emailCampaigns';
export const EMAIL_TEMPLATES_ENDPOINT = '/emailTemplates';
export const USER_LIST_ENDPOINT = '/emailUserLists';
export const CONTACT_FORM_LOGS_ENDPOINT = '/contactFormLogs';
export const CONTACT_US_ENDPOINT = `/contactUs`;

// Declaration endpoints
export const USER_DECLARATIONS_ENDPOINT = `/userDeclarations`;
export const USER_DECLARATIONS_VALIDATE_ENDPOINT = `${USER_DECLARATIONS_ENDPOINT}/status`;
export const USER_DECLARATIONS_TEMPLATE_ENDPOINT = '/usersDeclarations/template';
export const USER_DECLARATIONS_UPLOAD_ENDPOINT = '/usersDeclarationFile/upload';
export const NOTES_ENDPOINT = '/notes';

// Points & conversions
export const POINT_CONVERSIONS_API = `/pointsConversions`;
export const POINT_CONVERSIONS_API_UPDATE_STATUS = `${POINT_CONVERSIONS_API}/status`;
export const POINTS_ENDPOINT = 'points';
export const POINTS_CONVERSION_ENDPOINT = '/pointsConversions';
export const POINTS_CONVERSION_EDIT_ENDPOINT = `${POINTS_CONVERSION_ENDPOINT}/status`;
export const POINT_CONVERSION_VALIDATE_OPERATION = 'validate';
export const POINT_CONVERSION_DECLINE_OPERATION = 'decline';

// Products & allocation
export const PRODUCTS = `/products`;
export const POSSIBLE_ALLOCATION_TYPES = `/allocationTypes`;
export const GET_ECARDS_ENDPOINT = '/getEcards';
export const CATEGORIES = `/categories`;

// Wallet & BDC
export const GET_WINS_COMPANY_ENDPOINT = `/winsWalletCompany/getWinsCompany`;
export const GET_ALL_EXPIRED_WINS_COMPANY_ENDPOINT = `/winsWalletCompany/getAllExpiredWins`;
export const SET_WINS_COMPANY_ENDPOINT = `/winsWalletCompany/setWinsCompany`;
export const UPDATE_WINS_COMPANY_ENDPOINT = `/winsWalletCompany/updateWinsCompany`;
export const SET_BDC_DEMAND_HISTORY_ENDPOINT = `/bdcDemandHistory/setBdcDemandHistory`;
export const UPDATE_BDC_DEMAND_HISTORY_ENDPOINT = `/bdcDemandHistory/updateBdcDemandHistory`;
export const GET_BDC_DEMAND_HISTORY_ENDPOINT = `/bdcDemandHistory/getBdcDemandHistory`;
export const GET_BDC_DETAILS_ENDPOINT = `/bdcDemandHistory/getBdcDetails`;
export const GET_INVOICE_DETAILS_ENDPOINT = `/bdcDemandHistory/getInvoiceDetails`;

// Dashboard & metrics
export const DASHBOARD_ENDPOINT = '/dashboard';
export const KEY_STATS_ENDPOINT = `${DASHBOARD_ENDPOINT}/key-stats`;
export const KEY_DETAILED_STATS_ENDPOINT = `${DASHBOARD_ENDPOINT}/detailed-stats`;
export const METRICS_ENDPOINT_PATH = 'ha/metrics';
export const METRICS_ENDPOINT = '/ha/metrics';

// User Growth Ref
export const USER_GROWTH_REF_UPLOAD_ENDPOINT = '/usersGrowthRefFile/upload';

// Invite users
export const INVITE_USERS_ENDPOINT = `/invitedUsers`;
export const INVITE_USERS_EMAIL_LIST_ENDPOINT = `${INVITE_USERS_ENDPOINT}/email`;

// Stripe
export const CANCEL_STRIPE_USERS_ENDPOINT = '/cancelStripeUserSubscription';
export const SUBSCRIPTION = '/subscriptions';

// Posts & social
export const POSTS_ENDPOINT = '/posts';
export const LIKES_ENDPOINT = '/likes';
export const COMMENTS_ENDPOINT = '/comments';
export const PINS = 'pins';

// AI endpoints
export const GET_IA_PERSO_API = '/iaPersoCompany/getIaPersoCompany';
export const GET_IA_API = '/iaPersoCompany/getIaCompany';
export const SET_UPDATE_IA_PERSO_API = '/iaPersoCompany/setOrUpdateIaPersoCompany';

// HTTP headers
export const CONTENT_TYPE = 'Content-Type';
export const CONTENT_DISPOSITION = 'content-disposition';
export const ACCEPT_LANGUAGE = 'Accept-Language';
export const AUTHORIZATION = 'Authorization';
export const MULTIPART_FORM_DATA = 'multipart/form-data';

// HTTP methods
export const GET = 'get';
export const POST = 'post';
export const BLOB = 'blob';

// Query parameters
export const API_V1 = '/api/v2';
export const PLATFORM_QUERY = '?platform=';
export const SIZE_QUERY = '&size=';
export const SORT_DESC = 'DESC';
export const MAX_SIZE = '1000';
export const NO_OFFSET = '0';
export const OFFSET_QUERY = '&offset=';
export const DEFAULT_USER_LIST_SIZE = 10;
export const DEFAULT_LIST_SIZE = 20;
export const DEFAULT_OFFSET = 0;
export const VIEW_POST_QUERY = '&view=';
export const PROGRAM_QUERY = '&program=';
export const PARAMETER_SIZE = 'size';
export const PARAMETER_SORT_BY = 'sortBy';
export const PARAMETER_SORT_DIRECTION = 'sortDirection';
export const PARAMETER_OFFSET = 'offset';
export const PARAMETER_PLATFORM_ID = 'platformId';
export const PARAMETER_VIEW = 'view';
export const COMMENTS_QUERY = 'comments?';
export const DEFAULT_COMMENTS_LIST_SIZE = 5;
export const DEFAULT_USERS_LIST_SIZE = 20;
export const DETAILED_ALLOCATIONS_QUERY = '?detailedAllocations=';

// Form fields
export const GET_FORM_FIELDS_API = '/formFields?launchType=';
export const GET_FORM_FIELDS_API_PROGRAM_TYPE = '&programType=';
export const GET_FORM_FIELDS_API_FORM_TYPE = '&formType=';
export const GET_FORM_FIELDS_API_WITH_PRODUCTS = '&withProducts=';
export const GET_FORM_FIELDS_API_REGISTER_TYPE = 'register';
export const GET_FORM_FIELDS_API_RESULTS_TYPE = 'results';

// Misc
export const PROGRAMS = 'programs';
export const RANKING = 'ranking';
export const DECLARATIONS = 'declarations';
export const CREATE_DECLARATION = `${DECLARATIONS}/create`;
export const USER_DATA_EXPORT = 'all-data';
export const BENEFICIARY_POINTS = 'points';
export const WELCOME_CUSTOM = 'getOnboardingProgramDetails';

// Enums
export enum HTTP_STATUS {
  FORBIDDEN = 403,
  NOT_FOUND = 404
}

export enum ACCOUNT_TYPE {
  COMPANY_REPRESENTATIVE = 1,
  BENEFICIARY = 2
}

export enum VIEW_TYPE {
  COUNTER = 'counter',
  LIST = 'list',
  BLOCK = 'block',
  ADMINISTRATORS = 'administrators',
  PREVIEW = 'preview',
  PLATFORM = 'platform'
}

export enum POST_FILE_TYPE {
  POST_IMAGE = 9,
  POST_VIDEO = 10,
  POST_OTHERS = 11
}

export enum COMMENT_FILE_TYPE {
  COMMENT_IMAGE = 12,
  COMMENT_VIDEO = 13,
  COMMENT_OTHERS = 14
}

export enum CAMPAIGN_FILE_TYPE {
  IMAGE = 4
}
