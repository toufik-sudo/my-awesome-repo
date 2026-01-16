import React from 'react';
import { FormattedMessage } from 'react-intl';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Onboarding content block used to render the welcome text
 * @constructor
 */
const OnboardingWelcomeText = ({
  landingDescription = null,
  landingTitle = null,
  colorTitles = null,
  colorFont = null
}) => {
  const { mb2, text5xl, text2xl, withGrayColor, tLandscapeText3xl, tLandscapeTextLg } = coreStyle;
  const onboardingIntl = 'onboarding.welcome.';

  return (
    <>
      <p className={`${text5xl} ${mb2} ${tLandscapeText3xl}`} style={{ color: colorTitles }}>
        {landingTitle || <FormattedMessage id={`${onboardingIntl}title`} />}
      </p>
      <p className={`${text2xl} ${withGrayColor} ${tLandscapeTextLg}`} style={{ color: colorFont }}>
        {landingDescription || <FormattedMessage id={`${onboardingIntl}content`} />}
      </p>
    </>
  );
};

export default OnboardingWelcomeText;
