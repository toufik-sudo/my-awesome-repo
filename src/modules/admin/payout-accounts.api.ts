import { api } from '@/lib/axios';
import { rbac } from '@/lib/api-rbac';
import type { Paginated, PaginationParams } from '@/modules/shared/types/pagination';

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
  updatedAt: string;
  host?: { id: number; email: string; firstName?: string; lastName?: string };
}

const BASE = '/payout-accounts';

export const payoutAccountsApi = {
  getMine: () => api.get<PayoutAccount[]>(BASE, rbac('payoutAccountsApi.getMine.GET')).then(r => r.data),
  getAll: () => api.get<PayoutAccount[]>(`${BASE}/all`, rbac('payoutAccountsApi.getAll.GET')).then(r => r.data),
  getAllPaginated: (params: PaginationParams = {}) =>
    api.get<Paginated<PayoutAccount>>(`${BASE}/all`, {
      ...rbac('payoutAccountsApi.getAll.GET'),
      params: { page: params.page ?? 1, limit: params.limit ?? 20 },
    }).then(r => r.data),
  create: (data: Partial<PayoutAccount>) => api.post<PayoutAccount>(BASE, data, rbac('payoutAccountsApi.create.POST')).then(r => r.data),
  update: (id: string, data: Partial<PayoutAccount>) => api.put<PayoutAccount>(`${BASE}/${id}`, data, rbac('payoutAccountsApi.update.PUT')).then(r => r.data),
  remove: (id: string) => api.delete(`${BASE}/${id}`, rbac('payoutAccountsApi.remove.DELETE')),
};
