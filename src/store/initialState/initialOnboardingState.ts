// -----------------------------------------------------------------------------
// Initial Onboarding State
// Migrated from old_app/src/store/initialState/initialOnboardingState.ts
// -----------------------------------------------------------------------------

import { IOnboardingReducer } from '@/types/store';
import { ONBOARDING_BENEFICIARY_USER_TYPE } from '@/constants/onboarding/general';

export const initialOnboardingState: IOnboardingReducer = {
  registerData: {
    title: null,
    firstName: null,
    lastName: null,
    email: null,
    createAccountPassword: null,
    passwordConfirmation: null,
    type: ONBOARDING_BENEFICIARY_USER_TYPE,
    croppedAvatar: null,
    fullAvatar: null,
    avatarConfig: null
  }
};
