import { api } from '@/lib/axios';
import { rbac, rbacMerge } from '@/lib/api-rbac';
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
    return api.get<PropertyListResponse>(`/properties?${params.toString()}`, rbac('propertiesApi.getAll.GET')).then(r => r.data);
  },

  getById: (id: string) =>
    api.get<Property>(`/properties/${id}`, rbac('propertiesApi.getById.GET')).then(r => r.data),

  create: (data: PropertyCreatePayload) =>
    api.post<Property>('/properties', data, rbac('propertiesApi.create.POST')).then(r => r.data),

  update: (id: string, data: Partial<PropertyCreatePayload>) =>
    api.put<Property>(`/properties/${id}`, data, rbac('propertiesApi.update.PUT')).then(r => r.data),

  updatePrices: (id: string, data: Partial<PropertyCreatePayload>) =>
    api.put<Property>(`/properties/${id}/prices`, data, rbac('propertiesApi.updatePrices.PUT')).then(r => r.data),

  updatePhotos: (id: string, data: { images: string[] }) =>
    api.put<Property>(`/properties/${id}/photos`, data, rbac('propertiesApi.updatePhotos.PUT')).then(r => r.data),

  updateAvailability: (id: string, data: any) =>
    api.put<Property>(`/properties/${id}/availability`, data, rbac('propertiesApi.updateAvailability.PUT')).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/properties/${id}`, rbac('propertiesApi.delete.DELETE')).then(r => r.data),

  getAvailability: (id: string, from: string, to: string) =>
    api.get<AvailabilityEntry[]>(
      `/properties/${id}/availability`,
      rbacMerge('propertiesApi.getAvailability.GET', { params: { from, to } })
    ).then(r => r.data),

  subscribePromoAlert: (id: string, data: { notifyEmail: boolean; notifyPhone: boolean }) =>
    api.post(`/properties/${id}/promo-alerts`, data, rbac('propertiesApi.subscribePromoAlert.POST')).then(r => r.data),

  unsubscribePromoAlert: (id: string) =>
    api.delete(`/properties/${id}/promo-alerts`, rbac('propertiesApi.unsubscribePromoAlert.DELETE')).then(r => r.data),

  getPromos: (id: string) =>
    api.get(`/properties/${id}/promos`, rbac('propertiesApi.getPromos.GET')).then(r => r.data),
};

// ─── Saved Search Alerts API ─────────────────────────────────────────────────

export const savedSearchAlertsApi = {
  getAll: () =>
    api.get<SavedSearchAlert[]>('/alerts/saved-searches', rbac('savedSearchAlertsApi.getAll.GET')).then(r => r.data),

  create: (data: SavedSearchAlertPayload) =>
    api.post<SavedSearchAlert>('/alerts/saved-searches', data, rbac('savedSearchAlertsApi.create.POST')).then(r => r.data),

  update: (id: string, data: Partial<SavedSearchAlertPayload & { isActive: boolean }>) =>
    api.put<SavedSearchAlert>(`/alerts/saved-searches/${id}`, data, rbac('savedSearchAlertsApi.update.PUT')).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/alerts/saved-searches/${id}`, rbac('savedSearchAlertsApi.delete.DELETE')).then(r => r.data),
};
