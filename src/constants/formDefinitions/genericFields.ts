import {
  CENTER_ELEMENT,
  COMPLEX_DATEPICKER,
  EURO_INPUT,
  FLOATING,
  FORM_FIELDS,
  INCENTIVE_MONTHLY_BUDGET_OPTIONS,
  INPUT_TYPE,
  INTERESTED_IN_OPTIONS,
  IS_INLINE,
  NON_FLOATING_ELEMENT,
  NUMBER_FIELD,
  PERCENTAGE_INPUT,
  PROOF_OF_SALE_TRANSLATION,
  RADIO_DEFAULT_OPTIONS,
  RADIO_DEFAULT_TYPE,
  ROUNDED_ELEMENT,
  TIME_FIELD,
  TITLE_OPTIONS,
  TITLE_OPTIONS_FRENCH,
  UNIT_INPUT,
  USD_INPUT
} from 'constants/forms';
import {
  BASE_INPUT_CONSTRAINT_GROUP,
  BASE_RADIO_CONSTRAINT_GROUP,
  CONSTRAINTS,
  CONTACT_URL_REGEXP_CONSTRAINT,
  CREATE_ACCOUNT_PASSWORD,
  DATE_INPUT_CONSTRAINT_GROUP,
  DECIMAL_REWARDS_AMOUNT_CONSTRAINT,
  DROPDOWN_CONSTRAINT_GROUP,
  EMAIL_INPUT_CONSTRAINT,
  FILE,
  FILE_EXTENSION,
  FILE_SIZE,
  INPUT_TYPE_CONSTRAINT,
  NUMBER_CONSTRAINT,
  NUMBER_INPUT_CONSTRAINT,
  NUMBER_WITH_DECIMALS_CONSTRAINT,
  PASSWORD_INPUT_CONSTRAINT_GROUP,
  PHONE_CONSTRAINT_GROUP,
  PLATFORM_IDENTIFIER_LENGTH,
  REQUIRED_CONSTRAINT,
  REQUIRED_TRIMMED_CONSTRAINT,
  REVENUE_AMOUNT_CONSTRAINT,
  STRING,
  TRIMMED_INPUT,
  UNIQUE_NAME,
  USER_DECLARATION_COMMENTS_LENGTH
} from 'constants/validation';
import { buildFormField } from 'services/FormServices';
import { PROOF_FILE_ACCEPTED_EXTENSIONS, PROOF_FILE_MB_MAX_SIZE } from 'constants/api/declarations';
import { CHALLENGE, PROGRAM_TYPES } from 'constants/wall/launch';
import { convertMbToBytes } from 'utils/files';
import MomentUtilities from 'utils/MomentUtilities';

export const FIRST_NAME_FIELD = buildFormField({ label: FORM_FIELDS.FIRST_NAME });
export const LAST_NAME_FIELD = buildFormField({ label: FORM_FIELDS.LAST_NAME });
export const COMPANY_ROLE_FIELD = buildFormField({ label: FORM_FIELDS.COMPANY_ROLE });
export const ROLE_IN_COMPANY_FIELD = buildFormField({ label: FORM_FIELDS.ROLE_IN_COMPANY_FIELD });
export const TARGETED_MARKETS_FIELD = buildFormField({ label: FORM_FIELDS.TARGETED_MARKETS });

export const COMPANY_IBAN = buildFormField({ label: FORM_FIELDS.COMPANY_IBAN });
export const COMPANY_BIC = buildFormField({ label: FORM_FIELDS. COMPANY_BIC });
export const COMPANY_SIRET_SIREN = buildFormField({ label: FORM_FIELDS.COMPANY_SIRET_SIREN });
export const ADDRESS = buildFormField({ label: FORM_FIELDS.ADDRESS });
export const CITY = buildFormField({ label: FORM_FIELDS.CITY });
export const COUNTRY = buildFormField({ label: FORM_FIELDS.COUNTRY });
export const ZIPCODE = buildFormField({ label: FORM_FIELDS.ZIP_CODE });
export const PHONE_NUMBER = buildFormField({ label: FORM_FIELDS.PHONE_NUMBER,constraints: PHONE_CONSTRAINT_GROUP}); 
export const COMPANY_EMAIL = buildFormField({ label: FORM_FIELDS.COMPANY_EMAIL }); 
export const COMPANY_PHONE_NUMBER = buildFormField({ label: FORM_FIELDS.COMPANY_PHONE_NUMBER }); 
export const COMPANY_ADDRESS = buildFormField({label: FORM_FIELDS.COMPANY_ADDRESS});
export const COMPANY_CITY = buildFormField({label: FORM_FIELDS.COMPANY_CITY});
export const COMPANY_COUNTRY = buildFormField({label: FORM_FIELDS.COMPANY_COUNTRY});
export const COMPANY_ZIPCODE = buildFormField({label: FORM_FIELDS.COMPANY_ZIPCODE});

 

