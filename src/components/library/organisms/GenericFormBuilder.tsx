// -----------------------------------------------------------------------------
// GenericFormBuilder Organism Component
// Form builder using Formik with dynamic field rendering
// -----------------------------------------------------------------------------

import React, { ReactNode } from 'react';
import { Formik, Form, FormikHelpers, FormikProps } from 'formik';
import { cn } from '@/lib/utils';
import { CustomFormField } from '../molecules/CustomFormField';
import { ButtonSubmitForm } from '../atoms/ButtonSubmitForm';
import { buildValidationSchema, getInitialValues } from '@/services/FormServices';
import type { IFormField } from '@/types/forms/IForm';

export interface GenericFormBuilderProps {
  formDeclaration: IFormField[];
  formAction: (values: Record<string, unknown>, helpers: FormikHelpers<Record<string, unknown>>) => void;
  validateOnMount?: boolean;
  disableSubmit?: boolean;
  submitButtonText?: string;
  formSlot?: (form: FormikProps<Record<string, unknown>>) => ReactNode;
  className?: string;
  fieldClassName?: string;
}

const GenericFormBuilder: React.FC<GenericFormBuilderProps> = ({
  formDeclaration,
  formAction,
  validateOnMount = false,
  disableSubmit = false,
  submitButtonText = 'form.submit',
  formSlot,
  className = '',
  fieldClassName = ''
}) => {
  const initialValues = getInitialValues<Record<string, unknown>>(formDeclaration);
  const validationSchema = buildValidationSchema(formDeclaration);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={formAction}
      validateOnMount={validateOnMount}
      enableReinitialize
    >
      {(formikProps) => (
        <Form className={cn('space-y-6', className)}>
          <div className={cn('space-y-4', fieldClassName)}>
            {formDeclaration.map((field, index) => (
              <CustomFormField
                key={`${field.label}-${index}`}
                form={formikProps}
                field={field}
              />
            ))}
          </div>

          {/* Optional custom slot for additional form content */}
          {formSlot && formSlot(formikProps)}

          {/* Submit button */}
          {!disableSubmit && (
            <div className="flex justify-end pt-4">
              <ButtonSubmitForm
                isSubmitting={formikProps.isSubmitting}
                buttonText={submitButtonText}
                loading={formikProps.isSubmitting}
                nextStepDisabled={!formikProps.isValid}
              />
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export { GenericFormBuilder };
export default GenericFormBuilder;
