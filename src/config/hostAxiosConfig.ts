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
import { LOGIN_PAGE_ROUTE, ROOT } from '@/constants/routes';
import { clearUserData } from '@/services';

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
    const instance = axios.create(config);
    // Interceptor for 401 unauthorized response when user token is expired
    // instance.interceptors.response.use(
    //   (response) => response,
    //   (error) => {
    //     // Check status code is 401 => remove user credentials and redirect to homepage
    //     if (error.response?.status === 401 && window.location.pathname.indexOf(LOGIN_PAGE_ROUTE) === -1) {
    //       clearUserData();
    //       window.location.href = ROOT;
    //     }

    //     return Promise.reject(error);
    //   }
    // );
    return instance;
};

export default hostAxiosInstance;