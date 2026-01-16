import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

import AccountApi from 'api/AccountApi';
import useToggler from 'hooks/general/useToggler';
import { REDIRECT_MAPPING, ACTIVATE_ACCOUNT, EMAIL_TOKEN_EXPIRED_LINK_ROUTE, WALL } from 'constants/routes';
import { AUTHORIZATION_TOKEN } from 'constants/general';
import { extractHighestUserRole, isAccountNotVerified } from 'services/security/accessServices';
import { IStore } from 'interfaces/store/IStore';
import { getUserUuid, saveUserData } from 'services/UserDataServices';
import { redirectManager } from 'services/AccountServices';

const accountApi = new AccountApi();

/**
 * Hook used to retrieve user data
 */
export const useUserData = () => {
  const history = useHistory();
  const [userData, setUserData] = useState<any>({});
  const { userLoggedIn } = useSelector((store: IStore) => store.generalReducer);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [componentLoading, setComponentLoading] = useState(false);
  const { isActive: shouldRefresh, toggle: refreshUserData } = useToggler(false);

  const handleNotVerifiedAccount = userData => {
    let step = userData.step;
    const {
      location: { pathname }
    } = history;
    const avoidedRoutes = [ACTIVATE_ACCOUNT, EMAIL_TOKEN_EXPIRED_LINK_ROUTE];
    const shouldRedirectNotActivePage =
      !avoidedRoutes.some(avoidedRoute => pathname.includes(avoidedRoute)) && isAccountNotVerified(userData.status);
    if (shouldRedirectNotActivePage) {
      step = REDIRECT_MAPPING.NOT_ACTIVATED;
      redirectManager(history, step);
    }
    return step;
  };

  useEffect(() => {
    async function loadAsync() {
      setComponentLoading(true);
      try {
        if (Cookies.get(AUTHORIZATION_TOKEN)) {
          const id = getUserUuid();
          const data = await accountApi.getUserData(id);
          const userData = { ...data, highestRole: extractHighestUserRole(data) };
          const step = handleNotVerifiedAccount(userData);
          saveUserData({ ...userData, step });
          // console.log(userData);
          setUserData(userData);
        }
      } catch (e) {
        window.location = `/${WALL}` as any;
        console.log('/wall here !!!')
      } finally {
        setComponentLoading(false);
      }
    }
    userLoggedIn && loadAsync();
  }, [history, userLoggedIn, shouldRefresh]);

  return { userData, imgLoaded, setImgLoaded, componentLoading, refreshUserData };
};
