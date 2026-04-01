import { api } from '@/lib/axios';

const FEES_BASE = '/service-fees';

export interface ServiceFeeRule {
  id: string;
  createdByUserId: number;
  scope: 'global' | 'host' | 'property_group' | 'property';
  targetHostId?: number;
  targetPropertyGroupId?: string;
  targetPropertyId?: string;
  calculationType: 'percentage' | 'fixed' | 'percentage_plus_fixed';
  percentageRate: number;
  fixedAmount: number;
  minFee?: number;
  maxFee?: number;
  isDefault: boolean;
  isActive: boolean;
  description?: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

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
