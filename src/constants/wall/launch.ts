/* eslint-disable quotes */
import { faCompressArrowsAlt, faCube, faGripLines } from '@fortawesome/free-solid-svg-icons';
import {
  COMPLEX_NUMBER_REGEXP,
  DEPENDS_ON,
  REGEX,
  HIGHER_THAN,
  LOWER_THAN,
  NUMBER_REGEXP,
  REQUIRED,
  REWARDED_AMOUNT_REGEXP,
  TYPE
} from 'constants/validation';
import { REVENUE } from 'constants/wall/dashboard';
import { PRICE } from 'constants/landing';
import { type } from 'os';

export const GOAL_PRODUCTS_TO_DISPLAY = 10;
export const INITIAL_GOAL_INDEX = 1;
export const AUTO_CLOSE_PROGRAM_NOTICE = 5000;
export const BUDGET_POINTS_VALUE = 25;
export const POINT_VALUE = '0,04';
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
// const CONTENTS = 'contents';
const FINAL = 'final';
export const PROGRAM_JOURNEY = 'programJourney';
export const QUICK = 'quick';
export const FULL = 'full';
export const CHALLENGE = 'challenge';
export const LOYALTY = 'loyalty';
export const SPONSORSHIP = 'sponsorship';
export const FREEMIUM = 'freemium';
export const REFERRAL = 'referral';
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

export const PROGRAM_TYPES = {
  [CHALLENGE]: 1,
  [LOYALTY]: 2,
  [SPONSORSHIP]: 3,
  [FREEMIUM]: 4
};

export const PROGRAM_TYPES_NAMES = {
  1: CHALLENGE,
  2: LOYALTY,
  3: SPONSORSHIP,
  4: FREEMIUM
};

export const PROGRAM_CREATION_TYPES = {
  [QUICK]: 1,
  [FULL]: 2
};

export const DROPZONE_TITLE_TYPE = {
  TITLE: 'title',
  ERROR: 'error'
};

export const EUROS = '€';
export const DOLLARS = '$';

export const CURRENCY_SYMBOLS = {
  [EUROS]: 1,
  [DOLLARS]: 2
};
export const GENERAL_URL = 'http://rewardzai.com';

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
export const IDENTIFICATION_COVER_ID = 'identificationCoverId';
export const IDENTIFICATION_COVER = 'identificationCover';
export const IDENTIFICATION_TITLE = 'identificationTitle';
export const IDENTIFICATION_TEXT = 'identificationText';
export const DESIGN_TITLE = 'designTitle';
export const DESIGN_TEXT = 'designText';
export const CONTENTS_COVER = 'contentsCover';
export const CONTENTS_COVER_ID = 'contentsCoverId';
export const FULL_PRODUCTS = 'fullProducts';
export const FULL_CATEGORIES_PRODUCTS = 'fullCategoriesProducts';
export const NEW_PRODUCT_NAME = 'newProductName';
export const PROGRAM_BUDGET = 'programBudget';
export const PROGRAM_PRODUCTS = 'productIds';
export const PROGRAM_CATEGORIES = 'categoryIds';
export const PERSONALISE_PRODUCTS = 'personaliseProducts';
export const ACCEPTED_USERS_LIST_TYPE = ['.csv', '.xls', '.xlsx'];
export const USER_LIST_ACCEPTED_TYPE_LABELS = ['title', 'values'];
export const WISYWIG_DATA_FIELD = 'wysiwigDataField';
export const WISYWIG_DATA_FIELD1 = 'wysiwigDataField1';
export const WISYWIG_DATA_FIELD2 = 'wysiwigDataField2';
export const WISYWIG_DATA_FIELD3 = 'wysiwigDataField3';
export const WISYWIG_DATA_FIELD4 = 'wysiwigDataField4';
export const EXCLUDED_INTERMEDIARY_STEPS = [PRODUCTS, REWARDS];
export const QUICK_LAUNCH_AVAILABLE_STEPS = [PROGRAM, USERS, REWARDS, FINAL];
export const FULL_LAUNCH_AVAILABLE_STEPS = [PROGRAM, USERS, PRODUCTS, RESULTS, REWARDS_FULL, IA, ECARD, DESIGN, CONTENTS, FINAL];
export const FREEMIUM_FULL_LAUNCH_AVAILABLE_STEPS = [PROGRAM, USERS, IA, DESIGN, CONTENTS, FINAL];
export const FREEMIUM_MODIFY_LAUNCH_AVAILABLE_STEPS = [DESIGN, CONTENTS, FINAL];
export const FREEMIUM_QUICK_LAUNCH_AVAILABLE_STEPS = [PROGRAM, USERS, FINAL];

export const CHALLENGE_FULL_LAUNCH_AVAILABLE_STEPS = [PROGRAM, USERS, PRODUCTS, RESULTS, REWARDS_FULL, IA, ECARD, DESIGN, CONTENTS, FINAL];
export const CHALLENGE_MODIFY_LAUNCH_AVAILABLE_STEPS = [DESIGN, CONTENTS, FINAL];
export const CHALLENGE_QUICK_LAUNCH_AVAILABLE_STEPS = [PROGRAM, USERS, REWARDS, FINAL];
export const COMING_SOON_FIELD = 'comingSoon';
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
export const BANNER_TITLE = 'bannerTitle';
export const CONTENTS_TITLE = 'contentsTitle';
export const BANNER_TITLE1 = 'bannerTitle1';
export const CONTENTS_TITLE1 = 'contentsTitle1';
export const BANNER_TITLE2 = 'bannerTitle2';
export const CONTENTS_TITLE2 = 'contentsTitle2';
export const BANNER_TITLE3 = 'bannerTitle3';
export const CONTENTS_TITLE3 = 'contentsTitle3';
export const BANNER_TITLE4 = 'bannerTitle4';
export const CONTENTS_TITLE4 = 'contentsTitle4';
export const CORRELATED_GOALS = 'correlatedGoals';
export const SOCIAL_NETWORKS = 'socialMediaAccounts';
export const ECARD_SELECTED_LIST = 'eCardSelectdList';
export const AI_SELECTED_LIST = 'iaCompany';
export const PRODUCT_TOKEN = 'ProductToken';
export const BRAND_NAME = 'BrandName';
export const COUNTRY = 'Country';
export const COUNTRY_CODE = 'CountryCode';
export const DISCOUNT = 'Discount';
export const DENOMINATIONS = 'Denominations';
export const CURRENCY = 'Currency';
export const REAL_TIME_STOCK = 'RealTimeStock';
export const CATEGORIES = 'Categories';
export const LANGUAGE_CODE = 'LanguageCode';
export const BRAND_DESCRIPTION = 'BrandDescription';
export const REDEMPTION_INSTRUCTIONS = 'RedemptionInstructions';
export const LOGO_FILE = 'LogoFile';
export const ECARD_ID = 'ecardId';

