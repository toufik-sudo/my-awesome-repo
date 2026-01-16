import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router';

import OnboardingPageStructure from 'components/pages/onboarding/beneficiary/OnboardingPageStructure';
import {
  ONBOARDING_SHOW_LEFT_BLOCK_DELAY,
  AUTHORIZATION_TOKEN,
  ONBOARDING_BENEFICIARY_COOKIE
} from 'constants/general';
import { WALL_ROUTE } from 'constants/routes';
import { removeLocalSlice } from 'utils/LocalStorageUtils';
import { useStoredProgramData } from 'hooks/programs/useStoredProgramData';

/**
 * Onboarding generic welcome page used for displaying information to user when
 * @constructor
 */
const OnboardingGenericPage = () => {
  const [shouldShowLeft, setShouldShowLeft] = useState(false);
  const history = useHistory();
  const { programDetails } = useStoredProgramData();

  useEffect(() => {
    removeLocalSlice(ONBOARDING_BENEFICIARY_COOKIE);
    if (!Cookies.get(AUTHORIZATION_TOKEN)) {
      setTimeout(() => setShouldShowLeft(true), ONBOARDING_SHOW_LEFT_BLOCK_DELAY);
      return;
    }
    history.push(WALL_ROUTE);
  }, []);
  if (!programDetails) return null;

  return (
    <OnboardingPageStructure
      showLoadingScreen={!shouldShowLeft}
      shouldShowLeft={shouldShowLeft}
      programDetails={programDetails}
    />
  );
};

export default OnboardingGenericPage;
