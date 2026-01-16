import React from 'react';

import LinksGroup from 'components/molecules/footer/LinksGroup';
import LogoGroup from 'components/molecules/footer/LogoGroup';
import SocialLinkList from 'components/molecules/footer/SocialLinkList';
import style from 'assets/style/components/landing/Footer.module.scss';

/**
 * Organism component used to render footer
 *
 * @constructor
 */
const FooterSection = () => {
  const { footer, container } = style;

  return (
    <footer className={footer}>
      <div className={container}>
        <LinksGroup />
        <SocialLinkList />
        <LogoGroup />
      </div>
    </footer>
  );
};

export default FooterSection;
