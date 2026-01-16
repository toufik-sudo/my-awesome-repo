import React, { useEffect, useState } from 'react';

import OnboardingLeftSideLayout from 'components/organisms/layouts/OnboardingLeftSideLayout';
import { ONBOARDING_LOADING_DURATION } from 'constants/general';

import rocket from 'assets/images/rocket.jpg';
import logoWhite from 'assets/images/logo/logoWhite.png';
import style from 'sass-boilerplate/stylesheets/components/wall/WallBasePageStructure.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Onboarding loading screen used until the onboarding content is rendered
 * @constructor
 */
const OnboardingLoadingScreen = ({ landingPictureUrl = null, logo = null, colorSidebar = null }) => {
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    setTimeout(() => setStartAnimation(true), ONBOARDING_LOADING_DURATION);
  }, []);

  const { absolute, top0, right0, bottom0, withBackgroundImage, left0, maxWidth260 } = coreStyle;
  const { customAnimation } = style;

  return (
    <OnboardingLeftSideLayout logo={logo} colorSidebar={colorSidebar}>
      <div
        className={`${
          startAnimation ? customAnimation : ''
        } ${absolute} ${top0} ${right0} ${bottom0} ${left0} ${withBackgroundImage} ${coreStyle['flex-center-total']}`}
        style={{ backgroundImage: `url(${landingPictureUrl || rocket})` }}
      >
        <img src={logo || logoWhite} alt="Logo" className={maxWidth260} />
      </div>
    </OnboardingLeftSideLayout>
  );
};

export default OnboardingLoadingScreen;
