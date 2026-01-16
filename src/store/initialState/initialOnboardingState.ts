import { IOnboardingReducer } from 'interfaces/store/IStore';
import { ONBOARDING_BENEFICIARY_USER_TYPE } from 'constants/onboarding/general';

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
