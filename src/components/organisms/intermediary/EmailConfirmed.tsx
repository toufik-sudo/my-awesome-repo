import React from 'react';
import { useHistory } from 'react-router-dom';

import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
import { LOGIN_PAGE_ROUTE } from 'constants/routes';
import { BUTTON_MAIN_TYPE, BUTTON_MAIN_VARIANT } from 'constants/ui';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'assets/style/components/createAccount/EmailConfirmed.module.scss';

/**
 * Organism component used to render email confirmed template
 *
 * @param type
 * @constructor
 */
const EmailConfirmed = ({ type }) => {
  const { emailConfirmed, emailConfirmedTitle } = style;
  const history = useHistory();

  return (
    <div className={emailConfirmed}>
      <DynamicFormattedMessage tag="div" className={emailConfirmedTitle} id={`welcome.page.${type}.title`} />
      <ButtonFormatted
        type={BUTTON_MAIN_TYPE.PRIMARY}
        variant={BUTTON_MAIN_VARIANT.INVERTED}
        onClick={() => history.push(LOGIN_PAGE_ROUTE)}
        buttonText="welcome.page.redirect.cta"
      />
    </div>
  );
};

export default EmailConfirmed;
