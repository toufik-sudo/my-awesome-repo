import { toast } from 'react-toastify';

import axiosInstance from 'config/axiosConfig';
import { handleUserAuthorizationToken } from 'services/AccountServices';
import { SET_ONBOARDING_REGISTER_DATA } from 'store/actions/actionTypes';
import { LOGIN_ENDPOINT } from 'constants/api';

/**
 * Action set onboarding register data
 *
 * @param payload
 */
export const setOnboardingRegisterData = payload => {
  return {
    type: SET_ONBOARDING_REGISTER_DATA,
    payload
  };
};

/**
 * Method calls login endpoint and handles authorization
 * @param email
 * @param createAccountPassword
 * @param formatMessage
 */
export const submitRegisterLoginStep = async (email, createAccountPassword, formatMessage) => {
  try {
    const {
      headers: { authorization }
    } = await axiosInstance().post(LOGIN_ENDPOINT, { email, password: createAccountPassword });
    handleUserAuthorizationToken(authorization);
  } catch (err) {
    // toast(formatMessage({ id: 'toast.message.generic.error' }));
  }
};