export const PLATFORM_IDENTIFIER_FIELD = buildFormField({
  label: FORM_FIELDS.PLATFORM_IDENTIFIER,
  hasExplanation: true,
  extraConstraints: [TRIMMED_INPUT, UNIQUE_NAME],
  constraints: {
    ...REQUIRED_CONSTRAINT,
    ...INPUT_TYPE_CONSTRAINT
  }
});

export const REVENUE_REWARD_AMOUNT_FIELD = value => {
  return buildFormField({
    label: FORM_FIELDS.REVENUE_REWARD_AMOUNT,
    type: INPUT_TYPE.EXTENDED_INPUT_FIELD,
    constraints: {
      ...REQUIRED_CONSTRAINT,
      ...INPUT_TYPE_CONSTRAINT,
      ...REVENUE_AMOUNT_CONSTRAINT
    },
    style: PERCENTAGE_INPUT,
    initialValue: value
  });
};

export const REVENUE_SALES_AMOUNT_FIELD = value => {
  const currency = process.env.REACT_APP_ZONE === 'US' ? USD_INPUT : EURO_INPUT;

  return buildFormField({
    label: FORM_FIELDS.SALES_REWARD_AMOUNT,
    type: INPUT_TYPE.EXTENDED_INPUT_FIELD,
    constraints: {
      ...REQUIRED_CONSTRAINT,
      ...INPUT_TYPE_CONSTRAINT,
      ...DECIMAL_REWARDS_AMOUNT_CONSTRAINT
    },
    style: currency,
    initialValue: value
  });
};

export const MIN_REWARD_THRESHOLD_FIELD = min => {
  const currency = process.env.REACT_APP_ZONE === 'US' ? USD_INPUT : EURO_INPUT;

  return buildFormField({
    label: FORM_FIELDS.MIN_REWARD_THRESHOLD,
    type: INPUT_TYPE.EXTENDED_INPUT_FIELD,
    constraints: { ...INPUT_TYPE_CONSTRAINT, ...NUMBER_WITH_DECIMALS_CONSTRAINT },
    style: {
      ...NUMBER_FIELD,
      ...currency
    },
    initialValue: min
  });
};

export const MAX_REWARD_THRESHOLD_FIELD = max => {
  const currency = process.env.REACT_APP_ZONE === 'US' ? USD_INPUT : EURO_INPUT;

  return buildFormField({
    label: FORM_FIELDS.MAX_REWARD_THRESHOLD,
    type: INPUT_TYPE.EXTENDED_INPUT_FIELD,
    constraints: { ...INPUT_TYPE_CONSTRAINT, ...NUMBER_WITH_DECIMALS_CONSTRAINT },
    style: { ...NUMBER_FIELD, ...currency },
    initialValue: max
  });
};

export const MIN_SALES_THRESHOLD_FIELD = min => {
  return buildFormField({
    label: FORM_FIELDS.MIN_SALES_THRESHOLD,
    type: INPUT_TYPE.EXTENDED_INPUT_FIELD,
    constraints: { ...INPUT_TYPE_CONSTRAINT, ...NUMBER_CONSTRAINT },
    style: { ...NUMBER_FIELD, ...UNIT_INPUT },
    initialValue: min
  });
};

export const MAX_SALES_THRESHOLD_FIELD = max => {
  return buildFormField({
    label: FORM_FIELDS.MAX_SALES_THRESHOLD,
    type: INPUT_TYPE.EXTENDED_INPUT_FIELD,
    constraints: { ...INPUT_TYPE_CONSTRAINT, ...NUMBER_CONSTRAINT },
    style: { ...NUMBER_FIELD, ...UNIT_INPUT },
    initialValue: max
  });
};

