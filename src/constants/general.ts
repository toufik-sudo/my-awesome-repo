export const BOOLEAN = 'boolean';
export const BUTTON = 'button';
export const PRIMARY = 'primary';
export const SECONDARY = 'secondary';
export const WALL_TYPE = 'wall';
export const NAME = 'name';
export const CROSS_ORIGIN_ANONYMOUS = 'anonymous';
export const CLOUD_REWARDS_LOGO_ALT = 'RewardzAi logo';
export const CLOUD_REWARDS_COMPANY_LOGO_ALT = 'Company logo';
export const CLOUD_REWARDS_URL = 'https://rewardzai.com';
export const CLOUD_REWARDS_URL_EU = 'https://rewardzai.com/';
export const MAX_AVATAR_FILE_SIZE = 8192000;
export const MAX_PRODUCT_FILE_SIZE = 8192000;
export const MAX_DESIGN_TITLE = 21;
export const MAX_DESIGN_TITLE_INPUT_CHAR_LENGTH = 22;
export const DEFAULT_INPUT_CHAR_LENGTH = 524288;
export const MAX_DESIGN_CONTENT = 256;
export const DOT_SEPARATOR = '.';
export const COMMA_SEPARATOR = ',';
export const START = 'start';
export const END = 'end';
export const METRICS_INTERVAL = 10000;
// eslint-disable-next-line no-undef
export const PUBLIC_URL = process.env.PUBLIC_URL;
export const CLOSED = 'closed';
export const ACCEPT = 'accept';
export const DECLINE = 'decline';
export const FULL = 'full';
export const LAUNCH = 'Launch';
export const QUICK = 'quick';
export const IMAGE = 'image';
export const BACKSPACE = 'Backspace';
export const DAYS = 'days';
export const MONTHS = 'months';
export const YEARS = 'years';
export const COMMUNICATION_FORMAT_DATE = 'DD/MM/YYYY';
export const CARD = 'card';

export const BEARER = 'Bearer ';
export const FREE_PLAN_LABEL = 'freemium';

export const TAILOR_SECTION_ID = 'tailorSection';
// Cookies
export const USER_DETAILS_COOKIE = 'userDetails';
export const USER_STEP_COOKIE = 'userStep';
export const USER_DATA_COOKIE = 'launchData';
export const AUTHORIZATION_TOKEN = 'Authorization';
export const ZONE_SELECTION = 'zoneSelection';
export const ZONE_EUROPE = 'Europe';
export const ZONE_US = 'US';
export const ZONE_US_URL = 'us.rewardzai.com';
export const UUID = 'uuid';
export const SELECTED_PLATFORM_COOKIE = 'platformSelected';
export const REGISTER_DATA_COOKIE = 'registerData';
export const CAN_REDIRECT_TO_EMAIL_ACTIVATION_PAGE = 'canRedirectToEmailActivation';

export const ALL_USER_COOKIES = [
  USER_DETAILS_COOKIE,
  USER_STEP_COOKIE,
  USER_DATA_COOKIE,
  AUTHORIZATION_TOKEN,
  UUID,
  SELECTED_PLATFORM_COOKIE
];
// Local storage
export const ONBOARDING_BENEFICIARY_COOKIE = 'onboardingBeneficiary';
export const INVITED_ADMIN_PLATFORM = 'invitedAdminPlatform';
export const USER_LOCAL_STORAGE_SLICES = [INVITED_ADMIN_PLATFORM];

//Colors
export const WHITE = '#fff';
export const BLACK = '#000';

//User types
export const ADMIN = 'admin';

export enum USER_COOKIE_FIELDS {
  PLATFORM_TYPE_ID = 'platformTypeId',
  STEP = 'step',
  UUID = 'uuid',
  PLATFORM_TYPE_LABEL = 'platformTypeLabel',
  PLATFORM_ID = 'platformId',
  INVITATIONS_ROLES = 'invitationsRoles'
}

export enum LOADER_TYPE {
  FULL = 'full',
  FULL_PAGE = 'fullPage',
  PAGE = 'page',
  INTERMEDIARY = 'intermediary',
  LOCAL = 'local',
  DROPZONE = 'dropzone',
  COMMUNICATION = 'communicationList',
  CATEGORY = 'category',
  PAYMENT = 'payment'
}

export enum PROGRAM_BTN_CLASS {
  DISABLED = 'disabled',
  PRIMARY = 'primary',
  SECONDARY = 'secondary'
}

export const BASE_64_DECODER = {
  NAME: ';base64,',
  START_POS: 5,
  END_POS: 8
};

export const RADIO_OPTIONS = [ACCEPT, DECLINE];

export const IMAGES_ALT = {
  LOGO: 'RewardzAi logo image',
  SERVICES: 'Services screen display',
  FEATURE: 'Feature image',
  AVATAR_IMAGE: 'Avatar image',
  NOT_FOUND_IMAGE: '404 Not found image',
  COVER_IMAGE: 'Cover image',
  CARD: 'Payment card',
  PHONE: 'Phone',
  GOOGLE_PLAY: 'Google play',
  APP_STORE: 'App store'
};