const LAUNCH_REQUIREMENTS_BASE = [PROGRAM_TYPE, PROGRAM_JOURNEY];
const LAUNCH_REQUIREMENTS_PROGRAM = [...LAUNCH_REQUIREMENTS_BASE, CONFIDENTIALITY];
const LAUNCH_REQUIREMENTS_USERS_BASE = [
  ...LAUNCH_REQUIREMENTS_PROGRAM,
  PROGRAM_NAME,
  PROGRAM_URL,
  PROGRAM_EXTENDED_URL
];
const LAUNCH_REQUIREMENTS_USERS_UPLOAD = [
  ...LAUNCH_REQUIREMENTS_USERS_BASE,
  ACCEPTED_EMAIL_INVITATIONS,
  INVITED_USERS_FIELDS
];
const LAUNCH_REQUIREMENTS_PRODUCTS_BASE = [...LAUNCH_REQUIREMENTS_USERS_BASE, ACCEPTED_EMAIL_INVITATIONS];
const LAUNCH_REQUIREMENTS_RESULTS_BASE = [...LAUNCH_REQUIREMENTS_PRODUCTS_BASE, PERSONALISE_PRODUCTS, RESULTS_CHANNEL];
const LAUNCH_REQUIREMENTS_USERS_VALIDATION = [...LAUNCH_REQUIREMENTS_USERS_UPLOAD, INVITED_USER_DATA];
const LAUNCH_REQUIREMENTS_RESULTS_VALIDATION = [...LAUNCH_REQUIREMENTS_USERS_BASE];
const LAUNCH_REQUIREMENTS_REWARDS_CUBE = [...LAUNCH_REQUIREMENTS_RESULTS_VALIDATION, CUBE];
const LAUNCH_REQUIREMENTS_REWARDS_GOALS = [...LAUNCH_REQUIREMENTS_REWARDS_CUBE, CORRELATED_GOALS];
const LAUNCH_REQUIREMENTS_DESIGN_BASE = [...LAUNCH_REQUIREMENTS_REWARDS_CUBE];
const LAUNCH_REQUIREMENTS_ECARD = [...LAUNCH_REQUIREMENTS_REWARDS_CUBE,
  ECARD_SELECTED_LIST,
];
const LAUNCH_REQUIREMENTS_IA = [...LAUNCH_REQUIREMENTS_ECARD];
const LAUNCH_REQUIREMENTS_DESIGN_INTERMEDIARY = [...LAUNCH_REQUIREMENTS_REWARDS_CUBE, COMPANY_LOGO, COMPANY_NAME];
const LAUNCH_REQUIREMENTS_CONTENTS_BASE = [
  ...LAUNCH_REQUIREMENTS_DESIGN_INTERMEDIARY,
  IDENTIFICATION_COVER,
  IDENTIFICATION_COVER_ID,
  IDENTIFICATION_TITLE
];
const LAUNCH_REQUIREMENTS_CONTENTS_BASE1 = [
  ...LAUNCH_REQUIREMENTS_CONTENTS_BASE,
  WISYWIG_DATA_FIELD,
  CONTENTS_TITLE,
  BANNER_TITLE
];
const LAUNCH_REQUIREMENTS_CONTENTS_BASE2 = [
  ...LAUNCH_REQUIREMENTS_CONTENTS_BASE1,
  WISYWIG_DATA_FIELD1,
  CONTENTS_TITLE1,
  BANNER_TITLE1
];
const LAUNCH_REQUIREMENTS_CONTENTS_BASE3 = [
  ...LAUNCH_REQUIREMENTS_CONTENTS_BASE2,
  WISYWIG_DATA_FIELD2,
  CONTENTS_TITLE2,
  BANNER_TITLE2
];
const LAUNCH_REQUIREMENTS_CONTENTS_BASE4 = [
  ...LAUNCH_REQUIREMENTS_CONTENTS_BASE3,
  WISYWIG_DATA_FIELD3,
  CONTENTS_TITLE3,
  BANNER_TITLE3
];
const LAUNCH_REQUIREMENTS_CONTENTS_SOCIAL_NETWORKS = [
  ...LAUNCH_REQUIREMENTS_CONTENTS_BASE
];
const LAUNCH_REQUIREMENTS_FINAL_QUICK = [
  ...LAUNCH_REQUIREMENTS_USERS_BASE,
  ACCEPTED_EMAIL_INVITATIONS,
  INVITED_USERS_FIELDS,
  SIMPLE_ALLOCATION
];
const LAUNCH_REQUIREMENTS_FINAL_FULL = [...LAUNCH_REQUIREMENTS_CONTENTS_SOCIAL_NETWORKS, SOCIAL_NETWORKS];
export enum LAUNCH_STEP_COMPONENTS {
  LAUNCH_PROGRAM_TYPE,
  LAUNCH_PROGRAM_CONFIDENTIALITY,
  LAUNCH_PROGRAM_PARAMETERS,
  PARTICIPANTS_INVITATION,
  LAUNCH_PROGRAM_USERS_UPLOAD_TEMPLATE,
  USER_VALIDATION_SECTION,
  PRODUCTS_INTERMEDIARY_PAGE,
  PRODUCTS_PAGE,
  RESULTS_PAGE,
  RESULTS_REQUIRED_INFORMATION,
  RESULTS_VALIDATION,
  REWARDS_INTERMEDIARY_PAGE,
  GOAL_OPTIONS_PAGE,
  GOAL_OPTIONS_PAGE_PREVIEW,
  REWARDS_GOAL_RELATIONS_PAGE,
  FULL_CUBE_PAGE,
  CUBE_OPTIONS_PAGE,
  ECARD_PAGE,
  AI_PAGE,
  DESIGN_PAGE,
  DESIGN_IDENTIFICATION_PAGE,
  CONTENTS_PAGE,
  SOCIAL_NETWORKS_PAGE,
  FINAL_STEP_PAGE,
}

