export const NAV_LIGHT = 'light';
export const NAV_DARK = 'dark';

const NR_OF_ADMINS = 'nrOfAdmins';
const CUBE = 'cube';
const KPI = 'kpi';
const ESCROW = 'escrow';
const AUTOMATIC_BILLING = 'automaticBilling';
const UNUSED_BUDGET_REFUND = 'unusedBudgetRefund';
const DATA_EXPORT = 'dataExport';
const MAX_USERS = 'maxUsers';
const DATA_STORAGE_CAPACITY = 'dataStorageCapacity';
const AUTOMATIC_EDITION_OF_RULES = 'automaticAdditionOfRules';
const MAX_EMAIL_PER_MONTH = 'maxEmailPerMonth';
const ARCHIVES = 'archives';

export const SETUP = 'setup';
export const TYPE_OF_PROGRAMS = 'typeOfPrograms';
export const NAME = 'name';
export const PRICE = 'price';
export const HIDE = 'hide';
export const CURRENCY = 'currency';
export const CTA = 'cta';
export const SUBSCRIBE = 'subscribe';
export const ID = 'id';
export const ADDITIONAL_ADMIN = 'additionalAdmin';
export const ADDITIONAL_CATEGORY = 'additionalCategory';
export const ADDITIONAL_COUNTRY = 'additionalCountry';
export const ADDITIONAL_GO = 'additionalGo';
export const ADDITIONAL_MARKETPLACE = 'additionalMarketplace';
export const ADDITIONAL_PREPACKAGED_MARKETPLACE = 'additionalPrepackagedMarketplace';
export const ADDITIONAL_PROGRAM = 'additionalProgram';
export const ADDITIONAL_USER = 'additionalUser';
export const ADDITIONAL_CONNECTION = 'apiConnection';
export const EMAIL_VOLUME = 'emailVolume';
export const OWN_GIFTS_MARKETPLACE = 'ownGiftsMarketplace';
export const STORY_TELLING_LIBRARY_FULL_ACCESS = 'storyTellingLibraryFullAccess';
export const TRAINING_COURSES = 'trainingCourses';
export const FREQUENCIES_OF_PAYMENT = 'frequenciesOfPayment';
export const INITIAL_SLIDE = 0;

export const PRICING_DATA_ANIMATION_CONFIG = {
  delay: 300,
  smooth: true,
  offset: -50
};

export enum PRICING_BLOCK_TYPES {
  BASE = 'base',
  ADDITIONAL = 'additional',
  SUBSCRIPTION = 'subscription'
}

export const PRICE_ORDER = [
  SETUP,
  TYPE_OF_PROGRAMS,
  NR_OF_ADMINS,
  CUBE,
  KPI,
  ESCROW,
  AUTOMATIC_EDITION_OF_RULES,
  AUTOMATIC_BILLING,
  UNUSED_BUDGET_REFUND,
  DATA_EXPORT,
  MAX_EMAIL_PER_MONTH,
  MAX_USERS,
  DATA_STORAGE_CAPACITY,
  ARCHIVES,
  FREQUENCIES_OF_PAYMENT
];

export const PRICE_ORDER_ADDITIONAL = [
  NAME,
  ADDITIONAL_CATEGORY,
  ADDITIONAL_PROGRAM,
  ADDITIONAL_COUNTRY,
  ADDITIONAL_ADMIN,
  STORY_TELLING_LIBRARY_FULL_ACCESS,
  ADDITIONAL_MARKETPLACE,
  ADDITIONAL_PREPACKAGED_MARKETPLACE,
  OWN_GIFTS_MARKETPLACE,
  ADDITIONAL_USER,
  EMAIL_VOLUME,
  ADDITIONAL_GO,
  ADDITIONAL_CONNECTION,
  TRAINING_COURSES,
  CTA,
  ID
];

export const PRICE_ORDER_COLUMN_ORDER = [NAME, PRICE, CTA, ...PRICE_ORDER, CTA, ID];
export const CURRENCY_VALUES = ['$', '€'];
export const CHECKED_LABEL = 'CHECKED';
export const UNCHECKED_LABEL = 'UNCHECKED';

export enum CHECKED_VALUES {
  CHECKED = 'checked',
  UNCHECKED = 'unchecked'
}

export const LANDING_TITLE = ['incentive', 'relationship', 'management'];
export const FORMATTED_PRICING_CELLS = [ARCHIVES, DATA_STORAGE_CAPACITY, TYPE_OF_PROGRAMS];

/**
 * Pricing fields order based on the pricing section type
 */
export const PRICING_TYPES = {
  [PRICING_BLOCK_TYPES.BASE]: PRICE_ORDER,
  [PRICING_BLOCK_TYPES.ADDITIONAL]: PRICE_ORDER_ADDITIONAL,
  [PRICING_BLOCK_TYPES.SUBSCRIPTION]: PRICE_ORDER
};
