import axiosInstance from '@/config/axiosConfig';
import { USERS_ENDPOINT } from '@/constants/api';
import { getUserUuid } from '@/services/UserDataServices';

/**
 * Method used to call get user api
 */
export const getUserData = (): Promise<any> => {
  return axiosInstance().get(`${USERS_ENDPOINT}/${getUserUuid()}`);
};

/**
 * Method used to update user data
 * @param userData - User data to update
 */
export const updateUserData = (userData: Record<string, any>): Promise<any> => {
  return axiosInstance().patch(`${USERS_ENDPOINT}/${getUserUuid()}`, userData);
};
