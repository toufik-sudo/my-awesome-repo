// -----------------------------------------------------------------------------
// Points API
// Migrated from old_app/src/api/PointsApi.ts
// -----------------------------------------------------------------------------

import axiosInstance from '@/config/axiosConfig';
import { POINT_CONVERSIONS_API, POINT_CONVERSIONS_API_UPDATE_STATUS } from '@/constants/api';

class PointsApi {
  async convertPoints(payload: any) {
    const { data } = await axiosInstance().post(POINT_CONVERSIONS_API, payload);
    return data;
  }

  async validatePointsConversion(payload: any) {
    return await axiosInstance().put(POINT_CONVERSIONS_API_UPDATE_STATUS, payload);
  }
}

export const pointsApi = new PointsApi();
export default PointsApi;
