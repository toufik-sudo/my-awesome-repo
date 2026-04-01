import { api } from '@/lib/axios';

export interface ServiceBookingDto {
  serviceId: string;
  bookingDate: string;
  startTime?: string;
  participants: number;
  childParticipants?: number;
  paymentMethod: 'ccp' | 'baridi_mob' | 'edahabia' | 'cib' | 'cash' | 'bank_transfer';
  message?: string;
  participantDetails?: Array<{ name: string; age?: number }>;
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

export const serviceBookingsApi = {
  create: (data: ServiceBookingDto) =>
    api.post<ServiceBookingResponse>('/service-bookings', data).then(r => r.data),

  getMyBookings: () =>
    api.get<ServiceBookingResponse[]>('/service-bookings/my').then(r => r.data),

  getProviderBookings: () =>
    api.get<ServiceBookingResponse[]>('/service-bookings/provider').then(r => r.data),

  getOne: (id: string) =>
    api.get<ServiceBookingResponse>(`/service-bookings/${id}`).then(r => r.data),

  accept: (id: string) =>
    api.put<ServiceBookingResponse>(`/service-bookings/${id}/accept`).then(r => r.data),

  decline: (id: string, reason?: string) =>
    api.put<ServiceBookingResponse>(`/service-bookings/${id}/decline`, { reason }).then(r => r.data),

  cancel: (id: string, reason?: string) =>
    api.put<ServiceBookingResponse>(`/service-bookings/${id}/cancel`, { reason }).then(r => r.data),

  // Availability
  getAvailability: (serviceId: string, startDate: string, endDate: string) =>
    api.get<ServiceAvailabilitySlot[]>(`/service-bookings/availability/${serviceId}`, {
      params: { startDate, endDate },
    }).then(r => r.data),

  setAvailability: (serviceId: string, data: { date: string; isBlocked?: boolean; customPrice?: number; maxSlots?: number; timeSlots?: string[] }) =>
    api.post(`/service-bookings/availability/${serviceId}`, data).then(r => r.data),

  bulkSetAvailability: (serviceId: string, dates: Array<{ date: string; isBlocked?: boolean; customPrice?: number; maxSlots?: number; timeSlots?: string[] }>) =>
    api.post(`/service-bookings/availability/${serviceId}/bulk`, { dates }).then(r => r.data),
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
    api.get<ServiceGroupResponse[]>('/service-groups').then(r => r.data),

  getOne: (id: string) =>
    api.get<ServiceGroupResponse>(`/service-groups/${id}`).then(r => r.data),

  create: (data: { name: string; description?: string }) =>
    api.post<ServiceGroupResponse>('/service-groups', data).then(r => r.data),

  update: (id: string, data: { name?: string; description?: string; isActive?: boolean }) =>
    api.put(`/service-groups/${id}`, data).then(r => r.data),

  remove: (id: string) =>
    api.delete(`/service-groups/${id}`),

  getServices: (groupId: string) =>
    api.get(`/service-groups/${groupId}/services`).then(r => r.data),

  addService: (groupId: string, serviceId: string) =>
    api.post(`/service-groups/${groupId}/services`, { serviceId }).then(r => r.data),

  removeService: (groupId: string, serviceId: string) =>
    api.delete(`/service-groups/${groupId}/services/${serviceId}`),
};
