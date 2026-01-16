import React, { memo } from 'react';

import SubmitFormButton from 'components/atoms/ui/ButtonSubmitForm';
import Button from 'components/atoms/ui/Button';
import { LOGIN_PAGE_ROUTE, ONBOARDING_BENEFICIARY_LOGIN_ROUTE } from 'constants/routes';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { BUTTON_MAIN_TYPE, BUTTON_MAIN_VARIANT } from 'constants/ui';
import style from 'assets/style/components/LoginModal.module.scss';

/**
 * Molecule component used to render forgot password form additional
 *
 * @param form
 * @param history
 * @param formLoading
 * @param isOnboardingFlow
 * @constructor
 */
const ForgotPasswordFormAdditional = ({ form, history, formLoading, isOnboardingFlow }) => {
  const { isOnboardingFlow: isOnboarding } = isOnboardingFlow;

  return (
    <div className={style.buttonWrapper}>
      <SubmitFormButton isSubmitting={form.isSubmitting} buttonText="form.submit.go" loading={formLoading} />
      <DynamicFormattedMessage
        type={BUTTON_MAIN_TYPE.TEXT_ONLY}
        variant={BUTTON_MAIN_VARIANT.INVERTED}
        tag={Button}
        onClick={() => history.push(isOnboarding ? ONBOARDING_BENEFICIARY_LOGIN_ROUTE : LOGIN_PAGE_ROUTE)}
        id="form.label.back"
      />
    </div>
  );
};

export default memo(ForgotPasswordFormAdditional);
