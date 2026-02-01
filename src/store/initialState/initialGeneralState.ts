export interface IGeneralReducer {
  globalLoading: boolean;
  userLoggedIn: boolean;
  redirectOnLogin: boolean;
}

export const initialGeneralState: IGeneralReducer = {
  globalLoading: false,
  userLoggedIn: false,
  redirectOnLogin: false
};
