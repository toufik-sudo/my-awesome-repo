import axiosInstance from 'config/axiosConfig';
import { API_V1, CONTENT_TYPE, MAX_TIMEOUT_PERIOD, MULTIPART_FORM_DATA, POST } from 'constants/api';
import { trimUrl } from 'utils/api';
import envConfig from 'config/envConfig';

/**
 * Action used to upload a file
 * @param data
 * @param endpoint
 */
export const uploadFile = (data, endpoint) =>
  axiosInstance()({
    method: POST,
    url: `${trimUrl(envConfig.backendUrl, API_V1)}${endpoint}`,
    data,
    headers: { [CONTENT_TYPE]: MULTIPART_FORM_DATA },
    timeout: MAX_TIMEOUT_PERIOD
  });