export const LAUNCH_STEP_TYPES = {
  [PROGRAM]: {
    name: PROGRAM,
    steps: [
      { component: LAUNCH_STEP_COMPONENTS.LAUNCH_PROGRAM_TYPE, index: 1 },
      {
        component: LAUNCH_STEP_COMPONENTS.LAUNCH_PROGRAM_CONFIDENTIALITY,
        index: 2,
        [QUICK]: {
          requirements: LAUNCH_REQUIREMENTS_BASE,
          redirectTo: LAUNCH_PROGRAM_FIRST
        },
        [FULL]: {
          requirements: LAUNCH_REQUIREMENTS_BASE,

          redirectTo: LAUNCH_PROGRAM_FIRST
        }
      },
      {
        component: LAUNCH_STEP_COMPONENTS.LAUNCH_PROGRAM_PARAMETERS,
        index: 3,
        [QUICK]: {
          requirements: LAUNCH_REQUIREMENTS_PROGRAM,
          redirectTo: LAUNCH_PROGRAM_SECOND
        },
        [FULL]: {
          requirements: LAUNCH_REQUIREMENTS_PROGRAM,
          redirectTo: LAUNCH_PROGRAM_SECOND
        }
      }
    ]
  },
  [USERS]: {
    name: USERS,
    steps: [
      {
        component: LAUNCH_STEP_COMPONENTS.PARTICIPANTS_INVITATION,
        index: 1,
        [QUICK]: {
          requirements: LAUNCH_REQUIREMENTS_USERS_BASE,
          redirectTo: LAUNCH_PROGRAM_THIRD
        },
        [FULL]: {
          requirements: LAUNCH_REQUIREMENTS_USERS_BASE,
          redirectTo: LAUNCH_PROGRAM_THIRD
        }
      },
      {
        component: LAUNCH_STEP_COMPONENTS.LAUNCH_PROGRAM_USERS_UPLOAD_TEMPLATE,
        index: 2,
        [QUICK]: {
          requirements: LAUNCH_REQUIREMENTS_USERS_UPLOAD,
          redirectTo: LAUNCH_USER_FIRST
        },
        [FULL]: {
          requirements: LAUNCH_REQUIREMENTS_USERS_UPLOAD,
          redirectTo: LAUNCH_USER_FIRST
        }
      },
      {
        component: LAUNCH_STEP_COMPONENTS.USER_VALIDATION_SECTION,
        index: 3,
        [QUICK]: {
          requirements: LAUNCH_REQUIREMENTS_USERS_VALIDATION,
          redirectTo: LAUNCH_USER_SECOND
        },
        [FULL]: {
          requirements: LAUNCH_REQUIREMENTS_USERS_VALIDATION,
          redirectTo: LAUNCH_USER_SECOND
        }
      }
    ]
  },
  [PRODUCTS]: {
    name: PRODUCTS,
    steps: [
      {
        component: LAUNCH_STEP_COMPONENTS.PRODUCTS_INTERMEDIARY_PAGE,
        index: 1,
        [FULL]: {
          requirements: LAUNCH_REQUIREMENTS_PRODUCTS_BASE,
          redirectTo: LAUNCH_USER_FIRST,
          alternateRequirements: {
            [ACCEPTED_EMAIL_INVITATIONS]: INVITED_USER_DATA
          },
          alternateRedirect: LAUNCH_USER_SECOND
        }
      },
      {
        component: LAUNCH_STEP_COMPONENTS.PRODUCTS_PAGE,
        index: 2,
        [FULL]: {
          requirements: LAUNCH_REQUIREMENTS_PRODUCTS_BASE,
          redirectTo: LAUNCH_USER_FIRST,
          alternateRequirements: {
            [ACCEPTED_EMAIL_INVITATIONS]: INVITED_USER_DATA
          },
          alternateRedirect: LAUNCH_USER_SECOND
        }
      }
    ]
  },
  [RESULTS]: {
    name: RESULTS,
    steps: [
      {
        component: LAUNCH_STEP_COMPONENTS.RESULTS_PAGE,
        index: 1,
        [FULL]: {
          requirements: LAUNCH_REQUIREMENTS_RESULTS_BASE,
          redirectTo: LAUNCH_PRODUCTS_FIRST,
          alternateRequirements: {
            [PERSONALISE_PRODUCTS]: PROGRAM_PRODUCTS
          },
          alternateRedirect: LAUNCH_PRODUCTS_SECOND
        }
      },
      {
        component: LAUNCH_STEP_COMPONENTS.RESULTS_REQUIRED_INFORMATION,
        index: 2,
        [FULL]: {
          requirements: LAUNCH_REQUIREMENTS_RESULTS_BASE,
          redirectTo: LAUNCH_RESULTS_FIRST,
          alternateRequirements: {
            [PERSONALISE_PRODUCTS]: PROGRAM_PRODUCTS
          },
          alternateRedirect: LAUNCH_PRODUCTS_SECOND
        }
      },
      {
        component: LAUNCH_STEP_COMPONENTS.RESULTS_VALIDATION,
        index: 3,
        [FULL]: {
          requirements: LAUNCH_REQUIREMENTS_RESULTS_VALIDATION,
          redirectTo: LAUNCH_RESULTS_SECOND
        }
      }
    ]
  },
  [REWARDS]: {
    name: REWARDS,
    steps: [
      { component: LAUNCH_STEP_COMPONENTS.REWARDS_INTERMEDIARY_PAGE, index: null },
      {
        component: LAUNCH_STEP_COMPONENTS.GOAL_OPTIONS_PAGE,
        index: 1,
        [QUICK]: {
          requirements: LAUNCH_REQUIREMENTS_USERS_UPLOAD,
          redirectTo: LAUNCH_USER_FIRST
        }
      }
    ],
    except: FULL
  },
  [REWARDS_FULL]: {
    name: REWARDS_FULL,
    steps: [
      {
        component: LAUNCH_STEP_COMPONENTS.REWARDS_INTERMEDIARY_PAGE,
        index: 1,
        [FULL]: {
          requirements: LAUNCH_REQUIREMENTS_RESULTS_VALIDATION,
          redirectTo: LAUNCH_RESULTS_THIRD
        }
      },
      {
        component: LAUNCH_STEP_COMPONENTS.REWARDS_GOAL_RELATIONS_PAGE,
        index: 2,
        [FULL]: {
          requirements: LAUNCH_REQUIREMENTS_RESULTS_VALIDATION,
          redirectTo: LAUNCH_REWARDS_FULL_FIRST
        }
      },
      {
        component: LAUNCH_STEP_COMPONENTS.FULL_CUBE_PAGE,
        index: 3,
        [QUICK]: {
          requirements: LAUNCH_REQUIREMENTS_REWARDS_CUBE,
          redirectTo: LAUNCH_REWARDS_FIRST
        },
        [FULL]: {
          requirements: LAUNCH_REQUIREMENTS_REWARDS_GOALS,
          redirectTo: LAUNCH_REWARDS_FULL_SECOND
        }
      },
      {
        component: LAUNCH_STEP_COMPONENTS.CUBE_OPTIONS_PAGE,
        index: 4,
        [QUICK]: {
          requirements: LAUNCH_REQUIREMENTS_REWARDS_CUBE,
          redirectTo: LAUNCH_REWARDS_FIRST
        },
        [FULL]: {
          requirements: LAUNCH_REQUIREMENTS_REWARDS_GOALS,
          redirectTo: LAUNCH_REWARDS_FULL_SECOND
        }
      },
      {
        component: LAUNCH_STEP_COMPONENTS.GOAL_OPTIONS_PAGE_PREVIEW,
        index: 5,
        [QUICK]: {
          requirements: LAUNCH_REQUIREMENTS_REWARDS_CUBE,
          redirectTo: LAUNCH_REWARDS_FIRST
        },
        [FULL]: {
          requirements: LAUNCH_REQUIREMENTS_REWARDS_GOALS,
          redirectTo: LAUNCH_REWARDS_FULL_SECOND
        }
      }
    ],
    except: QUICK
  },
  [ECARD]: {
    name: ECARD,
    steps: [
      {
        component: LAUNCH_STEP_COMPONENTS.ECARD_PAGE,
        index: 1,
        [FULL]: {
          requirements: LAUNCH_REQUIREMENTS_REWARDS_GOALS,
          redirectTo: LAUNCH_REWARDS_FULL_SECOND
        }
      }
    ]
  },
  [IA]: {
    name: IA,
    steps: [
      {
        component: LAUNCH_STEP_COMPONENTS.AI_PAGE,
        index: 1,
        [FULL]: {
          requirements: LAUNCH_REQUIREMENTS_ECARD,
          redirectTo: LAUNCH_IA_FIRST
        }
      }
    ]
  },
  [DESIGN]: {
    name: DESIGN,
    steps: [
      {
        component: LAUNCH_STEP_COMPONENTS.DESIGN_PAGE,
        index: 1,
        [FULL]: {
          requirements: LAUNCH_REQUIREMENTS_IA,
          redirectTo: LAUNCH_IA_FIRST
        }
      },
      {
        component: LAUNCH_STEP_COMPONENTS.DESIGN_IDENTIFICATION_PAGE,
        index: 2,
        [FULL]: {
          requirements: LAUNCH_REQUIREMENTS_DESIGN_INTERMEDIARY,
          redirectTo: LAUNCH_DESIGN_FIRST
        }
      }
    ]
  },
  [CONTENTS]: {
    name: CONTENTS,
    steps: [
      {
        component: LAUNCH_STEP_COMPONENTS.CONTENTS_PAGE,
        index: 1,
        [FULL]: {
          requirements: LAUNCH_REQUIREMENTS_CONTENTS_BASE,
          redirectTo: LAUNCH_DESIGN_SECOND
        }
      },
      {
        component: LAUNCH_STEP_COMPONENTS.CONTENTS_PAGE,
        index: 2,
        [FULL]: {
          requirements: [LAUNCH_REQUIREMENTS_CONTENTS_BASE1, {
            [PROGRAM_TYPE]: FREEMIUM
          }],
          redirectTo: LAUNCH_CONTENTS_FIRST,
          alternateRequirements: {
            [PROGRAM_TYPE]: FREEMIUM
          },
          alternateRedirect: LAUNCH_CONTENTS_SIX
        }
      },
      {
        component: LAUNCH_STEP_COMPONENTS.CONTENTS_PAGE,
        index: 3,
        [FULL]: {
          requirements: [LAUNCH_REQUIREMENTS_CONTENTS_BASE2, {
            [PROGRAM_TYPE]: FREEMIUM
          }],
          redirectTo: LAUNCH_CONTENTS_SECOND,
          alternateRequirements: {
            [PROGRAM_TYPE]: FREEMIUM
          },
          alternateRedirect: LAUNCH_CONTENTS_SIX
        }
      },
      {
        component: LAUNCH_STEP_COMPONENTS.CONTENTS_PAGE,
        index: 4,
        [FULL]: {
          requirements: [LAUNCH_REQUIREMENTS_CONTENTS_BASE3, {
            [PROGRAM_TYPE]: FREEMIUM
          }],
          redirectTo: LAUNCH_CONTENTS_THIRD,
          alternateRequirements: {
            [PROGRAM_TYPE]: FREEMIUM
          },
          alternateRedirect: LAUNCH_CONTENTS_SIX
        }
      },
      {
        component: LAUNCH_STEP_COMPONENTS.CONTENTS_PAGE,
        index: 5,
        [FULL]: {
          requirements: [LAUNCH_REQUIREMENTS_CONTENTS_BASE4, {
            [PROGRAM_TYPE]: FREEMIUM
          }],
          redirectTo: LAUNCH_CONTENTS_FOUR,
          alternateRequirements: {
            [PROGRAM_TYPE]: FREEMIUM
          },
          alternateRedirect: LAUNCH_CONTENTS_SIX
        }
      },
      {
        component: LAUNCH_STEP_COMPONENTS.SOCIAL_NETWORKS_PAGE,
        index: 6,
        [FULL]: {
          requirements: LAUNCH_REQUIREMENTS_CONTENTS_SOCIAL_NETWORKS,
          redirectTo: LAUNCH_CONTENTS_FIRST
        }
      }
    ]
  },
  [FINAL]: {
    name: FINAL,
    steps: [
      {
        component: LAUNCH_STEP_COMPONENTS.FINAL_STEP_PAGE,
        index: 1,
        [QUICK]: {
          requirements: LAUNCH_REQUIREMENTS_FINAL_QUICK,
          redirectTo: LAUNCH_REWARDS_FIRST
        },
        [FULL]: {
          requirements: LAUNCH_REQUIREMENTS_FINAL_FULL,
          redirectTo: LAUNCH_CONTENTS_FIRST
        }
      }
    ]
  }
};

