import axiosInstance from 'config/axiosConfig';
import { PLATFORMS, PRICING_GET_ENDPOINT } from 'constants/api';
import { getUserCookie } from 'utils/general';
import { USER_COOKIE_FIELDS } from 'constants/general';

class PlatformApi {
  async getPlatformTypes() {
    const { data } = await axiosInstance().get(PRICING_GET_ENDPOINT);

    return data;
  }

  async createPlatform(payload) {
    const { data } = await axiosInstance().post(PLATFORMS, payload);

    return data;
  }
  async hasUniqueName(name: string) {
    const { data } = await axiosInstance().get(PLATFORMS, { params: { name } });
    const currentCreatedPlatformId = getUserCookie(USER_COOKIE_FIELDS.PLATFORM_ID);

    return data.length < 1 || data[0].id === currentCreatedPlatformId;
  }

  async getPlatformDetails(id: string) {
    const { data } = await axiosInstance().get(`${PLATFORMS}/${id}`);

    return data;
  }

  async updatePlatform(id: number, payload) {
    const { data } = await axiosInstance().patch(`${PLATFORMS}/${id}`, payload);

    return data;
  }
}

export default PlatformApi;