export const KEYCODES = {
  ENTER: 13
};

export const GENERAL_CHECKBOX_STATE = {
  ACTIVE: 'active',
  DISABLED: 'disabled'
};

export const WINDOW_SIZES = {
  DESKTOP_SMALL: 1279
};

export const NON_NUMERIC_VALUES = ['e', '-', '+'];
export const MAX_NUMBER_VALUE = 999999999999999999;
export const DECLINE_FIELD = 'decline';
export const ACCEPT_FIELD = 'accept';
export const MAX_WYSIWIG_LENGTH = 3000;
export const MAX_WYSIWIG_LENGTH_PUB = 80;

//Tags
export const HTML_TAGS = {
  H1: 'h1',
  H3: 'h3',
  H4: 'h4',
  P: 'p',
  DIV: 'div',
  TEXTAREA: 'textarea',
  SPAN: 'span',
  LABEL: 'label',
  ANCHOR: 'a',
  LI: 'li',
  STRONG: 'strong',
  TD: 'td',
  TR: 'tr'
};

export const DEBOUNCE_DELAY = 400;
export const PLATFORM_SELECTION_DELAY = 2000;

export const KEY_NAMES = {
  ENTER: 'Enter'
};

export const MP4_VIDEO_FORMAT = 'mp4';
export const VIDEO_TAG_SUPPORTED_FORMATS = [MP4_VIDEO_FORMAT, 'ogg', 'webm'];

export enum REDIRECT_DATA_TYPE {
  SHOW_POST = 'showPost',
  SHOW_CONFIDENTIALITY = 'showConfidentiality'
}

export const ONBOARDING_SHOW_LEFT_BLOCK_DELAY = 3000;
export const ONBOARDING_LOADING_DURATION = 2700;

export enum PLATFORM_STATUS {
  ACTIVE = 1,
  BLOCKED = 2,
  EXPIRED = 3
}

export const TYPES_OF_PROGRAMS = 'typesOfPrograms';
export const TOTAL_REVENUE_SUBSCRIPTIONS = 'totaRevenueOfSubscriptions';
export const TOTAL_EMAILS_SENT = 'totalEmailsSent';
export const TOTAL_SIZE_OF_DOCUMENTS = 'totalSizeOfDocuments';

export const GOOGLE_PLAY = 'https://play.google.com/store';
export const APP_STORE = 'https://www.apple.com/ios/app-store/';

export const DEFAULT_POINT_CONVERSION_STATUS_PENDING = 2;
export const DEFAULT_POINT_CONVERSION_STATUS_ERROR = 3;
export const DEFAULT_POINT_CONVERSION_STATUS_DONE = 4;
export const DEFAULT_MAX_SIZE_REQUEST = 100000;

export const WEBFORM_FR = {
  FREEMIUM: '1GalVZ3vv7YOsAz90mFir9as2tiaudjB7zWalD0qKahlvVjjsvIAQd1d5bq8KvYQ3',
  ACCESS: '2ZuH5KoIuDao5mwr6oo7eBwWouSzIQpVlyX6efeItzhZ5SPCNzV5QkuEo2p6A7FOH',
  BEST_SELLER: '31klsK9cC5F3xsV0WEWUQd0w8czLxykLeRAYBVYeYnUe0SsdaJ7O5Em2BIW2UVEAz',
  PREMIUM: '1r2Q6hfnXdjaCXmHIpDoHykjXHn7MKjcF6O1wjwRKqeVqG05nmSN0EY6CIwF5xQmD',
  INTERNATIONAL: '1rpKpd8twResj20O8avZVklcRkS2UbR6yA0v9d0D9CqnenutI1ZagiZYQkMiUtOuf'
};

export const WEBFORM_EN = {
  FREEMIUM: '1GbaXqigFdzRhYrpqpxZN1vKqufkzSeeoT2FqEz02Uz7DzXorvrXLTEBUEyJsS8i7',
  ACCESS: '1wAzKbcV4wzeylY2mOcT3RY9HXJ9IsHkqsZOVCvBzPPDwYv0mgzzaVbFXA6hc2Ao3',
  BEST_SELLER: '1ytJ4H4aBEuw0mHgRG2IQxp5068mWelFhhHDMEFggeg4AWnj1QG5FwE8ncT8OT5xV',
  PREMIUM: '1AD9SNBLmverzzUeXGhYOqYiLuoo0y39xF6mbdxkLy7otwrc5l1VdAxVrzipe6XVF',
  INTERNATIONAL: '1CanALfRAU7ohHbgkMEKKSKnsjKCfTsYKnt3zctFIGAiHAeR2kejGqTBqcvm11V6j'
};

export const WEBFORM_WHY_CHOOSE_US = '2VscaOAR9JUp5jYFLRn8j7Vdrgvhmcvv7Dikr0cXGqEbZWU2eDAH0ZzfQskrLQANl';