export const LAUNCH_TYPES = {
  TYPE: PROGRAM_TYPE,
  CONFIDENTIALITY: CONFIDENTIALITY
};

// PRODUCTS
export const PRODUCTS_TABS_CATEGORIES = ['createNewProduct', 'addExistingProduct', 'createCategory', 'addCategory'];
export const PRODUCTS_INFO_LABELS = ['acceptedFormats', 'maxSize', 'optimalResolution'];
export const PRODUCT_IMAGE_UPLOAD = 'image-upload';
export const PRODUCTS_INITIAL_ITEMS = 20;
export const PRODUCTS_CTA_TYPE = {
  CREATE: 'create',
  SHOW_MORE: 'showMore',
  REMOVE: 'removeCTA',
  ADD: 'addCTA'
};

export const PRODUCTS_TABS_STEPS = {
  CREATE_NEW_PRODUCT: 0,
  ADD_EXISTING_PRODUCT: 1
};

export const NETWORK_ERROR = {
  code: 413,
  message: 'Network Error'
};

export const OPTIMAL_RESOLUTION = {
  AVATAR: 'W 290 x H 66px',
  COVER: 'W 1920 x H 1080px',
  CONTENT_COVER: 'W 1024 x H 243'
};

export const CUBE_SECTIONS = {
  SPECIFIC_PRODUCTS: 'specificProducts',
  MEASUREMENT_TYPE: 'measurementType',
  MEASUREMENT_NAME: 'measurementName',
  ALLOCATION_TYPE: 'allocationType',
  MAIN: 'main',
  BRACKETS: 'brackets',
  STARS: 'stars'
};

