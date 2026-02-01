// -----------------------------------------------------------------------------
// Point Conversions API
// Migrated from old_app/src/api/PointConversionsApi.ts
// -----------------------------------------------------------------------------

import axiosInstance from '@/config/axiosConfig';
import { POINT_CONVERSIONS_API, POINT_CONVERSIONS_API_UPDATE_STATUS } from '@/constants/api';
import { DEFAULT_POINT_CONVERSIONS_SIZE } from '@/constants/api/pointConversions';

class PointConversionsApi {
  async getPointConversions() {
    const { data } = await axiosInstance().get(POINT_CONVERSIONS_API, {
      params: {
        ...DEFAULT_POINT_CONVERSIONS_SIZE
      }
    });
    return data;
  }

  async postPointConversions(dataParam: any) {
    const { data } = await axiosInstance().post(POINT_CONVERSIONS_API, dataParam);
    return data;
  }

  async validatePointConversion(pointConversion: {
    id: number;
    operation: string;
    orderUuid?: string;
    errorCode?: string;
    errorMessage?: string;
  }) {
    await axiosInstance().put(POINT_CONVERSIONS_API_UPDATE_STATUS, {
      data: [
        {
          id: pointConversion.id,
          operation: pointConversion.operation,
          orderUuid: pointConversion.orderUuid,
          errorCode: pointConversion.errorCode,
          errorMessage: pointConversion.errorMessage
        }
      ]
    });
  }
}

export const pointConversionsApi = new PointConversionsApi();
export default PointConversionsApi;
