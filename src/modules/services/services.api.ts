import { api } from '@/lib/axios';
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
    return api.get<TourismServiceListResponse>(`/services?${params.toString()}`).then(r => r.data);
  },

  getCategories: () =>
    api.get<Array<{ category: string; count: number }>>('/services/categories').then(r => r.data),

  getById: (id: string) =>
    api.get<TourismService>(`/services/${id}`).then(r => r.data),

  create: (data: Partial<TourismService>) =>
    api.post<TourismService>('/services', data).then(r => r.data),

  update: (id: string, data: Partial<TourismService>) =>
    api.put<TourismService>(`/services/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/services/${id}`).then(r => r.data),

  // Service documents
  uploadDocument: (serviceId: string, formData: FormData) =>
    api.post(`/services/${serviceId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data),

  getDocuments: (serviceId: string) =>
    api.get(`/services/${serviceId}/documents`).then(r => r.data),
};
