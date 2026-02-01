/**
 * Form Constants
 * Migrated from old_app/src/constants/forms.ts
 */

import type { IFormDropdownOption, IStyleForm } from '@/types/forms/IForm';

// Date/Time Constants
export const RESELLER_FORM_TYPE = 'reseller';
export const DEFAULT_DATE_FORMAT = 'dd/MM/yyyy';
export const DEFAULT_ISO_DATE_FORMAT = 'YYYY-MM-DD';
export const DEFAULT_ISO_DATE_FORMAT_WITH_TIME = 'YYYY-MM-DD HH:mm:ss';
export const DEFAULT_DATE_TIME_FORMAT = `${DEFAULT_DATE_FORMAT} HH:mm`;
export const TIME_FORMAT = 'HH:mm';
export const TIME_INTERVAL = 30;
export const TIME_LABEL = 'Time';
export const ACCEPT_OPTION_RADIO = 'accept';
export const DECLINE_OPTION_RADIO = 'decline';
export const AUTO_CLOSE_TIME = 10000;
export const MATCH = 'match';
export const MATCH_EMAIL = 'matchEmail';
export const DUPLICATED_VALUE = 1013;

/**
 * Modal Action Types Enum
 */
export enum MODAL_ACTION_TYPES {
  RESET = 'reset',
  CHANGED = 'changed'
}

/**
 * Generic Form Types Enum
 */
export enum GENERIC_FORM_TYPES {
  RESELLER = 1,
  TAILORED = 2,
  CONTACT_MAIN = 3
}

/**
 * Radio Default Type Enum
 */
export enum RADIO_DEFAULT_TYPE {
  REFUSE = 'refuse',
  ACCEPT = 'accept'
}

/**
 * Title Type Enum
 */
export enum TITLE_TYPE {
  MR = 'mr',
  MRS = 'mrs',
  MS = 'ms',
  COMPANY = 'company'
}

/**
 * Title Value Enum
 */
export enum TITLE_VALUE {
  MR = 'mr',
  MRS = 'mme',
  MS = 'mlle',
  COMPANY = 'company'
}

/**
 * Form Fields Enum - All form field identifiers
 */
