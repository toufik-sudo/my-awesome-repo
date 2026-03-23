import { api } from '@/lib/axios';

const FAVORITES_BASE = '/favorites';

export interface FavoriteItem {
  id: string;
  propertyId: string;
  createdAt: string;
  property?: any;
}

export const favoritesApi = {
  async getMyFavorites(): Promise<FavoriteItem[]> {
    const response = await api.get<FavoriteItem[]>(FAVORITES_BASE);
    return response.data;
  },

  async checkFavorite(propertyId: string): Promise<{ favorited: boolean }> {
    const response = await api.get<{ favorited: boolean }>(`${FAVORITES_BASE}/check/${propertyId}`);
    return response.data;
  },

  async toggleFavorite(propertyId: string): Promise<{ favorited: boolean }> {
    const response = await api.post<{ favorited: boolean }>(`${FAVORITES_BASE}/${propertyId}`);
    return response.data;
  },

  async removeFavorite(propertyId: string): Promise<{ favorited: boolean }> {
    const response = await api.delete<{ favorited: boolean }>(`${FAVORITES_BASE}/${propertyId}`);
    return response.data;
  },
};
