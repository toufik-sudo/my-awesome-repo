import React from 'react';

import LogoImageLink from 'components/atoms/ui/LogoImageLink';
import NavbarBurger from 'components/molecules/navigation/NavbarBurger';
import OnboardingMobileMenuBar from 'components/molecules/onboarding/OnboardingMobileMenuBar';
import { HTML_TAGS, WALL_TYPE } from 'constants/general';
import { useNavBurger } from 'hooks/nav/useNavBurger';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { openTab } from 'utils/general';

import componentStyle from 'assets/style/components/LeftSideLayout.module.scss';
import style from 'assets/style/components/wall/LeftNavigation.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import importedLogo from 'assets/images/logo/logoWhite.png';
import { useLegalDocUrl } from '../../../hooks/others/useLegalDocUrl';

/**
 * Organism layout component with left logo sidebar for onboarding
 *
 * @param children
 * @param theme
 * @param programDetails
 * @constructor
 */
const OnboardingLeftSideLayout = ({ children, theme = WALL_TYPE, logo = null, colorSidebar }) => {
  const { displayFlex, withDefaultColor, relative, w100, height100, withBoldFont, tLandscapeMt13, mtAuto } = coreStyle;
  const { toggleClass, isChecked } = useNavBurger();
  const { legalDocUrl } = useLegalDocUrl();
  const { navigation, leftNav, logoImg, logoImgOnboarding } = componentStyle;
  const { navigationStyle, wallLink } = style;
  const isWallType = theme === WALL_TYPE;

  return (
    <div className={`${leftNav} ${componentStyle[theme]}`}>
      {isWallType && <NavbarBurger {...{ toggleClass, isChecked }} isOnOnboarding={true} />}
      <OnboardingMobileMenuBar />
      <div
        className={`${navigation} ${displayFlex} ${mtAuto} ${coreStyle['flex-direction-column']}`}
        style={{ background: colorSidebar }}
      >
        <>
          <LogoImageLink className={`${logoImg} ${logoImgOnboarding}`} logo={logo || importedLogo} disabled />
          <div className={`${navigationStyle} ${mtAuto} ${tLandscapeMt13}`}>
            {/*<li className={wallLink} onClick={() => window.open(envConfig.onboarding.rulesUrl)}>*/}
            {/*  <DynamicFormattedMessage*/}
            {/*    className={`${withDefaultColor} ${withBoldFont}`}*/}
            {/*    tag={Link}*/}
            {/*    id="onboarding.menu.rules"*/}
            {/*  />*/}
            {/*</li>*/}
            <li className={wallLink}>
              <DynamicFormattedMessage
                tag={HTML_TAGS.ANCHOR}
                className={`${withDefaultColor} ${withBoldFont}`}
                onClick={event => openTab(event, legalDocUrl)}
                id="onboarding.menu.legal"
                href={legalDocUrl}
              />
            </li>
            <li
              className={wallLink}
            // onClick={() => window.open(envConfig.onboarding.contactUrl)}
            >
              <DynamicFormattedMessage
                className={`${withDefaultColor} ${withBoldFont}`}
                tag="a"
                id="onboarding.menu.contact"
                href="mailto:support@rewardzai.com"
              />
            </li>
          </div>
        </>
      </div>
      <div className={`${style.onboardingContentWrapper} ${relative} ${w100}`}>
        <div className={`${displayFlex} ${coreStyle['flex-wrap']} ${height100}`}>{children}</div>
      </div>
    </div>
  );
};

export default OnboardingLeftSideLayout;
