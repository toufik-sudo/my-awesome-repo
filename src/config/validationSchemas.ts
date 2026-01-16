import {
  CONTACT_FORM_FIELDS,
  CREATE_ACCOUNT_FIELDS,
  PASSWORD_RESET_FORM_FIELDS,
  RESELLER_FORM_FIELDS,
  TAILORED_FORM_FIELDS
} from 'constants/formDefinitions/formDeclarations';
import { buildValidationSchema } from 'services/FormServices';
import * as Yup from 'yup';

export const ContactSchema = Yup.object().shape(buildValidationSchema(CONTACT_FORM_FIELDS));
export const ResellerSchema = Yup.object().shape(buildValidationSchema(RESELLER_FORM_FIELDS));
export const TailoredSchema = Yup.object().shape(buildValidationSchema(TAILORED_FORM_FIELDS));
export const CreateAccountSchema = Yup.object().shape(buildValidationSchema(CREATE_ACCOUNT_FIELDS));
export const PasswordResetSchema = Yup.object().shape(buildValidationSchema(PASSWORD_RESET_FORM_FIELDS));
