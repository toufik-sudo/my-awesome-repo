// -----------------------------------------------------------------------------
// Axios Host Configuration
// For endpoints that are NOT under /api/v2 (e.g., file upload/download)
// -----------------------------------------------------------------------------

import axios, { AxiosInstance } from 'axios';
import envConfig from '@/config/envConfig';
import {
  APPLICATION_JSON,
  CONTENT_TYPE,
  TIMEOUT_PERIOD,
  ACCEPT_LANGUAGE,
  AUTHORIZATION
} from '@/constants/api';
import { AUTHORIZATION_TOKEN } from '@/constants/general';

// Helper to get cookie value
const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};

const baseAxiosHostConfiguration = () => ({
  baseURL: envConfig.backendHostUrl,
  headers: {
    Accept: APPLICATION_JSON,
    [CONTENT_TYPE]: APPLICATION_JSON,
    [AUTHORIZATION]: getCookie(AUTHORIZATION_TOKEN),
    [ACCEPT_LANGUAGE]: getCookie('cr-lang')
  },
  timeout: TIMEOUT_PERIOD
});

// No interceptors here; customize as needed
const hostAxiosInstance = (): AxiosInstance => {
  const config = baseAxiosHostConfiguration();
  return axios.create(config);
};

export default hostAxiosInstance;