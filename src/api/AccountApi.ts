import axiosInstance from 'config/axiosConfig';
import { PLATFORM_ADMINISTRATORS, USERS_ENDPOINT } from 'constants/api';

class AccountApi {
  getUserData = async (id: string) => {
    const { data } = await axiosInstance().get(`${USERS_ENDPOINT}/${id}`);

    return data;
  };

  createAccount = async payload => {
    const { data } = await axiosInstance().post(USERS_ENDPOINT, payload);

    return data;
  };

  joinAnAdmin = async body => {
    const { data } = await axiosInstance().post(PLATFORM_ADMINISTRATORS, body);

    return data;
  };
}

export default AccountApi;
