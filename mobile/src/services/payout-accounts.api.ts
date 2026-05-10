import { api } from '@/lib/axios';

export interface PayoutAccount {
  id: string;
  hostUserId: number;
  accountType: 'ccp' | 'bna' | 'badr' | 'cib' | 'baridi_mob' | 'bank_transfer' | 'other';
  bankName: string;
  accountNumber: string;
  accountKey?: string;
  holderName: string;
  agencyName?: string;
  rib?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  host?: { id: number; email: string; firstName?: string; lastName?: string };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const BASE = '/payout-accounts';

export const payoutAccountsApi = {
  async getMine(): Promise<PayoutAccount[]> {
    return api.get<PayoutAccount[]>(BASE).then((r) => r.data);
  },

  async getAllPaginated(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<PayoutAccount>> {
    const res = await api.get(`${BASE}/all`, { params: { page: params.page ?? 1, limit: params.limit ?? 20 } });
    const body: any = res.data;
    if (Array.isArray(body)) {
      return { data: body, total: body.length, page: 1, limit: body.length, totalPages: 1 };
    }
    return body;
  },

  async create(data: Partial<PayoutAccount>) {
    return api.post<PayoutAccount>(BASE, data).then((r) => r.data);
  },

  async update(id: string, data: Partial<PayoutAccount>) {
    return api.put<PayoutAccount>(`${BASE}/${id}`, data).then((r) => r.data);
  },

  async remove(id: string) {
    return api.delete(`${BASE}/${id}`).then((r) => r.data);
  },
};
