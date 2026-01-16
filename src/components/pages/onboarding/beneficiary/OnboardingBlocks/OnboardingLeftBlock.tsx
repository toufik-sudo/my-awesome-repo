import React from 'react';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Component used to render onboarding left block
 *
 * @param children
 * @constructor
 */
const OnboardingLeftBlock = ({ children }) => {
  const { displayFlex, w50, px10, py5, tLandscapeWidthFull, tLandscapeP15, mLargeMt5 } = coreStyle;

  return (
    <div
      className={`${w50} ${tLandscapeWidthFull} ${displayFlex} ${coreStyle['flex-center-vertical']} ${px10} ${mLargeMt5} ${py5} ${tLandscapeP15} `}
    >
      <div>{children}</div>
    </div>
  );
};

export default OnboardingLeftBlock;
