import { api } from '@/lib/axios';

export interface Reward {
  id: string;
  name: string;
  description?: string;
  type: string;
  pointsCost: number;
  currency: string;
  imageUrl?: string;
  category: string;
  status: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const rewardsApi = {
  async getShop(params: { page?: number; limit?: number; category?: string } = {}): Promise<PaginatedResponse<Reward>> {
    const res = await api.get('/rewards/shop', {
      params: { page: params.page ?? 1, limit: params.limit ?? 20, category: params.category },
    });
    const body: any = res.data;
    if (Array.isArray(body)) {
      return { data: body, total: body.length, page: 1, limit: body.length, totalPages: 1 };
    }
    return body;
  },

  async redeem(rewardId: string) {
    return api.post(`/rewards/${rewardId}/redeem`).then(r => r.data);
  },

  async getById(id: string): Promise<Reward> {
    const res = await api.get(`/rewards/${id}`);
    return res.data;
  },
};
