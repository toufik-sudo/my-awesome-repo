import * as Yup from 'yup';

import {
  CONSTRAINT_FIELD_LIST,
  CUSTOM_CONSTRAINT_FIELD_LIST,
  FORM_FIELDS,
  FORM_FIELDS_WITH_CONFIRMATION,
  GENERIC_FORM_TYPES,
  INPUT_TYPE,
  INTEGER_REVENUE_AND_SALES_FIELDS,
  MATCH,
  MATCH_EMAIL,
  PASSWORD_STRENGTH_METER,
  RADIO_DEFAULT_TYPE
} from 'constants/forms';
import {
  BASE_INPUT_CONSTRAINT_GROUP,
  CONSTRAINTS,
  DATE,
  FILE,
  FILE_EXTENSION,
  FILE_SIZE,
  FILE_TYPE,
  HTTP,
  HTTPS,
  INPUT_LENGTH,
  INVALID_NUMBER,
  MATCHES_RULE,
  NUMBER,
  NUMBER_REGEXP,
  OBJECT,
  REGEX_LETTERS_LOWER_AND_UPPERCASE,
  REGEX_LETTERS_LOWERCASE,
  REGEX_MAX_LENGTH,
  REGEX_MIN_LENGTH,
  REGEX_MIN_LENGTH_FOUR,
  REGEX_NUMBERS,
  REGEX_NUMBERS_AND_COMMA,
  REGEX_SPECIAL_CHARACTERS,
  REGEX_TELEPHONE_NUMBER,
  REGEX_URL_SPECIAL_CHARACTERS,
  REQUIRED,
  SINGLE_VALIDATION_FIELDS,
  URL_REGEXP,
  STRING,
  TYPE,
  VALIDATION_FIELDS
} from 'constants/validation';
import { IFormField } from 'interfaces/forms/IForm';
import { IContactMainForm, IProcessedResellerForm, IResellerForm, ITailoredForm } from 'interfaces/IModals';
import { BACKSPACE, NON_NUMERIC_VALUES } from 'constants/general';
import { hasExtension, isFileOfType } from 'utils/files';
import { RANKING } from 'constants/api';

export const baseContactLogForm = (values, type) => {
  const { lastName, firstName, email } = values;

  return {
    lastName,
    firstName,
    email,
    type
  };
};

/**
 * Method processes data from reseller form to be sent to BE
 *
 * @param values
 * NOTE: tested
 */
export const processResellerForm: (values: IResellerForm) => IProcessedResellerForm = values => {
  const { exclusiveMarket, phoneNumber, targetedMarkets, startDate, companyName, whyPromote } = values;

  return {
    ...baseContactLogForm(values, GENERIC_FORM_TYPES.RESELLER),
    data: {
      exclusiveMarket: exclusiveMarket === RADIO_DEFAULT_TYPE.ACCEPT,
      phoneNumber,
      targetedMarkets,
      companyName,
      startDate: startDate.toISOString(),
      whyPromote
    }
  };
};

/**
 * Method build a validation schema to be used in Yup validation for formik
 *
 * @param formFields
 */
export const buildValidationSchema = (formFields: IFormField[]) => {
  let validationSchema = {};

  formFields.forEach(field => {
    if (!field) {
      return;
    }
    Object.keys(field).forEach(key => {
      if (key !== CONSTRAINTS) {
        return;
      }
      validationSchema = setFirstSchemaField(validationSchema, field, key);

      Object.keys(field[key])
        .filter(constraint => constraint !== TYPE)
        .forEach(constraint => {
          validationSchema = addFieldErrorToSchema(validationSchema, field, key, constraint);
        });
    });
  });

  return validationSchema;
};

/**
 * Initialize first schema method based on it's type
 *
 * @param validationSchema
 * @param field
 * @param key
 */
const setFirstSchemaField = (validationSchema, field, key) => {
  let validationSchemaBuild = { ...validationSchema };
  const fieldType = field[key].type;

  if (fieldType === STRING || fieldType === DATE) {
    validationSchemaBuild = { ...validationSchema, [field.label]: Yup[fieldType]() };
  }

  if (fieldType === OBJECT) {
    validationSchemaBuild = {
      ...validationSchema,
      [field.label]: Yup[fieldType]({
        value: Yup.string().required(REQUIRED)
      })
    };
  }

  if (fieldType === FILE) {
    validationSchemaBuild = {
      ...validationSchema,
      [field.label]: Yup.mixed()
    };
  }

  return validationSchemaBuild;
};

