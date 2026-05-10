import { api } from '@/lib/axios';

export interface VerifiedInvitation {
  invitationId: string;
  email: string | null;
  phone: string | null;
  role: string;
  method: 'email' | 'phone';
  inviterName: string;
  inviterRole: string;
  expiresAt: string | null;
  message: string | null;
  userExists: boolean;
}

export interface SignupPayload {
  phoneNbr: string;
  email: string;
  role?: string;
  password: string;
  firstName: string;
  lastName: string;
  city: string;
  zipcode: string;
  address: string;
  country: string;
  countryCode?: string;
  cardId?: string;
  title?: string;
  avatarUrl?: string;
  referralCode?: string;
}

const BASE = '/onboarding';

export const onboardingApi = {
  verifyInvitation(token: string) {
    return api.get<VerifiedInvitation>(`${BASE}/invitation/${encodeURIComponent(token)}`).then((r) => r.data);
  },

  signupWithInvitation(token: string, payload: SignupPayload) {
    return api.post(`${BASE}/signup/invitation/${encodeURIComponent(token)}`, payload).then((r) => r.data);
  },

  selfSignup(payload: SignupPayload) {
    return api.post(`${BASE}/signup`, payload).then((r) => r.data);
  },
};
