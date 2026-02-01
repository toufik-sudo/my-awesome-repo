import { FORM_FIELDS, INPUT_TYPE } from '@/constants/forms';
import type { FormikContextType } from 'formik';

/**
 * Type constraint interface
 */
export interface ITypeConstraint {
  type: string;
}

/**
 * Required constraint interface
 */
export interface IRequiredConstraint {
  required?: boolean;
}

/**
 * Form constraints interface combining type and required with min/max
 */
export interface IFormConstraints extends IRequiredConstraint, ITypeConstraint {
  min?: number;
  max?: number;
  trim?: boolean;
}

/**
 * Email field constraint interface
 */
export interface IEmailFieldConstraint {
  type: 'string';
  required: true;
  email: boolean;
}

/**
 * URL field constraint interface
 */
export interface IUrlFieldConstraint {
  type: 'string';
  url: string;
}

/**
 * Form dropdown option interface
 */
export interface IFormDropdownOption {
  value: string | number | boolean;
  label: string;
}

/**
 * Match field type for validation
 */
export type TMatchField = string | RegExp | boolean;

/**
 * Union type for all constraint types
 */
export type TConstraints =
  | IFormConstraints
  | IEmailFieldConstraint
  | IRequiredConstraint
  | Record<string, TMatchField>
  | IUrlFieldConstraint;

/**
 * Form styling options interface
 */
export interface IStyleForm {
  floating?: boolean;
  rounded?: boolean;
  centerElement?: boolean;
  isInline?: boolean;
  isComplex?: boolean;
  isDisabled?: boolean;
  isHidden?: boolean;
  defaultInput?: boolean;
  euroInput?: boolean;
  usdInput?: boolean;
  unitInput?: boolean;
  numberField?: boolean;
  percentageInput?: boolean;
  timeField?: boolean;
  customRadio?: boolean;
  whiteLabel?: boolean;
  isSmaller?: boolean;
}

/**
 * Date supplier function type
 */
export type IDateSupplier = () => Date;

/**
 * Complete form field definition interface
 */
export interface IFormField {
  label: FORM_FIELDS | string;
  type: INPUT_TYPE;
  options?: IFormDropdownOption[];
  constraints?: TConstraints;
  style?: IStyleForm;
  hidden?: boolean;
  maxValue?: string;
  hasAdditional?: boolean;
  hasExplanation?: boolean;
  extraConstraints?: string[];
  initialValue?: string | number | Date | IFormDropdownOption;
  minDate?: IDateSupplier;
  maxDate?: IDateSupplier;
  isHiddenField?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Formik props interface
 */
export interface IFormikProps {
  formik: FormikContextType<any>;
}
