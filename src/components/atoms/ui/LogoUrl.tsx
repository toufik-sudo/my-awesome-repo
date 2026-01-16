import React, { memo } from 'react';
import { Link } from 'react-scroll/modules';

import { LANDING } from 'constants/routes';
import { IMAGES_ALT } from 'constants/general';
import brandLogo from 'assets/images/logo/logoWhite.png';
import style from 'assets/style/components/Navbar.module.scss';

/**
 * Atom component used to render logo url
 *
 * @constructor
 *
 * @see LogoImageLinkStory
 */
const LogoUrl = () => (
  <Link to={LANDING} smooth>
    <img src={brandLogo} className={style.logo} alt={IMAGES_ALT.LOGO} />
  </Link>
);

export default memo(LogoUrl);
