import { api } from '@/lib/axios';

const FEES_BASE = '/service-fees';

export interface ServiceFeeRule {
  id: string;
  createdByUserId: number;
  scope: 'global' | 'host' | 'property_group' | 'property';
  targetHostId?: number;
  targetPropertyGroupId?: string;
  targetPropertyId?: string;
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
    api.get<ServiceFeeRule[]>(FEES_BASE).then(r => r.data),

  getDefault: () =>
    api.get<ServiceFeeRule>(`${FEES_BASE}/default`).then(r => r.data),

  getForHost: (hostId: number) =>
    api.get<ServiceFeeRule[]>(`${FEES_BASE}/host/${hostId}`).then(r => r.data),

  create: (data: Partial<ServiceFeeRule>) =>
    api.post<ServiceFeeRule>(FEES_BASE, data).then(r => r.data),

  update: (ruleId: string, data: Partial<ServiceFeeRule>) =>
    api.put<ServiceFeeRule>(`${FEES_BASE}/${ruleId}`, data).then(r => r.data),

  remove: (ruleId: string) =>
    api.delete(`${FEES_BASE}/${ruleId}`),

  calculate: (data: { hostId: number; propertyId: string; propertyGroupId?: string; amount: number }) =>
    api.post<{ fee: number; rule: ServiceFeeRule }>(`${FEES_BASE}/calculate`, data).then(r => r.data),
};
