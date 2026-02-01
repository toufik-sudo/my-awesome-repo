// -----------------------------------------------------------------------------
// useUserRole Hook
// Gets the current user's role from the selected platform in wallReducer
// Migrated from old_app/src/hooks/user/useUserRole.ts
// -----------------------------------------------------------------------------

import { useMemo } from 'react';
import { useWallSelection } from '@/hooks/wall';
import { ROLE } from '@/constants/security/access';
import { getCurrentUser } from '@/services/AuthService';
import { useSuperUsersMainRoutes } from '@/hooks/nav/useSuperUsersMainRoutes';
import { 
  hasAtLeastSuperRole, 
  extractUserRoleForPlatform,
  extractHighestUserRole
} from '@/services/security/accessServices';

interface UserData {
  highestRole?: number;
  roles?: Array<{ platformId: number; role: number }>;
  hierarchicRole?: number;
  hr?: number;
}

/**
 * Get user data from stored token/cookies
 */
const getUserData = (): UserData => {
  const user = getCurrentUser();
  if (!user) return {};
  
  return {
    highestRole: user.hr,
    hierarchicRole: (user as unknown as { hierarchicRole?: number }).hierarchicRole,
    roles: (user as unknown as { roles?: Array<{ platformId: number; role: number }> }).roles,
    hr: user.hr
  };
};

/**
 * Hook to get the current user's role from Redux store
 * 
 * Logic:
 * - For Super/Hyper users on main routes OR when no platform selected: use highest role
 * - Otherwise: use platform-specific role from selected platform or extract from userData
 */
export const useUserRole = (): ROLE | null => {
  const { selectedPlatform } = useWallSelection();
  const isSuperUserMainRoute = useSuperUsersMainRoutes();
  
  const userRole = useMemo(() => {
    const userData = getUserData();
    const highestRole = userData.highestRole ?? extractHighestUserRole(userData);
    const isSuperUser = hasAtLeastSuperRole(highestRole);
    
    // For Super/Hyper users on main routes or when no platform is selected,
    // use the highest role (this handles the case where super role doesn't have a subplatform)
    if ((isSuperUser && isSuperUserMainRoute) || (isSuperUser && !selectedPlatform.id)) {
      return highestRole as ROLE;
    }
    
    // Use platform role if available from selected platform
    if (selectedPlatform.role !== undefined) {
      return selectedPlatform.role as ROLE;
    }
    
    // Fall back to extracting role for the specific platform
    const platformRole = extractUserRoleForPlatform(userData, selectedPlatform.id);
    if (platformRole !== undefined) {
      return platformRole as ROLE;
    }
    
    // Final fallback to highest role
    return highestRole !== undefined ? (highestRole as ROLE) : null;
  }, [selectedPlatform.id, selectedPlatform.role, isSuperUserMainRoute]);

  return userRole;
};

export default useUserRole;
