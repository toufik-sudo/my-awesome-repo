import React from 'react';

import CustomFormField from 'components/molecules/forms/fields/CustomFormField';
import SubmitFormButton from 'components/atoms/ui/ButtonSubmitForm';
import { ErrorFocus } from 'components/molecules/forms/fields/ScrollError';
import { TAILORED_FORM_FIELDS } from 'constants/formDefinitions/formDeclarations';
import { TAILORED } from 'constants/routes';

import style from 'assets/style/components/tailored/TailoredForm.module.scss';

/**
 * Molecule component used to render tailored form
 *
 * @param form
 * @constructor
 *
 * @see FormsStory
 */
const TailoredForm = ({ form }) => {
  return (
    <div className={style.wrapper}>
      <ErrorFocus />
      <form onSubmit={form.handleSubmit}>
        <>
          {TAILORED_FORM_FIELDS.map(field => (
            <CustomFormField key={field.label} {...{ form, field }} name={TAILORED} />
          ))}
          <SubmitFormButton
            isSubmitting={form.isSubmitting}
            buttonText="form.submit.button"
            loading={form.isSubmitting}
          />
        </>
      </form>
    </div>
  );
};

export default TailoredForm;
