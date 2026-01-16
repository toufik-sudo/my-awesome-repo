import React from 'react';

import OnboardingLeftSideLayout from 'components/organisms/layouts/OnboardingLeftSideLayout';
import OnboardingWelcomePageContent from 'components/pages/onboarding/beneficiary/OnboardingContentBlocks/OnboardingWelcomePageContent';
import OnboardingWelcomeText from 'components/pages/onboarding/beneficiary/OnboardingContentBlocks/OnboardingWelcomeText';
import OnboardingRightBlock from 'components/pages/onboarding/beneficiary/OnboardingBlocks/OnboardingRightBlock';
import OnboardingLeftBlock from 'components/pages/onboarding/beneficiary/OnboardingBlocks/OnboardingLeftBlock';
import OnboardingLoadingScreen from 'components/pages/onboarding/beneficiary/OnboardingLoadingScreen';
import { ONBOARDING_CUSTOM_WELCOME } from 'constants/routes';

/**
 * Onboarding common page structure
 * @param showLoadingScreen
 * @param shouldShowLeft
 * @param programDetails
 * @constructor
 */
const OnboardingPageStructure = ({ showLoadingScreen, shouldShowLeft, programDetails = null }) => {
  if (!programDetails) return null;
  const { landingTitle, landingDescription, landingPictureUrl } = programDetails;
  const { companyLogoUrl, colorSidebar, colorTitles, colorFont } = programDetails.design;
  const url = `${ONBOARDING_CUSTOM_WELCOME}?platformId=${programDetails.platformId}&programId=${Number(programDetails.programId)}&programName=${programDetails.name}`;

  return (
    <>
      {shouldShowLeft && (
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
            <OnboardingWelcomePageContent url={url} />
          </OnboardingRightBlock>
        </OnboardingLeftSideLayout>
      )}
      {showLoadingScreen && (
        <OnboardingLoadingScreen
          landingPictureUrl={landingPictureUrl}
          logo={companyLogoUrl}
          colorSidebar={colorSidebar}
        />
      )}
    </>
  );
};

export default OnboardingPageStructure;
