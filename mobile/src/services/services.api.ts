import { api } from '@/lib/axios';
import { API_BASE } from '@/constants/api.constants';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TourismServiceItem {
  id: string;
  providerId: number;
  title: Record<string, string> | string;
  description?: Record<string, string> | string;
  category: string;
  status: string;
  price: number;
  currency: string;
  pricingType: string;
  city: string;
  wilaya: string;
  thumbnail?: string;
  rating?: number;
}

export interface ServiceFilters {
  city?: string;
  category?: string;
  page?: number;
  limit?: number;
}

/**
 * Mobile services API. Mirrors backend `GET /services` (paginated) contract.
 * Falls back to a wrapped flat array if the backend ever returns a list.
 */
export const servicesApi = {
  async getAll(params: ServiceFilters = {}): Promise<PaginatedResponse<TourismServiceItem>> {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.append(k, String(v));
    });
    const res = await api.get<PaginatedResponse<TourismServiceItem> | TourismServiceItem[]>(
      `${API_BASE.SERVICES}?${qs.toString()}`,
    );
    const body: any = res.data;
    if (Array.isArray(body)) {
      return { data: body, total: body.length, page: 1, limit: body.length, totalPages: 1 };
    }
    return body;
  },

  async getById(id: string): Promise<TourismServiceItem> {
    const res = await api.get<TourismServiceItem>(`${API_BASE.SERVICES}/${id}`);
    return res.data;
  },
};
