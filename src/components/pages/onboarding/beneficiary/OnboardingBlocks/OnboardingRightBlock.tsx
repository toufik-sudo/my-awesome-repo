import React from 'react';

import LanguageSwitcherContainer from 'containers/LanguageSwitcherContainer';
import ZoneSwitcherContainer from 'containers/ZoneSwitcherContainer';
import LanguageSwitcher from 'components/atoms/ui/LanguageSwitcher';
import ZoneSwitcher from 'components/atoms/ui/ZoneSwitcher';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import loginStyle from 'assets/style/components/CreateAccountLogin.module.scss';
import onboardingStyle from 'sass-boilerplate/stylesheets/components/onboarding/RightBlock.module.scss';
import rocket from 'assets/images/rocket.jpg';

/**
 * Component used to render onboarding right block
 *
 * @param children
 * @param landingPictureUrl
 * @constructor
 */
const OnboardingRightBlock = ({ children, landingPictureUrl = null }) => {
  const {
    withDefaultColor,
    withBackgroundImage,
    relative,
    w50,
    overlayBefore,
    zIndex2,
    zIndex5,
    textCenter,
    maxWidth65Percent,
    text1xl,
    p4,
    tLandscapeWidthFull,
    absolute,
    top3,
    right3,
    right15,
    tLandscapeP15,
    tLandscapeTextLg,
    tLandscapeMaxWidthFull,
    w100,
    hiddenOnTabletLandScape
  } = coreStyle;

  const customClassZone = `${absolute} ${top3} ${right15} ${zIndex5} ${withDefaultColor}`;
  const customClassLanguage = `${absolute} ${top3} ${right3} ${zIndex5} ${withDefaultColor}`;

  return (
    <div
      style={{ backgroundImage: `url(${landingPictureUrl || rocket})` }}
      className={`${p4} ${tLandscapeP15} ${onboardingStyle.onboardingRightblock} ${loginStyle.onBoarding} ${withBackgroundImage} ${relative} ${overlayBefore} ${w50} ${tLandscapeWidthFull} ${coreStyle['flex-center-total']} `}
    >
      <div className={hiddenOnTabletLandScape}>
        <ZoneSwitcherContainer>
          {props => <ZoneSwitcher {...props} isOnboardingFlow customClass={customClassZone} />}
        </ZoneSwitcherContainer>
        <LanguageSwitcherContainer>
          {props => <LanguageSwitcher {...props} isOnboardingFlow customClass={customClassLanguage} />}
        </LanguageSwitcherContainer>
      </div>
      <div
        className={`${relative} ${zIndex2} ${withDefaultColor} ${textCenter} ${w100} ${maxWidth65Percent} ${tLandscapeMaxWidthFull} ${text1xl} ${tLandscapeTextLg}`}
      >
        {children}
      </div>
    </div>
  );
};

export default OnboardingRightBlock;