export const REWARD_RATIO_PER_PURCHASE_FIELD = value => {
  return buildFormField({
    label: FORM_FIELDS.REWARD_RATIO_PER_PURCHASE,
    type: INPUT_TYPE.EXTENDED_INPUT_FIELD,
    constraints: {
      ...REQUIRED_CONSTRAINT,
      ...INPUT_TYPE_CONSTRAINT,
      ...REVENUE_AMOUNT_CONSTRAINT
    },
    style: PERCENTAGE_INPUT,
    initialValue: value
  });
};

export const REWARD_AMOUNT_PER_PURCHASE_FIELD = value => {
  const currency = process.env.REACT_APP_ZONE === 'US' ? USD_INPUT : EURO_INPUT;

  return buildFormField({
    label: FORM_FIELDS.REWARD_AMOUNT_PER_PURCHASE,
    type: INPUT_TYPE.EXTENDED_INPUT_FIELD,
    constraints: {
      ...REQUIRED_CONSTRAINT,
      ...INPUT_TYPE_CONSTRAINT,
      ...NUMBER_WITH_DECIMALS_CONSTRAINT
    },
    style: currency,
    initialValue: value
  });
};

export const MIN_AMOUNT_PURCHASE_FIELD = min => {
  const currency = process.env.REACT_APP_ZONE === 'US' ? USD_INPUT : EURO_INPUT;

  return buildFormField({
    label: FORM_FIELDS.MIN_PURCHASE_THRESHOLD,
    type: INPUT_TYPE.EXTENDED_INPUT_FIELD,
    constraints: { ...INPUT_TYPE_CONSTRAINT, ...NUMBER_CONSTRAINT, ...NUMBER_WITH_DECIMALS_CONSTRAINT },
    style: { ...NUMBER_FIELD, ...currency },
    initialValue: min
  });
};

export const MAX_AMOUNT_PURCHASE_FIELD = max => {
  const currency = process.env.REACT_APP_ZONE === 'US' ? USD_INPUT : EURO_INPUT;

  return buildFormField({
    label: FORM_FIELDS.MAX_PURCHASE_THRESHOLD,
    type: INPUT_TYPE.EXTENDED_INPUT_FIELD,
    constraints: { ...INPUT_TYPE_CONSTRAINT, ...NUMBER_CONSTRAINT, ...NUMBER_WITH_DECIMALS_CONSTRAINT },
    style: { ...NUMBER_FIELD, ...currency },
    initialValue: max
  });
};

export const BASE_EXTENDED_FIELD = buildFormField({
  type: INPUT_TYPE.EXTENDED_INPUT_FIELD,
  constraints: { ...INPUT_TYPE_CONSTRAINT, ...NUMBER_CONSTRAINT },
  style: { ...NUMBER_FIELD, ...UNIT_INPUT }
});

export const MIN_NO_PURCHASE_FIELD = min => {
  return {
    ...BASE_EXTENDED_FIELD,
    label: FORM_FIELDS.MIN_PURCHASE_THRESHOLD,
    constraints: { ...INPUT_TYPE_CONSTRAINT, ...NUMBER_CONSTRAINT, ...NUMBER_WITH_DECIMALS_CONSTRAINT },
    initialValue: min
  };
};

export const MAX_NO_PURCHASE_FIELD = max => {
  return {
    ...BASE_EXTENDED_FIELD,
    label: FORM_FIELDS.MAX_PURCHASE_THRESHOLD,
    initialValue: max
  };
};

export const SPONSORSHIP_INFO_FIELD = value => {
  const currency = process.env.REACT_APP_ZONE === 'US' ? USD_INPUT : EURO_INPUT;

  return buildFormField({
    label: FORM_FIELDS.SPONSORSHIP_REWARD,
    type: INPUT_TYPE.EXTENDED_INPUT_FIELD,
    constraints: {
      ...REQUIRED_CONSTRAINT,
      ...INPUT_TYPE_CONSTRAINT,
      ...NUMBER_WITH_DECIMALS_CONSTRAINT
    },
    style: currency,
    initialValue: value
  });
};

