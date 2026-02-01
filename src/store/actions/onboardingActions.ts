// -----------------------------------------------------------------------------
// Onboarding Actions
// Migrated from old_app/src/store/actions/onboardingActions.ts
// -----------------------------------------------------------------------------

import { SET_ONBOARDING_REGISTER_DATA } from './actionTypes';
import { IRegisterStepsData } from '@/types/store';

/**
 * Set onboarding register data
 */
export const setOnboardingRegisterData = (registerData: Partial<IRegisterStepsData>) => ({
  type: SET_ONBOARDING_REGISTER_DATA,
  payload: { registerData }
});
