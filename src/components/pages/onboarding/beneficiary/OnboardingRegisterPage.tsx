import React from 'react';

import OnboardingLeftSideLayout from 'components/organisms/layouts/OnboardingLeftSideLayout';
import OnboardingWelcomeText from 'components/pages/onboarding/beneficiary/OnboardingContentBlocks/OnboardingWelcomeText';
import OnboardingLeftBlock from 'components/pages/onboarding/beneficiary/OnboardingBlocks/OnboardingLeftBlock';
import OnboardingRightBlock from 'components/pages/onboarding/beneficiary/OnboardingBlocks/OnboardingRightBlock';
import MultiStepRegisterWrapper from 'components/molecules/onboarding/RegisterPage/MultiStepRegisterWrapper';
import { useStoredProgramData } from 'hooks/programs/useStoredProgramData';

/**
 * Component used for rendering register page for beneficiary accounts
 * @constructor
 */
const OnboardingRegisterPage = () => {
  const { programDetails } = useStoredProgramData();

  if (!programDetails) return null;
  const { landingPictureUrl, landingTitle, landingDescription } = programDetails;
  const { companyLogoUrl, colorSidebar, colorTitles, colorFont } = programDetails.design;

  return (
    <OnboardingLeftSideLayout logo={companyLogoUrl} colorSidebar={colorSidebar}>
      <OnboardingLeftBlock>
        <OnboardingWelcomeText
          landingTitle={landingTitle}
          landingDescription={landingDescription}
          colorTitles={colorTitles}
          colorFont={colorFont}
        />
      </OnboardingLeftBlock>

      <OnboardingRightBlock landingPictureUrl={landingPictureUrl}>
        <MultiStepRegisterWrapper />
      </OnboardingRightBlock>
    </OnboardingLeftSideLayout>
  );
};

export default OnboardingRegisterPage;
