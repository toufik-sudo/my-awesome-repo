import React from 'react';

import { CONTACT_FORM_FIELDS } from 'constants/formDefinitions/formDeclarations';
import CustomFormField from 'components/molecules/forms/fields/CustomFormField';
import SubmitFormButton from 'components/atoms/ui/ButtonSubmitForm';
import style from 'assets/style/components/ContactSection.module.scss';

/**
 * Molecule component used to render contact form
 *
 * @param form
 * @constructor
 */
const ContactForm = ({ form }) => (
  <form onSubmit={form.handleSubmit}>
    <>
      {CONTACT_FORM_FIELDS.map((field, key) => (
        <CustomFormField key={key} form={form} field={field} />
      ))}
      <div className={style.buttonWrapper}>
        <SubmitFormButton
          isSubmitting={form.isSubmitting}
          buttonText="label.button.letsTalk"
          loading={form.isSubmitting}
        />
      </div>
    </>
  </form>
);

export default ContactForm;
