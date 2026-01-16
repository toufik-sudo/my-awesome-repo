import React from 'react';

import NavScrollElement from 'components/atoms/ui/NavScrollElement';
import { LANDING_NAV_ELEMENTS } from 'constants/routes';
import style from 'assets/style/components/Navbar.module.scss';

/**
 * Molecule component used to render main nav elements
 *
 * @param setActive
 * @param navHeight
 * @param closeNav
 * @constructor
 */
const NavMainElements = ({ setActive, navHeight, closeNav }) => (
  <ul className={style.menu}>
    {LANDING_NAV_ELEMENTS.map(element => (
      <NavScrollElement
        key={element}
        title={element}
        closeNav={closeNav}
        setActive={setActive}
        offsetHeight={navHeight}
      />
    ))}
  </ul>
);

export default NavMainElements;
