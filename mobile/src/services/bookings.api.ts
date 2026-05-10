import { api } from '@/lib/axios';

export interface BookingItem {
  id: string;
  propertyId: string;
  property?: { id: string; title: string; city: string; images?: string[] };
  status: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  currency: string;
  paymentStatus: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const bookingsApi = {
  async getMine(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<BookingItem>> {
    const res = await api.get('/bookings/my', {
      params: { page: params.page ?? 1, limit: params.limit ?? 20 },
    });
    const body: any = res.data;
    if (Array.isArray(body)) {
      return { data: body, total: body.length, page: 1, limit: body.length, totalPages: 1 };
    }
    return body;
  },

  async accept(id: string) {
    return api.post(`/bookings/${id}/accept`).then(r => r.data);
  },

  async reject(id: string, reason?: string) {
    return api.post(`/bookings/${id}/reject`, { reason }).then(r => r.data);
  },

  async getById(id: string) {
    return api.get(`/bookings/${id}`).then(r => r.data);
  },
};
