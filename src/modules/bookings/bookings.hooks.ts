import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi, type BookingResponse } from './bookings.api';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';

export const useMyBookings = () => {
  return useQuery({
    queryKey: ['my-bookings'],
    queryFn: bookingsApi.getMyBookings,
  });
};

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export const useMyBookingsPaginated = (params: PaginationParams = {}) => {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  return useQuery({
    queryKey: ['my-bookings', 'paginated', page, limit],
    queryFn: () => bookingsApi.getMyBookingsPaginated({ page, limit }),
    placeholderData: (prev) => prev,
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingsApi.cancel(id),
    onSuccess: () => {
      toast.success('Booking cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
    onError: () => toast.error('Failed to cancel booking'),
  });
};

// Host booking management
export interface HostBookingFilters {
  status?: string;
  propertyId?: string;
}

export const useHostBookings = (filters: HostBookingFilters = {}) => {
  return useQuery({
    queryKey: ['host-bookings', filters],
    queryFn: () => bookingsApi.getHostBookings(filters),
  });
};

export const useHostBookingsPaginated = (filters: HostBookingFilters & PaginationParams = {}) => {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  return useQuery({
    queryKey: ['host-bookings', 'paginated', filters.status, filters.propertyId, page, limit],
    queryFn: () => bookingsApi.getHostBookingsPaginated({ ...filters, page, limit }),
    placeholderData: (prev) => prev,
  });
};

export const useAcceptBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, propertyId }: { id: string; propertyId: string }) =>
      bookingsApi.accept(id, propertyId),
    onSuccess: () => {
      toast.success('Booking accepted');
      queryClient.invalidateQueries({ queryKey: ['host-bookings'] });
    },
    onError: () => toast.error('Failed to accept booking'),
  });
};

export const useDeclineBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, propertyId, reason }: { id: string; propertyId: string; reason?: string }) =>
      bookingsApi.decline(id, propertyId, reason),
    onSuccess: () => {
      toast.success('Booking declined');
      queryClient.invalidateQueries({ queryKey: ['host-bookings'] });
    },
    onError: () => toast.error('Failed to decline booking'),
  });
};

export const useCounterOfferBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; propertyId: string; newPrice: number; newCheckIn?: string; newCheckOut?: string; message?: string }) =>
      bookingsApi.counterOffer(data),
    onSuccess: () => {
      toast.success('Counter-offer sent');
      queryClient.invalidateQueries({ queryKey: ['host-bookings'] });
    },
    onError: () => toast.error('Failed to send counter-offer'),
  });
};
