import React, { memo } from 'react';

import PasswordStrengthMeter from 'components/molecules/forms/fields/PasswordStrengthMeter';
import SubmitFormButton from 'components/atoms/ui/ButtonSubmitForm';
import style from 'assets/style/components/LoginModal.module.scss';

/**
 * Molecule component used to render password reset form additional
 * @param form
 * @param formLoading
 * @constructor
 */
const PasswordResetFormAdditional = ({ form, formLoading }) => {
  const { buttonWrapper, buttonRight, submitButton, strenghtMeterWrapper } = style;
  return (
    <>
      <PasswordStrengthMeter customStyle={strenghtMeterWrapper} form={form} isPasswordChange={false} />
      <div className={`${buttonWrapper} ${buttonRight}`}>
        <SubmitFormButton
          className={submitButton}
          isSubmitting={form.isSubmitting}
          buttonText="form.submit.go"
          loading={formLoading}
        />
      </div>
    </>
  );
};

export default memo(PasswordResetFormAdditional);
