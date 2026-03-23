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
};
