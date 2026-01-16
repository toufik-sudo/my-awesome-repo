import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { FULL } from 'constants/general';
import { useSettingsTitle } from 'hooks/wall/settings/useSettingsTitle';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { DEFAULT_ALL_PROGRAMS } from 'constants/wall/programButtons';
import { ONBOARDING_GENERIC, SETTINGS, WALL_ROUTE } from 'constants/routes';
import { IStore } from 'interfaces/store/IStore';
import { getFormattedTitle } from 'services/WallServices';
import { LAUNCH_FIRST_STEP, PAGE_TITLES, pagesLocationPathname } from 'constants/pageTitles';
import { PROGRAMS, PROGRAMS_ENDPOINT } from 'constants/api';

/**
 * Atom component used to return page title by using Helmet
 * @constructor
 */
const TitleComponent = () => {
  const { settingsPageTitle } = useSettingsTitle();
  const { selectedProgramName } = useWallSelection();
  const launchStoreData = useSelector((store: IStore) => store.launchReducer);
  const pathName = window.location.pathname;
  const { formatMessage } = useIntl();
  let title = PAGE_TITLES.DEFAULT as any;
  let selectedTitle = '';

  if (pathName.indexOf(SETTINGS) !== -1) {
    title = settingsPageTitle;
  }

  if (pathName.indexOf(PROGRAMS) !== -1) {
    title = pathName === PROGRAMS_ENDPOINT ? PAGE_TITLES.ONBOARDING_PROGRAMS : ONBOARDING_GENERIC;
  }

  if (pathName.indexOf(PAGE_TITLES.PROGRAMS_LAUNCH) !== -1) {
    title =
      pathName.indexOf(LAUNCH_FIRST_STEP) !== -1 || (launchStoreData && launchStoreData.programJourney === FULL)
        ? PAGE_TITLES.PROGRAMS_LAUNCH
        : PAGE_TITLES.PROGRAMS_QUICK_LAUNCH;
  }

  if (
    (pathName.indexOf(PAGE_TITLES.COMMUNICATION) !== -1 || pathName === WALL_ROUTE) &&
    selectedProgramName &&
    selectedProgramName !== DEFAULT_ALL_PROGRAMS
  ) {
    selectedTitle = selectedProgramName;
    if (pathName === WALL_ROUTE) {
      title = PAGE_TITLES.PROGRAMS_WALL;
    }
  }

  const founded = pagesLocationPathname.find(item => pathName.indexOf(item) !== -1);
  let formattedTitle = getFormattedTitle(founded || title, { ' ': '', '/': '.', '-': '.' });

  if (formattedTitle.startsWith('.')) {
    formattedTitle = formattedTitle.substr(1);
  }

  return (
    <Helmet>
      <title>{formatMessage({ id: `${'page.title.'}${formattedTitle}` }, { values: selectedTitle })}</title>
    </Helmet>
  );
};

export { TitleComponent };
