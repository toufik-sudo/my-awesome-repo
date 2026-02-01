// -----------------------------------------------------------------------------
// Launch Constants
// Migrated from old_app/src/constants/wall/launch.ts
// -----------------------------------------------------------------------------

// Goal and program constants
export const GOAL_PRODUCTS_TO_DISPLAY = 10;
export const INITIAL_GOAL_INDEX = 1;
export const AUTO_CLOSE_PROGRAM_NOTICE = 5000;
export const BUDGET_POINTS_VALUE = 25;
export const POINT_VALUE = '0,04';

// Step names
export const PROGRAM = 'program';
export const USERS = 'users';
export const RESULTS = 'results';
export const PRODUCTS = 'products';
export const REWARDS = 'rewards';
export const REWARDS_FULL = 'rewardsFull';
export const DESIGN = 'design';
export const ECARD = 'eCard';
export const IA = 'IA';
export const CONTENTS = 'contents';
export const CUBE = 'cube';
export const PROGRAM_ID = 'programId';
export const PROGRAM_JOURNEY = 'programJourney';

// Program types
export const QUICK = 'quick';
export const FULL = 'full';
export const CHALLENGE = 'challenge';
export const LOYALTY = 'loyalty';
export const SPONSORSHIP = 'sponsorship';
export const FREEMIUM = 'freemium';
export const REFERRAL = 'referral';
export const STANDARD = 'standard';

// Confidentiality
export const PROGRAM_CONFIDENTIALITY_CLOSED = 'closed';
export const PROGRAM_CONFIDENTIALITY_OPEN = 'open';

// Launch routes
export const LAUNCH_BASE = '/launch';
export const LAUNCH_PROGRAM_FIRST = `${LAUNCH_BASE}/${PROGRAM}/1`;
export const LAUNCH_PROGRAM_SECOND = `${LAUNCH_BASE}/${PROGRAM}/2`;
export const LAUNCH_PROGRAM_THIRD = `${LAUNCH_BASE}/${PROGRAM}/3`;
export const LAUNCH_USER_FIRST = `${LAUNCH_BASE}/${USERS}/1`;
export const LAUNCH_USER_SECOND = `${LAUNCH_BASE}/${USERS}/2`;
export const LAUNCH_RESULTS_FIRST = `${LAUNCH_BASE}/${RESULTS}/1`;
export const LAUNCH_RESULTS_SECOND = `${LAUNCH_BASE}/${RESULTS}/2`;
export const LAUNCH_RESULTS_THIRD = `${LAUNCH_BASE}/${RESULTS}/3`;
export const LAUNCH_PRODUCTS_FIRST = `${LAUNCH_BASE}/${PRODUCTS}/1`;
export const LAUNCH_PRODUCTS_SECOND = `${LAUNCH_BASE}/${PRODUCTS}/2`;
export const LAUNCH_REWARDS_FIRST = `${LAUNCH_BASE}/${REWARDS}/1`;
export const LAUNCH_REWARDS_FULL_FIRST = `${LAUNCH_BASE}/${REWARDS_FULL}/1`;
export const LAUNCH_REWARDS_FULL_SECOND = `${LAUNCH_BASE}/${REWARDS_FULL}/2`;
export const LAUNCH_ECARD_FIRST = `${LAUNCH_BASE}/${ECARD}/1`;
export const LAUNCH_DESIGN_FIRST = `${LAUNCH_BASE}/${DESIGN}/1`;
export const LAUNCH_DESIGN_SECOND = `${LAUNCH_BASE}/${DESIGN}/2`;
export const LAUNCH_CONTENTS_FIRST = `${LAUNCH_BASE}/${CONTENTS}/1`;
export const LAUNCH_CONTENTS_SECOND = `${LAUNCH_BASE}/${CONTENTS}/2`;
export const LAUNCH_CONTENTS_THIRD = `${LAUNCH_BASE}/${CONTENTS}/3`;
export const LAUNCH_CONTENTS_FOUR = `${LAUNCH_BASE}/${CONTENTS}/4`;
export const LAUNCH_CONTENTS_FIVE = `${LAUNCH_BASE}/${CONTENTS}/5`;
export const LAUNCH_CONTENTS_SIX = `${LAUNCH_BASE}/${CONTENTS}/6`;
export const LAUNCH_IA_FIRST = `${LAUNCH_BASE}/${IA}/1`;

