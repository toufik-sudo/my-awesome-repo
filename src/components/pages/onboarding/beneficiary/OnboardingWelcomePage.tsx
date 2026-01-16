import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import InviteUserApi from 'api/InviteUsersApi';
import ProgramsApi from 'api/ProgramsApi';
import Loading from 'components/atoms/ui/Loading';
import OnboardingPageStructure from 'components/pages/onboarding/beneficiary/OnboardingPageStructure';
import { LOADER_TYPE, ONBOARDING_SHOW_LEFT_BLOCK_DELAY, ONBOARDING_BENEFICIARY_COOKIE } from 'constants/general';
import { useHistory } from 'react-router';
import { WALL_PROGRAM_ROUTE, WALL_ROUTE } from 'constants/routes';
import { removeLocalSlice, storeOnboardingBeneficiaryCookie } from 'utils/LocalStorageUtils';
import { forceActiveProgram, setSelectedPlatform } from 'store/actions/wallActions';
import { useLoggedUserUuid } from 'hooks/authorization/useLoggedUserUuid';
import { checkAndCreateZoneCookie } from 'hooks/general/changeZone';
import { useWallSelection } from 'hooks/wall/useWallSelection';

const inviteUserApi = new InviteUserApi();
const programsApi = new ProgramsApi();

/**
 * Onboarding welcome page used for displaying information to user
 * @constructor
 */
const OnboardingWelcomePage = () => {
  const [shouldShowLeft, setShouldShowLeft] = useState(false);
  const [isInvitingLoggedUser, setIsInvitingLoggedUser] = useState(false);
  const { loadingPlatforms } = useWallSelection();
  const { loggedUserUuid } = useLoggedUserUuid();

  const [programDetails, setProgramDetails] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();
  checkAndCreateZoneCookie(window.location.href);

  const { params } = useRouteMatch();

  useEffect(() => {
    (async () => {
      const programId = Number(params.programId);
      if (!programId) {
        setIsInvitingLoggedUser(false);
        return history.push(WALL_ROUTE);
      }
      const data = await programsApi.getAnonymousProgramDetails(programId);
      data.design = data.design || {};
      data.programId = programId;
      setProgramDetails(data);
      storeOnboardingBeneficiaryCookie({ ...data, ...params });
      if (!loggedUserUuid) {
        setTimeout(() => setShouldShowLeft(true), ONBOARDING_SHOW_LEFT_BLOCK_DELAY);
        return;
      }
      setIsInvitingLoggedUser(true);
      try {
        await inviteUserApi.inviteBeneficiaryUser({ programId, autoInvite: true });
      } catch (e) {
        const activeProgramPayload = {
          unlockSelection: true,
          programId: programId || null,
          forcedPlatformId: (data && data.platformId) || null
        };

        // force program selection in selector
        await dispatch(forceActiveProgram(activeProgramPayload));
        // force refresh of platforms in selector for selected program
        await dispatch(setSelectedPlatform({ id: activeProgramPayload.forcedPlatformId }));
        removeLocalSlice(ONBOARDING_BENEFICIARY_COOKIE);
      }
      setIsInvitingLoggedUser(false);
      // check platform and program in platforms list, then redirect on wall
      // if not, then user needs to accept the invitation => WALL_PROGRAM_ROUTE
      const redirectRoute = loggedUserUuid ? WALL_PROGRAM_ROUTE : WALL_ROUTE;
      history.push(redirectRoute);
    })();
  }, [loadingPlatforms]);

  if (isInvitingLoggedUser) return <Loading type={LOADER_TYPE.PAGE} />;
  return (
    <OnboardingPageStructure
      showLoadingScreen={!shouldShowLeft && programDetails}
      shouldShowLeft={shouldShowLeft}
      programDetails={programDetails}
    />
  );
};

export default OnboardingWelcomePage;