export const VOLUME = 'volume';
export const QUANTITY = 'quantity';
export const ACTION = 'action';
export const UNITS = 'units';

export const MEASUREMENT_TYPES = {
  VOLUME: 1,
  QUANTITY: 2,
  ACTION: 3
};
export const MEASUREMENT_NAMES = {
  1: VOLUME,
  2: QUANTITY,
  3: ACTION
};

export const MEASUREMENT_TYPE_LABELS = {
  [VOLUME]: VOLUME,
  [UNITS]: QUANTITY,
  [ACTION]: VOLUME
};

//Rewards
export const INDEPENDENT = 'independent';
export const CORRELATED = 'correlated';
export const COMING = 'coming';
export const SIMPLE = 'simple';
export const BRACKET = 'bracket';
export const GROWTH = 'growth';
export const RANKING = 'ranking';
export const ALLOCATION_TYPE = 'allocationType';
export const ALLOCATION_MAIN = 'main';
export const PERCENTAGE = 'percentage';
export const UNIT = 'unit';
export const EURO = 'euro';
export const SALES = 'sales';
export const DISABLED = 'disabled';
export const AVAILABLE = 'available';
export const PREVIOUS = 'previous';
export const NEXT = 'next';
export const ALPHABETIC_LIMIT = 26;
export const INSTANT = 'Instant';
export const MAXIMUM_GOALS_NUMBER = 3;

export const LAUNCH_REWARD_BLOCKS = [
  { icon: faGripLines, id: INDEPENDENT, button: true },
  { icon: faCompressArrowsAlt, id: CORRELATED, button: true },
  { icon: faCube, id: COMING, button: false }
];
export const CUBE_ALLOCATION_CATEGORY = [SIMPLE, BRACKET, GROWTH, RANKING];
export const ALLOCATION_TYPES = {
  [SIMPLE]: {
    [MEASUREMENT_TYPES.VOLUME]: 1,
    [MEASUREMENT_TYPES.QUANTITY]: 2
  },
  [BRACKET]: {
    [MEASUREMENT_TYPES.VOLUME]: 3,
    [MEASUREMENT_TYPES.QUANTITY]: 4
  },
  [GROWTH]: {
    [MEASUREMENT_TYPES.VOLUME]: 5,
    [MEASUREMENT_TYPES.QUANTITY]: 5
  },
  [RANKING]: {
    [MEASUREMENT_TYPES.VOLUME]: 6,
    [MEASUREMENT_TYPES.QUANTITY]: 6
  }
};

