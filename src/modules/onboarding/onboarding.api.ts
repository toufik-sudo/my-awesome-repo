/**
 * Onboarding module API endpoints (PUBLIC — no auth required)
 */
import { API_BASE } from '@/constants/api.constants';

const ONBOARDING_BASE = '/onboarding';

export const ONBOARDING_API = {
  VERIFY_INVITATION: (token: string) =>
    `${ONBOARDING_BASE}/invitation/${encodeURIComponent(token)}`,
  SIGNUP_WITH_INVITATION: (token: string) =>
    `${ONBOARDING_BASE}/signup/invitation/${encodeURIComponent(token)}`,
  SELF_SIGNUP: `${ONBOARDING_BASE}/signup`,
} as const;

export type OnboardingRole =
  | 'hyper_admin' | 'hyper_manager' | 'admin' | 'manager' | 'user' | 'guest';

export interface VerifiedInvitation {
  invitationId: string;
  email: string | null;
  phone: string | null;
  role: OnboardingRole;
  method: 'email' | 'phone';
  inviterName: string;
  inviterRole: OnboardingRole;
  expiresAt: string | null;
  message: string | null;
  userExists: boolean;
}

export interface SignupPayload {
  phoneNbr: string;
  email: string;
  role: OnboardingRole;
  password: string;
  cardId: string;
  passportId?: string;
  lastName: string;
  firstName: string;
  title: string;
  city: string;
  zipcode: string;
  address: string;
  country: string;
  /** ISO-3166 alpha-2 of the address country — drives backend phone & postal validation. */
  countryCode?: string;
  avatarUrl?: string;
  /** Optional referral code entered at signup (REF-XXXXXXXX). */
  referralCode?: string;
}

export interface SignupResponse {
  userId: number;
  role: OnboardingRole;
  email: string | null;
  phone: string | null;
}