export enum FORM_FIELDS {
  LAST_NAME = 'lastName',
  FIRST_NAME = 'firstName',
  FULL_NAME = 'fullName',
  EMAIL = 'email',
  COMPANY_NAME = 'companyName',
  PHONE_NUMBER = 'phoneNumber',
  TARGETED_MARKETS = 'targetedMarkets',
  EXCLUSIVE_MARKETS = 'exclusiveMarket',
  WHY_PROMOTE = 'whyPromote',
  START_DATE = 'startDate',
  WEBSITE_URL = 'websiteUrl',
  INTERESTED_IN = 'interestedIn',
  INCENTIVE_MONTHLY_BUDGET = 'incentiveMonthlyBudget',
  TITLE = 'title',
  COMPANY_ROLE = 'companyRole',
  ROLE_IN_COMPANY_FIELD = 'roleInCompany',
  KIND_OF_PROGRAMS = 'kindOfPrograms',
  NUMBER_OF_PROGRAMS = 'numberOfPrograms',
  NUMBER_OF_MEMBERS = 'numberOfMembers',
  CONNECT_CRM = 'connectCrm',
  HOW_MANY_USERS = 'howManyUsers',
  USE_SPECIFIC_MARKET = 'useSpecificMarket',
  NUMBER_OF_EMAILS_PER_USERS = 'numberOfEmailsPerUser',
  USE_SPECIFIC_APPLICATIONS = 'useSpecificApplications',
  NEED_TRAINING = 'needTraining',
  SPECIFIC_URL = 'specificUrl',
  NEEDS_SUPER_ADMIN = 'needsSuperAdmin',
  CONTACT_DATE = 'contactDate',
  PASSWORD_CONFIRMATION = 'passwordConfirmation',
  PASSWORD = 'password',
  OLD_PASSWORD = 'oldPassword',
  CREATE_ACCOUNT_PASSWORD = 'createAccountPassword',
  PROGRAM_NAME = 'programName',
  PROGRAM_URL = 'url',
  EXTEND_URL = 'extendUrl',
  PROGRAM_DURATION = 'duration',
  REVENUE_REWARD_AMOUNT = 'revenueRewardAmount',
  SALES_REWARD_AMOUNT = 'salesRewardsPercentage',
  MIN_REWARD_THRESHOLD = 'revenueMinThreshold',
  MAX_REWARD_THRESHOLD = 'revenueMaxThreshold',
  MIN_SALES_THRESHOLD = 'salesMinThreshold',
  MAX_SALES_THRESHOLD = 'salesMaxThreshold',
  MIN_PURCHASE_THRESHOLD = 'purchaseMinThreshold',
  MAX_PURCHASE_THRESHOLD = 'purchaseMaxThreshold',
  REWARD_RATIO_PER_PURCHASE = 'rewardRatioPerPurchase',
  REWARD_AMOUNT_PER_PURCHASE = 'rewardAmountPerPurchase',
  SPONSORSHIP_REWARD = 'sponsorshipReward',
  MIN_SPONSORSHIP_THRESHOLD = 'sponsorshipMinThreshold',
  MAX_SPONSORSHIP_THRESHOLD = 'sponsorshipMaxThreshold',
  CONTENTS_TITLE = 'contentsTitle',
  BANNER_TITLE = 'bannerTitle',
  DATE_OF_EVENT = 'dateOfEvent',
  DATE_OF_SPONSORSHIP = 'dateOfSponsorship',
  AMOUNT = 'amount',
  QUANTITY = 'quantity',
  CUSTOMER_REFERENCE = 'customerReference',
  TIME_OF_SALE = 'timeOfSale',
  CONTRACT_REFERENCE = 'contractReference',
  PRODUCT_NAME = 'productName',
  CONTACT_AGREEMENT = 'contactAgreement',
  PRODUCT_REFERENCE = 'productReference',
  ADDITIONAL_COMMENTS = 'additionalComments',
  PLATFORM_IDENTIFIER = 'platformIdentifier',
  BIRTH_DATE = 'dateOfBirth',
  ADDRESS = 'address',
  MOBILE_PHONE_NUMBER = 'mobilePhoneNumber',
  ZIP_CODE = 'zipCode',
  CITY = 'city',
  COUNTRY = 'country',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  PAYPAL = 'paypalLink',
  PROGRAM_ID = 'programId',
  PROOF_OF_SALE = 'proofOfSale',
  BENEFICIARY = 'beneficiary',
  NEW_PASSWORD = 'newPassword',
  NEW_PASSWORD_CONFIRMATION = 'newPasswordConfirmation',
  EMAIL_CONFIRMATION = 'emailConfirmation',
  PROOF_OF_REFERRAL = 'proofOfReferral',
  PROOF_OF_PURCHASE = 'proofOfPurchase',
  COMPANY_EMAIL = 'companyEmail',
  COMPANY_PHONE_NUMBER = 'companyPhoneNumber',
  COMPANY_IBAN = 'companyIban',
  COMPANY_BIC = 'companyBic',
  COMPANY_SIRET_SIREN = 'companySiret',
  COMPANY_ADDRESS = 'companyAddress',
  COMPANY_CITY = 'companyCity',
  COMPANY_COUNTRY = 'companyCountry',
  COMPANY_ZIPCODE = 'companyZipcode',
  CIVILITY = 'civility',
  POSTAL_CODE = 'postalCode',
  SPONSORSHIP_CIVILITY = 'sponsorshipCivility',
  SPONSORSHIP_EMAIL = 'sponsorshipEmail',
  SPONSORSHIP_PHONE_NUMBER = 'sponsorshipPhoneNumber',
  SPONSORSHIP_ADDRESS = 'sponsorshipAddress',
  SPONSORSHIP_ZIPCODE = 'sponsorshipZipCode',
  SPONSORSHIP_CITY = 'sponsorshipCity',
  SPONSORSHIP_FIRSTNAME = 'sponsorshipFirstName',
  SPONSORSHIP_LASTNAME = 'sponsorshipLastName',
  SPONSORSHIP_COMPANY_NAME = 'sponsorshipCompanyName',
  SPONSORSHIP_TITLE = 'sponsorshipTitle'
}

/**
 * Input Type Enum
 */
export enum INPUT_TYPE {
  TEXT = 'text',
  DECLARATION_PRODUCT = 'declarationProduct',
  TEL = 'tel',
  EMAIL = 'email',
  URL = 'url',
  PASSWORD = 'password',
  NUMBER = 'number',
  DROPDOWN = 'dropdown',
  RADIO = 'radio',
  DATETIME = 'date',
  TIME = 'time',
  DYNAMIC_DATETIME = 'dynamicDate',
  MULTIPLE_DATETIME = 'multipleDate',
  RADIO_TEXT = 'radioText',
  EXTENDED_INPUT_FIELD = 'extendedInputField',
  CHECKBOX = 'checkbox',
  FILE = 'file'
}