// Program type mappings
export const PROGRAM_TYPES = {
  [CHALLENGE]: 1,
  [LOYALTY]: 2,
  [SPONSORSHIP]: 3,
  [FREEMIUM]: 4
} as const;

export const PROGRAM_TYPES_NAMES = {
  1: CHALLENGE,
  2: LOYALTY,
  3: SPONSORSHIP,
  4: FREEMIUM
} as const;

export const PROGRAM_CREATION_TYPES = {
  [QUICK]: 1,
  [FULL]: 2
} as const;

// Currency
export const EUROS = '€';
export const DOLLARS = '$';

export const CURRENCY_SYMBOLS = {
  [EUROS]: 1,
  [DOLLARS]: 2
} as const;

// Launch form fields
export const LAUNCH_PROGRAM = 'launchProgram';
export const INVITED_USER_DATA = 'invitedUserData';
export const INVITED_USERS_FIELDS = 'invitedUsersFields';
export const ACCEPTED_EMAIL_INVITATIONS = 'acceptedEmailInvitation';
export const RESULTS_USERS_FIELDS = 'resultsUsersFields';
export const BACKGROUND_COVER = 'backgroundCover';
export const COMPANY_LOGO = 'companyLogo';
export const COMPANY_NAME = 'companyName';
export const COMPANY_AVATAR = 'companyAvatar';
export const COMPANY_COVER = 'companyCover';
export const FULL_PRODUCTS = 'fullProducts';
export const FULL_CATEGORIES_PRODUCTS = 'fullCategoriesProducts';
export const NEW_PRODUCT_NAME = 'newProductName';
export const PROGRAM_BUDGET = 'programBudget';
export const PROGRAM_PRODUCTS = 'productIds';
export const PROGRAM_CATEGORIES = 'categoryIds';
export const PERSONALISE_PRODUCTS = 'personaliseProducts';

// Results and validation
export const DECLARATION_FORM = 'declarationForm';
export const FILE_IMPORT = 'fileImport';
export const RESULTS_CHANNEL_FIELDS = [DECLARATION_FORM, FILE_IMPORT];
export const MANUAL_VALIDATION = 'manualValidation';
export const EMAIL_NOTIFY = 'emailNotify';
export const RESULTS_EMAIL_NOTIFY = 'resultsEmailNotify';
export const RESULTS_MANUAL_VALIDATION = 'resultsManualValidation';
export const USER_VALIDATION_FIELDS = [MANUAL_VALIDATION, EMAIL_NOTIFY];
export const RESULTS_VALIDATION_FIELDS = [RESULTS_MANUAL_VALIDATION, RESULTS_EMAIL_NOTIFY];
export const RESULTS_CHANNEL = 'resultChannel';
export const PROGRAM_TYPE = 'type';
export const CONFIDENTIALITY = 'confidentiality';
export const PROGRAM_NAME = 'programName';
export const PROGRAM_URL = 'url';
export const PROGRAM_EXTENDED_URL = 'extendUrl';
export const PROGRAM_DURATION = 'duration';
export const GLOBAL_ERROR = 'globalError';
export const SIMPLE_ALLOCATION = 'simpleAllocation';
export const CORRELATED_GOALS = 'correlatedGoals';
export const SOCIAL_NETWORKS = 'socialMediaAccounts';
export const ECARD_SELECTED_LIST = 'eCardSelectdList';
export const AI_SELECTED_LIST = 'iaCompany';

// Available steps
export const EXCLUDED_INTERMEDIARY_STEPS = [PRODUCTS, REWARDS];
export const QUICK_LAUNCH_AVAILABLE_STEPS = [PROGRAM, USERS, REWARDS, 'final'];
export const FULL_LAUNCH_AVAILABLE_STEPS = [PROGRAM, USERS, PRODUCTS, RESULTS, REWARDS_FULL, IA, ECARD, DESIGN, CONTENTS, 'final'];
export const FREEMIUM_FULL_LAUNCH_AVAILABLE_STEPS = [PROGRAM, USERS, IA, DESIGN, CONTENTS, 'final'];
export const FREEMIUM_MODIFY_LAUNCH_AVAILABLE_STEPS = [DESIGN, CONTENTS, 'final'];
export const FREEMIUM_QUICK_LAUNCH_AVAILABLE_STEPS = [PROGRAM, USERS, 'final'];
export const CHALLENGE_FULL_LAUNCH_AVAILABLE_STEPS = [PROGRAM, USERS, PRODUCTS, RESULTS, REWARDS_FULL, IA, ECARD, DESIGN, CONTENTS, 'final'];
export const CHALLENGE_MODIFY_LAUNCH_AVAILABLE_STEPS = [DESIGN, CONTENTS, 'final'];
export const CHALLENGE_QUICK_LAUNCH_AVAILABLE_STEPS = [PROGRAM, USERS, REWARDS, 'final'];

