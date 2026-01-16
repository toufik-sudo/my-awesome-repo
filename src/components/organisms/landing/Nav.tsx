import React from 'react';

import NavAuthLanguage from 'components/molecules/landing/NavAuthLanguage';
import NavMainElements from 'components/molecules/landing/NavMainElements';
import LogoUrl from 'components/atoms/ui/LogoUrl';
import { useNavbarScroll } from 'hooks/useNavbarScroll';
import { useNavOffset } from 'hooks/nav/useNavOffset';
import style from 'assets/style/components/Navbar.module.scss';
import NavbarBurger from 'components/molecules/navigation/NavbarBurger';
import { useNavBurger } from 'hooks/nav/useNavBurger';
import componentStyle from 'assets/style/components/LeftSideLayout.module.scss';

/**
 * Organism component used to render navigation for landing page
 *
 * @constructor
 */
const Nav = ({ setActive }) => {
  const { nav, navScrolled } = style;
  const scrolledTop = useNavbarScroll();
  const { navHeight, navElement } = useNavOffset();
  const { toggleClass, isChecked, closeNav } = useNavBurger();
  const { landingNavCollapse } = componentStyle;

  return (
    <>
      <nav className={`${nav} ${!scrolledTop ? navScrolled : ''}`} ref={navElement}>
        <NavbarBurger {...{ toggleClass, isChecked }} isOnLanding={true} disableOverlay={true} />
        <LogoUrl />
        <div className={landingNavCollapse}>
          <NavMainElements {...{ navHeight, setActive, closeNav }} />
          <NavAuthLanguage closeNav={closeNav} />
        </div>
      </nav>
    </>
  );
};

export default Nav;
