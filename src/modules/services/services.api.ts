import { api } from '@/lib/axios';
import { rbac, rbacMerge } from '@/lib/api-rbac';
import type {
  TourismService,
  TourismServiceFilters,
  TourismServiceListResponse,
} from '@/types/tourism-service.types';

export const tourismServicesApi = {
  getAll: (filters: TourismServiceFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, String(v)));
        } else {
          params.append(key, String(value));
        }
      }
    });
    return api.get<TourismServiceListResponse>(`/services?${params.toString()}`, rbac('tourismServicesApi.getAll.GET')).then(r => r.data);
  },

  getCategories: () =>
    api.get<Array<{ category: string; count: number }>>('/services/categories', rbac('tourismServicesApi.getCategories.GET')).then(r => r.data),

  getById: (id: string) =>
    api.get<TourismService>(`/services/${id}`, rbac('tourismServicesApi.getById.GET')).then(r => r.data),

  create: (data: Partial<TourismService>) =>
    api.post<TourismService>('/services', data, rbac('tourismServicesApi.create.POST')).then(r => r.data),

  update: (id: string, data: Partial<TourismService>) =>
    api.put<TourismService>(`/services/${id}`, data, rbac('tourismServicesApi.update.PUT')).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/services/${id}`, rbac('tourismServicesApi.delete.DELETE')).then(r => r.data),

  uploadDocument: (serviceId: string, formData: FormData) =>
    api.post(`/services/${serviceId}/documents`, formData, rbacMerge('tourismServicesApi.uploadDocument.POST', {
      headers: { 'Content-Type': 'multipart/form-data' },
    })).then(r => r.data),

  getDocuments: (serviceId: string) =>
    api.get(`/services/${serviceId}/documents`, rbac('tourismServicesApi.getDocuments.GET')).then(r => r.data),
};
