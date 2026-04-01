import { api } from '@/lib/axios';

const REFERRALS_BASE = '/referrals';

export interface Referral {
  id: string;
  referrerId: number;
  referredUserId?: number;
  code: string;
  inviteeContact?: string;
  method: string;
  status: 'pending' | 'signed_up' | 'first_booking' | 'completed' | 'expired';
  referrerPointsAwarded: number;
  referredPointsAwarded: number;
  sharedPropertyId?: string;
  expiresAt?: string;
  createdAt: string;
  referredUser?: { id: number; firstName?: string; lastName?: string; email?: string };
}

export interface ReferralStats {
  total: number;
  pending: number;
  signedUp: number;
  completed: number;
  totalPointsEarned: number;
}

export interface ShareStats {
  total: number;
  byMethod: Record<string, number>;
}

export const referralsApi = {
  getMyCode: () =>
    api.get<{ code: string }>(`${REFERRALS_BASE}/code`).then(r => r.data),

  create: (data: { method: string; inviteeContact?: string; propertyId?: string }) =>
    api.post<Referral>(REFERRALS_BASE, data).then(r => r.data),

  getMyReferrals: () =>
    api.get<Referral[]>(REFERRALS_BASE).then(r => r.data),

  getStats: () =>
    api.get<ReferralStats>(`${REFERRALS_BASE}/stats`).then(r => r.data),

  completeSignup: (code: string) =>
    api.post<Referral>(`${REFERRALS_BASE}/signup/${code}`).then(r => r.data),

  shareProperty: (data: { propertyId: string; method: string; recipient?: string }) =>
    api.post(`${REFERRALS_BASE}/share`, data).then(r => r.data),

  getShareStats: (propertyId: string) =>
    api.get<ShareStats>(`${REFERRALS_BASE}/share/${propertyId}/stats`).then(r => r.data),
};
