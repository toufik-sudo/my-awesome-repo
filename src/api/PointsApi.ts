import axiosInstance from 'config/axiosConfig';
import { POINTS_CONVERSION_ENDPOINT, POINTS_CONVERSION_EDIT_ENDPOINT } from 'constants/api';

class PointsApi {
  async convertPoints(payload) {
    const { data } = await axiosInstance().post(POINTS_CONVERSION_ENDPOINT, payload);

    return data;
  }

  async validatePointsConversion(payload) {
    return await axiosInstance().put(POINTS_CONVERSION_EDIT_ENDPOINT, payload);
  }
}

export default PointsApi;
