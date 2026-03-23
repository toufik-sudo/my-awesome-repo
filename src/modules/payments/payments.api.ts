import { api } from '@/lib/axios';

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
  /** Get active transfer accounts (public) */
  getTransferAccounts: () =>
    api.get<TransferAccount[]>(`${PAYMENTS_BASE}/transfer-accounts`).then(r => r.data),

  /** Admin: get all transfer accounts */
  getAllTransferAccounts: () =>
    api.get<TransferAccount[]>(`${PAYMENTS_BASE}/transfer-accounts/all`).then(r => r.data),

  /** Admin: Create/update transfer account */
  upsertTransferAccount: (data: Partial<TransferAccount>) =>
    api.post<TransferAccount>(`${PAYMENTS_BASE}/transfer-accounts`, data).then(r => r.data),

  /** Admin: Delete transfer account */
  deleteTransferAccount: (id: string) =>
    api.delete(`${PAYMENTS_BASE}/transfer-accounts/${id}`),

  /** Upload a payment receipt for a booking */
  uploadReceipt: (bookingId: string, file: File, amount?: number, transferAccountId?: string, guestNote?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bookingId', bookingId);
    if (amount) formData.append('amount', String(amount));
    if (transferAccountId) formData.append('transferAccountId', transferAccountId);
    if (guestNote) formData.append('guestNote', guestNote);
    return api.post<PaymentReceipt>(`${PAYMENTS_BASE}/receipts`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },

  /** Get pending receipts (hyper admin) */
  getPendingReceipts: () =>
    api.get<PaymentReceipt[]>(`${PAYMENTS_BASE}/receipts/pending`).then(r => r.data),

  /** Get receipts for a booking */
  getReceiptsByBooking: (bookingId: string) =>
    api.get<PaymentReceipt[]>(`${PAYMENTS_BASE}/receipts/booking/${bookingId}`).then(r => r.data),

  /** Approve receipt (hyper admin) */
  approveReceipt: (id: string, note?: string) =>
    api.put<PaymentReceipt>(`${PAYMENTS_BASE}/receipts/${id}/approve`, { note }).then(r => r.data),

  /** Reject receipt (hyper admin) */
  rejectReceipt: (id: string, note?: string) =>
    api.put<PaymentReceipt>(`${PAYMENTS_BASE}/receipts/${id}/reject`, { note }).then(r => r.data),

  /** Mock Stripe payment intent */
  createPaymentIntent: (bookingId: string, amount: number) =>
    api.post<{ clientSecret: string; paymentIntentId: string }>(`${PAYMENTS_BASE}/stripe/intent`, { bookingId, amount }).then(r => r.data),
};
