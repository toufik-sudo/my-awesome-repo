import { IGeneralReducer } from 'interfaces/store/IStore';

export const initialGeneralState: IGeneralReducer = {
  globalLoading: false,
  userLoggedIn: false,
  redirectOnLogin: false
};
