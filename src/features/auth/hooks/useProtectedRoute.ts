import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

/**
 * Hook used to check user authentication status
 * Returns authentication state from Redux store
 */
export const useProtectedRoute = () => {
  const isAuthenticated = useSelector((store: RootState) => store.generalReducer.userLoggedIn);
  const [isAuthDataLoaded, setIsAuthDataLoaded] = useState(false);

  useEffect(() => {
    setIsAuthDataLoaded(true);
  }, [isAuthenticated]);

  return { isAuthDataLoaded, isAuthenticated };
};

export default useProtectedRoute;
