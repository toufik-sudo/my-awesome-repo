import { api } from '@/lib/axios';

export interface CreateBookingDto {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  paymentMethod: 'ccp' | 'baridi_mob' | 'edahabia' | 'cib' | 'cash' | 'bank_transfer';
  message?: string;
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
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected' | 'refunded' | 'counter_offer';
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
  // Counter-offer fields
  counterOfferPrice?: number;
  counterOfferCheckIn?: string;
  counterOfferCheckOut?: string;
  counterOfferMessage?: string;
  // Guest/host info
  guest?: { id: number; email: string; firstName?: string; lastName?: string };
  hostResponse?: string;
}

export const bookingsApi = {
  create: (data: CreateBookingDto) =>
    api.post<BookingResponse>('/bookings', data).then(r => r.data),

  getMyBookings: () =>
    api.get<BookingResponse[]>('/bookings/my').then(r => r.data),

  getOne: (id: string) =>
    api.get<BookingResponse>(`/bookings/${id}`).then(r => r.data),

  cancel: (id: string) =>
    api.put(`/bookings/${id}/status`, { status: 'cancelled' }).then(r => r.data),

  checkAvailability: (propertyId: string, checkIn: string, checkOut: string) =>
    api.get<{ available: boolean }>(`/bookings/availability/${propertyId}`, {
      params: { checkIn, checkOut },
    }).then(r => r.data),

  // Host booking management
  getHostBookings: (filters: { status?: string; propertyId?: string } = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.propertyId) params.append('propertyId', filters.propertyId);
    return api.get<BookingResponse[]>(`/bookings?${params.toString()}`).then(r => r.data);
  },

  accept: (id: string, propertyId: string) =>
    api.put<BookingResponse>(`/bookings/${id}/accept`, { propertyId }).then(r => r.data),

  decline: (id: string, propertyId: string, reason?: string) =>
    api.put<BookingResponse>(`/bookings/${id}/decline`, { propertyId, reason }).then(r => r.data),

  counterOffer: (data: { id: string; propertyId: string; newPrice: number; newCheckIn?: string; newCheckOut?: string; message?: string }) =>
    api.put<BookingResponse>(`/bookings/${data.id}/counter-offer`, {
      propertyId: data.propertyId,
      newPrice: data.newPrice,
      newCheckIn: data.newCheckIn,
      newCheckOut: data.newCheckOut,
      message: data.message,
    }).then(r => r.data),
};
