import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router';

import LanguageSwitcher from 'components/atoms/ui/LanguageSwitcher';
import Button from 'components/atoms/ui/Button';
import NavScrollElement from 'components/atoms/ui/NavScrollElement';
import ZoneSwitcher from 'components/atoms/ui/ZoneSwitcher';
import { LOGIN_PAGE_ROUTE, PRICING, SIGN_UP } from 'constants/routes';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import LanguageSwitcherContainer from 'containers/LanguageSwitcherContainer';
import ZoneSwitcherContainer from 'containers/ZoneSwitcherContainer';

import style from 'assets/style/components/Navbar.module.scss';

/**
 * Molecule component used to render auth and language nav elements
 *
 * @constructor
 */
const NavAuthLanguage = ({ closeNav }) => {
  const { userActions, signUp } = style;
  const history = useHistory();

  return (
    <ul className={userActions}>
      <li>
        <ZoneSwitcherContainer>{props => <ZoneSwitcher {...props} />}</ZoneSwitcherContainer>
      </li>
      <li>
        <LanguageSwitcherContainer>{props => <LanguageSwitcher {...props} />}</LanguageSwitcherContainer>
      </li>
      <li>
        <Button onClick={() => history.push(LOGIN_PAGE_ROUTE)} type={BUTTON_MAIN_TYPE.PRIMARY}>
          <FormattedMessage id="label.login" />
        </Button>
      </li>
      <NavScrollElement closeNav={closeNav} title={PRICING} id={SIGN_UP} styleCustom={signUp} />
    </ul>
  );
};

export default NavAuthLanguage;
