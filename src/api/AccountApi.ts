// -----------------------------------------------------------------------------
// Account API
// Migrated from old_app/src/api/AccountApi.ts
// -----------------------------------------------------------------------------

import axiosInstance from '@/config/axiosConfig';
import { PLATFORM_ADMINISTRATORS, USERS_ENDPOINT } from '@/constants/api';

class AccountApi {
  getUserData = async (id: string) => {
    const { data } = await axiosInstance().get(`${USERS_ENDPOINT}/${id}`);
    return data;
  };

  createAccount = async (payload: any) => {
    const { data } = await axiosInstance().post(USERS_ENDPOINT, payload);
    return data;
  };

  joinAnAdmin = async (body: any) => {
    const { data } = await axiosInstance().post(PLATFORM_ADMINISTRATORS, body);
    return data;
  };
}

export const accountApi = new AccountApi();
export default AccountApi;
