// -----------------------------------------------------------------------------
// useUserPlatformRole Hook
// Migrated from old_app/src/hooks/user/useUserPlatformRole.ts
// Hook returns user authorizations for given role on a platform
// -----------------------------------------------------------------------------

import { useMemo } from 'react';
import { getUserAuthorizations, UserAuthorizations } from '@/services/security/accessServices';

/**
 * Hook returns user authorizations for given role on a platform
 * @param role - The user's role on the platform
 */
const useUserPlatformRole = (role: number | undefined): UserAuthorizations => {
  return useMemo(() => getUserAuthorizations(role), [role]);
};

export default useUserPlatformRole;
