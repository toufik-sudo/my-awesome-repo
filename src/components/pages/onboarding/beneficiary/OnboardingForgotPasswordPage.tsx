import React from 'react';

import ForgotPasswordFormWrapper from 'components/organisms/form-wrappers/ForgotPasswordFormWrapper';
import OnboardingLeftSideLayout from 'components/organisms/layouts/OnboardingLeftSideLayout';
import SuccessModal from 'components/organisms/modals/SuccessModal';
import OnboardingWelcomeText from 'components/pages/onboarding/beneficiary/OnboardingContentBlocks/OnboardingWelcomeText';
import OnboardingLeftBlock from 'components/pages/onboarding/beneficiary/OnboardingBlocks/OnboardingLeftBlock';
import OnboardingRightBlock from 'components/pages/onboarding/beneficiary/OnboardingBlocks/OnboardingRightBlock';
import { useStoredProgramData } from 'hooks/programs/useStoredProgramData';

/**
 * Component used for rendering a login page for beneficiary onboarding
 *
 * @constructor
 */
const OnboardingForgotPasswordPage = () => {
  const { programDetails } = useStoredProgramData();

  if (!programDetails) return null;
  const { companyLogoUrl, colorSidebar, colorTitles, colorFont } = programDetails.design;

  return (
    <OnboardingLeftSideLayout logo={companyLogoUrl} colorSidebar={colorSidebar}>
      <OnboardingLeftBlock>
        <OnboardingWelcomeText colorTitles={colorTitles} colorFont={colorFont} />
      </OnboardingLeftBlock>

      <OnboardingRightBlock>
        <ForgotPasswordFormWrapper isOnboardingFlow={true} />
        <SuccessModal closeButtonHidden={false} isOnboardingFlow={true} />
      </OnboardingRightBlock>
    </OnboardingLeftSideLayout>
  );
};

export default OnboardingForgotPasswordPage;
