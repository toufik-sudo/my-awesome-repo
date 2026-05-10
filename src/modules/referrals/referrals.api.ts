import { api } from '@/lib/axios';
import { rbac } from '@/lib/api-rbac';

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

export interface PaginatedReferrals {
  data: Referral[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedScopedReferrals extends PaginatedReferrals {
  stats: ReferralStats & {
    firstBooking: number;
    expired: number;
    totalReferrerPoints: number;
    totalReferredPoints: number;
  };
}

export const referralsApi = {
  getMyCode: () =>
    api.get<{ code: string }>(`${REFERRALS_BASE}/code`, rbac('referralsApi.getMyCode.GET')).then(r => r.data),

  create: (data: { method: string; inviteeContact?: string; propertyId?: string }) =>
    api.post<Referral>(REFERRALS_BASE, data, rbac('referralsApi.create.POST')).then(r => r.data),

  /** @deprecated Use getMyReferralsPaginated for server-side pagination. */
  getMyReferrals: () =>
    api.get<PaginatedReferrals>(REFERRALS_BASE, {
      ...rbac('referralsApi.getMyReferrals.GET'),
      params: { page: 1, limit: 1000 },
    }).then(r => r.data.data),

  getMyReferralsPaginated: (params: { page?: number; limit?: number } = {}) =>
    api.get<PaginatedReferrals>(REFERRALS_BASE, {
      ...rbac('referralsApi.getMyReferrals.GET'),
      params: { page: params.page ?? 1, limit: params.limit ?? 20 },
    }).then(r => r.data),

  getStats: () =>
    api.get<ReferralStats>(`${REFERRALS_BASE}/stats`, rbac('referralsApi.getStats.GET')).then(r => r.data),

  completeSignup: (code: string) =>
    api.post<Referral>(`${REFERRALS_BASE}/signup/${code}`, undefined, rbac('referralsApi.completeSignup.POST')).then(r => r.data),

  shareProperty: (data: { propertyId: string; method: string; recipient?: string }) =>
    api.post(`${REFERRALS_BASE}/share`, data, rbac('referralsApi.shareProperty.POST')).then(r => r.data),

  /**
   * Returns paginated scoped referrals plus aggregated stats over the full set.
   * The `referrals` alias (previous shape) is kept for backwards compatibility.
   */
  getScoped: (params: { page?: number; limit?: number } = {}) =>
    api.get<PaginatedScopedReferrals>(`${REFERRALS_BASE}/scoped`, {
      ...rbac('referralsApi.getScoped.GET'),
      params: { page: params.page ?? 1, limit: params.limit ?? 1000 },
    }).then(r => ({ ...r.data, referrals: r.data.data })),

  getShareStats: (propertyId: string) =>
    api.get<ShareStats>(`${REFERRALS_BASE}/share/${propertyId}/stats`, rbac('referralsApi.getShareStats.GET')).then(r => r.data),
};
