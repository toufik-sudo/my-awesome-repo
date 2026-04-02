import { api } from '@/lib/axios';

export type CancellationPolicyType = 'flexible' | 'moderate' | 'strict' | 'custom';

export interface CancellationRule {
  id: string;
  hostUserId: number;
  policyType: CancellationPolicyType;
  scope: 'all' | 'property_group' | 'service_group' | 'property' | 'service';
  targetPropertyGroupId?: string;
  targetServiceGroupId?: string;
  targetPropertyId?: string;
  targetServiceId?: string;
  /** Hours before check-in for full refund */
  fullRefundHours: number;
  /** Hours before check-in for partial refund */
  partialRefundHours: number;
  /** Partial refund percentage (0-100) */
  partialRefundPercent: number;
  /** Penalty percentage if cancelled too late (0-100) */
  lateCancelPenalty: number;
  /** Whether no-show is penalized */
  noShowPenalty: boolean;
  noShowPenaltyPercent: number;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/** Preset definitions for quick setup */
export const CANCELLATION_PRESETS: Record<string, Partial<CancellationRule>> = {
  flexible: {
    policyType: 'flexible',
    fullRefundHours: 24,
    partialRefundHours: 12,
    partialRefundPercent: 50,
    lateCancelPenalty: 0,
    noShowPenalty: false,
    noShowPenaltyPercent: 0,
    description: 'Annulation gratuite jusqu\'à 24h avant',
  },
  moderate: {
    policyType: 'moderate',
    fullRefundHours: 72,
    partialRefundHours: 24,
    partialRefundPercent: 50,
    lateCancelPenalty: 50,
    noShowPenalty: true,
    noShowPenaltyPercent: 100,
    description: 'Annulation gratuite jusqu\'à 72h, 50% après',
  },
  strict: {
    policyType: 'strict',
    fullRefundHours: 168,
    partialRefundHours: 72,
    partialRefundPercent: 25,
    lateCancelPenalty: 100,
    noShowPenalty: true,
    noShowPenaltyPercent: 100,
    description: 'Annulation gratuite 7 jours avant, 25% ensuite',
  },
};

const BASE = '/cancellation-rules';

export const cancellationRulesApi = {
  getMine: () => api.get<CancellationRule[]>(BASE).then(r => r.data),
  getForHost: (hostId: number) => api.get<CancellationRule[]>(`${BASE}/host/${hostId}`).then(r => r.data),
  create: (data: Partial<CancellationRule>) => api.post<CancellationRule>(BASE, data).then(r => r.data),
  update: (id: string, data: Partial<CancellationRule>) => api.put<CancellationRule>(`${BASE}/${id}`, data).then(r => r.data),
  remove: (id: string) => api.delete(`${BASE}/${id}`),
};
