import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import LanguageSwitcherContainer from 'containers/LanguageSwitcherContainer';
import ZoneSwitcherContainer from 'containers/ZoneSwitcherContainer';
import LanguageSwitcher from 'components/atoms/ui/LanguageSwitcher';
import ZoneSwitcher from 'components/atoms/ui/ZoneSwitcher';
import Button from 'components/atoms/ui/Button';

import { BUTTON_MAIN_TYPE, BUTTON_MAIN_VARIANT } from 'constants/ui';
import { ONBOARDING_BENEFICIARY_LOGIN_ROUTE, ONBOARDING_BENEFICIARY_REGISTER_BASE_ROUTE } from 'constants/routes';
import { REGISTER_PAGE_STEPS } from 'constants/onboarding/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import componentStyle from 'assets/style/components/LeftSideLayout.module.scss';

/**
 * Molecule component used to render mobile menu for onboarding journey
 *
 * @constructor
 */

const OnboardingMobileMenuBar = () => {
  const history = useHistory();
  const { params } = useRouteMatch();
  const { onboardingMobileMenu } = componentStyle;
  const {
    mLargePx15,
    mLargeTextSm,
    withDefaultColor,
    flex,
    flexAlignItemsCenter,
    flexJustifyContentEnd,
    flexWrap,
    mr1
  } = coreStyle;

  return (
    <div className={`${onboardingMobileMenu} ${flex} ${flexAlignItemsCenter} ${flexJustifyContentEnd} ${flexWrap}`}>
      <ZoneSwitcherContainer>
        {props => <ZoneSwitcher {...{ ...props, withDefaultColor }} isOnboardingFlow />}
      </ZoneSwitcherContainer>
      <LanguageSwitcherContainer>
        {props => <LanguageSwitcher {...{ ...props, withDefaultColor }} isOnboardingFlow />}
      </LanguageSwitcherContainer>
      <DynamicFormattedMessage
        tag={Button}
        variant={BUTTON_MAIN_VARIANT.INVERTED}
        type={BUTTON_MAIN_TYPE.PRIMARY}
        onClick={() => history.push(`${ONBOARDING_BENEFICIARY_REGISTER_BASE_ROUTE}${REGISTER_PAGE_STEPS.TITLE}`)}
        id="onboarding.welcome.signUp.cta"
        className={`${mLargePx15} ${mLargeTextSm} ${mr1}`}
      />
      <DynamicFormattedMessage
        tag={Button}
        type={BUTTON_MAIN_TYPE.PRIMARY}
        id="onboarding.welcome.logIn.cta"
        onClick={() => history.push(ONBOARDING_BENEFICIARY_LOGIN_ROUTE, { params })}
        className={`${mLargePx15} ${mLargeTextSm}`}
      />
    </div>
  );
};

export default OnboardingMobileMenuBar;
