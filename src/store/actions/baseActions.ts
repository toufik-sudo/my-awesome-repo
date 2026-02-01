// -----------------------------------------------------------------------------
// Base Actions
// Migrated from old_app/src/store/actions/baseActions.ts
// -----------------------------------------------------------------------------

import axiosInstance from '@/config/axiosConfig';
import envConfig from '@/config/envConfig';
import { 
  API_V1, 
  CONTENT_TYPE, 
  MAX_TIMEOUT_PERIOD, 
  MULTIPART_FORM_DATA, 
  POST 
} from '@/constants/api';
import { trimUrl } from '@/utils/api';

/**
 * Action used to upload a file
 */
export const uploadFile = (data: any, endpoint: string) =>
  axiosInstance()({
    method: POST,
    url: `${trimUrl(envConfig.backendUrl, API_V1)}${endpoint}`,
    data,
    headers: { [CONTENT_TYPE]: MULTIPART_FORM_DATA },
    timeout: MAX_TIMEOUT_PERIOD
  });
