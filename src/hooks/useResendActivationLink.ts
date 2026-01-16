import { useState } from 'react';
import Cookies from 'js-cookie';
import { UUID } from 'constants/general';
import { activateAccountRequest } from '../store/actions/authenticationActions';
import { OPERATION_TYPES } from '../constants/api/tokenValidation';
import { RESEND_ACTIVATION_LINK_ERROR, RESEND_ACTIVATION_LINK_SUCCESS } from '../constants/forms';

export const useResendActivationLink = () => {
  const [message, setMessage] = useState<string>('activation');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const resendEmail = async () => {
    const uuidCookie = Cookies.get(UUID);
    if (!uuidCookie) {
      return;
    }
    setIsLoading(true);
    setIsSuccess(false);
    try {
      await activateAccountRequest(uuidCookie, { operation: OPERATION_TYPES.RESEND_EMAIL });
      setMessage(RESEND_ACTIVATION_LINK_SUCCESS);
      setIsSuccess(true);
    } catch (e) {
      setIsSuccess(false);
      setMessage(RESEND_ACTIVATION_LINK_ERROR);
    }
    setIsLoading(false);
  };

  return { message, isLoading, isSuccess, resendEmail };
};