// File types
export const ACCEPTED_USERS_LIST_TYPE = ['.csv', '.xls', '.xlsx'];
export const USER_LIST_ACCEPTED_TYPE_LABELS = ['title', 'values'];

// Allocation types
export const INSTANT = 'instant';
export const VOLUME = 'volume';

// Cube sections
export const CUBE_SECTIONS = {
  SPECIFIC_PRODUCTS: 'specificProducts',
  MEASUREMENT_TYPE: 'measurementType',
  MEASUREMENT_NAME: 'measurementName',
  ALLOCATION_TYPE: 'allocationType',
  MAIN: 'main'
} as const;

export const MEASUREMENT_NAMES: Record<number, string> = {
  1: 'quantity',
  2: 'revenue',
  3: 'revenue'
};

// Launch types
export const LAUNCH_TYPES = {
  CONFIDENTIALITY: 'confidentiality',
  TYPE: 'type'
} as const;

// Launch step types configuration
export interface ILaunchStepConfig {
  name: string;
  steps: Array<{ index: number; name?: string }>;
  hideIndex?: boolean;
}

export const LAUNCH_STEP_TYPES: Record<string, ILaunchStepConfig> = {
  [PROGRAM]: {
    name: PROGRAM,
    steps: [{ index: 1 }, { index: 2 }, { index: 3 }]
  },
  [USERS]: {
    name: USERS,
    steps: [{ index: 1 }, { index: 2 }]
  },
  [RESULTS]: {
    name: RESULTS,
    steps: [{ index: 1 }, { index: 2 }, { index: 3 }]
  },
  [PRODUCTS]: {
    name: PRODUCTS,
    steps: [{ index: 1 }, { index: 2 }],
    hideIndex: true
  },
  [REWARDS]: {
    name: REWARDS,
    steps: [{ index: 1 }],
    hideIndex: true
  },
  [REWARDS_FULL]: {
    name: REWARDS_FULL,
    steps: [{ index: 1 }, { index: 2 }]
  },
  [DESIGN]: {
    name: DESIGN,
    steps: [{ index: 1 }, { index: 2 }]
  },
  [ECARD]: {
    name: ECARD,
    steps: [{ index: 1 }]
  },
  [IA]: {
    name: IA,
    steps: [{ index: 1 }]
  },
  [CONTENTS]: {
    name: CONTENTS,
    steps: [{ index: 1 }, { index: 2 }, { index: 3 }, { index: 4 }, { index: 5 }]
  }
};

// Base goal value
export const BASE_GOAL_VALUE = {
  measurementType: null,
  measurementName: null,
  allocationType: null,
  main: { min: '', max: '', value: '' },
  specificProducts: false,
  productIds: [],
  acceptedTypes: [],
  brackets: [],
  validated: {
    measurementType: false,
    allocationType: false,
    main: false
  }
};

export const INITIAL_BRACKET_VALUES = [] as const;

// WYSIWYG data field
export const WISYWIG_DATA_FIELD = 'wysiwigDataField';

// Cube allocation constants (migrated from old_app)
export const SIMPLE = 'simple';
export const BRACKET = 'bracket';
export const GROWTH = 'growth';
export const RANKING = 'ranking';
export const UNITS = 'units';
export const NEXT = 'next';
export const PREVIOUS = 'previous';
export const AVAILABLE = 'available';
export const DISABLED = 'disabled';
export const ALPHABETIC_LIMIT = 26;
export const MAXIMUM_GOALS_NUMBER = 3;

export const MEASUREMENT_TYPES = {
  QUANTITY: 1,
  VOLUME: 2,
  ACTION: 3
} as const;

