import React, { memo } from 'react';

import Button from 'components/atoms/ui/Button';
import SubmitFormButton from 'components/atoms/ui/ButtonSubmitForm';
import { FORGOT_PASSWORD_PAGE_ROUTE, ONBOARDING_BENEFICIARY_FORGOT_PASSWORD_PAGE_ROUTE } from 'constants/routes';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { BUTTON_MAIN_TYPE, BUTTON_MAIN_VARIANT } from 'constants/ui';
import style from 'assets/style/components/LoginModal.module.scss';

/**
 * Molecule component used to render login form additional
 *
 * @param formLoading
 * @param form
 * @param setLoginRoute
 * @constructor
 */
const LoginFormAdditional = ({ formLoading, form, history, isOnboardingFlow }) => {
  return (
    <div className={style.buttonWrapper}>
      <SubmitFormButton isSubmitting={form.isSubmitting} buttonText="form.login.button" loading={formLoading} />
      <DynamicFormattedMessage
        type={BUTTON_MAIN_TYPE.TEXT_ONLY}
        variant={BUTTON_MAIN_VARIANT.INVERTED}
        tag={Button}
        onClick={() =>
          history.push(
            isOnboardingFlow ? ONBOARDING_BENEFICIARY_FORGOT_PASSWORD_PAGE_ROUTE : FORGOT_PASSWORD_PAGE_ROUTE
          )
        }
        id="form.label.forgotpassword"
      />
    </div>
  );
};

export default memo(LoginFormAdditional);
