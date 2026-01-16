import { useEffect, useState } from 'react';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { isUserBeneficiary } from 'services/security/accessServices';
import { LOGIN, LOGIN_PAGE_ROUTE, ONBOARDING_BENEFICIARY_LOGIN_ROUTE, ONBOARDING_CUSTOM_WELCOME } from 'constants/routes';
import ProgramsApi from '../../api/ProgramsApi';
import { retrieveOnboardingBeneficiaryCookie, storeOnboardingBeneficiaryCookie } from '../../utils/LocalStorageUtils';
import { useHistory, useLocation } from 'react-router-dom';
import { AUTHORIZATION_TOKEN } from 'constants/general';
import Cookies from 'js-cookie';

const programsApi = new ProgramsApi();

/**
 * Hook used to return the user logout redirect route
 */
export const useLogoutUserRoute = () => {
  const [logoutRedirectRoute, setLogoutRedirectRoute] = useState(LOGIN);
  const {
    selectedPlatform: { role },
    selectedProgramId,
    selectedProgramName,
    selectedPlatform,
    programDetails
  } = useWallSelection();
  const isBeneficiary = isUserBeneficiary(role);
  const storedBeneficiaryData = retrieveOnboardingBeneficiaryCookie();

  // const history = useHistory();

  useEffect(() => {
    let logoutTo = LOGIN_PAGE_ROUTE;
    const authorizationToken = Cookies.get(AUTHORIZATION_TOKEN);
    // console.log("AUTHORIZATION_TOKEN : " + authorizationToken)
    const isAuthenticated = !!authorizationToken;
    if (selectedProgramId) {
      const url = `${ONBOARDING_CUSTOM_WELCOME}?platformId=${selectedPlatform.id}&programId=${selectedProgramId}&programName=${selectedProgramName}`;
      logoutTo = url;
      // history.push(url)
      // return;
    }

    if (!selectedProgramId && !isAuthenticated) {
      logoutTo = LOGIN_PAGE_ROUTE;
      // history.push(LOGIN_PAGE_ROUTE)
      // return;
    }

    if (!isAuthenticated) {
      logoutTo = LOGIN_PAGE_ROUTE;
      // history.push(LOGIN_PAGE_ROUTE)
      // return;
    }

    setLogoutRedirectRoute(logoutTo);

  }, [selectedProgramId, programDetails]);


  // useEffect(() => {
  //   let logoutTo = `/${LOGIN}`;
  //   if (isBeneficiary && selectedProgramId) {
  //     logoutTo = ONBOARDING_BENEFICIARY_LOGIN_ROUTE;
  //     if (!Object.keys(storedBeneficiaryData.design).length) {
  //       (async () => {
  //         const data = await programsApi.getAnonymousProgramDetails(parseInt(selectedProgramId));
  //         data.design = data.design || {};
  //         storeOnboardingBeneficiaryCookie(data);
  //       })();
  //     }
  //   }
  //   setLogoutRedirectRoute(logoutTo);
  // }, [isBeneficiary, selectedProgramId, programDetails]);



  return { logoutRedirectRoute };
};