export const MEASUREMENT_TYPE_LABELS = {
  quantity: 'QUANTITY',
  volume: 'VOLUME',
  units: 'UNITS'
} as const;

export const FREQUENCY_TYPE = {
  INSTANTANEOUSLY: 'instantaneously',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTER: 'quarter'
} as const;

export const FREQUENCY_TYPE_VALUES = {
  instantaneously: 1,
  weekly: 2,
  monthly: 3,
  quarter: 4
} as const;

export const TIME_DAY_CONSTRAINTS = {
  WEEK: 7,
  MONTH: 30
} as const;

export const TIME_MONTH_CONSTRAINTS = {
  QUARTER: 3
} as const;

export const TIME_DROPDOWN_OPTIONS = {
  YEAR: { VALUE: 'y', LABEL: 'year' },
  MONTH: { VALUE: 'm', LABEL: 'month' },
  WEEK: { VALUE: 'w', LABEL: 'week' }
} as const;

export const VALIDITY_MONTHS_COUNT = 11;
export const VALIDITY_WEEKS_COUNT = 3;

export const BRACKET_TYPE = {
  FROM: 'min',
  TO: 'max',
  EQUALS: 'value',
  STATUS: 'status'
} as const;

export const BASE_BRACKET_VALUE = {
  min: '',
  max: '',
  value: '',
  status: AVAILABLE,
  errors: { min: '', max: '', equals: '' }
} as const;

export const CUBE_ALLOCATION_CATEGORY = [SIMPLE, BRACKET, GROWTH, RANKING] as const;

export const ALLOCATION_MECHANISM_TYPE: Record<number, { type: string; category: string }> = {
  1: { type: VOLUME, category: SIMPLE },
  2: { type: UNITS, category: SIMPLE },
  3: { type: VOLUME, category: BRACKET },
  4: { type: UNITS, category: BRACKET },
  5: { type: VOLUME, category: GROWTH },
  6: { type: UNITS, category: GROWTH },
  7: { type: VOLUME, category: RANKING },
  8: { type: UNITS, category: RANKING }
};

export const ALLOCATION_TYPES: Record<string, Record<number, number>> = {
  [SIMPLE]: { 1: 2, 2: 1, 3: 2 },
  [BRACKET]: { 1: 4, 2: 3, 3: 4 },
  [GROWTH]: { 1: 6, 2: 5, 3: 6 },
  [RANKING]: { 1: 8, 2: 7, 3: 8 }
};

export const BRACKET_FORM_TYPE: Record<string, Record<string, string> | string> = {
  [CHALLENGE]: { quantity: 'units', volume: 'volume' },
  [LOYALTY]: { quantity: 'units', volume: 'volume' },
  [SPONSORSHIP]: 'referral'
};

export const BRACKET_INPUT_TYPE: Record<string, any> = {};
export const GROWTH_INPUT_TYPE: Record<string, any> = {};
export const RANKING_INPUT_TYPE: Record<string, any> = {};

export const ALLOCATION_WITHOUT_INSTANT = [3, 4, 5, 6, 7, 8];
export const BASE_FREQUENCY_TYPES = [FREQUENCY_TYPE.INSTANTANEOUSLY];

export const SIMPLIFIED_CUBE_TYPE = {
  MIN: 'min',
  MAX: 'max',
  VALUE: 'value'
} as const;

export const ALLOCATION_MAIN = 'main';
export const ALLOCATION_TYPE = 'allocationType';

export const PDF_ALLOCATION_FREQUENCIES: Record<string, string> = {
  1: 'instantaneously',
  2: 'weekly',
  3: 'monthly',
  4: 'quarterly',
  default: 'at the end of the program'
};

export const PDF_SPENDING_POINTS_FREQUENCIES: Record<string, string> = {
  1: 'immediately',
  2: 'at the end of the program',
  default: 'when allowed'
};

export const ALLOCATION_MECHANISMS_TRANSLATIONS: Record<string, Record<number | string, string>> = {
  volume: { 1: 'revenue', 2: 'revenue', 3: 'referrals', default: 'revenue' },
  units: { 1: 'sales quantity', 2: 'sales quantity', 3: 'referrals', default: 'quantity' },
  default: { default: 'performance' }
};
