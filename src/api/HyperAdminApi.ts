// -----------------------------------------------------------------------------
// Hyper Admin API
// Migrated from old_app/src/api/HyperAdminApi.ts
// -----------------------------------------------------------------------------

import axiosInstance from '@/config/axiosConfig';
import { METRICS_ENDPOINT } from '@/constants/api';

export interface IMetricsData {
  totalUsers?: number;
  totalPlatforms?: number;
  totalPrograms?: number;
  activePrograms?: number;
  [key: string]: unknown;
}

class HyperAdminApi {
  async getMetricsData(): Promise<IMetricsData> {
    const { data } = await axiosInstance().get(METRICS_ENDPOINT);
    return data;
  }
}

export const hyperAdminApi = new HyperAdminApi();
export default HyperAdminApi;
