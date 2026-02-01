// -----------------------------------------------------------------------------
// KPIs API
// Migrated from old_app/src/api/KPIsApi.ts
// -----------------------------------------------------------------------------

import axiosInstance from '@/config/axiosConfig';

export interface IKPIParams {
  platform?: number;
  program?: number;
  startDate?: string;
  endDate?: string;
  [key: string]: unknown;
}

export interface IKPIResponse {
  [key: string]: unknown;
}

class KPIsApi {
  async getKPIs(endpoint: string, payload?: IKPIParams): Promise<IKPIResponse> {
    const { data } = await axiosInstance().get(endpoint, {
      params: payload
    });
    return data;
  }
}

export const kpisApi = new KPIsApi();
export default KPIsApi;
