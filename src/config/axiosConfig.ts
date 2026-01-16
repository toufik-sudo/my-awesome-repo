import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

import envConfig from 'config/envConfig';
import { APPLICATION_JSON, CONTENT_TYPE, TIMEOUT_PERIOD, ACCEPT_LANGUAGE, AUTHORIZATION } from 'constants/api';
import { AUTHORIZATION_TOKEN } from 'constants/general';
import { CR_COOKIE_LABEL } from 'constants/i18n';
import { LOGIN_PAGE_ROUTE, ROOT } from 'constants/routes';
import { clearUserData } from 'services/UserDataServices';

const baseAxiosConfiguration = () => ({
  baseURL: envConfig.backendUrl,
  headers: {
    Accept: APPLICATION_JSON,
    [CONTENT_TYPE]: APPLICATION_JSON,
    [AUTHORIZATION]: Cookies.get(AUTHORIZATION_TOKEN),
    [ACCEPT_LANGUAGE]: Cookies.get(CR_COOKIE_LABEL)
  },
  timeout: TIMEOUT_PERIOD
});

const baseAxiosConfigurationWithoutAuthHeader = {
  baseURL: envConfig.backendUrl,
  headers: {
    Accept: APPLICATION_JSON,
    [CONTENT_TYPE]: APPLICATION_JSON
  },
  timeout: TIMEOUT_PERIOD
};

const axiosInstance: (withAuthHeader?: boolean) => AxiosInstance = (withAuthHeader = true) => {
  let config = baseAxiosConfigurationWithoutAuthHeader;
  if (withAuthHeader) {
    config = baseAxiosConfiguration();
  }

  const instance = axios.create(config);
  // interceptor for 401 unauthorized response when user token is expired
  instance.interceptors.response.use(
    function(response) {
      return response;
    },
    function(error) {
      //check status code is 401 => remove user credentials and redirect to homepage
      if (error.response?.status == 401 && window.location.pathname.indexOf(LOGIN_PAGE_ROUTE) === -1) {
        clearUserData();
        (window as any).location = ROOT;
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const mockAxiosInstance: AxiosInstance = axios.create(baseAxiosConfiguration());

export default axiosInstance;
