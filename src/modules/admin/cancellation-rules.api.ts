import { api } from '@/lib/axios';
import { rbac } from '@/lib/api-rbac';
import type { Paginated, PaginationParams } from '@/modules/shared/types/pagination';

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
  fullRefundHours: number;
  partialRefundHours: number;
  partialRefundPercent: number;
  lateCancelPenalty: number;
  noShowPenalty: boolean;
  noShowPenaltyPercent: number;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

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
  getMine: () => api.get<CancellationRule[]>(BASE, rbac('cancellationRulesApi.getMine.GET')).then(r => r.data),
  getAll: () => api.get<CancellationRule[]>(`${BASE}/all`, rbac('cancellationRulesApi.getAll.GET')).then(r => r.data),
  getAllPaginated: (params: PaginationParams = {}) =>
    api.get<Paginated<CancellationRule>>(`${BASE}/all`, {
      ...rbac('cancellationRulesApi.getAll.GET'),
      params: { page: params.page ?? 1, limit: params.limit ?? 20 },
    }).then(r => r.data),
  getForHost: (hostId: number) => api.get<CancellationRule[]>(`${BASE}/host/${hostId}`, rbac('cancellationRulesApi.getForHost.GET')).then(r => r.data),
  create: (data: Partial<CancellationRule>) => api.post<CancellationRule>(BASE, data, rbac('cancellationRulesApi.create.POST')).then(r => r.data),
  update: (id: string, data: Partial<CancellationRule>) => api.put<CancellationRule>(`${BASE}/${id}`, data, rbac('cancellationRulesApi.update.PUT')).then(r => r.data),
  remove: (id: string) => api.delete(`${BASE}/${id}`, rbac('cancellationRulesApi.remove.DELETE')),
};
