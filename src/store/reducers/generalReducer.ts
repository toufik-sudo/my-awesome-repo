import { AnyAction } from 'redux';

import { IGeneralReducer } from 'interfaces/store/IStore';
import { initialGeneralState } from 'store/initialState/initialGeneralState';
import { SET_GLOBAL_LOADING, SET_USER_LOGGED_IN, SET_HANDLE_REDIRECT_ON_LOGIN } from 'store/actions/actionTypes';

/**
 * General reducer -> manages loading and other app states
 *
 * @param state
 * @param action
 */
export default (state: IGeneralReducer = initialGeneralState, action: AnyAction) => {
  switch (action.type) {
    case SET_GLOBAL_LOADING:
      return {
        ...state,
        globalLoading: action.payload
      };
    case SET_USER_LOGGED_IN:
      return {
        ...state,
        userLoggedIn: action.payload
      };
    case SET_HANDLE_REDIRECT_ON_LOGIN:
      return {
        ...state,
        redirectOnLogin: action.payload
      };
    default:
      return state;
  }
};
