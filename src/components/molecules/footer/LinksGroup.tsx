import React from 'react';

import LinksSectionList from 'components/molecules/footer/LinksSectionList';
import LinkGroupColumn from 'components/molecules/footer/LinkGroupColumn';
import { FOOTER_URL_LINKS } from 'constants/footer';
import style from 'assets/style/components/landing/Footer.module.scss';

/**
 * Molecule component that renders lists of footer links
 *
 * @constructor
 *
 * @see FooterStory
 */
const LinksGroup = () => {
  return (
    <div className={style.links}>
      <LinksSectionList />
      {FOOTER_URL_LINKS.map(list => (
        <LinkGroupColumn {...{ list }} key={JSON.stringify(list)} />
      ))}
    </div>
  );
};

export default LinksGroup;
