import React, { memo, useContext } from 'react';

import PasswordStrengthMeter from 'components/molecules/forms/fields/PasswordStrengthMeter';
import RegisterSubmitButtons from 'components/molecules/onboarding/RegisterPage/RegisterSubmitButtons';
import RegisterResponseErrorBlock from 'components/atoms/onboarding/RegisterResponseErrorBlock';

import { RegisterFormContext } from 'components/molecules/onboarding/RegisterPage/MultiStepRegisterWrapper';
import { REGISTER_PAGES } from 'constants/onboarding/general';

import loginStyle from 'assets/style/components/LoginModal.module.scss';
import styles from 'assets/style/components/CreateAccountLogin.module.scss';

/**
 * Molecule component used to render Register form additional slot
 * @param form
 * @param additionalForm
 * @param imageError
 * @constructor
 */
const RegisterFormAdditional = ({ form, additionalForm }) => {
  const { onBack, step, pageWithError, isLoading } = useContext(RegisterFormContext);

  return (
    <div className={styles.registerForm}>
      {pageWithError && step === pageWithError.step && <RegisterResponseErrorBlock error={pageWithError.error} />}
      {additionalForm === REGISTER_PAGES.PASSWORD && (
        <PasswordStrengthMeter customStyle={loginStyle.strenghtMeterWrapper} form={form} isPasswordChange={false} />
      )}
      <RegisterSubmitButtons
        {...{
          onBack,
          disableForward: !(Object.keys(form.values).length && form.isValid),
          isLoading,
          isSubmitting: form.isSubmitting,
          step
        }}
      />
    </div>
  );
};

export default memo(RegisterFormAdditional);
