import { IOnboardingReducer } from 'interfaces/store/IStore';
import { AnyAction } from 'redux';

import { SET_ONBOARDING_REGISTER_DATA } from '../actions/actionTypes';
import { initialOnboardingState } from 'store/initialState/initialOnboardingState';

/**
 * Onboarding reducer -> manages onboarding data
 *
 * @param state
 * @param action
 */
export default (state: IOnboardingReducer = initialOnboardingState, { type, payload }: AnyAction) => {
  switch (type) {
    case SET_ONBOARDING_REGISTER_DATA:
      return {
        ...state,
        registerData: { ...state.registerData, ...payload.registerData }
      };
    default:
      return state;
  }
};