export const ALLOCATION_WITHOUT_INSTANT = [5, 6];

/**
 * Inverse mapping of allocation types: id -> category & measurement type
 */
export const ALLOCATION_MECHANISM_TYPE = Object.keys(ALLOCATION_TYPES).reduce((acc, key) => {
  const allocationType = ALLOCATION_TYPES[key];
  if (key === GROWTH || key === RANKING) {
    acc[allocationType[MEASUREMENT_TYPES.VOLUME]] = {
      type: key,
      category: key
    };
  } else {
    Object.keys(allocationType).forEach(
      subKey =>
      (acc[allocationType[subKey]] = {
        type: Object.keys(MEASUREMENT_TYPES).find(key => MEASUREMENT_TYPES[key] === parseInt(subKey)),
        category: key
      })
    );
  }

  return acc;
}, {});

export const SIMPLIFIED_CUBE_TYPE = {
  MIN: 'min',
  MAX: 'max',
  VALUE: 'value'
};

export const BRACKET_TYPE = {
  FROM: 'min',
  TO: 'max',
  EQUALS: 'value',
  LABEL: 'label',
  STATUS: 'status'
};

export const BRACKET_FORM_TYPE = {
  [CHALLENGE]: {
    [QUANTITY]: UNITS,
    [VOLUME]: PERCENTAGE,
    [ACTION]: PERCENTAGE
  },
  [LOYALTY]: {
    [QUANTITY]: UNITS,
    [VOLUME]: PERCENTAGE
  },
  [SPONSORSHIP]: UNITS
};

export const FROM_VALIDATIONS = {
  [REGEX]: COMPLEX_NUMBER_REGEXP,
  [LOWER_THAN]: BRACKET_TYPE.TO,
  [REQUIRED]: {
    only: BRACKET_TYPE.FROM
  },
  [HIGHER_THAN]: {
    type: PREVIOUS,
    target: BRACKET_TYPE.TO
  },
  [DEPENDS_ON]: {
    type: PREVIOUS,
    target: BRACKET_TYPE.TO
  }
};

export const TO_VALIDATIONS = {
  [REGEX]: COMPLEX_NUMBER_REGEXP,
  [HIGHER_THAN]: BRACKET_TYPE.FROM,
  [REQUIRED]: {
    only: BRACKET_TYPE.TO
  },
  [LOWER_THAN]: {
    type: NEXT,
    target: BRACKET_TYPE.FROM
  }
};

export const PERCENTAGE_VALIDATION = {
  [REQUIRED]: true
};

export const PERCENTAGE_EQUALS_VALIDATION = {
  ...PERCENTAGE_VALIDATION,
  [REGEX]: REWARDED_AMOUNT_REGEXP
};

export const EURO_EQUALS_VALIDATION = {
  ...PERCENTAGE_VALIDATION,
  [REGEX]: COMPLEX_NUMBER_REGEXP
};

export const GROWTH_PERCENTAGE_FROM = {
  [REGEX]: REWARDED_AMOUNT_REGEXP,
  [LOWER_THAN]: BRACKET_TYPE.TO,
  [REQUIRED]: {
    only: BRACKET_TYPE.FROM
  },
  [HIGHER_THAN]: {
    type: PREVIOUS,
    target: BRACKET_TYPE.TO
  },
  [DEPENDS_ON]: {
    type: PREVIOUS,
    target: BRACKET_TYPE.TO
  }
};

export const GROWTH_PERCENTAGE_TO = {
  [REGEX]: REWARDED_AMOUNT_REGEXP,
  [HIGHER_THAN]: BRACKET_TYPE.FROM,
  [REQUIRED]: {
    only: BRACKET_TYPE.TO
  },
  [LOWER_THAN]: {
    type: NEXT,
    target: BRACKET_TYPE.FROM
  }
};

export const EQUALS_EURO_VALIDATIONS = {
  [REGEX]: COMPLEX_NUMBER_REGEXP,
  [REQUIRED]: true
};

export const BRACKET_INPUT_TYPE = {
  [CHALLENGE]: {
    [PERCENTAGE]: {
      [BRACKET_TYPE.FROM]: { value: EURO, validations: FROM_VALIDATIONS },
      [BRACKET_TYPE.TO]: { value: EURO, validations: TO_VALIDATIONS },
      [BRACKET_TYPE.EQUALS]: { value: PERCENTAGE, validations: PERCENTAGE_EQUALS_VALIDATION }
    },
    [UNITS]: {
      [BRACKET_TYPE.FROM]: { value: SALES, validations: { ...FROM_VALIDATIONS, [REGEX]: NUMBER_REGEXP } },
      [BRACKET_TYPE.TO]: { value: SALES, validations: { ...TO_VALIDATIONS, [REGEX]: NUMBER_REGEXP } },
      [BRACKET_TYPE.EQUALS]: { value: EURO, validations: EURO_EQUALS_VALIDATION }
    }
  },
  [LOYALTY]: {
    [PERCENTAGE]: {
      [BRACKET_TYPE.FROM]: { value: EURO, validations: FROM_VALIDATIONS },
      [BRACKET_TYPE.TO]: { value: EURO, validations: TO_VALIDATIONS },
      [BRACKET_TYPE.EQUALS]: { value: PERCENTAGE, validations: PERCENTAGE_EQUALS_VALIDATION }
    },
    [UNITS]: {
      [BRACKET_TYPE.FROM]: { value: UNITS, validations: { ...FROM_VALIDATIONS, [REGEX]: NUMBER_REGEXP } },
      [BRACKET_TYPE.TO]: { value: UNITS, validations: { ...TO_VALIDATIONS, [REGEX]: NUMBER_REGEXP } },
      [BRACKET_TYPE.EQUALS]: { value: EURO, validations: EURO_EQUALS_VALIDATION }
    }
  },
  [SPONSORSHIP]: {
    [BRACKET_TYPE.FROM]: { value: SPONSORSHIP, validations: { ...FROM_VALIDATIONS, [REGEX]: NUMBER_REGEXP } },
    [BRACKET_TYPE.TO]: { value: SPONSORSHIP, validations: { ...TO_VALIDATIONS, [REGEX]: NUMBER_REGEXP } },
    [BRACKET_TYPE.EQUALS]: { value: EURO, validations: EURO_EQUALS_VALIDATION }
  }
};

