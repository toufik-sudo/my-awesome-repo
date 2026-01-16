import React from 'react';

import IconExternalLink from 'components/atoms/ui/IconExternalLink';
import { SOCIAL_ICONS } from 'constants/footer';
import style from 'assets/style/components/landing/Footer.module.scss';

/**
 * Molecule component used to render social link list
 *
 * @constructor
 *
 * @see FooterStory
 */
const SocialLinkList = () => (
  <ul className={style.socialGroup}>
    {SOCIAL_ICONS.map(icon => (
      <li key={icon.url}>
        <IconExternalLink {...{ icon }} />
      </li>
    ))}
  </ul>
);

export default SocialLinkList;
