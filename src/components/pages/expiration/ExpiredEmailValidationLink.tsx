import React from 'react';

import Heading from 'components/atoms/ui/Heading';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
import NavLanguageSelector from 'components/molecules/onboarding/NavLanguageSelector';
import { ROOT } from 'constants/routes';

import logo from 'assets/images/logo/logoWhite.png';
import style from 'assets/style/components/ExpiredResetPasswordLink.module.scss';
import styleInter from 'sass-boilerplate/stylesheets/pages/IntermediaryPage.module.scss';

/**
 * Page component witch is displayed after the reset password link is expired.
 *
 * @constructor
 */
const { expiredLinkContainer, expiredLinkContent, expiredLinkTitle } = style;
const ExpiredEmailValidationLink = () => {
  return (
    <>
      {/* <NavLanguageSelector /> */}
      <div className={expiredLinkContainer}>
        <div className={expiredLinkContent}>
          <div className={styleInter.logoContainer}>
            <h1>Welcome to </h1> <img src={logo} alt="RewardzAi Logo" />
          </div>
          <Heading className={expiredLinkTitle} size={'4'} textId="account.activation.expired.link" />
          <ProvidersWrapper>
            <ButtonFormatted
              buttonText="account.activation.expired.cta"
              onClick={() => (window.location = (ROOT as unknown) as Location)}
              type="primary"
              variant="inverted"
            />
          </ProvidersWrapper>
        </div>
      </div>
    </>
  );
};

export default ExpiredEmailValidationLink;
