import React from 'react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
import Heading from 'components/atoms/ui/Heading';
import { ROOT } from 'constants/routes';

import logo from 'assets/images/logo-large.png';
import style from 'assets/style/components/ExpiredResetPasswordLink.module.scss';
import styleInter from 'sass-boilerplate/stylesheets/pages/IntermediaryPage.module.scss';


/**
 * Page component witch is displayed after the reset password link is expired.
 *
 * @constructor
 */
const { expiredLinkContainer, expiredLinkContent, expiredLinkTitle } = style;
const ExpiredResetPasswordLink = () => {
  return (
    <div className={expiredLinkContainer}>
      <div className={expiredLinkContent}>
        <div className={styleInter.logoContainer}>
          <h1>Welcome to </h1> <img src={logo} alt="RewardzAi Logo" />
        </div>
        <Heading className={expiredLinkTitle} size={'4'} textId={'forgot.password.expired.link'} />
        <ProvidersWrapper>
          <ButtonFormatted
            buttonText="forgot.password.expired.cta"
            onClick={() => (window.location = (ROOT as unknown) as Location)}
            type="primary"
            variant="inverted"
          />
        </ProvidersWrapper>
      </div>
    </div>
  );
};

export default ExpiredResetPasswordLink;
