import { api } from '@/lib/axios';

export interface Referral {
  id: string;
  code: string;
  status: string;
  inviteeContact?: string;
  createdAt: string;
  pointsEarned?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const referralsApi = {
  async getMine(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Referral>> {
    const res = await api.get('/referrals', {
      params: { page: params.page ?? 1, limit: params.limit ?? 20 },
    });
    const body: any = res.data;
    if (Array.isArray(body)) {
      return { data: body, total: body.length, page: 1, limit: body.length, totalPages: 1 };
    }
    return body;
  },

  async getMyCode() {
    return api.get<{ code: string }>('/referrals/code').then(r => r.data);
  },
};
