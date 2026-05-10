import { api } from '@/lib/axios';
import { rbac } from '@/lib/api-rbac';
import type { Paginated, PaginationParams } from '@/modules/shared/types/pagination';

const FEES_BASE = '/service-fees';

export interface ServiceFeeRule {
  id: string;
  createdByUserId: number;
  scope: 'global' | 'host' | 'property_group' | 'property' | 'service_group' | 'service';
  targetHostId?: number;
  targetPropertyGroupId?: string;
  targetPropertyId?: string;
  targetServiceGroupId?: string;
  targetServiceId?: string;
  calculationType: 'percentage' | 'fixed' | 'percentage_plus_fixed' | 'fixed_then_percentage';
  percentageRate: number;
  fixedAmount: number;
  fixedThreshold?: number;
  minFee?: number;
  maxFee?: number;
  isDefault: boolean;
  isActive: boolean;
  description?: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Calculation types explained:
 * - percentage: fee = amount × rate%
 * - fixed: fee = fixedAmount (constant)
 * - percentage_plus_fixed: fee = amount × rate% + fixedAmount
 * - fixed_then_percentage: fee = fixedAmount if amount ≤ threshold,
 *   otherwise fixedAmount + (amount - threshold) × rate%, capped at maxFee
 *
 * Priority: lower number = higher priority. When multiple rules match,
 * the one with the lowest priority number wins.
 */

export const serviceFeesApi = {
  getAll: () =>
    api.get<ServiceFeeRule[]>(FEES_BASE, rbac('serviceFeesApi.getAll.GET')).then(r => r.data),

  getAllPaginated: (params: PaginationParams = {}) =>
    api.get<Paginated<ServiceFeeRule>>(FEES_BASE, {
      ...rbac('serviceFeesApi.getAll.GET'),
      params: { page: params.page ?? 1, limit: params.limit ?? 20 },
    }).then(r => r.data),

  getDefault: () =>
    api.get<ServiceFeeRule>(`${FEES_BASE}/default`, rbac('serviceFeesApi.getDefault.GET')).then(r => r.data),

  getForHost: (hostId: number) =>
    api.get<ServiceFeeRule[]>(`${FEES_BASE}/host/${hostId}`, rbac('serviceFeesApi.getForHost.GET')).then(r => r.data),

  create: (data: Partial<ServiceFeeRule>) =>
    api.post<ServiceFeeRule>(FEES_BASE, data, rbac('serviceFeesApi.create.POST')).then(r => r.data),

  update: (ruleId: string, data: Partial<ServiceFeeRule>) =>
    api.put<ServiceFeeRule>(`${FEES_BASE}/${ruleId}`, data, rbac('serviceFeesApi.update.PUT')).then(r => r.data),

  remove: (ruleId: string) =>
    api.delete(`${FEES_BASE}/${ruleId}`, rbac('serviceFeesApi.remove.DELETE')),

  calculate: (data: { hostId: number; propertyId: string; propertyGroupId?: string; amount: number; serviceId?: string; serviceGroupId?: string }) =>
    api.post<{ fee: number; rule: ServiceFeeRule }>(`${FEES_BASE}/calculate`, data, rbac('serviceFeesApi.calculate.POST')).then(r => r.data),
};
