import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { AUTHORIZATION_TOKEN } from 'constants/general';
import { setUserLoggedIn } from 'store/actions/generalActions';

/**
 * Hook used to set the authorization token to store
 */
export const useAuthorizationStore = () => {
  const dispatch = useDispatch();
  const authorizationToken = Cookies.get(AUTHORIZATION_TOKEN);

  useEffect(() => {
    dispatch(setUserLoggedIn(!!authorizationToken));
  }, [dispatch, authorizationToken]);
};
