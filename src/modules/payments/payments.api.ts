import { api } from '@/lib/axios';
import { rbac, rbacMerge } from '@/lib/api-rbac';

export interface TransferAccount {
  id: string;
  bankName: string;
  accountType: 'ccp' | 'bna' | 'badr' | 'cib' | 'other';
  accountNumber: string;
  accountKey?: string;
  holderName: string;
  agencyName?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface PaymentReceipt {
  id: string;
  bookingId: string;
  receiptUrl: string;
  originalFileName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewNote?: string;
  reviewedByUserId?: number;
  reviewedAt?: string;
  guestNote?: string;
  createdAt: string;
  transferAccount?: TransferAccount;
  booking?: {
    id: string;
    propertyId: string;
    totalPrice: number;
    guestId: number;
    property?: { title: string; city: string };
    guest?: { email: string; firstName: string; lastName: string };
  };
  uploadedBy?: { id: number; email: string; firstName?: string; lastName?: string };
}

const PAYMENTS_BASE = '/payments';

export const paymentsApi = {
  getTransferAccounts: () =>
    api.get<TransferAccount[]>(`${PAYMENTS_BASE}/transfer-accounts`, rbac('paymentsApi.getTransferAccounts.GET')).then(r => r.data),

  getAllTransferAccounts: () =>
    api.get<TransferAccount[]>(`${PAYMENTS_BASE}/transfer-accounts/all`, rbac('paymentsApi.getAllTransferAccounts.GET')).then(r => r.data),

  upsertTransferAccount: (data: Partial<TransferAccount>) =>
    api.post<TransferAccount>(`${PAYMENTS_BASE}/transfer-accounts`, data, rbac('paymentsApi.upsertTransferAccount.POST')).then(r => r.data),

  deleteTransferAccount: (id: string) =>
    api.delete(`${PAYMENTS_BASE}/transfer-accounts/${id}`, rbac('paymentsApi.deleteTransferAccount.DELETE')),

  uploadReceipt: (bookingId: string, file: File, amount?: number, transferAccountId?: string, guestNote?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bookingId', bookingId);
    if (amount) formData.append('amount', String(amount));
    if (transferAccountId) formData.append('transferAccountId', transferAccountId);
    if (guestNote) formData.append('guestNote', guestNote);
    return api.post<PaymentReceipt>(`${PAYMENTS_BASE}/receipts`, formData, rbacMerge('paymentsApi.uploadReceipt.POST', {
      headers: { 'Content-Type': 'multipart/form-data' },
    })).then(r => r.data);
  },

  getPendingReceipts: () =>
    api.get<PaymentReceipt[]>(`${PAYMENTS_BASE}/receipts/pending`, rbac('paymentsApi.getPendingReceipts.GET')).then(r => r.data),

  getReceiptsByBooking: (bookingId: string) =>
    api.get<PaymentReceipt[]>(`${PAYMENTS_BASE}/receipts/booking/${bookingId}`, rbac('paymentsApi.getReceiptsByBooking.GET')).then(r => r.data),

  approveReceipt: (id: string, note?: string) =>
    api.put<PaymentReceipt>(`${PAYMENTS_BASE}/receipts/${id}/approve`, { note }, rbac('paymentsApi.approveReceipt.PUT')).then(r => r.data),

  rejectReceipt: (id: string, note?: string) =>
    api.put<PaymentReceipt>(`${PAYMENTS_BASE}/receipts/${id}/reject`, { note }, rbac('paymentsApi.rejectReceipt.PUT')).then(r => r.data),

  createPaymentIntent: (bookingId: string, amount: number) =>
    api.post<{ clientSecret: string; paymentIntentId: string }>(`${PAYMENTS_BASE}/stripe/intent`, { bookingId, amount }, rbac('paymentsApi.createPaymentIntent.POST')).then(r => r.data),
};
