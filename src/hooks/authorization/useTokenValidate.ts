import { PASSWORD_RESET } from 'constants/routes';
import { useState } from 'react';
import { useParams } from 'react-router';
import { validateToken } from 'store/actions/formActions';
import { VALIDATE_TYPE } from 'constants/api/tokenValidation';

/**
 * Hook used to validate the password reset token
 *
 * @param history
 */
export const useTokenValidate = history => {
  const [isValid, setValid] = useState(false);
  const { authState, token } = useParams();

  if (authState === PASSWORD_RESET && !isValid) {
    validateToken(token, setValid, history, VALIDATE_TYPE.RESET_PASSWORD);
  }

  return isValid;
};