export const MIN_SPONSORSHIP_THRESHOLD_FIELD = value => {
  return buildFormField({
    label: FORM_FIELDS.MIN_SPONSORSHIP_THRESHOLD,
    type: INPUT_TYPE.EXTENDED_INPUT_FIELD,
    constraints: { ...INPUT_TYPE_CONSTRAINT, ...NUMBER_CONSTRAINT },
    style: { ...NUMBER_FIELD, ...UNIT_INPUT },
    initialValue: value
  });
};

export const MAX_SPONSORSHIP_THRESHOLD_FIELD = initial => {
  return buildFormField({
    label: FORM_FIELDS.MAX_SPONSORSHIP_THRESHOLD,
    type: INPUT_TYPE.EXTENDED_INPUT_FIELD,
    constraints: { ...INPUT_TYPE_CONSTRAINT, ...NUMBER_CONSTRAINT },
    style: { ...NUMBER_FIELD, ...UNIT_INPUT },
    initialValue: initial
  });
};

export const TAILORED_FORM_TYPE = 'tailored';

export const TITLE_FIELD = {
  ...buildFormField({
    label: FORM_FIELDS.TITLE,
    type: INPUT_TYPE.RADIO,
    constraints: BASE_RADIO_CONSTRAINT_GROUP,
    style: { ...NON_FLOATING_ELEMENT, ...CENTER_ELEMENT, ...IS_INLINE }
  }),
  options: TITLE_OPTIONS
};

export const COMPANY_NAME_FIELD = buildFormField({ label: FORM_FIELDS.COMPANY_NAME });
export const SPONSORSHIP_COMPANY_NAME_FIELD = buildFormField({ label: FORM_FIELDS.SPONSORSHIP_COMPANY_NAME, constraints:""});
export const PHONE_NUMBER_FIELD = buildFormField({
  type: INPUT_TYPE.TEL,
  label: FORM_FIELDS.PHONE_NUMBER,
  constraints: PHONE_CONSTRAINT_GROUP
});

export const INTERESTED_IN_FIELD = {
  ...buildFormField({
    label: FORM_FIELDS.INTERESTED_IN,
    type: INPUT_TYPE.DROPDOWN,
    constraints: DROPDOWN_CONSTRAINT_GROUP,
    initialValue: { label: '', value: '' }
  }),
  options: INTERESTED_IN_OPTIONS
};

export const INCENTIVE_MONTHLY_BUDGET_FIELD = {
  ...buildFormField({
    label: FORM_FIELDS.INCENTIVE_MONTHLY_BUDGET,
    type: INPUT_TYPE.DROPDOWN,
    constraints: DROPDOWN_CONSTRAINT_GROUP,
    initialValue: { label: '', value: '' }
  }),
  options: INCENTIVE_MONTHLY_BUDGET_OPTIONS
};

export const WEBSITE_URL_FIELD = buildFormField({
  label: FORM_FIELDS.WEBSITE_URL,
  constraints: { ...CONTACT_URL_REGEXP_CONSTRAINT, ...INPUT_TYPE_CONSTRAINT }
});

export const EMAIL_FIELD = buildFormField({
  label: FORM_FIELDS.EMAIL,
  type: FORM_FIELDS.EMAIL,
  constraints: EMAIL_INPUT_CONSTRAINT
});

export const PASSWORD_FIELD = buildFormField({
  label: FORM_FIELDS.PASSWORD,
  type: INPUT_TYPE.PASSWORD,
  constraints: PASSWORD_INPUT_CONSTRAINT_GROUP
});

export const OLD_PASSWORD_FIELD = { ...PASSWORD_FIELD, label: FORM_FIELDS.OLD_PASSWORD };

export const CREATE_ACCOUNT_PASSWORD_FIELD = buildFormField({
  label: CREATE_ACCOUNT_PASSWORD,
  type: INPUT_TYPE.PASSWORD,
  constraints: PASSWORD_INPUT_CONSTRAINT_GROUP
});

export const PASSWORD_CONFIRMATION_FIELD = buildFormField({
  label: FORM_FIELDS.PASSWORD_CONFIRMATION,
  type: INPUT_TYPE.PASSWORD,
  constraints: PASSWORD_INPUT_CONSTRAINT_GROUP
});

export const EXCLUSIVE_MARKETS_FIELD = {
  ...buildFormField({
    label: FORM_FIELDS.EXCLUSIVE_MARKETS,
    type: INPUT_TYPE.RADIO,
    initialValue: RADIO_DEFAULT_TYPE.REFUSE
  }),
  options: RADIO_DEFAULT_OPTIONS
};

