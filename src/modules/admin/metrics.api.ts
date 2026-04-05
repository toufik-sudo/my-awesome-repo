import { api } from '@/lib/axios';

const BASE = '/metrics';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MetricUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNbr: string;
  city: string;
  country: string;
  isActive: boolean;
  roles: string[];
}

export interface MetricBooking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyCity: string;
  guestId: number;
  guestEmail: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalPrice: number;
  currency: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
}

export interface MetricProperty {
  id: string;
  title: string;
  propertyType: string;
  status: string;
  city: string;
  wilaya: string;
  pricePerNight: number;
  currency: string;
  hostId: number;
  hostEmail: string;
  hostName: string;
  bedrooms: number;
  maxGuests: number;
  averageRating: number;
  trustStars: number;
  isVerified: boolean;
  isAvailable: boolean;
  createdAt: string;
}

export interface MetricService {
  id: string;
  title: Record<string, string>;
  category: string;
  status: string;
  city: string;
  price: number;
  currency: string;
  providerId: number;
  providerEmail: string;
  providerName: string;
  averageRating: number;
  isAvailable: boolean;
  createdAt: string;
}

export interface PlatformSummary {
  users: { total: number; active: number; inactive: number };
  properties: { total: number; published: number; paused: number; archived: number; draft: number };
  services: { total: number; published: number };
  bookings: { total: number; pending: number; confirmed: number; completed: number; cancelled: number };
  revenue: { total: number };
}

export interface MetricServiceBooking {
  id: string;
  serviceId: string;
  serviceTitle: string;
  serviceCategory: string;
  userId: number;
  userName: string;
  userEmail: string;
  date: string;
  totalPrice: number;
  currency: string;
  status: string;
  createdAt: string;
}

export const metricsApi = {
  getUsers: (params?: Record<string, any>) =>
    api.get<PaginatedResult<MetricUser>>(`${BASE}/users`, { params }).then(r => r.data),

  getBookings: (params?: Record<string, any>) =>
    api.get<PaginatedResult<MetricBooking>>(`${BASE}/bookings`, { params }).then(r => r.data),

  getServiceBookings: (params?: Record<string, any>) =>
    api.get<PaginatedResult<MetricServiceBooking>>(`${BASE}/service-bookings`, { params }).then(r => r.data),

  getProperties: (params?: Record<string, any>) =>
    api.get<PaginatedResult<MetricProperty>>(`${BASE}/properties`, { params }).then(r => r.data),

  getServices: (params?: Record<string, any>) =>
    api.get<PaginatedResult<MetricService>>(`${BASE}/services`, { params }).then(r => r.data),

  getRevenue: (params?: Record<string, any>) =>
    api.get(`${BASE}/revenue`, { params }).then(r => r.data),

  getSummary: () =>
    api.get<PlatformSummary>(`${BASE}/summary`).then(r => r.data),
};
