import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import Button from 'components/atoms/ui/Button';
import { HTML_TAGS, ONBOARDING_BENEFICIARY_COOKIE } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { BUTTON_MAIN_TYPE, BUTTON_MAIN_VARIANT } from 'constants/ui';
import { ONBOARDING_BENEFICIARY_REGISTER_BASE_ROUTE, ONBOARDING_BENEFICIARY_LOGIN_ROUTE, ONBOARDING_CUSTOM_WELCOME } from 'constants/routes';
import { REGISTER_PAGE_STEPS } from 'constants/onboarding/general';
import { getLocalStorage } from 'services/StorageServies';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import { useLegalDocUrl } from '../../../../../hooks/others/useLegalDocUrl';

/**
 * Onboarding welcome page content used to render the content from the right block
 * @constructor
 */
const OnboardingWelcomePageContent = ({url}) => {
  const history = useHistory();
  const { params } = useRouteMatch();
  const {
    text3xl,
    withBoldFont,
    mb4,
    mb3,
    mb7,
    mb10,
    mb2,
    mLargeMb4,
    textDecorationUnderline,
    pointer,
    hiddenOnTabletLandScape
  } = coreStyle;
  const { legalDocUrl } = useLegalDocUrl();
  const onboardingBeneficiary = getLocalStorage(ONBOARDING_BENEFICIARY_COOKIE);
  const tcLink = (onboardingBeneficiary && onboardingBeneficiary.termsAndConditionsUrl) || legalDocUrl;

  return (
    <>
      <DynamicFormattedMessage
        className={`${text3xl} ${withBoldFont} ${mb4}`}
        tag={HTML_TAGS.P}
        id="onboarding.welcome.disclaimer.title"
      />
      <DynamicFormattedMessage className={mb3} tag={HTML_TAGS.P} id="onboarding.welcome.disclaimer.content" />

      <div className={`${mb10} ${mLargeMb4}`}>
        <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id="onboarding.welcome.info.details" />
        <DynamicFormattedMessage
          tag={HTML_TAGS.SPAN}
          id="onboarding.welcome.info.cta"
          onClick={() => window.open(tcLink, '_blank')}
          className={`${textDecorationUnderline} ${pointer}`}
        />
      </div>
      <DynamicFormattedMessage tag={HTML_TAGS.P} className={mb2} id="onboarding.welcome.account.none" />
      <DynamicFormattedMessage
        tag={Button}
        variant={BUTTON_MAIN_VARIANT.INVERTED}
        type={BUTTON_MAIN_TYPE.PRIMARY}
        onClick={() => history.push(`${ONBOARDING_BENEFICIARY_REGISTER_BASE_ROUTE}${REGISTER_PAGE_STEPS.TITLE}`)}
        id="onboarding.welcome.signUp.cta"
        className={`${mb7} ${hiddenOnTabletLandScape}`}
      />
      <DynamicFormattedMessage tag={HTML_TAGS.P} className={mb2} id="onboarding.welcome.account.exists" />
      <DynamicFormattedMessage
        tag={Button}
        type={BUTTON_MAIN_TYPE.PRIMARY}
        id="onboarding.welcome.logIn.cta"
        onClick={() => history.push(url)}
        className={hiddenOnTabletLandScape}
      />
    </>
  );
};

export default OnboardingWelcomePageContent;
