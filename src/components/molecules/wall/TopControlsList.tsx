import React from 'react';
import ReactTooltip from 'react-tooltip';
import { useIntl } from 'react-intl';

import TopNavigationElement from 'components/atoms/wall/TopNavigationElement';
import NotificationsDropdownIcon from 'components/organisms/notifications/dropdown/NotificationsDropdownIcon';
import LanguageSwitcherContainer from '../../../containers/LanguageSwitcherContainer';
import LanguageSwitcher from '../../atoms/ui/LanguageSwitcher';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { WALL_ROUTE, SETTINGS } from 'constants/routes';
import { TOOLTIP_FIELDS } from 'constants/tootltip';

import style from 'assets/style/components/wall/TopNavigation.module.scss';

/**
 * Molecule component used to render top controls on wall navigation with tooltips
 *
 * @constructor
 */
const TopControlsList = () => {
  const { formatMessage } = useIntl();

  const controls = [
    {
      id: 'language',
      tooltipText: formatMessage({ id: 'wall.navigation.language' }),
    },
    {
      id: 'notifications',
      tooltipText: formatMessage({ id: 'wall.navigation.notifications' }),
    },
    {
      id: 'settings',
      tooltipText: formatMessage({ id: 'wall.navigation.settings' }),
    },
  ];

  return (
    <div className={style.topControls}>
      <div
        data-tip={controls[0].tooltipText}
        data-for="tooltip-language"
        className={style.controlItem}
      >
        <LanguageSwitcherContainer>{props => <LanguageSwitcher {...props} />}</LanguageSwitcherContainer>
        <ReactTooltip
          id="tooltip-language"
          place={TOOLTIP_FIELDS.PLACE_LEFT}
          effect={TOOLTIP_FIELDS.EFFECT_SOLID}
          className="nav-tooltip"
          delayShow={300}
          delayHide={100}
        />
      </div>

      <div
        data-tip={controls[1].tooltipText}
        data-for="tooltip-notifications"
        className={style.controlItem}
      >
        <NotificationsDropdownIcon icon={<FontAwesomeIcon icon={faFlag} size="lg" />} />
        <ReactTooltip
          id="tooltip-notifications"
          place={TOOLTIP_FIELDS.PLACE_LEFT}
          effect={TOOLTIP_FIELDS.EFFECT_SOLID}
          className="nav-tooltip"
          delayShow={300}
          delayHide={100}
        />
      </div>

      <div
        data-tip={controls[2].tooltipText}
        data-for="tooltip-settings"
        className={style.controlItem}
      >
        <TopNavigationElement url={`${WALL_ROUTE}${SETTINGS}`} icon={<FontAwesomeIcon icon={faCog} size="lg" />} />
        <ReactTooltip
          id="tooltip-settings"
          place={TOOLTIP_FIELDS.PLACE_LEFT}
          effect={TOOLTIP_FIELDS.EFFECT_SOLID}
          className="nav-tooltip"
          delayShow={300}
          delayHide={100}
        />
      </div>
    </div>
  );
};

export default TopControlsList;
