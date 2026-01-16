import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useWallSelection } from 'hooks/wall/useWallSelection';
import { retrievePlatformsData } from 'services/PlatformSelectionServices';
import { IStore } from 'interfaces/store/IStore';
import { getRouteForcedParams } from 'utils/routeUtils';
import { retrieveOnboardingBeneficiaryCookie, removeLocalSlice } from 'utils/LocalStorageUtils';
import { ONBOARDING_BENEFICIARY_COOKIE } from 'constants/general';
import { hasAtLeastSuperRole } from 'services/security/accessServices';

/**
 * Hook used to retrieve platforms with programs and set the enforced program active
 */
export const usePlatformSelectionStore = userData => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((store: IStore) => store.generalReducer.userLoggedIn);
  const {
    programs,
    platforms,
    selectedProgramId,
    selectedPlatform: { id: selectedPlatformId }
  } = useWallSelection();

  useEffect(() => {
    if (!isAuthenticated || !userData.highestRole || (platforms.length && programs.length)) {
      return;
    }

    const loginProgramId = retrieveOnboardingBeneficiaryCookie().programId;
    removeLocalSlice(ONBOARDING_BENEFICIARY_COOKIE);
    retrievePlatformsData(
      dispatch,
      getRouteForcedParams(selectedProgramId, selectedPlatformId),
      loginProgramId,
      hasAtLeastSuperRole(userData.highestRole)
    );
  }, [dispatch, isAuthenticated, userData.highestRole, selectedPlatformId]);
};
