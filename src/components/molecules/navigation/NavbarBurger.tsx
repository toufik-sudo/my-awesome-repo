import React from 'react';
import { emptyFn } from 'utils/general';

import componentStyle from 'assets/style/components/LeftSideLayout.module.scss';

/**
 * Molecule component used to render the menu burger icon
 *
 * @constructor
 */
const NavbarBurger = ({
  toggleClass,
  isChecked,
  isOnLanding = false,
  disableOverlay = false,
  isOnOnboarding = false
}) => {
  const {
    navToggle,
    navToggleIcon,
    navToggleOverlay,
    navToggleIconBurger,
    navToggleIconRight,
    navToggleOnboarding
  } = componentStyle;

  return (
    <>
      <input type="checkbox" id="navToggler" className={navToggle} onChange={emptyFn} checked={isChecked} />
      <label
        className={`${navToggleIcon} ${isOnOnboarding ? navToggleOnboarding : ''} ${
          isOnLanding ? navToggleIconRight : ''
        }`}
        onClick={toggleClass}
        htmlFor="navToggler"
      >
        <div className={navToggleIconBurger} />
      </label>
      {!disableOverlay && <div className={navToggleOverlay} />}
    </>
  );
};

export default NavbarBurger;
