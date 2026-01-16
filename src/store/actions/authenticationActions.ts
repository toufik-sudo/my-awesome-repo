import axiosInstance from 'config/axiosConfig';
import { STATUS, USERS } from 'constants/api';
import { PAGE_NOT_FOUND } from 'constants/routes';

/**
 * Method used to call activateAccount endpoint
 *
 * @param uuid
 * @param token
 * @param history
 * @param operation
 */
export const activateAccount = ({ uuid, token }, history, operation) => {
  return activateAccountRequest(uuid, { token, operation }).catch(() => history.push(PAGE_NOT_FOUND));
};
/**
 * Method used to make the request for resend account activation link
 *
 * @param uuid
 * @param data
 */
export const activateAccountRequest = (uuid, data) => axiosInstance().patch(`${USERS}/${uuid}${STATUS}`, data);
