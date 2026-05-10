import { api } from '@/lib/axios';
import { rbac, rbacMerge } from '@/lib/api-rbac';

export interface ServiceBookingDto {
  serviceId: string;
  bookingDate: string;
  startTime?: string;
  participants: number;
  childParticipants?: number;
  paymentMethod: 'ccp' | 'baridi_mob' | 'edahabia' | 'cib' | 'cash' | 'bank_transfer';
  message?: string;
  participantDetails?: Array<{ name: string; age?: number }>;
  usePoints?: boolean;
  pointsToUse?: number;
}

export interface ServiceBookingResponse {
  id: string;
  serviceId: string;
  service?: {
    id: string;
    title: Record<string, string>;
    category: string;
    city: string;
    images: string[];
    price: number;
  };
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';
  bookingDate: string;
  startTime?: string;
  participants: number;
  childParticipants: number;
  unitPrice: number;
  childPrice: number;
  discountPercent: number;
  totalPrice: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  customerMessage?: string;
  providerResponse?: string;
  customer?: { id: number; email: string; firstName?: string; lastName?: string };
  createdAt: string;
}

export interface ServiceAvailabilitySlot {
  id: string;
  serviceId: string;
  date: string;
  isBlocked: boolean;
  customPrice?: number;
  maxSlots?: number;
  bookedSlots: number;
  timeSlots?: string[];
}

export interface PaginatedServiceBookings {
  data: ServiceBookingResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const serviceBookingsApi = {
  create: (data: ServiceBookingDto) =>
    api.post<ServiceBookingResponse>('/service-bookings', data, rbac('serviceBookingsApi.create.POST')).then(r => r.data),

  /** @deprecated Use getMyBookingsPaginated for server-side pagination. */
  getMyBookings: () =>
    api.get<PaginatedServiceBookings>('/service-bookings/my', rbacMerge('serviceBookingsApi.getMyBookings.GET', {
      params: { page: 1, limit: 1000 },
    })).then(r => r.data.data),

  getMyBookingsPaginated: (params: { page?: number; limit?: number } = {}) =>
    api.get<PaginatedServiceBookings>('/service-bookings/my', rbacMerge('serviceBookingsApi.getMyBookings.GET', {
      params: { page: params.page ?? 1, limit: params.limit ?? 20 },
    })).then(r => r.data),

  /** @deprecated Use getProviderBookingsPaginated for server-side pagination. */
  getProviderBookings: () =>
    api.get<PaginatedServiceBookings>('/service-bookings/provider', rbacMerge('serviceBookingsApi.getProviderBookings.GET', {
      params: { page: 1, limit: 1000 },
    })).then(r => r.data.data),

  getProviderBookingsPaginated: (params: { page?: number; limit?: number } = {}) =>
    api.get<PaginatedServiceBookings>('/service-bookings/provider', rbacMerge('serviceBookingsApi.getProviderBookings.GET', {
      params: { page: params.page ?? 1, limit: params.limit ?? 20 },
    })).then(r => r.data),

  getOne: (id: string) =>
    api.get<ServiceBookingResponse>(`/service-bookings/${id}`, rbac('serviceBookingsApi.getOne.GET')).then(r => r.data),

  accept: (id: string) =>
    api.put<ServiceBookingResponse>(`/service-bookings/${id}/accept`, undefined, rbac('serviceBookingsApi.accept.PUT')).then(r => r.data),

  decline: (id: string, reason?: string) =>
    api.put<ServiceBookingResponse>(`/service-bookings/${id}/decline`, { reason }, rbac('serviceBookingsApi.decline.PUT')).then(r => r.data),

  cancel: (id: string, reason?: string) =>
    api.put<ServiceBookingResponse>(`/service-bookings/${id}/cancel`, { reason }, rbac('serviceBookingsApi.cancel.PUT')).then(r => r.data),

  getAvailability: (serviceId: string, startDate: string, endDate: string) =>
    api.get<ServiceAvailabilitySlot[]>(`/service-bookings/availability/${serviceId}`, rbacMerge('serviceBookingsApi.getAvailability.GET', {
      params: { startDate, endDate },
    })).then(r => r.data),

  setAvailability: (serviceId: string, data: { date: string; isBlocked?: boolean; customPrice?: number; maxSlots?: number; timeSlots?: string[] }) =>
    api.post(`/service-bookings/availability/${serviceId}`, data, rbac('serviceBookingsApi.setAvailability.POST')).then(r => r.data),

  bulkSetAvailability: (serviceId: string, dates: Array<{ date: string; isBlocked?: boolean; customPrice?: number; maxSlots?: number; timeSlots?: string[] }>) =>
    api.post(`/service-bookings/availability/${serviceId}/bulk`, { dates }, rbac('serviceBookingsApi.bulkSetAvailability.POST')).then(r => r.data),
};

// Service groups API
export interface ServiceGroupResponse {
  id: string;
  name: string;
  description?: string;
  adminId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const serviceGroupsApi = {
  getAll: () =>
    api.get<ServiceGroupResponse[]>('/service-groups', rbac('serviceGroupsApi.getAll.GET')).then(r => r.data),

  getOne: (id: string) =>
    api.get<ServiceGroupResponse>(`/service-groups/${id}`, rbac('serviceGroupsApi.getOne.GET')).then(r => r.data),

  create: (data: { name: string; description?: string }) =>
    api.post<ServiceGroupResponse>('/service-groups', data, rbac('serviceGroupsApi.create.POST')).then(r => r.data),

  update: (id: string, data: { name?: string; description?: string; isActive?: boolean }) =>
    api.put(`/service-groups/${id}`, data, rbac('serviceGroupsApi.update.PUT')).then(r => r.data),

  remove: (id: string) =>
    api.delete(`/service-groups/${id}`, rbac('serviceGroupsApi.remove.DELETE')),

  getServices: (groupId: string) =>
    api.get(`/service-groups/${groupId}/services`, rbac('serviceGroupsApi.getServices.GET')).then(r => r.data),

  addService: (groupId: string, serviceId: string) =>
    api.post(`/service-groups/${groupId}/services`, { serviceId }, rbac('serviceGroupsApi.addService.POST')).then(r => r.data),

  removeService: (groupId: string, serviceId: string) =>
    api.delete(`/service-groups/${groupId}/services/${serviceId}`, rbac('serviceGroupsApi.removeService.DELETE')),
};
