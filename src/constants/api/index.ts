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

// Endpoints
export const PRICING_GET_ENDPOINT = '/platformTypes';
export const CONTACT_FORM_LOGS_ENDPOINT = '/contactFormLogs';
export const LOGIN_ENDPOINT = `${TOKENS}/login`;
export const USERS_ENDPOINT = '/users';
export const CANCEL_STRIPE_USERS_ENDPOINT = '/cancelStripeUserSubscription';
export const PLATFORM_ADMINISTRATORS = '/platformAdministrators';
export const USERS_RANKING_ENDPOINT = `${USERS_ENDPOINT}/rankings`;
export const UPDATE_PROGRAM_USER_ENDPOINT = '/programUsers';
export const EMAIL_CAMPAIGN_ENDPOINT = '/emailCampaigns';
export const EMAIL_TEMPLATES_ENDPOINT = '/emailTemplates';
export const USER_LIST_ENDPOINT = '/emailUserLists';
export const FORGOT_PASSWORD_ENDPOINT = `${TOKENS}/resetPassword`;
export const RESET_PASSWORD_ENDPOINT = `/users/password`;
export const VALIDATE_TOKEN = `${TOKENS}/validate`;
export const UPDATE_USER_ENDPOINT = `/users`;
export const UPLOAD_FILES_ENDPOINT = `/file/upload`;
export const UPLOAD_USERS_LIST = '/invitedUsersFile/upload';
export const GENERATE_URL_ENDPOINT = `/programs/customUrl`;
export const USER_DECLARATIONS_ENDPOINT = `/userDeclarations`;
export const POINT_CONVERSIONS_API = `/pointsConversions`;
export const POINT_CONVERSIONS_API_UPDATE_STATUS = `${POINT_CONVERSIONS_API}/status`;
export const USER_DECLARATIONS_VALIDATE_ENDPOINT = `${USER_DECLARATIONS_ENDPOINT}/status`;
export const NOTES_ENDPOINT = '/notes';
export const USER_DECLARATIONS_TEMPLATE_ENDPOINT = '/usersDeclarations/template';
export const USER_DECLARATIONS_UPLOAD_ENDPOINT = '/usersDeclarationFile/upload';
export const PROGRAMS_ENDPOINT = '/programs';
export const UPDATE_PROGRAMS_ENDPOINT = '/updateProgram';
export const GET_ECARDS_ENDPOINT = '/getEcards';
export const USERS = `/users`;
export const USERS_DETAILS = `/usersDetails`;
export const STATUS = `/status`;
export const PRODUCTS = `/products`;
export const PLATFORMS = '/platforms';
export const SET_CURRENT_STEP = `/users/step`;
export const POSSIBLE_ALLOCATION_TYPES = `/allocationTypes`;
export const CONTACT_US_ENDPOINT = `/contactUs`;

// BDC Demand endpoints
export const GET_WINS_COMPANY_ENDPOINT = `/winsWalletCompany/getWinsCompany`;
export const GET_ALL_EXPIRED_WINS_COMPANY_ENDPOINT = `/winsWalletCompany/getAllExpiredWins`;
export const SET_WINS_COMPANY_ENDPOINT = `/winsWalletCompany/setWinsCompany`;
export const UPDATE_WINS_COMPANY_ENDPOINT = `/winsWalletCompany/updateWinsCompany`;
export const SET_BDC_DEMAND_HISTORY_ENDPOINT = `/bdcDemandHistory/setBdcDemandHistory`;
export const UPDATE_BDC_DEMAND_HISTORY_ENDPOINT = `/bdcDemandHistory/updateBdcDemandHistory`;
export const GET_BDC_DEMAND_HISTORY_ENDPOINT = `/bdcDemandHistory/getBdcDemandHistory`;
export const GET_BDC_DETAILS_ENDPOINT = `/bdcDemandHistory/getBdcDetails`;
export const GET_INVOICE_DETAILS_ENDPOINT = `/bdcDemandHistory/getInvoiceDetails`;

// User Growth Ref
export const USER_GROWTH_REF_UPLOAD_ENDPOINT = '/usersGrowthRefFile/upload';

// Payment
export const SUBSCRIPTION = '/subscriptions';

// Hyper Admin
export const METRICS_ENDPOINT = '/ha/metrics';

// Headers
export const CONTENT_TYPE = 'Content-Type';
export const CONTENT_DISPOSITION = 'content-disposition';
export const ACCEPT_LANGUAGE = 'Accept-Language';
export const AUTHORIZATION = 'Authorization';
export const MULTIPART_FORM_DATA = 'multipart/form-data';

// HTTP Methods
export const GET = 'get';
export const POST = 'post';
export const BLOB = 'blob';

// Query parameters
export const POSTS_ENDPOINT = '/posts';
export const API_V1 = '/api/v2';
export const CATEGORIES = `/categories`;
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
export const LIKES_ENDPOINT = '/likes';
export const PINS = 'pins';
export const PROGRAMS = 'programs';
export const RANKING = 'ranking';
export const DECLARATIONS = 'declarations';
export const CREATE_DECLARATION = `${DECLARATIONS}/create`;
export const USER_DATA_EXPORT = 'all-data';
export const DASHBOARD_ENDPOINT = '/dashboard';
export const KEY_STATS_ENDPOINT = `${DASHBOARD_ENDPOINT}/key-stats`;
export const KEY_DETAILED_STATS_ENDPOINT = `${DASHBOARD_ENDPOINT}/detailed-stats`;
export const INVITE_USERS_ENDPOINT = `/invitedUsers`;
export const INVITE_USERS_EMAIL_LIST_ENDPOINT = `${INVITE_USERS_ENDPOINT}/email`;
export const BENEFICIARY_POINTS = 'points';
export const DETAILED_ALLOCATIONS_QUERY = '?detailedAllocations=';

// Parameter names
export const PARAMETER_SIZE = 'size';
export const PARAMETER_SORT_BY = 'sortBy';
export const PARAMETER_SORT_DIRECTION = 'sortDirection';
export const PARAMETER_OFFSET = 'offset';
export const PARAMETER_PLATFORM_ID = 'platformId';
export const PARAMETER_VIEW = 'view';

// Comments
export const COMMENTS_QUERY = 'comments?';
export const DEFAULT_COMMENTS_LIST_SIZE = 5;
export const DEFAULT_USERS_LIST_SIZE = 20;
export const COMMENTS_ENDPOINT = '/comments';
export const POINTS_ENDPOINT = 'points';

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

export type FileType = POST_FILE_TYPE | COMMENT_FILE_TYPE | CAMPAIGN_FILE_TYPE;

export const POINT_CONVERSION_VALIDATE_OPERATION = 'validate';
export const POINT_CONVERSION_DECLINE_OPERATION = 'decline';

// Sorting
export enum SORT_DIRECTION {
  ASC = 'ASC',
  DESC = 'DESC'
}