/**
 * Method adds to the existing schema (validationSchema) a new field based on the current position
 *
 * @param validationSchema
 * @param field
 * @param key
 * @param constraint
 */
const addFieldErrorToSchema = (validationSchema, field, key, constraint) => {
  const validationField = validationSchema[field.label];
  const ruleMessage = VALIDATION_FIELDS[constraint.toUpperCase()];
  let ruleSet = constraint;
  let fieldLabelValue = null;

  if (CUSTOM_CONSTRAINT_FIELD_LIST.includes(constraint)) {
    return addCustomFieldConstraintsToSchema(validationSchema, field, key, constraint);
  }

  if (CONSTRAINT_FIELD_LIST.includes(constraint)) {
    ruleSet = MATCHES_RULE;
  }

  if( validationField[ruleSet]){
    fieldLabelValue = validationField[ruleSet](field[key][constraint], ruleMessage).nullable();
  }

  if (SINGLE_VALIDATION_FIELDS.includes(constraint)) {
    fieldLabelValue = validationField[ruleSet](`${ruleMessage}`);
  }

  if (Object.keys(FORM_FIELDS_WITH_CONFIRMATION).indexOf(field.label) !== -1) {
    fieldLabelValue = validationField
      .oneOf(
        [Yup.ref(FORM_FIELDS_WITH_CONFIRMATION[field.label]), null],
        field.label === FORM_FIELDS.EMAIL_CONFIRMATION ? MATCH_EMAIL : MATCH
      )
      .required(REQUIRED);
  }

  return { ...validationSchema, [field.label]: fieldLabelValue };
};

const addCustomFieldConstraintsToSchema = (validationSchema, field, key, constraint) => {
  const ruleMessage = VALIDATION_FIELDS[constraint.toUpperCase()];
  let validationTest;

  if (constraint === FILE_SIZE) {
    validationTest = value => !value || value.size < field[key][constraint];
  }

  if (constraint === FILE_TYPE) {
    validationTest = value => !value || isFileOfType(value, field[key][constraint].toString());
  }

  if (constraint === FILE_EXTENSION) {
    validationTest = value => !value || hasExtension(value, field[key][constraint]);
  }

  const fieldLabelValue = validationTest && validationSchema[field.label].test(constraint, ruleMessage, validationTest);

  return { ...validationSchema, [field.label]: fieldLabelValue };
};

/**
 * Method processes data from contact main form to be sent to BE
 * @param values
 */
export const processContactMainForm = (values: IContactMainForm) => {
  const { incentiveMonthlyBudget, interestedIn, phoneNumber, websiteUrl } = values;
  const processedValues = {
    ...baseContactLogForm(values, GENERIC_FORM_TYPES.CONTACT_MAIN),
    data: {
      incentiveMonthlyBudget: incentiveMonthlyBudget.value as string,
      phoneNumber,
      websiteUrl,
      interestedIn: interestedIn.value
    }
  };

  // Delete website url if the value is the prefix of the url
  if (websiteUrl === HTTP || websiteUrl === HTTPS) {
    delete processedValues.data.websiteUrl;
  }

  return processedValues;
};

/**
 * Method processes data from tailored form to be sent to BE
 * @param values
 */
export const processTailoredForm = (values: ITailoredForm) => {
  const {
    companyName,
    title,
    companyRole,
    kindOfPrograms,
    numberOfPrograms,
    numberOfMembers,
    connectCrm,
    howManyUsers,
    useSpecificMarket,
    numberOfEmailsPerUser,
    useSpecificApplications,
    needTraining,
    specificUrl,
    needsSuperAdmin,
    phoneNumber
  } = values;

  const processedObject = {
    ...baseContactLogForm(values, GENERIC_FORM_TYPES.TAILORED),
    data: {
      title,
      companyRole,
      howManyUsers,
      useSpecificMarket,
      numberOfEmailsPerUser,
      useSpecificApplications,
      needTraining,
      needsSuperAdmin,
      kindOfPrograms,
      numberOfPrograms: numberOfPrograms,
      numberOfMembers: numberOfMembers,
      companyName,
      specificUrl,
      connectCrm,
      phoneNumber,
      contactDates: getContactDates(values)
    }
  };

  Object.keys(values).forEach(key => {
    if (values[key] === RADIO_DEFAULT_TYPE.REFUSE) {
      processedObject.data[key] = false;
    }
    if (values[key] === RADIO_DEFAULT_TYPE.ACCEPT) {
      processedObject.data[key] = values[`${key}Additional`] || true;
    }
  });

  return processedObject;
};

