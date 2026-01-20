import React from 'react';
import { Link } from 'react-router-dom';

import Button from 'components/atoms/ui/Button';
import NavLanguageSelector from 'components/molecules/onboarding/NavLanguageSelector';
import { WALL_ROUTE } from 'constants/routes';
import { IMAGES_ALT } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { BUTTON_MAIN_VARIANT } from 'constants/ui';

import logo from 'assets/images/logo/logo_ia.png';
import style from 'assets/style/components/WelcomePage.module.scss';

/**
 * Page component used to render welcome page
 *
 * @constructor
 */
const WelcomePage = () => {
  return (
    <>
      <NavLanguageSelector />
      <div className={style.emailActivation}>
        <img src={logo} alt={IMAGES_ALT.LOGO} className={style.logoImg} />
        <Link to={WALL_ROUTE}>
          <DynamicFormattedMessage
            variant={BUTTON_MAIN_VARIANT.INVERTED}
            tag={Button}
            id="welcome.page.redirect.cta"
            onClick={() => (window.location = (WALL_ROUTE as unknown) as Location)}
          />
        </Link>
      </div>
    </>
  );
};

export default WelcomePage;
