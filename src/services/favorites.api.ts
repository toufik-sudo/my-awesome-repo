import { api } from '@/lib/axios';
import { rbac, rbacMerge } from '@/lib/api-rbac';

const FAVORITES_BASE = '/favorites';

export interface FavoriteItem {
  id: string;
  propertyId: string;
  createdAt: string;
  property?: any;
}

export interface PaginatedFavorites {
  data: FavoriteItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const favoritesApi = {
  /** @deprecated Use getMyFavoritesPaginated for server-side pagination. */
  async getMyFavorites(): Promise<FavoriteItem[]> {
    const response = await api.get<PaginatedFavorites>(FAVORITES_BASE, rbacMerge('favoritesApi.getMyFavorites.GET', {
      params: { page: 1, limit: 1000 },
    }));
    return response.data.data;
  },

  async getMyFavoritesPaginated(params: { page?: number; limit?: number } = {}): Promise<PaginatedFavorites> {
    const response = await api.get<PaginatedFavorites>(FAVORITES_BASE, rbacMerge('favoritesApi.getMyFavorites.GET', {
      params: { page: params.page ?? 1, limit: params.limit ?? 20 },
    }));
    return response.data;
  },

  async checkFavorite(propertyId: string): Promise<{ favorited: boolean }> {
    const response = await api.get<{ favorited: boolean }>(`${FAVORITES_BASE}/check/${propertyId}`, rbac('favoritesApi.checkFavorite.GET'));
    return response.data;
  },

  async toggleFavorite(propertyId: string): Promise<{ favorited: boolean }> {
    const response = await api.post<{ favorited: boolean }>(`${FAVORITES_BASE}/${propertyId}`, undefined, rbac('favoritesApi.toggle.POST'));
    return response.data;
  },

  async removeFavorite(propertyId: string): Promise<{ favorited: boolean }> {
    const response = await api.delete<{ favorited: boolean }>(`${FAVORITES_BASE}/${propertyId}`, rbac('favoritesApi.removeFavorite.DELETE'));
    return response.data;
  },
};
