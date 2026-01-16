import { AxiosResponse } from 'axios';
import { AnyAction } from 'redux';

import { SET_GLOBAL_LOADING, SET_USER_LOGGED_IN, SET_HANDLE_REDIRECT_ON_LOGIN } from 'store/actions/actionTypes';

/**
 * Action changes globalLoading state to a given payload
 *
 * @param payload
 */
export const setGlobalLoading = (payload: boolean) => ({
  type: SET_GLOBAL_LOADING,
  payload
});

export const setHandleRedirectOnLogin = (payload: boolean) => ({
  type: SET_HANDLE_REDIRECT_ON_LOGIN,
  payload
});
/**
 * Action applies all endpoint dependencies (loading state) and returns a promise with the data
 *
 * @param apiAction
 */
export const applyApiCall: <Payload>(
  apiAction: AnyAction | Promise<AxiosResponse<Payload>>
) => Promise<Payload> = apiAction => {
  return new Promise((resolve, reject) => {
    apiAction
      .then(data => resolve(data))
      .catch(err =>
        reject({
          ...err.response?.data,
          status: err.response?.status
        })
      );
  });
};

/**
 * Action used to set the user logged in status
 *
 * @param payload
 */
export const setUserLoggedIn = (payload: boolean) => ({
  type: SET_USER_LOGGED_IN,
  payload
});
