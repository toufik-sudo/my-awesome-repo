import { useContext, useMemo } from 'react';

import { UserContext } from 'components/App';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { extractUserRoleForPlatform, hasAtLeastSuperRole } from 'services/security/accessServices';
import { useSuperUsersMainRoutes } from 'hooks/nav/useSuperUsersMainRoutes';
import { getUserHighestRole } from 'services/UserDataServices';

export const useUserRole = () => {
  const { userData = {} } = useContext(UserContext);
  const highestRole = userData.highestRole || getUserHighestRole();
  const isSuperUser = hasAtLeastSuperRole(highestRole);
  const isSuperUserMainRoute = useSuperUsersMainRoutes();
  const { selectedPlatform } = useWallSelection();

  const userRole = useMemo(() => {
    // this will handle the case where a Super role does not yet have a subplatform created and basically does
    // not have an active platform since the super platform cannot be selected
    if ((isSuperUser && isSuperUserMainRoute) || (isSuperUser && !selectedPlatform.id)) {
      return highestRole;
    }

    return selectedPlatform.role || extractUserRoleForPlatform(userData, selectedPlatform.id);
  }, [userData, highestRole, isSuperUserMainRoute, selectedPlatform]);

  return userRole;
};
