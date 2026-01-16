import React, { useEffect, useState } from 'react';

import LoginFormWrapper from 'components/organisms/form-wrappers/LoginFormWrapper';
import OnboardingLeftSideLayout from 'components/organisms/layouts/OnboardingLeftSideLayout';
import OnboardingWelcomeText from 'components/pages/onboarding/beneficiary/OnboardingContentBlocks/OnboardingWelcomeText';
import OnboardingLeftBlock from 'components/pages/onboarding/beneficiary/OnboardingBlocks/OnboardingLeftBlock';
import OnboardingRightBlock from 'components/pages/onboarding/beneficiary/OnboardingBlocks/OnboardingRightBlock';
import { useStoredProgramData } from 'hooks/programs/useStoredProgramData';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import ProgramsApi from 'api/ProgramsApi';
import { LOGIN } from 'constants/routes';
import { useSelector } from 'react-redux';
import { IStore } from 'interfaces/store/IStore';
import { AUTHORIZATION_TOKEN } from 'constants/general';
import Cookies from 'js-cookie';

/**
 * Component used for rendering a login page for beneficiary onboarding
 *
 * @constructor
 */


const WelcomePageCustom = () => {

  const location = useLocation();
  const [programDetails, setProgramDetails] = useState(null)
  const history = useHistory();
  const query = new URLSearchParams(location.search);
  const programId = Number(query.get('programId'));
  const platformId = query.get('platformId');
  const programName = query.get('programName');
  const programsApi = new ProgramsApi();
  //  const isAuthenticated = useSelector((store: IStore) => store.generalReducer.userLoggedIn);
  const authorizationToken = Cookies.get(AUTHORIZATION_TOKEN);
  // console.log("AUTHORIZATION_TOKEN : " + authorizationToken)
  const isAuthenticated = !!authorizationToken;
  if (isAuthenticated) return false
  useEffect(() => {
    (async () => {
      if (!programId) {
        return history.push(LOGIN);
      }
      const data = await programsApi.getOnboardingProgramDetails(programId);
      data.design = data.design || {};
      setProgramDetails(data);

    })();
  }, []);

  //  const { programDetails } = programsApi.getOnboardingProgramDetails

  const url = `wall?platformId=${platformId}&programId=${programId}&programName=${programName}`;


  if (!programId) return null;
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
        <LoginFormWrapper isOnboardingFlow={false} isCustomWall={true} customUrl={url} />
      </OnboardingRightBlock>
    </OnboardingLeftSideLayout>
  );
};

export default WelcomePageCustom;
