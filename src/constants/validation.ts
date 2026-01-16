import {
  IEmailFieldConstraint,
  IFormConstraints,
  IRequiredConstraint,
  IUrlFieldConstraint
} from 'interfaces/forms/IForm';

export const NOT_URL_REGEXP = /^[a-z0-9_-]+([a-z0-9_-]+)*$/;
export const CONTACT_URL_REGEXP = /[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/;
export const URL_REGEXP = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/i;
export const FACEBOOK_ACCOUNT_URL_REGEXP = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|www\.)?facebook\.(com)\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w-\\.]*)?$/i;
export const TWITTER_ACCOUNT_URL_REGEXP = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|www\.)?twitter\.(com)\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w-\\.]*)?$/i;
export const LINKEDIN_ACCOUNT_URL_REGEXP = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|www\.)?linkedin\.(com)\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w-\\.]*)?$/i;
export const PAYPAL_ACCOUNT_URL_REGEXP = /^(https:\/\/)*paypal\.(me)\/(\w?.)*$/i;
export const NUMBER_REGEXP = /^[0-9]*$/;
export const PHONE_REGEXP = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s/0-9]*[#]*$/;
export const PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+-=.,"'\]{}[|\\<>~`;:?/])(?=.{8,})/;
export const EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const NON_EMPTY_REGEX = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;
export const REWARDED_AMOUNT_REGEXP = /^(?!0+$)(100(?:,00?)?|\d?\d(?:,\d\d?)?)$/;
export const COMPLEX_NUMBER_REGEXP = /^(?!0+$)[0-9]+(,\d{1,2})?$/;
export const DECIMAL_REWARDS_AMOUNT_REGEXP = /^(?!0+$)[0-9]+(,[1-9]{1,1}\d{0,1})?$/;
export const EMAIL = 'email';
export const REQUIRED = 'required';
export const PHONE_NUMBER = 'phoneNumber';
export const CUSTOM_URL = 'extendUrl';
export const UNIQUE_NAME = 'uniqueName';
export const TRIMMED_INPUT = 'trimmedInput';
export const PASSWORD = 'password';
export const MATCHES_RULE = 'matches';
export const TYPE = 'type';
export const CONSTRAINTS = 'constraints';
export const STRING = 'string';
export const OBJECT = 'object';
export const FILE = 'file';
export const HTTP = 'http://';
export const HTTPS = 'https://';
export const GLOBAL = 'global';
export const NOT_STRONG = 'notStrong';
export const NUMBER = 'number';
export const INVALID = 'invalid';
export const INVALID_NUMBER = `${INVALID}.${NUMBER}`;
export const MIN_INPUT_NUMBER_VALUE = 0;
export const REVENUE_AMOUNT = 'revenueAmount';
export const NUMBER_ITEM = 'numberItem';
export const COMPLEX_NUMBER = 'complexNumber';
export const SOCIAL_URL = 'socialUrl';
export const PROGRAM_NAME = 'programName';
export const REGEX = 'regex';
export const ZIP_CODE = 'zipCode';
export const FILE_SIZE = 'fileSize';
export const FILE_TYPE = 'fileType';
export const FILE_EXTENSION = 'fileExtension';
export const DATE = 'date';
export const WEBSITE_URL = 'websiteUrl';

export enum INPUT_LENGTH {
  MIN = 2,
  MAX = 50
}

export enum URL_LENGTH {
  MIN = 4,
  MAX = 50
}

export enum PHONE_INPUT_LENGTH {
  MIN = 10,
  MAX = 14
}

export enum PASSWORD_INPUT_LENGTH {
  MIN = 8,
  MAX = 100
}

export enum PLATFORM_IDENTIFIER_LENGTH {
  MIN = 2,
  MAX = 255
}

export enum NUMBER_INPUT_LENGTH {
  MIN = 1,
  MAX = 100
}

export enum SOCIAL_MEDIA_INPUT_LENGTH {
  MIN = 5,
  MAX = 120
}

export enum ZIP_CODE_LENGTH {
  MIN = 5,
  MAX = 10
}

export enum USER_DECLARATION_COMMENTS_LENGTH {
  MIN = 2,
  MAX = 250
}

export enum API_VALIDATION_CODE_RANGE {
  MIN = 1001,
  MAX = 1041
}

export enum PROGRAM_URL_LENGTH {
  MIN = 4,
  MAX = 250
}

export const INPUT_TYPE_CONSTRAINT = { type: STRING };
export const OBJECT_TYPE_CONSTRAINT = { type: OBJECT };
export const PHONE_REGEXP_CONSTRAINT = { [PHONE_NUMBER]: PHONE_REGEXP };
export const URL_REGEXP_CONSTRAINT = { [CUSTOM_URL]: NOT_URL_REGEXP };
export const CONTACT_URL_REGEXP_CONSTRAINT = { [WEBSITE_URL]: CONTACT_URL_REGEXP };
export const PASSWORD_REGEXP_CONSTRAINT = { [PASSWORD]: PASSWORD_REGEXP };
export const REVENUE_AMOUNT_CONSTRAINT = { [REVENUE_AMOUNT]: REWARDED_AMOUNT_REGEXP };
export const NUMBER_WITH_DECIMALS_CONSTRAINT = { [COMPLEX_NUMBER]: COMPLEX_NUMBER_REGEXP };
export const DECIMAL_REWARDS_AMOUNT_CONSTRAINT = { [COMPLEX_NUMBER]: DECIMAL_REWARDS_AMOUNT_REGEXP };
export const NUMBER_CONSTRAINT = { [NUMBER_ITEM]: NUMBER_REGEXP };
export const REQUIRED_CONSTRAINT: IRequiredConstraint = { required: true };
export const REQUIRED_TRIMMED_CONSTRAINT = { ...REQUIRED_CONSTRAINT, trim: true };

export const DATE_INPUT_CONSTRAINT_GROUP = { ...INPUT_TYPE_CONSTRAINT };
export const DROPDOWN_CONSTRAINT_GROUP = { ...REQUIRED_CONSTRAINT, ...OBJECT_TYPE_CONSTRAINT };

export const PHONE_NON_REQUIRED_CONSTRAINT_GROUP = {
  ...INPUT_TYPE_CONSTRAINT,
  ...PHONE_REGEXP_CONSTRAINT,
  min: PHONE_INPUT_LENGTH.MIN,
  max: PHONE_INPUT_LENGTH.MAX
};

export const BASE_INPUT_NON_REQUIRED_CONSTRAINT_GROUP: IFormConstraints = {
  ...INPUT_TYPE_CONSTRAINT,
  min: INPUT_LENGTH.MIN,
  max: INPUT_LENGTH.MAX
};

export const PHONE_CONSTRAINT_GROUP = {
  ...PHONE_NON_REQUIRED_CONSTRAINT_GROUP,
  ...REQUIRED_CONSTRAINT
};

export const BASE_RADIO_CONSTRAINT_GROUP: IFormConstraints = {
  ...REQUIRED_CONSTRAINT,
  ...INPUT_TYPE_CONSTRAINT
};

export const BASE_INPUT_CONSTRAINT_GROUP: IFormConstraints = {
  ...BASE_INPUT_NON_REQUIRED_CONSTRAINT_GROUP,
  ...REQUIRED_CONSTRAINT
};

export const PASSWORD_INPUT_CONSTRAINT_GROUP: IFormConstraints = {
  ...REQUIRED_CONSTRAINT,
  ...INPUT_TYPE_CONSTRAINT,
  ...PASSWORD_REGEXP_CONSTRAINT,
  min: PASSWORD_INPUT_LENGTH.MIN,
  max: PASSWORD_INPUT_LENGTH.MAX
};

export const CUSTOM_URL_INPUT_CONSTRAINT_GROUP = {
  ...REQUIRED_CONSTRAINT,
  ...INPUT_TYPE_CONSTRAINT,
  ...URL_REGEXP_CONSTRAINT,
  min: URL_LENGTH.MIN,
  max: URL_LENGTH.MAX
};

export const NUMBER_INPUT_CONSTRAINT = {
  ...INPUT_TYPE_CONSTRAINT,
  min: NUMBER_INPUT_LENGTH.MIN
};

export const EMAIL_INPUT_CONSTRAINT: IEmailFieldConstraint = {
  type: STRING,
  required: true,
  email: true
};

export const URL_INPUT_CONSTRAINT: IUrlFieldConstraint = {
  type: STRING,
  url: 'invalid.website'
};

export enum VALIDATION_FIELDS {
  MIN = 'min',
  MAX = 'max',
  REQUIRED = 'required',
  TRIM = 'required',
  EMAIL = 'invalid.email',
  PHONENUMBER = 'invalid.phone',
  PASSWORD = 'invalid.password',
  EXTENDURL = 'invalid.url',
  INVALID = 'invalid',
  REVENUEAMOUNT = 'percentage',
  NUMBERITEM = 'invalid',
  COMPLEXNUMBER = 'percentage',
  PROGRAMNAME = 'invalid.programName',
  FILESIZE = 'invalid.fileSize',
  FILETYPE = 'invalid.fileType',
  FILEEXTENSION = 'invalid.fileType',
  SOCIALURL = 'socialUrl',
  WEBSITEURL = 'invalid.website'
}

export const SINGLE_VALIDATION_FIELDS = [EMAIL, REQUIRED];

export const CREATE_ACCOUNT_PASSWORD = 'createAccountPassword';
export const REGEX_MIN_LENGTH = /^(?=.{8,})/;
export const REGEX_MAX_LENGTH = /^(?=.{0,100}$)/;
export const REGEX_LETTERS_LOWER_AND_UPPERCASE = /^(?=.*[a-z])(?=.*[A-Z])/;
export const REGEX_SPECIAL_CHARACTERS = /(?=.*[-!$%^&*()_+|~=`{}[\]:";'<>?,./])/;
export const REGEX_NUMBERS = /(?=.*[0-9])/;
export const DATE_INPUT_NON_REQUIRED_CONSTRAINT_GROUP = { type: DATE };
export const ZIP_CODE_NON_REQUIRED_CONSTRAINT_GROUP = {
  ...INPUT_TYPE_CONSTRAINT,
  min: ZIP_CODE_LENGTH.MIN,
  max: ZIP_CODE_LENGTH.MAX
};

//CUBE VALIDATION
export const LOWER_THAN = 'lowerThan';
export const DEPENDS_ON = 'dependsOn';
export const HIGHER_THAN = 'higherThan';

export const MAX_EMAIL_LENGTH_LIST = 10;

export const SOCIAL_ACCOUNTS_NON_REQUIRED_CONSTRAINT_GROUP = {
  ...INPUT_TYPE_CONSTRAINT,
  min: SOCIAL_MEDIA_INPUT_LENGTH.MIN,
  max: SOCIAL_MEDIA_INPUT_LENGTH.MAX
};

export const REGEX_LETTERS_LOWERCASE = /^[a-z0-9_-]+$/;
export const REGEX_MIN_LENGTH_FOUR = /^(?=.{4,})/;

export const PROGRAM_URL_CONSTRAINT_GROUP = {
  ...REQUIRED_CONSTRAINT,
  ...INPUT_TYPE_CONSTRAINT,
  min: PROGRAM_URL_LENGTH.MIN,
  max: PROGRAM_URL_LENGTH.MAX
};

export const ADDRESS_INPUT_NON_REQUIRED_CONSTRAINT_GROUP: IFormConstraints = {
  ...INPUT_TYPE_CONSTRAINT,
  min: INPUT_LENGTH.MIN,
  max: USER_DECLARATION_COMMENTS_LENGTH.MAX
};

export const REGEX_URL_SPECIAL_CHARACTERS = /(?=.*[!$%^&*()+|~=`{}[\]:";'<>?,./])/;
export const REGEX_NUMBERS_AND_COMMA = /^[0-9,]*$/;
export const ADMIN_INVITATION_DUPLICATE_ERROR_CODE = 1041;
export const FORBIDDEN_ERROR_CODE = 1021;
export const REGEX_TELEPHONE_NUMBER = /^[0-9+#()-]*$/;
// export const REGEX_TELEPHONE_NUMBER = /^(00|\+)([0-9]{2})([0-9]{9})$|^([0-9]{10})$/;

export const MAX_NUMBER_FOR_SIMPLIFIED_RULE = 999999999999999999;
