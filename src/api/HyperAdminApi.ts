import axiosInstance from 'config/axiosConfig';
import { METRICS_ENDPOINT } from 'constants/api';

class HyperAdminApi {
  async getMetricsData() {
    return await axiosInstance().get(METRICS_ENDPOINT);
  }
}

export default HyperAdminApi;
