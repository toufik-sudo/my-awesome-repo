import { api } from '@/lib/axios';

const FEES_BASE = '/service-fees';

export type FeeScope = 'global' | 'host' | 'property_group' | 'property' | 'service_group' | 'service';
export type FeeCalculation = 'percentage' | 'fixed' | 'percentage_plus_fixed' | 'fixed_then_percentage';

export interface ServiceFeeRule {
  id: string;
  createdByUserId: number;
  scope: FeeScope;
  targetHostId?: number;
  targetPropertyGroupId?: string;
  targetPropertyId?: string;
  targetServiceGroupId?: string;
  targetServiceId?: string;
  calculationType: FeeCalculation;
  /** Percentage fee (e.g., 15 for 15%) */
  percentageRate: number;
  /** Fixed fee amount */
  fixedAmount: number;
  /**
   * Threshold for fixed_then_percentage:
   * fixed fee applies up to this amount, then percentage on the remainder
   */
  fixedThreshold?: number;
  /** Min fee cap */
  minFee?: number;
  /** Max fee cap */
  maxFee?: number;
  isDefault: boolean;
  isActive: boolean;
  description?: string;
  /**
   * Priority — lower number = higher priority.
   * When multiple rules match, the one with the lowest priority number wins.
   */
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

  calculate: (data: {
    hostId: number;
    propertyId: string;
    propertyGroupId?: string;
    amount: number;
    serviceId?: string;
    serviceGroupId?: string;
  }) =>
    api.post<{ fee: number; rule: ServiceFeeRule }>(`${FEES_BASE}/calculate`, data).then(r => r.data),
};
