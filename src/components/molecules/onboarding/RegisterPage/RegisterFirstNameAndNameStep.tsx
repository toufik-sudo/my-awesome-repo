import React, { useContext } from 'react';

import RegisterGenericForm from 'components/molecules/onboarding/RegisterPage/RegisterGenericForm';
import RegisterPageNameBlock from 'components/atoms/onboarding/RegisterPageNameBlock';
import { RegisterFormContext } from 'components/molecules/onboarding/RegisterPage/MultiStepRegisterWrapper';
import { ONBOARDING_FIRST_NAME_FIELD, ONBOARDING_LAST_NAME_FIELD } from 'constants/formDefinitions/genericFields';
import { prepareFieldsValue } from 'services/OnboardingServices';
import { REGISTER_PAGES } from 'constants/onboarding/general';
import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import { setTranslate } from 'utils/animations';
import { DELAY_TYPES } from 'constants/animations';

/**
 * Molecule component used to render firstName and lastName step
 * @constructor
 */
const RegisterFirstNameAndNameStep = () => {
  const { registerData } = useContext(RegisterFormContext);

  return (
    <SpringAnimation settings={setTranslate(DELAY_TYPES.MIN)}>
      <>
        <RegisterPageNameBlock blockTitle={REGISTER_PAGES.FIRST_NAME} />
        <RegisterGenericForm
          formFields={prepareFieldsValue(registerData, [ONBOARDING_FIRST_NAME_FIELD, ONBOARDING_LAST_NAME_FIELD])}
        />
      </>
    </SpringAnimation>
  );
};

export default RegisterFirstNameAndNameStep;
