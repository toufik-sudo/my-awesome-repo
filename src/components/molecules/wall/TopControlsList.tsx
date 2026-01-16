import React from 'react';

import TopNavigationElement from 'components/atoms/wall/TopNavigationElement';
import NotificationsDropdownIcon from 'components/organisms/notifications/dropdown/NotificationsDropdownIcon';
import LanguageSwitcherContainer from '../../../containers/LanguageSwitcherContainer';
import LanguageSwitcher from '../../atoms/ui/LanguageSwitcher';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { WALL_ROUTE, SETTINGS } from 'constants/routes';

import style from 'assets/style/components/wall/TopNavigation.module.scss';

/**
 * Molecule component used to render top controls on wall navigation
 *
 * @constructor
 */
const TopControlsList = () => {
  return (
    <div className={style.topControls}>
      <LanguageSwitcherContainer>{props => <LanguageSwitcher {...props} />}</LanguageSwitcherContainer>
      <NotificationsDropdownIcon icon={<FontAwesomeIcon icon={faFlag} size="lg" />} />
      <TopNavigationElement url={`${WALL_ROUTE}${SETTINGS}`} icon={<FontAwesomeIcon icon={faCog} size="lg" />} />
    </div>
  );
};

export default TopControlsList;
