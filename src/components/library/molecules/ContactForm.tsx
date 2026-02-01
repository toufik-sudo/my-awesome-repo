// -----------------------------------------------------------------------------
// ContactForm Molecule Component
// Migrated from old_app/src/components/molecules/forms/ContactForm.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { cn } from '@/lib/utils';
import { CustomFormField } from './CustomFormField';
import { ButtonSubmitForm } from '../atoms/ButtonSubmitForm';
import type { FormikProps } from 'formik';
import type { IFormField } from '@/types/forms/IForm';

export interface ContactFormProps {
  form: FormikProps<Record<string, unknown>>;
  formFields: IFormField[];
  submitButtonText?: string;
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  form,
  formFields,
  submitButtonText = 'label.button.letsTalk',
  className = ''
}) => {
  return (
    <form onSubmit={form.handleSubmit} className={cn('space-y-6', className)}>
      <div className="space-y-4">
        {formFields.map((field, key) => (
          <CustomFormField key={key} form={form} field={field} />
        ))}
      </div>
      
      <div className="flex justify-end">
        <ButtonSubmitForm
          isSubmitting={form.isSubmitting}
          buttonText={submitButtonText}
          loading={form.isSubmitting}
        />
      </div>
    </form>
  );
};

export { ContactForm };
export default ContactForm;
