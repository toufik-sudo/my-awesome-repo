import { FORM_FIELDS, INPUT_TYPE } from 'constants/forms';
import { IArrayKey } from 'interfaces/IGeneral';
import { FormikContextType } from 'formik';

export interface ITypeConstraint {
  type: string;
}

export interface IRequiredConstraint {
  required?: boolean;
}

export interface IFormConstraints extends IRequiredConstraint, ITypeConstraint {
  min?: number;
  max?: number;
}

export interface IEmailFieldConstraint {
  type: 'string';
  required: true;
  email: boolean;
}

export interface IUrlFieldConstraint {
  type: 'string';
  url: string;
}

export interface IFormDropdownOption {
  value: string | number | boolean;
  label: string;
}

export type TMatchField = string | RegExp | boolean;
export type TConstraints =
  | IFormConstraints
  | IEmailFieldConstraint
  | IRequiredConstraint
  | IArrayKey<TMatchField>
  | IUrlFieldConstraint;

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

export type IDateSupplier = () => Date;

export interface IFormField {
  label: FORM_FIELDS;
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
}

export interface IFormikProps {
  formik: FormikContextType<any>;
}
