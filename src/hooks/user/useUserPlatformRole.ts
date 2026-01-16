import { useMemo } from 'react';

import { getUserAuthorizations } from 'services/security/accessServices';
/**
 * Hook returns user role on given platform
 *
 * @param role
 */
const useUserPlatformRole = role => {
  return useMemo(() => getUserAuthorizations(role), [role]);
};

export default useUserPlatformRole;
