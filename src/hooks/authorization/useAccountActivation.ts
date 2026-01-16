import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import { IActivationUrlProps } from 'interfaces/IAuthentication';
import { activateAccount } from 'store/actions/authenticationActions';
import { validateToken } from 'store/actions/formActions';
import { OPERATION_TYPES, VALIDATE_TYPE } from 'constants/api/tokenValidation';
import { CAN_REDIRECT_TO_EMAIL_ACTIVATION_PAGE } from 'constants/general';
import { removeLocalStorage } from 'services/StorageServies';

/**
 * Hook used to activate account
 */
export const useAccountActivation = () => {
  const history = useHistory();
  const params: IActivationUrlProps = useParams<IActivationUrlProps>();
  const [isValid, setIsValid] = useState(false);
  const [userActive, setUserActive] = useState(false);

  useEffect(() => {
    if (!isValid && !userActive) {
      validateToken(params.token, setIsValid, history, VALIDATE_TYPE.EMAIL_CONFIRMATION).then(() => {
        activateAccount(params, history, OPERATION_TYPES.ACTIVATE_EMAIL);
        setUserActive(true);
        removeLocalStorage(CAN_REDIRECT_TO_EMAIL_ACTIVATION_PAGE);
      });
    }
  }, []);

  return userActive;
};
