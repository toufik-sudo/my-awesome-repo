import axiosInstance from 'config/axiosConfig';
import { USERS_ENDPOINT } from 'constants/api';
import { getUserUuid } from 'services/UserDataServices';

/**
 * Method used to call get user api
 */
export const getUserData = () => axiosInstance().get(`${USERS_ENDPOINT}/${getUserUuid()}`);
