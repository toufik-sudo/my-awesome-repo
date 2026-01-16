import { useMemo } from 'react';

import { SETTINGS, WALL } from 'constants/routes';
import { getSettingsTabComponent } from 'services/wall/settings';
import { isAnyKindOfAdmin, getUserAuthorizations } from 'services/security/accessServices';
import { useTabNavigation } from 'hooks/general/useTabNavigation';

/**
 * Hook used to handle settings data
 */
export const useSettingsData = platform => {
  const { role, status, hierarchicType } = platform;
  const userRights = useMemo(() => getUserAuthorizations(role), [role]);
  const hasAdminRights = isAnyKindOfAdmin(userRights);
  const tabHeaders = useMemo(() => getSettingsTabComponent(userRights, status, hierarchicType), [
    role,
    status,
    hierarchicType
  ]);
  const { index, setTabIndex } = useTabNavigation(tabHeaders, `/${WALL}${SETTINGS}`);

  return { index, setTabIndex, tabHeaders, hasAdminRights, role, userRights };
};
