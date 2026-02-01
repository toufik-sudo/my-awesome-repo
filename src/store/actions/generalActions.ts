import { 
  SET_GLOBAL_LOADING, 
  SET_USER_LOGGED_IN, 
  SET_HANDLE_REDIRECT_ON_LOGIN 
} from './actionTypes';

export interface ISetGlobalLoadingAction {
  type: typeof SET_GLOBAL_LOADING;
  payload: boolean;
}

export interface ISetUserLoggedInAction {
  type: typeof SET_USER_LOGGED_IN;
  payload: boolean;
}

export interface ISetRedirectOnLoginAction {
  type: typeof SET_HANDLE_REDIRECT_ON_LOGIN;
  payload: boolean;
}

export type GeneralActionTypes = 
  | ISetGlobalLoadingAction 
  | ISetUserLoggedInAction 
  | ISetRedirectOnLoginAction;

/**
 * Set global loading state
 */
export const setGlobalLoading = (loading: boolean): ISetGlobalLoadingAction => ({
  type: SET_GLOBAL_LOADING,
  payload: loading
});

/**
 * Set user logged in state
 */
export const setUserLoggedIn = (loggedIn: boolean): ISetUserLoggedInAction => ({
  type: SET_USER_LOGGED_IN,
  payload: loggedIn
});

/**
 * Set redirect on login flag
 */
export const setRedirectOnLogin = (redirect: boolean): ISetRedirectOnLoginAction => ({
  type: SET_HANDLE_REDIRECT_ON_LOGIN,
  payload: redirect
});
