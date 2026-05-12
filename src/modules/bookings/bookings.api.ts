import { api } from '@/lib/axios';
import { rbac, rbacMerge } from '@/lib/api-rbac';

export interface CreateBookingDto {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  paymentMethod: 'ccp' | 'baridi_mob' | 'edahabia' | 'cib' | 'cash' | 'bank_transfer';
  message?: string;
  /** When set by admin/manager: create booking on behalf of this guest user (auto-validated). */
  onBehalfOfGuestId?: number | string;
}

export interface BookingResponse {
  id: string;
  propertyId: string;
  property?: {
    id: string;
    title: string;
    city: string;
    images: string[];
  };
  status: 'pending' | 'accepted' | 'confirmed' | 'cancelled' | 'completed' | 'rejected' | 'refunded' | 'counter_offer' | 'archived';
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfNights: number;
  pricePerNight: number;
  effectiveRate: number;
  discountPercent: number;
  discountType: string | null;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  totalPrice: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  guestMessage: string | null;
  createdAt: string;
  counterOfferPrice?: number;
  counterOfferCheckIn?: string;
  counterOfferCheckOut?: string;
  counterOfferMessage?: string;
  guest?: { id: number; email: string; firstName?: string; lastName?: string };
  hostResponse?: string;
  acceptedAt?: string | null;
  confirmedAt?: string | null;
  archivedAt?: string | null;
  paymentDeadlineAt?: string | null;
  acceptDeadlineAt?: string | null;
}

export interface BookingsPaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedBookings {
  data: BookingResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const bookingsApi = {
  create: (data: CreateBookingDto) =>
    api.post<BookingResponse>('/bookings', data, rbac('bookingsApi.create.POST')).then(r => r.data),

  /** @deprecated Use getMyBookingsPaginated for server-side pagination. */
  getMyBookings: () =>
    api.get<PaginatedBookings>('/bookings/my', rbacMerge('bookingsApi.getMyBookings.GET', {
      params: { page: 1, limit: 1000 },
    })).then(r => r.data.data),

  getMyBookingsPaginated: (params: BookingsPaginationParams = {}) =>
    api.get<PaginatedBookings>('/bookings/my', rbacMerge('bookingsApi.getMyBookings.GET', {
      params: { page: params.page ?? 1, limit: params.limit ?? 20 },
    })).then(r => r.data),

  getOne: (id: string) =>
    api.get<BookingResponse>(`/bookings/${id}`, rbac('bookingsApi.getOne.GET')).then(r => r.data),

  cancel: (id: string) =>
    api.put(`/bookings/${id}/status`, { status: 'cancelled' }, rbac('bookingsApi.cancel.PUT')).then(r => r.data),

  checkAvailability: (propertyId: string, checkIn: string, checkOut: string) =>
    api.get<{ available: boolean }>(`/bookings/availability/${propertyId}`, rbacMerge('bookingsApi.checkAvailability.GET', {
      params: { checkIn, checkOut },
    })).then(r => r.data),

  /** @deprecated Use getHostBookingsPaginated for server-side pagination. */
  getHostBookings: (filters: { status?: string; propertyId?: string } = {}) => {
    const params: Record<string, any> = { page: 1, limit: 1000 };
    if (filters.status) params.status = filters.status;
    if (filters.propertyId) params.propertyId = filters.propertyId;
    return api.get<PaginatedBookings>('/bookings', rbacMerge('bookingsApi.getHostBookings.GET', { params }))
      .then(r => r.data.data);
  },

  getHostBookingsPaginated: (filters: { status?: string; propertyId?: string } & BookingsPaginationParams = {}) => {
    const params: Record<string, any> = {
      page: filters.page ?? 1,
      limit: filters.limit ?? 20,
    };
    if (filters.status) params.status = filters.status;
    if (filters.propertyId) params.propertyId = filters.propertyId;
    return api.get<PaginatedBookings>('/bookings', rbacMerge('bookingsApi.getHostBookings.GET', { params }))
      .then(r => r.data);
  },

  accept: (id: string, propertyId: string) =>
    api.put<BookingResponse>(`/bookings/${id}/accept`, { propertyId }, rbac('bookingsApi.accept.PUT')).then(r => r.data),

  decline: (id: string, propertyId: string, reason?: string) =>
    api.put<BookingResponse>(`/bookings/${id}/decline`, { propertyId, reason }, rbac('bookingsApi.decline.PUT')).then(r => r.data),

  counterOffer: (data: { id: string; propertyId: string; newPrice: number; newCheckIn?: string; newCheckOut?: string; message?: string }) =>
    api.put<BookingResponse>(`/bookings/${data.id}/counter-offer`, {
      propertyId: data.propertyId,
      newPrice: data.newPrice,
      newCheckIn: data.newCheckIn,
      newCheckOut: data.newCheckOut,
      message: data.message,
    }, rbac('bookingsApi.counterOffer.PUT')).then(r => r.data),
};
