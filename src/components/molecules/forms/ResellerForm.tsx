import React from 'react';

import CustomFormField from 'components/molecules/forms/fields/CustomFormField';
import SubmitFormButton from 'components/atoms/ui/ButtonSubmitForm';
import { RESELLER_FORM_FIELDS } from 'constants/formDefinitions/formDeclarations';

/**
 * Molecule component used to render reseller form
 *
 * @param form
 * @constructor
 *
 * @see FormsStory
 */
const ResellerForm = ({ form }) => (
  <form onSubmit={form.handleSubmit}>
    {RESELLER_FORM_FIELDS.map((field, key) => (
      <CustomFormField key={key} form={form} field={field} />
    ))}
    <SubmitFormButton isSubmitting={form.isSubmitting} buttonText="form.submit.button" loading={form.isSubmitting} />
  </form>
);

export default ResellerForm;