/**
 * Interested In Options
 */
export const INTERESTED_IN_OPTIONS: IFormDropdownOption[] = [
  { value: 'Sales challenges', label: 'Sales challenges' },
  { value: 'Customer acquisition', label: 'Customer acquisition' },
  { value: 'Customer loyalty', label: 'Customer loyalty' },
  { value: 'Brand awareness', label: 'Brand awareness' },
  { value: 'Project efficiency', label: 'Project efficiency' },
  { value: 'Something else', label: 'Something else' },
  { value: 'All of that', label: 'All of that' }
];

/**
 * Incentive Monthly Budget Options
 */
export const INCENTIVE_MONTHLY_BUDGET_OPTIONS: IFormDropdownOption[] = [
  { value: 'Under 1000€', label: 'Under 1000€' },
  { value: 'From 1K€ to 5K€', label: 'From 1K€ to 5K€' },
  { value: 'From 5K€ to 10K€', label: 'From 5K€ to 10K€' },
  { value: 'From 10K€ to 25K€', label: 'From 10K€ to 25K€' },
  { value: 'From 25K€ to 50K€', label: 'From 25K€ to 50K€' },
  { value: 'From 50K€', label: 'From 50K€' }
];

/**
 * Radio Default Options
 */
export const RADIO_DEFAULT_OPTIONS: IFormDropdownOption[] = [
  { value: RADIO_DEFAULT_TYPE.ACCEPT, label: ACCEPT_OPTION_RADIO },
  { value: RADIO_DEFAULT_TYPE.REFUSE, label: DECLINE_OPTION_RADIO }
];

/**
 * Title Options
 */
export const TITLE_OPTIONS: IFormDropdownOption[] = [
  { value: TITLE_VALUE.MR, label: TITLE_TYPE.MR },
  { value: TITLE_VALUE.MRS, label: TITLE_TYPE.MRS },
  { value: TITLE_VALUE.MS, label: TITLE_TYPE.MS }
];

/**
 * Title Options French
 */
export const TITLE_OPTIONS_FRENCH: IFormDropdownOption[] = [
  { value: TITLE_VALUE.MR, label: TITLE_TYPE.MR },
  { value: TITLE_VALUE.MRS, label: TITLE_TYPE.MRS },
  { value: TITLE_VALUE.MS, label: TITLE_TYPE.MS }
];

// Style Form Constants
export const NON_FLOATING_ELEMENT: IStyleForm = { floating: false };
export const ROUNDED_ELEMENT: IStyleForm = { rounded: true };
export const CENTER_ELEMENT: IStyleForm = { centerElement: true };
export const IS_INLINE: IStyleForm = { isInline: true };
export const IS_HIDDEN: IStyleForm = { isHidden: true };
export const COMPLEX_DATEPICKER: IStyleForm = { isComplex: true };
export const DISABLED: IStyleForm = { isDisabled: true };
export const FLOATING: IStyleForm = { floating: true };
export const DEFAULT_INPUT: IStyleForm = { defaultInput: true };
export const EURO_INPUT: IStyleForm = { euroInput: true };
export const USD_INPUT: IStyleForm = { usdInput: true };
export const UNIT_INPUT: IStyleForm = { unitInput: true };
export const PERCENTAGE_INPUT: IStyleForm = { percentageInput: true };
export const NUMBER_FIELD: IStyleForm = { numberField: true };
export const TIME_FIELD: IStyleForm = { timeField: true };
export const CUSTOM_RADIO: IStyleForm = { customRadio: true };
export const WHITE_LABEL: IStyleForm = { whiteLabel: true };
export const SMALLER_FONT_ELEMENT: IStyleForm = { isSmaller: true };

// Password Strength
export const PASSWORD_STRENGTH_METER = ['seriously', 'weak', 'whyNot', 'great', 'awesome'];
export const passwordStrengthMeterFillValue = 25;
export const passwordStrengthMeterFillSymbol = '%';
export const RESEND_ACTIVATION_LINK_SUCCESS = 'success';
export const RESEND_ACTIVATION_LINK_ERROR = 'error';

/**
 * Options List
 */
export const OPTIONS_LIST = {
  sponsorshipReward: 'sponsorshipReward',
  rewardAmountPerPurchase: 'rewardAmountPerPurchase',
  rewardRatioPerPurchase: 'rewardRatioPerPurchase',
  salesRewardsPercentage: 'salesRewardsPercentage',
  revenueRewardAmount: 'revenueRewardAmount'
};

