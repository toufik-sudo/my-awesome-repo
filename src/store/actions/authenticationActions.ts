import axiosInstance from '@/config/axiosConfig';
import { STATUS, USERS } from '@/constants/api';
import { PAGE_NOT_FOUND } from '@/constants/routes';

interface ActivationParams {
  uuid: string;
  token: string;
}

interface ActivationData {
  token: string;
  operation: string;
}

/**
 * Method used to call activateAccount endpoint
 *
 * @param params - UUID and token for activation
 * @param history - Router history for navigation
 * @param operation - Type of operation to perform
 */
export const activateAccount = (
  { uuid, token }: ActivationParams,
  history: { push: (path: string) => void },
  operation: string
): Promise<any> => {
  return activateAccountRequest(uuid, { token, operation })
    .catch(() => history.push(PAGE_NOT_FOUND));
};

/**
 * Method used to make the request for resend account activation link
 *
 * @param uuid - User UUID
 * @param data - Token and operation data
 */
export const activateAccountRequest = (uuid: string, data: ActivationData): Promise<any> => {
  return axiosInstance().patch(`${USERS}/${uuid}${STATUS}`, data);
};