export const GROWTH_INPUT_TYPE = {
  [CHALLENGE]: {
    [PERCENTAGE]: {
      [BRACKET_TYPE.FROM]: { value: PERCENTAGE, validations: GROWTH_PERCENTAGE_FROM },
      [BRACKET_TYPE.TO]: { value: PERCENTAGE, validations: GROWTH_PERCENTAGE_TO },
      [BRACKET_TYPE.EQUALS]: { value: EURO, validations: EQUALS_EURO_VALIDATIONS }
    },
    [UNITS]: {
      [BRACKET_TYPE.FROM]: { value: PERCENTAGE, validations: GROWTH_PERCENTAGE_FROM },
      [BRACKET_TYPE.TO]: { value: PERCENTAGE, validations: GROWTH_PERCENTAGE_TO },
      [BRACKET_TYPE.EQUALS]: { value: EURO, validations: EQUALS_EURO_VALIDATIONS }
    }
  },
  [LOYALTY]: {
    [PERCENTAGE]: {
      [BRACKET_TYPE.FROM]: { value: PERCENTAGE, validations: GROWTH_PERCENTAGE_FROM },
      [BRACKET_TYPE.TO]: { value: PERCENTAGE, validations: GROWTH_PERCENTAGE_TO },
      [BRACKET_TYPE.EQUALS]: { value: EURO, validations: EQUALS_EURO_VALIDATIONS }
    },
    [UNITS]: {
      [BRACKET_TYPE.FROM]: { value: PERCENTAGE, validations: GROWTH_PERCENTAGE_FROM },
      [BRACKET_TYPE.TO]: { value: PERCENTAGE, validations: GROWTH_PERCENTAGE_TO },
      [BRACKET_TYPE.EQUALS]: { value: EURO, validations: EQUALS_EURO_VALIDATIONS }
    }
  },
  [SPONSORSHIP]: {
    [BRACKET_TYPE.FROM]: { value: PERCENTAGE, validations: GROWTH_PERCENTAGE_FROM },
    [BRACKET_TYPE.TO]: { value: PERCENTAGE, validations: GROWTH_PERCENTAGE_TO },
    [BRACKET_TYPE.EQUALS]: { value: EURO, validations: EQUALS_EURO_VALIDATIONS }
  }
};

export const RANKING_INPUT_TYPE = {
  [CHALLENGE]: {
    [PERCENTAGE]: {
      [BRACKET_TYPE.FROM]: { value: '', validations: { ...FROM_VALIDATIONS, [REGEX]: NUMBER_REGEXP } },
      [BRACKET_TYPE.TO]: { value: '', validations: { ...TO_VALIDATIONS, [REGEX]: NUMBER_REGEXP } },
      [BRACKET_TYPE.EQUALS]: { value: EURO, validations: EQUALS_EURO_VALIDATIONS }
    },
    [UNITS]: {
      [BRACKET_TYPE.FROM]: { value: '', validations: { ...FROM_VALIDATIONS, [REGEX]: NUMBER_REGEXP } },
      [BRACKET_TYPE.TO]: { value: '', validations: { ...TO_VALIDATIONS, [REGEX]: NUMBER_REGEXP } },
      [BRACKET_TYPE.EQUALS]: { value: EURO, validations: EQUALS_EURO_VALIDATIONS }
    }
  },
  [LOYALTY]: {
    [PERCENTAGE]: {
      [BRACKET_TYPE.FROM]: { value: '', validations: { ...FROM_VALIDATIONS, [REGEX]: NUMBER_REGEXP } },
      [BRACKET_TYPE.TO]: { value: '', validations: { ...TO_VALIDATIONS, [REGEX]: NUMBER_REGEXP } },
      [BRACKET_TYPE.EQUALS]: { value: EURO, validations: EQUALS_EURO_VALIDATIONS }
    },
    [UNITS]: {
      [BRACKET_TYPE.FROM]: { value: '', validations: { ...FROM_VALIDATIONS, [REGEX]: NUMBER_REGEXP } },
      [BRACKET_TYPE.TO]: { value: '', validations: { ...TO_VALIDATIONS, [REGEX]: NUMBER_REGEXP } },
      [BRACKET_TYPE.EQUALS]: { value: EURO, validations: EQUALS_EURO_VALIDATIONS }
    }
  },
  [SPONSORSHIP]: {
    [BRACKET_TYPE.FROM]: { value: '', validations: { ...FROM_VALIDATIONS, [REGEX]: NUMBER_REGEXP } },
    [BRACKET_TYPE.TO]: { value: '', validations: { ...TO_VALIDATIONS, [REGEX]: NUMBER_REGEXP } },
    [BRACKET_TYPE.EQUALS]: { value: EURO, validations: EQUALS_EURO_VALIDATIONS }
  }
};

export const BASE_BRACKET_VALUE = {
  [BRACKET_TYPE.FROM]: '',
  [BRACKET_TYPE.TO]: '',
  [BRACKET_TYPE.EQUALS]: '',
  errors: {
    [BRACKET_TYPE.FROM]: '',
    [BRACKET_TYPE.TO]: '',
    [BRACKET_TYPE.EQUALS]: ''
  },
  [BRACKET_TYPE.STATUS]: AVAILABLE
};

