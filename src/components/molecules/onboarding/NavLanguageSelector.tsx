import React from 'react';

import LanguageSwitcher from 'components/atoms/ui/LanguageSwitcher';
import LanguageSwitcherContainer from 'containers/LanguageSwitcherContainer';
import { useNavbarScroll } from 'hooks/useNavbarScroll';
import { useNavOffset } from 'hooks/nav/useNavOffset';

import style from 'assets/style/components/Navbar.module.scss';

/**
 * Molecule component used to render language selector nav
 *
 * @constructor
 */
const NavLanguageSelector = () => {
  const { nav, navScrolled, userActions, languageSwitcherOnboarding } = style;
  const scrolledTop = useNavbarScroll();
  const { navElement } = useNavOffset();

  return (
    <nav className={`${nav} ${!scrolledTop ? navScrolled : ''}`} ref={navElement}>
      <ul className={`${userActions} ${!scrolledTop ? '' : languageSwitcherOnboarding}`}>
        <li>
          <LanguageSwitcherContainer>{props => <LanguageSwitcher {...props} />}</LanguageSwitcherContainer>
        </li>
      </ul>
    </nav>
  );
};

export default NavLanguageSelector;
