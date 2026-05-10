import { api } from '@/lib/axios';
import { rbac } from '@/lib/api-rbac';

export interface HostFeeAbsorption {
  id: string;
  hostUserId: number;
  scope: 'all' | 'property_group' | 'service_group' | 'property' | 'service';
  targetPropertyGroupId?: string;
  targetServiceGroupId?: string;
  targetPropertyId?: string;
  targetServiceId?: string;
  absorptionPercent: number;
  paymentMethods?: string[];
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
  getMine: () => api.get<HostFeeAbsorption[]>(BASE, rbac('hostFeeAbsorptionApi.getMine.GET')).then(r => r.data),
  getForHost: (hostId: number) => api.get<HostFeeAbsorption[]>(`${BASE}/host/${hostId}`, rbac('hostFeeAbsorptionApi.getForHost.GET')).then(r => r.data),
  create: (data: Partial<HostFeeAbsorption>) => api.post<HostFeeAbsorption>(BASE, data, rbac('hostFeeAbsorptionApi.create.POST')).then(r => r.data),
  update: (id: string, data: Partial<HostFeeAbsorption>) => api.put<HostFeeAbsorption>(`${BASE}/${id}`, data, rbac('hostFeeAbsorptionApi.update.PUT')).then(r => r.data),
  remove: (id: string) => api.delete(`${BASE}/${id}`, rbac('hostFeeAbsorptionApi.remove.DELETE')),
  checkAbsorption: (data: { hostId: number; propertyId?: string; serviceId?: string; paymentMethod: string }) =>
    api.post<{ absorbed: boolean; absorptionPercent: number; absorptionAmount?: number }>(`${BASE}/check`, data, rbac('hostFeeAbsorptionApi.checkAbsorption.POST')).then(r => r.data),
};
