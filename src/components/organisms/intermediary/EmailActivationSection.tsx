import React from 'react';

import NavLanguageSelector from 'components/molecules/onboarding/NavLanguageSelector';
import EmailConfirmed from 'components/organisms/intermediary/EmailConfirmed';
import EmailSent from 'components/organisms/intermediary/EmailSent';
import logo from 'assets/images/logo/logoWhite.png';
import { CLOUD_REWARDS_LOGO_ALT } from 'constants/general';
import { EMAIL_CONFIRMED } from 'constants/routes';

import style from 'assets/style/components/WelcomePage.module.scss';

/**
 * Template component for email activation
 *
 * @param type
 * @constructor
 */
const EmailActivationSection = ({ type }) => {
  const { emailActivation, logoImg } = style;
  let emailContent = <EmailSent {...{ type }} />;

  if (type === EMAIL_CONFIRMED) {
    emailContent = <EmailConfirmed {...{ type }} />;
  }

  return (
    <>
      {/* <NavLanguageSelector /> */}
      <div className={emailActivation}>
        <img src={logo} alt={CLOUD_REWARDS_LOGO_ALT} className={logoImg} />
        {emailContent}
      </div>
    </>
  );
};

export default EmailActivationSection;
