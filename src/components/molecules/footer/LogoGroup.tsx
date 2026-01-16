import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import style from 'assets/style/components/landing/Footer.module.scss';

/**
 * Molecule component used to render logo group
 *
 * @constructor
 *
 * @see FooterStory
 */
const LogoGroup = () => {
  const { logoGroup, bottomLogo } = style;

  return (
    <div className={logoGroup}>
      <DynamicFormattedMessage
        tag="div"
        className={bottomLogo}
        id="footer.cta"
        values={{ date: new Date().getFullYear() }}
      />
    </div>
  );
};

export default LogoGroup;
