import React, { createContext } from 'react';
import { useHistory } from 'react-router-dom';

import RegisterCivilityStep from 'components/molecules/onboarding/RegisterPage/RegisterCivilityStep';
import RegisterFirstNameAndNameStep from 'components/molecules/onboarding/RegisterPage/RegisterFirstNameAndNameStep';
import RegisterAvatarStep from 'components/molecules/onboarding/RegisterPage/RegisterAvatarStep';
import RegisterEmailStep from 'components/molecules/onboarding/RegisterPage/RegisterEmailStep';
import RegisterPasswordStep from 'components/molecules/onboarding/RegisterPage/RegisterPasswordStep';
import { ONBOARDING_BENEFICIARY_REGISTER_STEPS } from 'constants/onboarding/onboarding';
import { ensureSafeRoute, getActiveRegisterComponent } from 'services/OnboardingServices';
import { useOnboardingRegisterData } from 'hooks/wall/onboarding/useOnboardingRegisterData';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { REGISTER_PAGE_STEPS } from 'constants/onboarding/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

export const RegisterFormContext = createContext(null);

/**
 * Main register component used to render multi step wizard
 *
 * @constructor
 */
const MultiStepRegisterWrapper = () => {
  const { text4xl, withBoldFont, mb3, lh1, withDefaultColor, w100, textLeft } = coreStyle;
  const {
    step,
    onBack,
    onSubmit,
    registerData,
    isLoading,
    avatarContext,
    setPageWithError,
    pageWithError
  } = useOnboardingRegisterData();
  const history = useHistory();
  const REGISTER_PAGE_COMPONENTS_MAPPING = {
    [REGISTER_PAGE_STEPS.TITLE]: RegisterCivilityStep,
    [REGISTER_PAGE_STEPS.NAME]: RegisterFirstNameAndNameStep,
    [REGISTER_PAGE_STEPS.AVATAR]: RegisterAvatarStep,
    [REGISTER_PAGE_STEPS.EMAIL]: RegisterEmailStep,
    [REGISTER_PAGE_STEPS.PASSWORD]: RegisterPasswordStep
  };

  const currentStep = getActiveRegisterComponent(step, ONBOARDING_BENEFICIARY_REGISTER_STEPS);
  const CurrentStep = REGISTER_PAGE_COMPONENTS_MAPPING[currentStep];
  ensureSafeRoute(step, history);

  return (
    <RegisterFormContext.Provider
      value={{
        step,
        onBack,
        onSubmit,
        registerData,
        isLoading,
        avatarContext,
        setPageWithError,
        pageWithError
      }}
    >
      <DynamicFormattedMessage
        className={`${text4xl} ${mb3} ${withBoldFont} ${lh1} ${withDefaultColor} ${w100} ${textLeft}`}
        tag={HTML_TAGS.P}
        id={'onboarding.sign.in'}
      />
      <CurrentStep />
    </RegisterFormContext.Provider>
  );
};

export default MultiStepRegisterWrapper;
