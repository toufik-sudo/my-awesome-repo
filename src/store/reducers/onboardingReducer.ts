// -----------------------------------------------------------------------------
// Onboarding Reducer
// Migrated from old_app/src/store/reducers/onboardingReducer.ts
// -----------------------------------------------------------------------------

import { AnyAction } from 'redux';
import { SET_ONBOARDING_REGISTER_DATA } from '../actions/actionTypes';
import { IOnboardingReducer } from '@/types/store';
import { initialOnboardingState } from '../initialState/initialOnboardingState';

/**
 * Onboarding reducer - manages onboarding data
 */
const onboardingReducer = (
  state: IOnboardingReducer = initialOnboardingState,
  { type, payload }: AnyAction
): IOnboardingReducer => {
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

export default onboardingReducer;
