import React from 'react';
import { useHistory } from 'react-router-dom';

import Button from 'components/atoms/ui/Button';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { CREATE_ACCOUNT_FREEMIUM, LAUNCH } from 'constants/routes';
import style from 'assets/style/components/WelcomePage.module.scss';

/**
 * Molecule component used to render welcome navigation button
 *
 * @param type
 * @param id
 * @constructor
 */
const WelcomeNavigationBottom = ({ type, id }) => {
  const history = useHistory();

  return (
    <div className={style.navigationSection}>
      <DynamicFormattedMessage tag="span" id={`welcome.page.${type}.title`} />
      <DynamicFormattedMessage
        type={BUTTON_MAIN_TYPE.SECONDARY}
        tag={Button}
        onClick={() => history.push(type === LAUNCH ? `${CREATE_ACCOUNT_FREEMIUM}/${id}` : `/${type}`)}
        id={`welcome.page.${type}.cta`}
      />
    </div>
  );
};

export default WelcomeNavigationBottom;
