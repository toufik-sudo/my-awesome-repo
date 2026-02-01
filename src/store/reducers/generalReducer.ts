import { AnyAction } from 'redux';
import { 
  SET_GLOBAL_LOADING, 
  SET_USER_LOGGED_IN, 
  SET_HANDLE_REDIRECT_ON_LOGIN 
} from '../actions/actionTypes';
import { IGeneralReducer, initialGeneralState } from '../initialState/initialGeneralState';

/**
 * General reducer - manages loading and authentication states
 */
const generalReducer = (
  state: IGeneralReducer = initialGeneralState, 
  action: AnyAction
): IGeneralReducer => {
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

export default generalReducer;
