import type { BookingResponse } from '../bookings.api';
import type { ServiceBookingResponse } from '@/modules/services/service-bookings.api';

/**
 * Unified booking shape used by all surfaces (My Bookings, Host Bookings,
 * Booking History, Calendar, Payment) so property and service bookings can be
 * rendered with a single component path.
 */
export interface UnifiedBooking {
  type: 'property' | 'service';
  id: string;
  /** Underlying domain id (propertyId or serviceId) */
  refId: string;
  title: string;
  city: string;
  image?: string | null;
  status: string;
  /** Primary date (checkIn for property, bookingDate for service) */
  startDate: string;
  /** Optional end date (checkOut for property; same as start for service) */
  endDate: string;
  /** "guests" for property, "participants" for service */
  partySize: number;
  durationLabel: string;
  totalPrice: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  guestName?: string;
  guestEmail?: string;
  paymentDeadlineAt?: string | null;
  acceptDeadlineAt?: string | null;
  raw: BookingResponse | ServiceBookingResponse;
}

const pickServiceTitle = (s: ServiceBookingResponse['service']): string => {
  if (!s?.title) return 'Service';
  if (typeof s.title === 'string') return s.title;
  return s.title.fr || s.title.en || s.title.ar || Object.values(s.title)[0] || 'Service';
};

export const normalizeProperty = (b: BookingResponse): UnifiedBooking => ({
  type: 'property',
  id: b.id,
  refId: b.propertyId,
  title: b.property?.title || 'Property',
  city: b.property?.city || '',
  image: b.property?.images?.[0] || null,
  status: b.status,
  startDate: b.checkInDate,
  endDate: b.checkOutDate,
  partySize: b.numberOfGuests,
  durationLabel: `${b.numberOfNights} night${b.numberOfNights > 1 ? 's' : ''}`,
  totalPrice: Number(b.totalPrice),
  currency: b.currency || 'DZD',
  paymentMethod: b.paymentMethod,
  paymentStatus: b.paymentStatus,
  createdAt: b.createdAt,
  guestName: b.guest ? `${b.guest.firstName || ''} ${b.guest.lastName || ''}`.trim() : undefined,
  guestEmail: b.guest?.email,
  paymentDeadlineAt: b.paymentDeadlineAt,
  acceptDeadlineAt: b.acceptDeadlineAt,
  raw: b,
});

export const normalizeService = (b: ServiceBookingResponse): UnifiedBooking => {
  const total = Number(b.participants) + Number(b.childParticipants || 0);
  return {
    type: 'service',
    id: b.id,
    refId: b.serviceId,
    title: pickServiceTitle(b.service),
    city: b.service?.city || '',
    image: b.service?.images?.[0] || null,
    status: b.status,
    startDate: b.bookingDate,
    endDate: b.bookingDate,
    partySize: total,
    durationLabel: `${total} participant${total > 1 ? 's' : ''}`,
    totalPrice: Number(b.totalPrice),
    currency: b.currency || 'DZD',
    paymentMethod: b.paymentMethod,
    paymentStatus: b.paymentStatus,
    createdAt: b.createdAt,
    guestName: b.customer ? `${b.customer.firstName || ''} ${b.customer.lastName || ''}`.trim() : undefined,
    guestEmail: b.customer?.email,
    raw: b,
  };
};

export const mergeBookings = (
  properties: BookingResponse[] = [],
  services: ServiceBookingResponse[] = [],
): UnifiedBooking[] => {
  const all = [
    ...properties.map(normalizeProperty),
    ...services.map(normalizeService),
  ];
  all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return all;
};
