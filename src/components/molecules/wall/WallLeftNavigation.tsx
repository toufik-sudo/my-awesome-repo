import React from 'react';
import useRouter from 'use-react-router';

import LeftNavigationElement from 'components/atoms/wall/LeftNavigationElement';
import LogoutButton from 'components/atoms/wall/LogoutButton';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { WALL } from 'services/wall/navigation';
import { useWindowSize } from 'hooks/others/useWindowSize';
import { WINDOW_SIZES, HTML_TAGS } from 'constants/general';
import { useNavItems } from 'hooks/nav/useNavItems';
import { openTab } from 'utils/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import style from 'assets/style/components/wall/LeftNavigation.module.scss';
import { useLegalDocUrl } from '../../../hooks/others/useLegalDocUrl';

/**
 * Molecule component used to render left wall navigation
 * @param closeNav
 * @param showCompanyLogo
 * @param isCollapsed
 * @constructor
 */
const WallLeftNavigation = ({ closeNav, showCompanyLogo, isCollapsed = false }) => {
  const { mt0, tLandscapeMt7, mtAuto } = coreStyle;
  const { menuSeparator, navigationStyle, wallLink, collapsedNav } = style;
  const router = useRouter();
  const { windowSize } = useWindowSize();
  const { wall, widgets } = useNavItems();
  const { legalDocUrl } = useLegalDocUrl();

  const navClasses = `${navigationStyle} ${isCollapsed ? collapsedNav : ''}`;

  return (
    <>
      <div className={navClasses}>
        <ul className={showCompanyLogo ? mt0 : ''}>
          {wall.map(({ title, icon, url, external, isDisabled }) => (
            <LeftNavigationElement 
              key={title} 
              {...{ title, icon, url, closeNav, external, isDisabled, isCollapsed }} 
            />
          ))}
        </ul>
        {windowSize.width < WINDOW_SIZES.DESKTOP_SMALL && router.match.path.includes(WALL) && (
          <>
            <hr className={menuSeparator} />
            <ul>
              {widgets.map(({ title, url }) => (
                <LeftNavigationElement 
                  className={wallLink} 
                  key={title} 
                  {...{ title, url, closeNav, isCollapsed }} 
                />
              ))}
            </ul>
          </>
        )}
      </div>
      <div className={`${navClasses} ${mtAuto} ${tLandscapeMt7}`}>
        <hr className={menuSeparator} />
        {!isCollapsed && (
          <li className={wallLink}>
            <DynamicFormattedMessage
              tag={HTML_TAGS.ANCHOR}
              onClick={event => openTab(event, legalDocUrl)}
              id="onboarding.menu.legal"
              href={legalDocUrl}
            />
          </li>
        )}
        <LogoutButton isCollapsed={isCollapsed} />
      </div>
    </>
  );
};

export default WallLeftNavigation;