export const START_DATE_FIELD = buildFormField({
  label: FORM_FIELDS.START_DATE,
  type: INPUT_TYPE.DATETIME,
  constraints: DATE_INPUT_CONSTRAINT_GROUP,
  initialValue: new Date(),
  minDate: () => new Date()
});

//-------------------------------------------------------------------------------------


export const SPONSORSHIP_CIVILITY = {
  ...buildFormField({
    label: FORM_FIELDS.SPONSORSHIP_TITLE,
    type: INPUT_TYPE.RADIO,
    constraints: BASE_INPUT_CONSTRAINT_GROUP,
    style: { ...NON_FLOATING_ELEMENT, ...CENTER_ELEMENT }
  }),
  options: TITLE_OPTIONS_FRENCH
};
export const SPONSORSHIP_EMAIL= buildFormField({
  label: FORM_FIELDS.SPONSORSHIP_EMAIL,
  type: FORM_FIELDS.EMAIL,
  constraints: EMAIL_INPUT_CONSTRAINT
}) 
export const SPONSORSHIP_PHONE_NUMBER= buildFormField({
  label: FORM_FIELDS.SPONSORSHIP_PHONE_NUMBER,
  constraints: PHONE_CONSTRAINT_GROUP
}) 
export const SPONSORSHIP_ADDRESS= buildFormField({
  label: FORM_FIELDS.SPONSORSHIP_ADDRESS,
  type: INPUT_TYPE.TEXT
}) 
export const SPONSORSHIP_ZIPCODE= buildFormField({
  label: FORM_FIELDS.SPONSORSHIP_ZIPCODE,
  type: INPUT_TYPE.TEXT
}) 
export const SPONSORSHIP_CITY= buildFormField({
  label: FORM_FIELDS.SPONSORSHIP_CITY,
  type: INPUT_TYPE.TEXT
}) 
export const SPONSORSHIP_FIRSTNAME= buildFormField({
  label: FORM_FIELDS.SPONSORSHIP_FIRSTNAME,
  type: INPUT_TYPE.TEXT,
  value: "",
  constraints: { ...INPUT_TYPE_CONSTRAINT, ...REQUIRED_CONSTRAINT }
  
}) 
export const SPONSORSHIP_LASTNAME= buildFormField({
  label: FORM_FIELDS.SPONSORSHIP_LASTNAME,
  type: INPUT_TYPE.TEXT
}) 

//------------------------------------------------------------------
export const DURATION_DATE_FIELD = duration =>
  buildFormField({
    label: FORM_FIELDS.PROGRAM_DURATION,
    type: INPUT_TYPE.MULTIPLE_DATETIME,
    constraints: DATE_INPUT_CONSTRAINT_GROUP,
    initialValue: {
      start: (duration && new Date(duration.start)) || new Date(MomentUtilities.getStartOfDay(new Date())),
      end: (duration && new Date(duration.end)) || ''
    }
  });

export const WHY_PROMOTE_FIELD = buildFormField({
  label: FORM_FIELDS.WHY_PROMOTE,
  style: NON_FLOATING_ELEMENT
});

export const KIND_OF_PROGRAMS_FIELD = buildFormField({
  label: FORM_FIELDS.KIND_OF_PROGRAMS,
  style: { ...NON_FLOATING_ELEMENT, ...CENTER_ELEMENT }
});

export const NUMBER_OF_PROGRAMS_FIELD = buildFormField({
  label: FORM_FIELDS.NUMBER_OF_PROGRAMS,
  type: INPUT_TYPE.NUMBER,
  constraints: { ...NUMBER_INPUT_CONSTRAINT, ...REQUIRED_TRIMMED_CONSTRAINT },
  initialValue: '',
  style: { ...NON_FLOATING_ELEMENT, ...CENTER_ELEMENT }
});

export const NUMBER_OF_MEMBERS_FIELD = buildFormField({
  label: FORM_FIELDS.NUMBER_OF_MEMBERS,
  type: INPUT_TYPE.NUMBER,
  constraints: { ...NUMBER_INPUT_CONSTRAINT, ...REQUIRED_TRIMMED_CONSTRAINT },
  initialValue: '',
  style: { ...NON_FLOATING_ELEMENT, ...CENTER_ELEMENT }
});