// Constraint field identifiers (references to validation constants)
export const PHONE_NUMBER = 'phoneNumber';
export const REVENUE_AMOUNT = 'revenueAmount';
export const NUMBER_ITEM = 'numberItem';
export const COMPLEX_NUMBER = 'complexNumber';
export const SOCIAL_URL = 'socialUrl';
export const FILE_SIZE = 'fileSize';
export const FILE_TYPE = 'fileType';
export const FILE_EXTENSION = 'fileExtension';

/**
 * Constraint Field List
 */
export const CONSTRAINT_FIELD_LIST = [
  PHONE_NUMBER,
  FORM_FIELDS.PASSWORD,
  REVENUE_AMOUNT,
  NUMBER_ITEM,
  SOCIAL_URL,
  COMPLEX_NUMBER,
  FORM_FIELDS.EXTEND_URL,
  FORM_FIELDS.PROGRAM_NAME,
  FORM_FIELDS.WEBSITE_URL
];

/**
 * Social Media Accounts mapping
 */
export const SOCIAL_MEDIA_ACCOUNTS = {
  FACEBOOK: FORM_FIELDS.FACEBOOK,
  LINKEDIN: FORM_FIELDS.LINKEDIN,
  TWITTER: FORM_FIELDS.TWITTER
};

export const socialMediaAccounts = 'socialMediaAccounts';
export const SOCIAL_NETWORKS = [FORM_FIELDS.FACEBOOK, FORM_FIELDS.TWITTER, FORM_FIELDS.LINKEDIN];
export const MINIMUM_AGE_VALUE = 18;

/**
 * Register Form Fields Custom Mapping
 */
export const REGISTER_FORM_FIELDS_CUSTOM_MAPPING = {
  [FORM_FIELDS.TITLE]: 'civility',
  [FORM_FIELDS.LAST_NAME]: 'name',
  [FORM_FIELDS.FACEBOOK]: 'facebookAccount',
  [FORM_FIELDS.TWITTER]: 'twitterAccount',
  [FORM_FIELDS.LINKEDIN]: 'linkedInAccount'
};

export const CUSTOM_CONSTRAINT_FIELD_LIST = [FILE_SIZE, FILE_TYPE, FILE_EXTENSION];

/**
 * Form Fields With Confirmation
 */
export const FORM_FIELDS_WITH_CONFIRMATION = {
  [FORM_FIELDS.PASSWORD_CONFIRMATION]: FORM_FIELDS.CREATE_ACCOUNT_PASSWORD,
  [FORM_FIELDS.NEW_PASSWORD_CONFIRMATION]: FORM_FIELDS.NEW_PASSWORD,
  [FORM_FIELDS.EMAIL_CONFIRMATION]: FORM_FIELDS.EMAIL
};

/**
 * Revenue and Sales Fields
 */
export const REVENUE_AND_SALES_FIELDS = [
  FORM_FIELDS.REVENUE_REWARD_AMOUNT,
  FORM_FIELDS.MIN_REWARD_THRESHOLD,
  FORM_FIELDS.MAX_REWARD_THRESHOLD,
  FORM_FIELDS.SALES_REWARD_AMOUNT,
  FORM_FIELDS.MIN_SALES_THRESHOLD,
  FORM_FIELDS.MAX_SALES_THRESHOLD,
  FORM_FIELDS.SALES_REWARD_AMOUNT,
  FORM_FIELDS.SPONSORSHIP_REWARD,
  FORM_FIELDS.MIN_SPONSORSHIP_THRESHOLD,
  FORM_FIELDS.MAX_SPONSORSHIP_THRESHOLD,
  FORM_FIELDS.REWARD_RATIO_PER_PURCHASE,
  FORM_FIELDS.MIN_PURCHASE_THRESHOLD,
  FORM_FIELDS.MAX_PURCHASE_THRESHOLD,
  FORM_FIELDS.REWARD_AMOUNT_PER_PURCHASE
];

/**
 * Integer Revenue and Sales Fields
 */
export const INTEGER_REVENUE_AND_SALES_FIELDS = [
  FORM_FIELDS.MIN_SALES_THRESHOLD,
  FORM_FIELDS.MAX_SALES_THRESHOLD,
  FORM_FIELDS.MIN_SPONSORSHIP_THRESHOLD,
  FORM_FIELDS.MAX_SPONSORSHIP_THRESHOLD,
  FORM_FIELDS.MIN_PURCHASE_THRESHOLD,
  FORM_FIELDS.MAX_PURCHASE_THRESHOLD
];
