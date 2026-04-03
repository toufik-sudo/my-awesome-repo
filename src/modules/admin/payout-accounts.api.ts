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
  updatedAt: string;
  host?: { id: number; email: string; firstName?: string; lastName?: string };
}

const BASE = '/payout-accounts';

export const payoutAccountsApi = {
  getMine: () => api.get<PayoutAccount[]>(BASE).then(r => r.data),
  getAll: () => api.get<PayoutAccount[]>(`${BASE}/all`).then(r => r.data),
  create: (data: Partial<PayoutAccount>) => api.post<PayoutAccount>(BASE, data).then(r => r.data),
  update: (id: string, data: Partial<PayoutAccount>) => api.put<PayoutAccount>(`${BASE}/${id}`, data).then(r => r.data),
  remove: (id: string) => api.delete(`${BASE}/${id}`),
};