/**
 * Method finds current field to be deleted in a values formik object
 *
 * @param dateInputCount
 * @param setDateInputCount
 * @param values
 * @param key
 */
export const deleteContactInput = (dateInputCount, setDateInputCount, values, key) => {
  const currentDeletedInput = dateInputCount.find((input, index) => index === key);
  setDateInputCount(dateInputCount.filter((input, index) => index !== key));
  delete values[currentDeletedInput];
};

/**
 * Method returns an array of valid dates
 *
 * @param dateInputCount
 * @param values
 */
export const getValidDates = (dateInputCount, values) =>
  dateInputCount.map(input => values[input]).filter(input => input).length;

/**
 * Method creates a field to be used inside a radio text custom field
 *
 * @param additionalField
 */
export const getAdditionalField = additionalField => {
  return {
    additionalField: true,
    label: additionalField,
    type: INPUT_TYPE.TEXT,
    constraints: BASE_INPUT_CONSTRAINT_GROUP
  };
};

/**
 * Method adds a new date field with a random id
 *
 * @param dateInputCount
 * @param label
 * @param setDateInputCount
 */
export const addNewDate = (dateInputCount, label, setDateInputCount) => {
  const fieldName = `${label}-field-${Math.random()
    .toString(36)
    .substr(2, 5)}`;
  setDateInputCount([...dateInputCount, fieldName]);
};

/**
 * Method returns an array of valid dates
 *
 * @param values
 */
export const getContactDates = values =>
  Object.keys(values)
    .map(key => key.startsWith(FORM_FIELDS.CONTACT_DATE) && values[key].toISOString())
    .filter(input => input);

/**
 * Method returns a intl message or a value from strength mater array
 *
 * @param score
 * @param formatMessage
 * @param intlResult
 */
export const createPasswordLabel = (score, { formatMessage }, intlResult) => {
  const passwordLevel = PASSWORD_STRENGTH_METER[score];
  if (!intlResult) {
    return passwordLevel;
  }

  return formatMessage({ id: `form.label.passwordMeter.${passwordLevel}` });
};

/**
 * Method retrieves initial values from a field definition
 *
 * @param formDeclaration
 */
export const getInitialValues: <FormType>(formDeclaration: IFormField[]) => FormType = formDeclaration => {
  const initialValues: any = {};

  formDeclaration.forEach(field => {
    initialValues[field.label] = field.initialValue;
  });

  return initialValues;
};

/**
 * Method build a form field with some default values
 *
 * @param label
 * @param type
 * @param hasExplanation field used to mark the given input that it should render a explanation as well
 * @param constraints
 * @param initialValue
 * @param service
 *
 * NOTE: Used any since it can have any constraint interface
 */
export const buildFormField: (props) => IFormField = ({
  label,
  hasExplanation = undefined,
  type = INPUT_TYPE.TEXT,
  constraints = BASE_INPUT_CONSTRAINT_GROUP,
  initialValue = '',
  maxValue = '',
  style = null,
  ...rest
}) => {
  return {
    label,
    type,
    constraints,
    initialValue,
    maxValue,
    style,
    hasExplanation,
    ...rest
  };
};

/**
 * Method used to set input type number custom error (based on different browser behavior)
 *
 * @param type
 * @param label
 * @param values
 * @param errors
 * @param setFieldError
 */
export const setNumberInputErrors = ({ type, label, constraints }, { values, errors, setFieldError }) => {
  if (type === NUMBER && values[label] <= 0 && !errors[label] && constraints.required) {
    setFieldError(label, INVALID_NUMBER);
  }
};

export const getOptionText = (text, before, after) => {
  return `${before}${text}${after}`;
};

export const processOptionsText = (type, { loyaltyText, challengeText, sponsorshipText }: any, before, after = '') => {
  if (type === 'challenge') {
    return getOptionText(challengeText, before, after);
  }

  if (type === 'loyalty') {
    return getOptionText(loyaltyText, before, after);
  }

  return getOptionText(sponsorshipText, before, after);
};

/**
 * Method blocks the +, -, e character on numeric input
 *
 * @param event
 */
export const blockNumberInvalidCharacters = event => {
  if (event.key === BACKSPACE) return;
  if (!event.key.match(/^[0-9]+$/)) event.preventDefault();

  return NON_NUMERIC_VALUES.forEach(value => event.key === value && event.preventDefault());
};

