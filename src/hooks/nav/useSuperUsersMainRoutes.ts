// -----------------------------------------------------------------------------
// useSuperUsersMainRoutes Hook
// Migrated from old_app/src/hooks/nav/useSuperUsersMainRoutes.ts
// Hook used to check if on super/hyper users routes
// -----------------------------------------------------------------------------

import { useLocation } from 'react-router-dom';
import { SUPER_USERS_ROUTES } from '@/constants/routes';

/**
 * Hook used to check if on super/hyper users routes
 */
export const useSuperUsersMainRoutes = (): boolean => {
  const { pathname } = useLocation();
  const isSuperUserMainRoute = SUPER_USERS_ROUTES.some(route => pathname.startsWith(route));

  return isSuperUserMainRoute;
};

export default useSuperUsersMainRoutes;
