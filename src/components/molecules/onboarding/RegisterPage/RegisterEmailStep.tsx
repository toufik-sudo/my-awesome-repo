import React, { useContext } from 'react';

import RegisterGenericForm from 'components/molecules/onboarding/RegisterPage/RegisterGenericForm';
import RegisterPageNameBlock from 'components/atoms/onboarding/RegisterPageNameBlock';
import { RegisterFormContext } from 'components/molecules/onboarding/RegisterPage/MultiStepRegisterWrapper';
import { ONBOARDING_EMAIL_CONFIRMATION_FIELD, ONBOARDING_EMAIL_FIELD } from 'constants/formDefinitions/genericFields';
import { prepareFieldsValue } from 'services/OnboardingServices';
import { REGISTER_PAGES } from 'constants/onboarding/general';
import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import { setTranslate } from 'utils/animations';
import { DELAY_TYPES } from 'constants/animations';

/**
 * Molecule component used to render register email step
 * @constructor
 */
const RegisterEmailStep = () => {
  const { registerData } = useContext(RegisterFormContext);

  return (
    <SpringAnimation settings={setTranslate(DELAY_TYPES.MIN)}>
      <>
        <RegisterPageNameBlock blockTitle={REGISTER_PAGES.EMAIL} />
        <RegisterGenericForm
          formFields={prepareFieldsValue(registerData, [ONBOARDING_EMAIL_FIELD, ONBOARDING_EMAIL_CONFIRMATION_FIELD])}
        />
      </>
    </SpringAnimation>
  );
};

export default RegisterEmailStep;