export const CONNECT_CRM_FIELD = {
  ...buildFormField({
    label: FORM_FIELDS.CONNECT_CRM,
    type: INPUT_TYPE.RADIO_TEXT,
    constraints: BASE_INPUT_CONSTRAINT_GROUP,
    initialValue: RADIO_DEFAULT_TYPE.REFUSE,
    style: { ...NON_FLOATING_ELEMENT, ...CENTER_ELEMENT }
  }),
  options: RADIO_DEFAULT_OPTIONS
};

export const HOW_MANY_USERS_FIELD = buildFormField({
  label: FORM_FIELDS.HOW_MANY_USERS,
  type: INPUT_TYPE.NUMBER,
  constraints: { ...NUMBER_INPUT_CONSTRAINT, ...REQUIRED_TRIMMED_CONSTRAINT },
  initialValue: '',
  style: CENTER_ELEMENT
});

export const USE_SPECIFIC_MARKET_FIELD = {
  ...buildFormField({
    label: FORM_FIELDS.USE_SPECIFIC_MARKET,
    type: INPUT_TYPE.RADIO_TEXT,
    constraints: BASE_INPUT_CONSTRAINT_GROUP,
    initialValue: RADIO_DEFAULT_TYPE.REFUSE,
    style: CENTER_ELEMENT
  }),
  options: RADIO_DEFAULT_OPTIONS
};

export const CONTACT_DATE_FIELD = buildFormField({
  label: FORM_FIELDS.CONTACT_DATE,
  type: INPUT_TYPE.DYNAMIC_DATETIME,
  constraints: { ...REQUIRED_CONSTRAINT, ...INPUT_TYPE_CONSTRAINT },
  initialValue: new Date(),
  style: COMPLEX_DATEPICKER
});

export const NEEDS_SUPER_ADMIN_FIELD = {
  ...buildFormField({
    label: FORM_FIELDS.NEEDS_SUPER_ADMIN,
    type: INPUT_TYPE.RADIO,
    initialValue: RADIO_DEFAULT_TYPE.REFUSE
  }),
  options: RADIO_DEFAULT_OPTIONS
};

export const SPECIFIC_URL_FIELD = {
  ...buildFormField({
    label: FORM_FIELDS.SPECIFIC_URL,
    type: INPUT_TYPE.RADIO_TEXT,
    constraints: BASE_INPUT_CONSTRAINT_GROUP,
    initialValue: RADIO_DEFAULT_TYPE.REFUSE,
    style: CENTER_ELEMENT
  }),
  options: RADIO_DEFAULT_OPTIONS
};

export const NEED_TRAINING_FIELD = {
  ...buildFormField({
    label: FORM_FIELDS.NEED_TRAINING,
    type: INPUT_TYPE.RADIO,
    initialValue: RADIO_DEFAULT_TYPE.REFUSE
  }),
  options: RADIO_DEFAULT_OPTIONS
};

export const USE_SPECIFIC_APPLICATIONS_FIELD = {
  ...buildFormField({
    label: FORM_FIELDS.USE_SPECIFIC_APPLICATIONS,
    type: INPUT_TYPE.RADIO_TEXT,
    constraints: BASE_INPUT_CONSTRAINT_GROUP,
    initialValue: RADIO_DEFAULT_TYPE.REFUSE,
    style: CENTER_ELEMENT
  }),
  options: RADIO_DEFAULT_OPTIONS
};

export const NUMBER_OF_EMAILS_PER_USERS_FIELD = buildFormField({
  label: FORM_FIELDS.NUMBER_OF_EMAILS_PER_USERS,
  type: INPUT_TYPE.NUMBER,
  constraints: { ...NUMBER_INPUT_CONSTRAINT, ...REQUIRED_TRIMMED_CONSTRAINT },
  initialValue: '',
  style: CENTER_ELEMENT
});

export const DATE_OF_EVENT_FIELD = buildFormField({
  label: FORM_FIELDS.DATE_OF_EVENT,
  type: INPUT_TYPE.DATETIME,
  constraints: { ...REQUIRED_CONSTRAINT, ...DATE_INPUT_CONSTRAINT_GROUP },
  maxDate: () => new Date()
});
export const DATE_OF_SPONSORSHIP_FIELD = buildFormField({
  label: FORM_FIELDS.DATE_OF_SPONSORSHIP,
  type: INPUT_TYPE.DATETIME,
  constraints: { ...REQUIRED_CONSTRAINT, ...DATE_INPUT_CONSTRAINT_GROUP },
  maxDate: () => new Date()
});

