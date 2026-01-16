import React from 'react';
import { Link, useHistory } from 'react-router-dom';

import Button from 'components/atoms/ui/Button';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { INVITED_ADMIN_PLATFORM } from 'constants/general';
import { getLocalStorage } from 'services/StorageServies';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { ROOT } from 'constants/routes';

import style from 'assets/style/components/CreateAccountLogin.module.scss';

/**
 * Molecule component used to render create account form additional
 *
 * @constructor
 */
const CreateAccountFormAdditional = () => {
  const { goBack, btnWrapper } = style;
  const history = useHistory();
  const invitedPlatformId = getLocalStorage(INVITED_ADMIN_PLATFORM);

  if (invitedPlatformId) {
    return null;
  }

  return (
    <div className={btnWrapper}>
      <Link to={ROOT}>
        <DynamicFormattedMessage
          tag={Button}
          type={BUTTON_MAIN_TYPE.ALT}
          id="form.label.back"
          onClick={() => history.goBack()}
          className={goBack}
        />
      </Link>
    </div>
  );
};

export default CreateAccountFormAdditional;
