import { useEffect, useState } from 'react';

import { getSettingsPageTitle } from 'services/WallServices';
import { PAGE_TITLES } from 'constants/pageTitles';

/**
 * Hook used to handle settings page title
 */
export const useSettingsTitle = () => {
  const [settingsPageTitle, setSettingsPageTitle] = useState(PAGE_TITLES.SETTINGS_ACCOUNT);

  useEffect(() => {
    setSettingsPageTitle(getSettingsPageTitle());
  }, [window.location.pathname]);

  return { settingsPageTitle };
};
