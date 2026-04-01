import { api } from '@/lib/axios';
import type { Property } from '@/types/property.types';

export interface PropertyListResponse {
  data: Property[];
  total: number;
  page: number;
  limit: number;
}

export interface PropertyFilters {
  location?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
  amenities?: string;
  sortBy?: string;
  minTrustStars?: number;
  page?: number;
  limit?: number;
}

export interface PropertyCreatePayload {
  title: string;
  description: string;
  propertyType: string;
  address: string;
  city: string;
  wilaya: string;
  country?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  beds?: number;
  amenities: string[];
  checkInTime: string;
  checkOutTime: string;
  instantBooking: boolean;
  allowPets?: boolean;
  minNights: number;
  maxNights?: number;
  pricePerNight: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  weeklyDiscount?: number;
  monthlyDiscount?: number;
  customDiscount?: number;
  customDiscountMinNights?: number;
  cleaningFee?: number;
  serviceFeePercent?: number;
  currency?: string;
  acceptedPaymentMethods?: string[];
  houseRules?: string[];
  cancellationPolicy?: string;
  images?: string[];
  status?: string;
}

export interface AvailabilityEntry {
  date: string;
  isBlocked: boolean;
  customPrice: number | null;
}

export interface SavedSearchAlertPayload {
  name: string;
  criteria: Record<string, any>;
  frequency?: 'instant' | 'daily' | 'weekly';
  channels?: ('email' | 'push' | 'sms')[];
}

export interface SavedSearchAlert {
  id: string;
  name: string;
  criteria: Record<string, any>;
  frequency: string;
  channels: string[];
  isActive: boolean;
  lastTriggeredAt: string | null;
  matchCount: number;
  createdAt: string;
}

export const propertiesApi = {
  getAll: (filters: PropertyFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    return api.get<PropertyListResponse>(`/properties?${params.toString()}`).then(r => r.data);
  },

  getById: (id: string) =>
    api.get<Property>(`/properties/${id}`).then(r => r.data),

  create: (data: PropertyCreatePayload) =>
    api.post<Property>('/properties', data).then(r => r.data),

  update: (id: string, data: Partial<PropertyCreatePayload>) =>
    api.put<Property>(`/properties/${id}`, data).then(r => r.data),

  updatePrices: (id: string, data: Partial<PropertyCreatePayload>) =>
    api.put<Property>(`/properties/${id}/prices`, data).then(r => r.data),

  updatePhotos: (id: string, data: { images: string[] }) =>
    api.put<Property>(`/properties/${id}/photos`, data).then(r => r.data),

  updateAvailability: (id: string, data: any) =>
    api.put<Property>(`/properties/${id}/availability`, data).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/properties/${id}`).then(r => r.data),

  /** Fetch availability for a date window (call per 3-month chunk) */
  getAvailability: (id: string, from: string, to: string) =>
    api.get<AvailabilityEntry[]>(
      `/properties/${id}/availability`,
      { params: { from, to } }
    ).then(r => r.data),

  /** Subscribe to promo alerts on a property */
  subscribePromoAlert: (id: string, data: { notifyEmail: boolean; notifyPhone: boolean }) =>
    api.post(`/properties/${id}/promo-alerts`, data).then(r => r.data),

  unsubscribePromoAlert: (id: string) =>
    api.delete(`/properties/${id}/promo-alerts`).then(r => r.data),

  /** Get promos for a property */
  getPromos: (id: string) =>
    api.get(`/properties/${id}/promos`).then(r => r.data),
};

// ─── Saved Search Alerts API ─────────────────────────────────────────────────

export const savedSearchAlertsApi = {
  getAll: () =>
    api.get<SavedSearchAlert[]>('/alerts/saved-searches').then(r => r.data),

  create: (data: SavedSearchAlertPayload) =>
    api.post<SavedSearchAlert>('/alerts/saved-searches', data).then(r => r.data),

  update: (id: string, data: Partial<SavedSearchAlertPayload & { isActive: boolean }>) =>
    api.put<SavedSearchAlert>(`/alerts/saved-searches/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/alerts/saved-searches/${id}`).then(r => r.data),
};
