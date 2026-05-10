import { api } from '@/lib/axios';
import {
  ONBOARDING_API,
  VerifiedInvitation,
  SignupPayload,
  SignupResponse,
} from './onboarding.api';

/**
 * Onboarding service — public, unauthenticated calls used by /onboarding.
 * Bypasses the RBAC pre-flight interceptor because endpoints are `@Public()`.
 */
export const onboardingService = {
  async verifyInvitation(token: string): Promise<VerifiedInvitation> {
    const { data } = await api.get<VerifiedInvitation>(
      ONBOARDING_API.VERIFY_INVITATION(token),
      { headers: { 'x-public-onboarding': '1' } },
    );
    return data;
  },

  async signupWithInvitation(
    token: string,
    payload: SignupPayload,
  ): Promise<SignupResponse> {
    const { data } = await api.post<SignupResponse>(
      ONBOARDING_API.SIGNUP_WITH_INVITATION(token),
      payload,
      { headers: { 'x-public-onboarding': '1' } },
    );
    return data;
  },

  async selfSignup(payload: SignupPayload): Promise<SignupResponse> {
    const { data } = await api.post<SignupResponse>(
      ONBOARDING_API.SELF_SIGNUP,
      payload,
      { headers: { 'x-public-onboarding': '1' } },
    );
    return data;
  },
};
