import axiosInstance from 'config/axiosConfig';
import {
  POINT_CONVERSION_DECLINE_OPERATION,
  POINT_CONVERSION_VALIDATE_OPERATION,
  POINT_CONVERSIONS_API,
  POINT_CONVERSIONS_API_UPDATE_STATUS
} from 'constants/api';
import { DEFAULT_POINT_CONVERSIONS_SIZE } from 'constants/api/pointConversions';

class PointConversionsApi {
  async getPointConversions() {
    const { data } = await axiosInstance().get(POINT_CONVERSIONS_API, {
      params: {
        ...DEFAULT_POINT_CONVERSIONS_SIZE
      }
    });

    return data;
  }
  
  async postPointConversions(dataParam) {
    const { data } = await axiosInstance().post(POINT_CONVERSIONS_API, 
      dataParam
    );

    return data;
  }

  async validatePointConversion(pointConversion) {
    await axiosInstance().put(POINT_CONVERSIONS_API_UPDATE_STATUS, {
      data: [
        {
          id: pointConversion.id,
          operation: pointConversion.operation,
          orderUuid : pointConversion.orderUuid,
          errorCode : pointConversion.errorCode,
          errorMessage : pointConversion.errorMessage
        }
      ]
    });
  }
}

export default PointConversionsApi;