export const getPasswordFormValidation = value => {
  return [
    {
      text: 'form.label.passwordRequirements.min.characters',
      value: REGEX_MIN_LENGTH.test(value)
    },
    {
      text: 'form.label.passwordRequirements.max.characters',
      value: REGEX_MAX_LENGTH.test(value)
    },
    {
      text: 'form.label.passwordRequirements.letters',
      value: REGEX_LETTERS_LOWER_AND_UPPERCASE.test(value)
    },
    {
      text: 'form.label.passwordRequirements.special.character',
      value: REGEX_SPECIAL_CHARACTERS.test(value)
    },
    {
      text: 'form.label.passwordRequirements.number',
      value: REGEX_NUMBERS.test(value)
    }
  ];
};

/**
 * Method used to validate an url
 * @param url
 */
export const validateUrl = (url: string) => URL_REGEXP.test(url);

/**
 * Returns whether given form field is required
 * @param field
 */
export const isFieldRequired = (field: IFormField) => field.constraints && field.constraints['required'];

/**
 * Maps an array to an array that contains label/value field used for Select component
 *
 * @param valueField
 * @param labelValue
 */
export const buildLabelValue = (valueField = 'id', labelValue = 'name') => elem => ({
  value: elem[valueField],
  label: elem[labelValue]
});

/**
 * Validates a given string
 * @param input
 * @param validation
 */
export const validateTextInput = (input, validation = {} as any) => {
  if (!input) return 'form.validation.required';
  const testingInput = !validation.ignoreBlank ? input.trim() : input;
  if (testingInput.length < (validation.min || INPUT_LENGTH.MIN)) return 'form.validation.min';
  if (testingInput.length > (validation.max || INPUT_LENGTH.MAX)) return 'form.validation.max';
  return null;
};

/**
 * Method sets target field value by another field
 * @param form
 * @param fieldToChange
 * @param fieldToChangeFrom
 */
export const setUrlField = (form, fieldToChange, fieldToChangeFrom) => {
  let extendUrlFieldValue = '';
  const initialUrl = form.initialValues[fieldToChange];
  const extendUrlFromDoc = document.getElementsByName(fieldToChangeFrom);

  if (extendUrlFromDoc.length) {
    // @ts-ignore
    extendUrlFieldValue = extendUrlFromDoc[0].value;
  }

  form.setFieldValue(fieldToChange, initialUrl + extendUrlFieldValue);
};

/**
 * Returns customUrl field error labels
 * @param value
 */
export const getCustomUrlFieldFormValidation = value => {
  return [
    {
      text: 'form.label.customUrl.min.characters',
      value: REGEX_MIN_LENGTH_FOUR.test(value)
    },
    {
      text: 'form.label.customUrl.letters',
      value: REGEX_LETTERS_LOWERCASE.test(value)
    },
    {
      text: 'form.label.customUrl.special.character',
      value: !REGEX_URL_SPECIAL_CHARACTERS.test(value)
    }
  ];
};

/**
 * Method prevent event default for form field
 * @param e
 * @param label
 */
export const disableCubeFieldsInvalidChars = (e, label) => {
  const checkForInteger = INTEGER_REVENUE_AND_SALES_FIELDS.includes(label);
  if (e.key === BACKSPACE) return;
  if (!REGEX_NUMBERS_AND_COMMA.test(e.key) || (checkForInteger && !NUMBER_REGEXP.test(e.key))) {
    e.preventDefault();
  }
};

/**
 * Method prevent event default for form field
 * @param type
 * @param e
 */
export const disableBracketsInputAdd = (e, type) => {
  if (e.key === BACKSPACE) return;
  if (type === RANKING) return NUMBER_REGEXP.test(e.target.value);

  return REGEX_NUMBERS_AND_COMMA.test(e.target.value);
};

/**
 * Method prevent event default for telephone type form field
 * @param e
 */
export const blockInvalidTelephone = e => {
  return !REGEX_TELEPHONE_NUMBER.test(e.key) && e.preventDefault();
};

/**
 * Method prevent event default for telephone or number type form field
 * @param e
 * @param type
 */
export const blockFieldInvalidNumberOrPhone = (e, type) => {
  if (e.key === BACKSPACE) return;
  if (type === INPUT_TYPE.TEL) return blockInvalidTelephone(e);

  return blockNumberInvalidCharacters(e);
};
