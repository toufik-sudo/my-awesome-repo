import { useLocation } from 'react-router-dom';

import { COMMUNICATION, DECLARATIONS_WALL, LAUNCH_BASE, USERS_WALL, WALL } from 'constants/routes';

/**
 * Check if is on wall route and return boolean
 */
export const useWallRoute = () => {
  const location = useLocation();
  const isWallRoute = location.pathname.includes(WALL);
  const isDeclarationRoute = location.pathname.includes(DECLARATIONS_WALL);
  const isCommunicationRoute = location.pathname.includes(COMMUNICATION);
  const isUsersRoute = location.pathname.includes(USERS_WALL) && !location.pathname.includes(LAUNCH_BASE);

  return { isWallRoute, isUsersRoute, isDeclarationRoute, isCommunicationRoute };
};
