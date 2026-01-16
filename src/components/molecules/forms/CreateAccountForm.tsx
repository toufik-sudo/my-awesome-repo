import React from 'react';

import CustomFormField from 'components/molecules/forms/fields/CustomFormField';
import PasswordStrengthMeter from 'components/molecules/forms/fields/PasswordStrengthMeter';
import SubmitFormButton from 'components/atoms/ui/ButtonSubmitForm';
import DynamicFormattedError from 'components/atoms/ui/DynamicFormattedError';
import { CREATE_ACCOUNT_FIELDS } from 'constants/formDefinitions/formDeclarations';

import style from 'assets/style/components/CreateAccountLogin.module.scss';

/**
 * Molecule component used to render create account form
 *
 * @param form
 * @param formLoading
 * @constructor
 *
 * @see FormsStory
 */
const CreateAccountForm = ({ form, formLoading }) => {
  const globalError = (form.errors as any).global;

  return (
    <form onSubmit={form.handleSubmit}>
      <>
        {CREATE_ACCOUNT_FIELDS.map((field, key) => (
          <CustomFormField key={key} form={form} field={field} />
        ))}
        <DynamicFormattedError hasError={globalError} id={`form.validation.${globalError}`} />
        <PasswordStrengthMeter form={form} customStyle={style.strenghtMeterWrapper} isPasswordChange={false} />
        <SubmitFormButton isSubmitting={form.isSubmitting} buttonText="form.submit.next" loading={formLoading} />
      </>
    </form>
  );
};

export default CreateAccountForm;
