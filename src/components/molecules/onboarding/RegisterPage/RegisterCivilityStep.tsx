import React, { useContext } from 'react';

import RegisterGenericForm from 'components/molecules/onboarding/RegisterPage/RegisterGenericForm';
import RegisterPageNameBlock from 'components/atoms/onboarding/RegisterPageNameBlock';
import { TITLE_FIELD } from 'constants/formDefinitions/genericFields';
import { prepareFieldsValue } from 'services/OnboardingServices';
import { RegisterFormContext } from 'components/molecules/onboarding/RegisterPage/MultiStepRegisterWrapper';
import { REGISTER_PAGES } from 'constants/onboarding/general';
import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import { setTranslate } from 'utils/animations';
import { DELAY_TYPES } from 'constants/animations';

/**
 * Molecule component used to render register civility step
 * @constructor
 */
const RegisterCivilityStep = () => {
  const { registerData } = useContext(RegisterFormContext);

  return (
    <SpringAnimation settings={setTranslate(DELAY_TYPES.MIN)}>
      <>
        <RegisterPageNameBlock blockTitle={REGISTER_PAGES.TITLE} />
        <RegisterGenericForm formFields={prepareFieldsValue(registerData, [TITLE_FIELD])} />
      </>
    </SpringAnimation>
  );
};

export default RegisterCivilityStep;
