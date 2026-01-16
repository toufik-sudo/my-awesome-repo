import React, { useContext } from 'react';

import RegisterGenericForm from 'components/molecules/onboarding/RegisterPage/RegisterGenericForm';
import RegisterPageNameBlock from 'components/atoms/onboarding/RegisterPageNameBlock';
import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import {
  ONBOARDING_CREATE_ACCOUNT_PASSWORD_FIELD,
  ONBOARDING_PASSWORD_CONFIRMATION_FIELD
} from 'constants/formDefinitions/genericFields';
import { prepareFieldsValue } from 'services/OnboardingServices';
import { RegisterFormContext } from 'components/molecules/onboarding/RegisterPage/MultiStepRegisterWrapper';
import { REGISTER_PAGES } from 'constants/onboarding/general';
import { setTranslate } from 'utils/animations';
import { DELAY_TYPES } from 'constants/animations';

/**
 * Molecule component used to render register password step
 * @constructor
 */
const RegisterPasswordStep = () => {
  const { registerData } = useContext(RegisterFormContext);

  return (
    <SpringAnimation settings={setTranslate(DELAY_TYPES.MIN)}>
      <>
        <RegisterPageNameBlock blockTitle={REGISTER_PAGES.PASSWORD} />
        <RegisterGenericForm
          formFields={prepareFieldsValue(registerData, [
            ONBOARDING_CREATE_ACCOUNT_PASSWORD_FIELD,
            ONBOARDING_PASSWORD_CONFIRMATION_FIELD
          ])}
          additionalForm={REGISTER_PAGES.PASSWORD}
        />
      </>
    </SpringAnimation>
  );
};

export default RegisterPasswordStep;
