// -----------------------------------------------------------------------------
// Wall Settings API
// Migrated from old_app/src/api/WallSettingsApi.ts
// -----------------------------------------------------------------------------

import Cookies from 'js-cookie';
import axiosInstance from '@/config/axiosConfig';
import { AUTHORIZATION, MAX_TIMEOUT_PERIOD } from '@/constants/api';
import { AUTHORIZATION_TOKEN } from '@/constants/general';

class WallSettingsApi {
  async confirmPassword(endpoint: string, payload: any) {
    const { data } = await axiosInstance().put(
      endpoint,
      { ...payload },
      { 
        headers: { [AUTHORIZATION]: Cookies.get(AUTHORIZATION_TOKEN) }, 
        timeout: MAX_TIMEOUT_PERIOD 
      }
    );
    return data;
  }
}

export const wallSettingsApi = new WallSettingsApi();
export default WallSettingsApi;