export const POSTAL_FIELD = buildFormField({
  label: FORM_FIELDS.POSTAL_CODE,
  type: INPUT_TYPE.NUMBER,
  constraints: { ...REQUIRED_CONSTRAINT, ...DATE_INPUT_CONSTRAINT_GROUP },
})

export const TIME_OF_SALE_FIELD = buildFormField({
  label: FORM_FIELDS.TIME_OF_SALE,
  type: INPUT_TYPE.DATETIME,
  style: TIME_FIELD,
  constraints: { ...REQUIRED_CONSTRAINT, ...DATE_INPUT_CONSTRAINT_GROUP }
});

export const CIVILITY_FIELD = buildFormField({
  label: FORM_FIELDS.CIVILITY,
  type: INPUT_TYPE.RADIO,
  style: TIME_FIELD,
  constraints: { ...REQUIRED_CONSTRAINT, ...DATE_INPUT_CONSTRAINT_GROUP }
});

export const AMOUNT_FIELD = buildFormField({
  label: FORM_FIELDS.AMOUNT,
  type: INPUT_TYPE.TEXT,
  style: { ...EURO_INPUT, ...FLOATING },
  min: 0.01,
  constraints: {
    ...REQUIRED_CONSTRAINT,
    ...INPUT_TYPE_CONSTRAINT,
    ...NUMBER_WITH_DECIMALS_CONSTRAINT
  }
});

export const QUANTITY_FIELD = buildFormField({
  label: FORM_FIELDS.QUANTITY,
  type: INPUT_TYPE.TEXT,
  style: { ...NUMBER_FIELD, ...FLOATING },
  min: 0.01,
  constraints: {
    ...REQUIRED_CONSTRAINT,
    ...INPUT_TYPE_CONSTRAINT,
    ...NUMBER_WITH_DECIMALS_CONSTRAINT
  }
});

export const CUSTOMER_REFERENCE_FIELD = buildFormField({
  label: FORM_FIELDS.CUSTOMER_REFERENCE
});
export const CONTRACT_REFERENCE_FIELD = buildFormField({ label: FORM_FIELDS.CONTRACT_REFERENCE });
export const PRODUCT_REFERENCE_FIELD = buildFormField({ label: FORM_FIELDS.PRODUCT_REFERENCE });
export const ADDITIONAL_COMMENTS_FIELD = buildFormField({
  type: INPUT_TYPE.TEXT,
  isTextArea: true,
  constraints: {
    type: STRING,
    ...REQUIRED_CONSTRAINT,
    min: USER_DECLARATION_COMMENTS_LENGTH.MIN,
    max: USER_DECLARATION_COMMENTS_LENGTH.MAX
  },
  label: FORM_FIELDS.ADDITIONAL_COMMENTS
});
export const PRODUCT_NAME_FIELD = buildFormField({
  type: INPUT_TYPE.DECLARATION_PRODUCT, 
  label: FORM_FIELDS.PRODUCT_NAME,
  constraints: { ...INPUT_TYPE_CONSTRAINT, ...REQUIRED_CONSTRAINT },
  
});

export const CONTACT_AGREEMENT = buildFormField({
  type: INPUT_TYPE.CHECKBOX,
  label: FORM_FIELDS.CONTACT_AGREEMENT,
  check: false,
  constraints: {}
})

export const MOBILE_NUMBER_FIELD = buildFormField({
  type: INPUT_TYPE.TEL,
  label: FORM_FIELDS.MOBILE_PHONE_NUMBER,
  constraints: PHONE_CONSTRAINT_GROUP
});

export const CONTACT_BIRTH_DATE_FIELD = buildFormField({
  label: FORM_FIELDS.BIRTH_DATE,
  type: INPUT_TYPE.DATETIME
});

export const ADDRESS_FIELD = buildFormField({
  label: FORM_FIELDS.ADDRESS,
  type: INPUT_TYPE.TEXT
});

export const ZIP_CODE_FIELD = buildFormField({
  label: FORM_FIELDS.ZIP_CODE,
  type: INPUT_TYPE.TEXT
});

