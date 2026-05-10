import { api } from '@/lib/axios';

export interface PaymentReceipt {
  id: string;
  bookingId: string;
  receiptUrl: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewNote?: string;
  createdAt: string;
  booking?: { id: string; propertyId: string; property?: { title: string; city: string } };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UploadReceiptInput {
  bookingId: string;
  amount: number;
  currency?: string;
  /** Local file URI (image or pdf) plus mime info. */
  file: { uri: string; name?: string; mimeType?: string; type?: string };
  note?: string;
}

export const paymentsApi = {
  async getMyReceipts(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<PaymentReceipt>> {
    const res = await api.get('/payments/receipts/mine', {
      params: { page: params.page ?? 1, limit: params.limit ?? 20 },
    });
    const body: any = res.data;
    if (Array.isArray(body)) {
      return { data: body, total: body.length, page: 1, limit: body.length, totalPages: 1 };
    }
    return body;
  },

  async getPendingReceipts(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<PaymentReceipt>> {
    const res = await api.get('/payments/receipts/pending', {
      params: { page: params.page ?? 1, limit: params.limit ?? 20 },
    });
    const body: any = res.data;
    if (Array.isArray(body)) {
      return { data: body, total: body.length, page: 1, limit: body.length, totalPages: 1 };
    }
    return body;
  },

  async approve(id: string, note?: string) {
    return api.put(`/payments/receipts/${id}/approve`, { note }).then(r => r.data);
  },

  async reject(id: string, note?: string) {
    return api.put(`/payments/receipts/${id}/reject`, { note }).then(r => r.data);
  },

  /**
   * Upload a guest receipt (image / pdf) for a booking.
   * Multipart payload mirrors the web frontend's `/payments/receipts` endpoint.
   */
  async uploadReceipt(input: UploadReceiptInput): Promise<PaymentReceipt> {
    const fd = new FormData();
    fd.append('bookingId', input.bookingId);
    fd.append('amount', String(input.amount));
    fd.append('currency', input.currency || 'DZD');
    if (input.note) fd.append('note', input.note);
    const ext = (input.file.name?.split('.').pop() || 'jpg').toLowerCase();
    fd.append('file', {
      uri: input.file.uri,
      name: input.file.name || `receipt.${ext}`,
      type: input.file.mimeType || input.file.type || (ext === 'pdf' ? 'application/pdf' : `image/${ext}`),
    } as any);
    const res = await api.post('/payments/receipts', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
