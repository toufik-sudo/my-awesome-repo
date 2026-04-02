import { api } from '@/lib/axios';

export interface HostFeeAbsorption {
  id: string;
  hostUserId: number;
  scope: 'all' | 'property_group' | 'service_group' | 'property' | 'service';
  targetPropertyGroupId?: string;
  targetServiceGroupId?: string;
  targetPropertyId?: string;
  targetServiceId?: string;
  absorptionPercent: number;
  /** Only absorb for specific payment methods (null = all) */
  paymentMethods?: string[];
  /** Whether this is for hand-to-hand (cash) payments only */
  handToHandOnly: boolean;
  validFrom?: string;
  validTo?: string;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

const BASE = '/host-fee-absorptions';

export const hostFeeAbsorptionApi = {
  getMine: () => api.get<HostFeeAbsorption[]>(BASE).then(r => r.data),
  getForHost: (hostId: number) => api.get<HostFeeAbsorption[]>(`${BASE}/host/${hostId}`).then(r => r.data),
  create: (data: Partial<HostFeeAbsorption>) => api.post<HostFeeAbsorption>(BASE, data).then(r => r.data),
  update: (id: string, data: Partial<HostFeeAbsorption>) => api.put<HostFeeAbsorption>(`${BASE}/${id}`, data).then(r => r.data),
  remove: (id: string) => api.delete(`${BASE}/${id}`),
  /** Check if host absorbs fees for this booking context */
  checkAbsorption: (data: { hostId: number; propertyId?: string; serviceId?: string; paymentMethod: string }) =>
    api.post<{ absorbed: boolean; absorptionPercent: number; absorptionAmount?: number }>(`${BASE}/check`, data).then(r => r.data),
};
