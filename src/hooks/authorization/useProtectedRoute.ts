import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { IStore } from 'interfaces/store/IStore';

/**
 * Hook used to set the authentication status of the user
 */
export const useProtectedRoute = () => {
  const isAuthenticated = useSelector((store: IStore) => store.generalReducer.userLoggedIn);
  const [isAuthDataLoaded, setIsAuthDataLoaded] = useState(false);

  useEffect(() => {
    setIsAuthDataLoaded(true);
  }, [isAuthenticated]);

  return { isAuthDataLoaded, isAuthenticated };
};