export const INITIAL_BRACKET_VALUES = [
  BASE_BRACKET_VALUE,
  BASE_BRACKET_VALUE,
  { ...BASE_BRACKET_VALUE, [BRACKET_TYPE.STATUS]: DISABLED }
];

//CONTENTS
export const CAN_NEXT_STEP = 'canNextStep';
export const SOCIAL = {
  FACEBOOK: 'facebook',
  TWITTER: 'twitter',
  LINKEDIN: 'linkedin',
  INSTAGRAM: 'instagram',
  CUSTOM: 'custom'
};
export const SOCIAL_NETWORK_TYPES = {
  [SOCIAL.FACEBOOK]: { active: false, hasError: false, value: '' },
  [SOCIAL.TWITTER]: { active: false, hasError: false, value: '' },
  [SOCIAL.LINKEDIN]: { active: false, hasError: false, value: '' },
  [SOCIAL.INSTAGRAM]: { active: false, hasError: false, value: '' },
  [SOCIAL.CUSTOM]: { active: false, hasError: false, value: '' }
};

export const BASE_GOAL_VALUE = Object.freeze({
  [CUBE_SECTIONS.SPECIFIC_PRODUCTS]: null,
  [CUBE_SECTIONS.MEASUREMENT_TYPE]: null,
  [CUBE_SECTIONS.MEASUREMENT_NAME]: null,
  [CUBE_SECTIONS.ALLOCATION_TYPE]: null,
  [CUBE_SECTIONS.BRACKETS]: [],
  acceptedTypes: [...CUBE_ALLOCATION_CATEGORY],
  measurementTypesValid: Object.keys(MEASUREMENT_TYPES),
  productIds: [],
  brackets: INITIAL_BRACKET_VALUES,
  [ALLOCATION_MAIN]: {
    [SIMPLIFIED_CUBE_TYPE.MIN]: '',
    [SIMPLIFIED_CUBE_TYPE.MAX]: '',
    [SIMPLIFIED_CUBE_TYPE.VALUE]: ''
  },
  validated: {
    [CUBE_SECTIONS.SPECIFIC_PRODUCTS]: false,
    [CUBE_SECTIONS.MEASUREMENT_TYPE]: false,
    [CUBE_SECTIONS.ALLOCATION_TYPE]: false
  }
});

// Frequency
export enum FREQUENCY_TYPE {
  INSTANTANEOUSLY = 'instantaneously',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTER = 'quarter'
}

export const FREQUENCY_TYPE_VALUES = {
  [FREQUENCY_TYPE.INSTANTANEOUSLY]: 1,
  [FREQUENCY_TYPE.DAILY]: 2,
  [FREQUENCY_TYPE.WEEKLY]: 3,
  [FREQUENCY_TYPE.MONTHLY]: 4,
  [FREQUENCY_TYPE.QUARTER]: 5
};

export const FREQUENCY_TYPE_VALUES_NAMES = {
  1: FREQUENCY_TYPE.INSTANTANEOUSLY,
  2: FREQUENCY_TYPE.DAILY,
  3: FREQUENCY_TYPE.WEEKLY,
  4: FREQUENCY_TYPE.MONTHLY,
  5: FREQUENCY_TYPE.QUARTER
};

export const TIME_DAY_CONSTRAINTS = {
  WEEK: 6,
  MONTH: 29
};

export const TIME_MONTH_CONSTRAINTS = {
  QUARTER: 2
};

export const BASE_FREQUENCY_TYPES = [FREQUENCY_TYPE.INSTANTANEOUSLY, FREQUENCY_TYPE.DAILY];

// Spend points
export enum SPEND_POINTS_TYPE {
  AT_START = 1,
  AT_END = 2,
  AT_VALIDATION = 3
}

export const BASE_SPEND_POINTS_TYPES = [
  SPEND_POINTS_TYPE.AT_START,
  SPEND_POINTS_TYPE.AT_END,
  SPEND_POINTS_TYPE.AT_VALIDATION
];

// Validity points
export const VALIDITY_MONTHS_COUNT = 11;
export const VALIDITY = 'validity';
export const VALIDITY_WEEKS_COUNT = 3;
export const TIME_DROPDOWN_OPTIONS = {
  YEAR: {
    VALUE: 'y',
    LABEL: 'year'
  },
  MONTH: {
    VALUE: 'm',
    LABEL: 'month'
  },
  WEEK: {
    VALUE: 'w',
    LABEL: 'week'
  }
};
export const YEARLY_OPTION = {
  value: `1y`,
  label: `1 Year`
};

// Reward managers
export const REWARD_MANAGERS_DEFAULT_VALUE = 10;

export const PROGRAM_IDENTIFIER = 'identifier';

export const INITIAL_SIMPLE_ALLOCATION = {
  min: '',
  max: '',
  value: '',
  type: ''
};

export const ALLOCATION_MECHANISMS_TRANSLATIONS = {
  [VOLUME]: {
    [1]: REVENUE,
    [2]: PRICE,
    default: ''
  },
  [QUANTITY]: {
    [3]: QUANTITY,
    default: VOLUME
  },
  [RANKING]: {
    default: RANKING
  },
  [GROWTH]: {
    default: `${RESULTS} ${GROWTH}`
  },
  default: {
    default: ''
  }
};

export const PDF_ALLOCATION_FREQUENCIES = {
  [1]: 'instantaneously',
  [2]: 'on a daily basis',
  [3]: 'on a weekly basis',
  [4]: 'on a monthly basis',
  default: 'on a quarterly basis'
};

export const PDF_SPENDING_POINTS_FREQUENCIES = {
  [1]: 'as soon as you get them',
  [2]: 'at the end of the program',
  default: 'with the express agreement of an administrator (please refer to your “Points” page)'
};
