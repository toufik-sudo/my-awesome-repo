import React from 'react';

import LoginFormWrapper from 'components/organisms/form-wrappers/LoginFormWrapper';
import OnboardingLeftSideLayout from 'components/organisms/layouts/OnboardingLeftSideLayout';
import OnboardingWelcomeText from 'components/pages/onboarding/beneficiary/OnboardingContentBlocks/OnboardingWelcomeText';
import OnboardingLeftBlock from 'components/pages/onboarding/beneficiary/OnboardingBlocks/OnboardingLeftBlock';
import OnboardingRightBlock from 'components/pages/onboarding/beneficiary/OnboardingBlocks/OnboardingRightBlock';
import { useStoredProgramData } from 'hooks/programs/useStoredProgramData';

/**
 * Component used for rendering a login page for beneficiary onboarding
 *
 * @constructor
 */
const OnboardingLoginPage = () => {
  const { programDetails } = useStoredProgramData();

  if (!programDetails) return null;
  const { landingPictureUrl, landingTitle, landingDescription, programId, platformId, programName } = programDetails;
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
        <LoginFormWrapper isOnboardingFlow={true} />
      </OnboardingRightBlock>
    </OnboardingLeftSideLayout>
  );
};

export default OnboardingLoginPage;