export const CITY_FIELD = buildFormField({
  label: FORM_FIELDS.CITY,
  type: INPUT_TYPE.TEXT
});

export const COUNTRY_FIELD = buildFormField({
  label: FORM_FIELDS.COUNTRY,
  type: INPUT_TYPE.TEXT
});

export const FACEBOOK_FIELD = buildFormField({
  label: FORM_FIELDS.FACEBOOK,
  type: INPUT_TYPE.TEXT
});

export const TWITTER_FIELD = buildFormField({
  label: FORM_FIELDS.TWITTER,
  type: INPUT_TYPE.TEXT
});

export const LINKEDIN_FIELD = buildFormField({
  label: FORM_FIELDS.LINKEDIN,
  type: INPUT_TYPE.TEXT
});

export const PAYPAL_LINK_FIELD = buildFormField({
  label: FORM_FIELDS.PAYPAL,
  type: INPUT_TYPE.TEXT,
  hasExplanation: true
});

export const PROGRAM_ID_FIELD = buildFormField({
  label: FORM_FIELDS.PROGRAM_ID,
  type: INPUT_TYPE.DROPDOWN
});

export const BENEFICIARY_FIELD = buildFormField({
  label: FORM_FIELDS.BENEFICIARY,
  type: INPUT_TYPE.DROPDOWN
});

export const DECLARATION_PROOF_FILE_FIELD = (required = false, type = PROGRAM_TYPES[CHALLENGE]) => {
  const requiredConstraint = (required && REQUIRED_CONSTRAINT) || {};

  return buildFormField({
    label: PROOF_OF_SALE_TRANSLATION[type],
    type: INPUT_TYPE.FILE,
    hasExplanation: true,
    constraints: {
      type: FILE,
      [FILE_SIZE]: convertMbToBytes(PROOF_FILE_MB_MAX_SIZE),
      [FILE_EXTENSION]: PROOF_FILE_ACCEPTED_EXTENSIONS,
      ...requiredConstraint
    }
  });
};

export const NEW_PASSWORD_FIELD = buildFormField({
  label: FORM_FIELDS.NEW_PASSWORD,
  type: INPUT_TYPE.PASSWORD,
  constraints: PASSWORD_INPUT_CONSTRAINT_GROUP
});

export const NEW_PASSWORD_CONFIRMATION_FIELD = buildFormField({
  label: FORM_FIELDS.NEW_PASSWORD_CONFIRMATION,
  type: INPUT_TYPE.PASSWORD,
  constraints: PASSWORD_INPUT_CONSTRAINT_GROUP
});

export const ONBOARDING_EMAIL_FIELD = buildFormField({
  label: FORM_FIELDS.EMAIL,
  type: FORM_FIELDS.EMAIL,
  constraints: EMAIL_INPUT_CONSTRAINT,
  style: { ...ROUNDED_ELEMENT }
});

export const ONBOARDING_EMAIL_CONFIRMATION_FIELD = buildFormField({
  label: FORM_FIELDS.EMAIL_CONFIRMATION,
  type: FORM_FIELDS.EMAIL,
  constraints: EMAIL_INPUT_CONSTRAINT,
  style: { ...ROUNDED_ELEMENT }
});

export const ONBOARDING_CREATE_ACCOUNT_PASSWORD_FIELD = buildFormField({
  label: CREATE_ACCOUNT_PASSWORD,
  type: INPUT_TYPE.PASSWORD,
  constraints: PASSWORD_INPUT_CONSTRAINT_GROUP,
  style: { ...ROUNDED_ELEMENT }
});

export const ONBOARDING_PASSWORD_CONFIRMATION_FIELD = buildFormField({
  label: FORM_FIELDS.PASSWORD_CONFIRMATION,
  type: INPUT_TYPE.PASSWORD,
  constraints: PASSWORD_INPUT_CONSTRAINT_GROUP,
  style: { ...ROUNDED_ELEMENT }
});

export const ONBOARDING_FIRST_NAME_FIELD = buildFormField({
  label: FORM_FIELDS.FIRST_NAME,
  style: ROUNDED_ELEMENT
});
export const ONBOARDING_LAST_NAME_FIELD = buildFormField({
  label: FORM_FIELDS.LAST_NAME,
  style: ROUNDED_ELEMENT
});
