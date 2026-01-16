import React from 'react';

import NavScrollElement from 'components/atoms/ui/NavScrollElement';
import { CONTACT, LANDING_NAV_ELEMENTS } from 'constants/routes';

/**
 * Molecule component that renders NavScroll elements to scroll on anchors
 *
 * @constructor
 *
 * @see FooterStory
 */
const LinksSectionList = () => (
  <ul>
    {LANDING_NAV_ELEMENTS.map((element, index) => {
      if (element === CONTACT) return null;

      return <NavScrollElement key={index} title={element} id={element} />;
    })}
  </ul>
);

export default LinksSectionList;
