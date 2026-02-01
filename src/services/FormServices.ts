/**
 * Form Services
 * Migrated from old_app/src/services/FormServices.ts
 */

import * as Yup from 'yup';
import type { IFormField, IFormDropdownOption } from '@/types/forms/IForm';
import type {
  IResellerForm,
  IContactMainForm,
  ITailoredForm,
  IProcessedResellerForm
} from '@/types/IModals';
import {
  FORM_FIELDS,
  INPUT_TYPE,
  GENERIC_FORM_TYPES,
  RADIO_DEFAULT_TYPE,
  CONSTRAINT_FIELD_LIST,
  CUSTOM_CONSTRAINT_FIELD_LIST,
  FORM_FIELDS_WITH_CONFIRMATION,
  INTEGER_REVENUE_AND_SALES_FIELDS,
  PASSWORD_STRENGTH_METER,
  MATCH,
  MATCH_EMAIL
} from '@/constants/forms';
import {
  CONSTRAINTS,
  TYPE,
  STRING,
  OBJECT,
  FILE,
  DATE,
  HTTP,
  HTTPS,
  INPUT_LENGTH,
  INVALID_NUMBER,
  NUMBER,
  MATCHES_RULE,
  REQUIRED,
  SINGLE_VALIDATION_FIELDS,
  VALIDATION_FIELDS,
  URL_REGEXP,
  REGEX_MIN_LENGTH,
  REGEX_MAX_LENGTH,
  REGEX_LETTERS_LOWER_AND_UPPERCASE,
  REGEX_SPECIAL_CHARACTERS,
  REGEX_NUMBERS,
  REGEX_MIN_LENGTH_FOUR,
  REGEX_LETTERS_LOWERCASE,
  REGEX_URL_SPECIAL_CHARACTERS,
  REGEX_NUMBERS_AND_COMMA,
  NUMBER_REGEXP,
  REGEX_TELEPHONE_NUMBER,
  BASE_INPUT_CONSTRAINT_GROUP
} from '@/constants/validation';
import { isFileOfType, hasExtension } from '@/utils/files';
import { BACKSPACE, NON_NUMERIC_VALUES } from '@/utils/general';

/**
 * Base contact log form data
 */
export const baseContactLogForm = (values: any, type: GENERIC_FORM_TYPES) => {
  const { lastName, firstName, email } = values;
  return {
    lastName,
    firstName,
    email,
    type
  };
};

/**
 * Process reseller form data for API
 */
export const processResellerForm = (values: IResellerForm): IProcessedResellerForm => {
  const { exclusiveMarket, phoneNumber, targetedMarkets, startDate, companyName, whyPromote } = values;

  return {
    ...baseContactLogForm(values, GENERIC_FORM_TYPES.RESELLER),
    data: {
      exclusiveMarket: exclusiveMarket === RADIO_DEFAULT_TYPE.ACCEPT,
      phoneNumber,
      targetedMarkets,
      companyName,
      startDate: startDate.toISOString()
    }
  };
};

/**
 * Process contact main form data for API
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

  // Delete website url if the value is just the prefix
  if (websiteUrl === HTTP || websiteUrl === HTTPS) {
    delete (processedValues.data as any).websiteUrl;
  }

  return processedValues;
};

/**
 * Process tailored form data for API
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

  const processedObject: any = {
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
      numberOfPrograms,
      numberOfMembers,
      companyName,
      specificUrl,
      connectCrm,
      phoneNumber,
      contactDates: getContactDates(values)
    }
  };

  Object.keys(values).forEach(key => {
    if ((values as any)[key] === RADIO_DEFAULT_TYPE.REFUSE) {
      processedObject.data[key] = false;
    }
    if ((values as any)[key] === RADIO_DEFAULT_TYPE.ACCEPT) {
      processedObject.data[key] = (values as any)[`${key}Additional`] || true;
    }
  });

  return processedObject;
};

/**
 * Initialize first schema field based on its type
 */
