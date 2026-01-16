import { useLocation } from 'react-router-dom';
import { SUPER_USERS_ROUTES } from 'constants/routes';

/**
 * Hook used to check if on super/hyper users routes
 */
export const useSuperUsersMainRoutes = () => {
  const { pathname } = useLocation();
  const isSuperUserMainRoute = SUPER_USERS_ROUTES.some(route => pathname.startsWith(route));

  return isSuperUserMainRoute;
};
