import React from 'react';
import { Link } from 'react-router-dom';

import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import { ROOT } from 'constants/routes';
import { HTML_TAGS, IMAGES_ALT } from 'constants/general';
import { setTranslate } from 'utils/animations';
import { DELAY_TYPES } from 'constants/animations';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import logo from 'assets/images/logo/logoWhite.png';
import style from 'assets/style/components/WelcomePage.module.scss';

/**
 * Molecule component used to render title logo for welcome section
 *
 * @param type
 * @constructor
 */
const WelcomeTitleLogo = ({ type }) => (
  <div className={style[type]}>
    <DynamicFormattedMessage tag={HTML_TAGS.P} id="welcome.page.title" />
    <SpringAnimation settings={setTranslate(DELAY_TYPES.MIN)}>
      <Link to={ROOT}>
        <img src={logo} alt={IMAGES_ALT.LOGO} />
      </Link>
    </SpringAnimation>
  </div>
);

export default WelcomeTitleLogo;