const setFirstSchemaField = (validationSchema: any, field: IFormField, key: string) => {
  let validationSchemaBuild = { ...validationSchema };
  const fieldType = (field as any)[key].type;

  if (fieldType === STRING || fieldType === DATE) {
    validationSchemaBuild = { ...validationSchema, [field.label]: (Yup as any)[fieldType]() };
  }

  if (fieldType === OBJECT) {
    validationSchemaBuild = {
      ...validationSchema,
      [field.label]: Yup.object({
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
 * Add custom field constraints to schema (file size, type, extension)
 */
const addCustomFieldConstraintsToSchema = (
  validationSchema: any,
  field: IFormField,
  key: string,
  constraint: string
) => {
  const ruleMessage = (VALIDATION_FIELDS as any)[constraint.toUpperCase()];
  let validationTest: ((value: any) => boolean) | undefined;

  if (constraint === 'fileSize') {
    validationTest = (value: any) => !value || value.size < (field as any)[key][constraint];
  }

  if (constraint === 'fileType') {
    validationTest = (value: any) => !value || isFileOfType(value, (field as any)[key][constraint].toString());
  }

  if (constraint === 'fileExtension') {
    validationTest = (value: any) => !value || hasExtension(value, (field as any)[key][constraint]);
  }

  const fieldLabelValue =
    validationTest && validationSchema[field.label].test(constraint, ruleMessage, validationTest);

  return { ...validationSchema, [field.label]: fieldLabelValue };
};

/**
 * Add field error to validation schema
 */
const addFieldErrorToSchema = (
  validationSchema: any,
  field: IFormField,
  key: string,
  constraint: string
) => {
  const validationField = validationSchema[field.label];
  const ruleMessage = (VALIDATION_FIELDS as any)[constraint.toUpperCase()];
  let ruleSet = constraint;
  let fieldLabelValue = null;

  if (CUSTOM_CONSTRAINT_FIELD_LIST.includes(constraint)) {
    return addCustomFieldConstraintsToSchema(validationSchema, field, key, constraint);
  }

  if (CONSTRAINT_FIELD_LIST.includes(constraint)) {
    ruleSet = MATCHES_RULE;
  }

  if (validationField[ruleSet]) {
    fieldLabelValue = validationField[ruleSet]((field as any)[key][constraint], ruleMessage).nullable();
  }

  if (SINGLE_VALIDATION_FIELDS.includes(constraint)) {
    fieldLabelValue = validationField[ruleSet](`${ruleMessage}`);
  }

  if (Object.keys(FORM_FIELDS_WITH_CONFIRMATION).indexOf(field.label as string) !== -1) {
    const confirmField = (FORM_FIELDS_WITH_CONFIRMATION as any)[field.label];
    fieldLabelValue = validationField
      .oneOf(
        [Yup.ref(confirmField), null],
        field.label === FORM_FIELDS.EMAIL_CONFIRMATION ? MATCH_EMAIL : MATCH
      )
      .required(REQUIRED);
  }

  return { ...validationSchema, [field.label]: fieldLabelValue };
};

/**
 * Build Yup validation schema from form field definitions
 */
export const buildValidationSchema = (formFields: IFormField[]): Record<string, any> => {
  let validationSchema = {};

  formFields.forEach(field => {
    if (!field) return;

    Object.keys(field).forEach(key => {
      if (key !== CONSTRAINTS) return;

      validationSchema = setFirstSchemaField(validationSchema, field, key);

      Object.keys((field as any)[key])
        .filter(constraint => constraint !== TYPE)
        .forEach(constraint => {
          validationSchema = addFieldErrorToSchema(validationSchema, field, key, constraint);
        });
    });
  });

  return validationSchema;
};

/**
 * Get initial values from form field definitions
 */
export const getInitialValues = <FormType>(formDeclaration: IFormField[]): FormType => {
  const initialValues: any = {};

  formDeclaration.forEach(field => {
    initialValues[field.label] = field.initialValue;
  });

  return initialValues;
};

/**
 * Build a form field with default values
 */
export const buildFormField = ({
  label,
  hasExplanation = undefined,
  type = INPUT_TYPE.TEXT,
  constraints = BASE_INPUT_CONSTRAINT_GROUP,
  initialValue = '',
  maxValue = '',
  style = null,
  ...rest
}: Partial<IFormField> & { label: string }): IFormField => {
  return {
    label: label as FORM_FIELDS,
    type,
    constraints,
    initialValue,
    maxValue,
    style: style || undefined,
    hasExplanation,
    ...rest
  };
};

/**
 * Create additional field for radio text custom field
 */
export const getAdditionalField = (additionalField: string): Partial<IFormField> => {
  return {
    label: additionalField as FORM_FIELDS,
    type: INPUT_TYPE.TEXT,
    constraints: BASE_INPUT_CONSTRAINT_GROUP
  };
};

/**
 * Delete contact input field
 */
export const deleteContactInput = (
  dateInputCount: string[],
  setDateInputCount: (inputs: string[]) => void,
  values: any,
  key: number
): void => {
  const currentDeletedInput = dateInputCount.find((_, index) => index === key);
  setDateInputCount(dateInputCount.filter((_, index) => index !== key));
  if (currentDeletedInput) {
    delete values[currentDeletedInput];
  }
};

/**
 * Get valid dates from form values
 */
export const getValidDates = (dateInputCount: string[], values: any): number =>
  dateInputCount.map(input => values[input]).filter(input => input).length;

/**
 * Add new date field with random ID
 */
export const addNewDate = (
  dateInputCount: string[],
  label: string,
  setDateInputCount: (inputs: string[]) => void
): void => {
  const fieldName = `${label}-field-${Math.random().toString(36).substr(2, 5)}`;
  setDateInputCount([...dateInputCount, fieldName]);
};

/**
 * Get contact dates from form values
 */
export const getContactDates = (values: any): string[] =>
  Object.keys(values)
    .map(key => key.startsWith(FORM_FIELDS.CONTACT_DATE) && values[key].toISOString())
    .filter((input): input is string => !!input);

/**
 * Create password strength label
 */
export const createPasswordLabel = (
  score: number,
  intl: { formatMessage: (descriptor: { id: string }) => string },
  intlResult: boolean
): string => {
  const passwordLevel = PASSWORD_STRENGTH_METER[score];
  if (!intlResult) {
    return passwordLevel;
  }
  return intl.formatMessage({ id: `form.label.passwordMeter.${passwordLevel}` });
};

/**
 * Set number input errors
 */
export const setNumberInputErrors = (
  { type, label, constraints }: { type: string; label: string; constraints: any },
  { values, errors, setFieldError }: { values: any; errors: any; setFieldError: (field: string, error: string) => void }
): void => {
  if (type === NUMBER && values[label] <= 0 && !errors[label] && constraints?.required) {
    setFieldError(label, INVALID_NUMBER);
  }
};

/**
 * Block invalid characters for number input
 */
export const blockNumberInvalidCharacters = (event: React.KeyboardEvent): void => {
  if (event.key === BACKSPACE) return;
  if (!event.key.match(/^[0-9]+$/)) event.preventDefault();
  NON_NUMERIC_VALUES.forEach(value => {
    if (event.key === value) event.preventDefault();
  });
};

/**
 * Get password form validation rules
 */
export const getPasswordFormValidation = (value: string) => {
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
 * Validate URL
 */
export const validateUrl = (url: string): boolean => URL_REGEXP.test(url);

/**
 * Check if form field is required
 */
export const isFieldRequired = (field: IFormField): boolean =>
  !!(field.constraints && (field.constraints as any)['required']);

/**
 * Build label/value pair for Select component
 */
export const buildLabelValue =
  (valueField = 'id', labelValue = 'name') =>
  (elem: any): IFormDropdownOption => ({
    value: elem[valueField],
    label: elem[labelValue]
  });

/**
 * Validate text input
 */
export const validateTextInput = (
  input: string,
  validation: { min?: number; max?: number; ignoreBlank?: boolean } = {}
): string | null => {
  if (!input) return 'form.validation.required';
  const testingInput = !validation.ignoreBlank ? input.trim() : input;
  if (testingInput.length < (validation.min || INPUT_LENGTH.MIN)) return 'form.validation.min';
  if (testingInput.length > (validation.max || INPUT_LENGTH.MAX)) return 'form.validation.max';
  return null;
};

/**
 * Get custom URL field form validation
 */
export const getCustomUrlFieldFormValidation = (value: string) => {
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
 * Disable cube fields invalid characters
 */
export const disableCubeFieldsInvalidChars = (e: React.KeyboardEvent, label: string): void => {
  const checkForInteger = INTEGER_REVENUE_AND_SALES_FIELDS.includes(label as FORM_FIELDS);
  if (e.key === BACKSPACE) return;
  if (!REGEX_NUMBERS_AND_COMMA.test(e.key) || (checkForInteger && !NUMBER_REGEXP.test(e.key))) {
    e.preventDefault();
  }
};

/**
 * Block invalid telephone characters
 */
export const blockInvalidTelephone = (e: React.KeyboardEvent): void => {
  if (!REGEX_TELEPHONE_NUMBER.test(e.key)) {
    e.preventDefault();
  }
};

/**
 * Block invalid characters for telephone or number fields
 */
export const blockFieldInvalidNumberOrPhone = (e: React.KeyboardEvent, type: INPUT_TYPE): void => {
  if (e.key === BACKSPACE) return;
  if (type === INPUT_TYPE.TEL) {
    blockInvalidTelephone(e);
    return;
  }
  blockNumberInvalidCharacters(e);
};
