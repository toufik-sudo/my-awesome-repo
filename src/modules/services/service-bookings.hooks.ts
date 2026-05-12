import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceBookingsApi } from './service-bookings.api';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';

export const useMyServiceBookings = () =>
  useQuery({
    queryKey: ['my-service-bookings'],
    queryFn: serviceBookingsApi.getMyBookings,
  });

export const useProviderServiceBookings = () =>
  useQuery({
    queryKey: ['provider-service-bookings'],
    queryFn: serviceBookingsApi.getProviderBookings,
  });

export const useAcceptServiceBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => serviceBookingsApi.accept(id),
    onSuccess: () => {
      toast.success('Service booking accepted');
      qc.invalidateQueries({ queryKey: ['provider-service-bookings'] });
    },
    onError: () => toast.error('Failed to accept'),
  });
};

export const useDeclineServiceBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => serviceBookingsApi.decline(id, reason),
    onSuccess: () => {
      toast.success('Service booking declined');
      qc.invalidateQueries({ queryKey: ['provider-service-bookings'] });
    },
    onError: () => toast.error('Failed to decline'),
  });
};

export const useCounterOfferServiceBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; newPrice?: number; newDate?: string; newTime?: string; message?: string }) =>
      serviceBookingsApi.counterOffer(data),
    onSuccess: () => {
      toast.success('Counter-offer sent');
      qc.invalidateQueries({ queryKey: ['provider-service-bookings'] });
    },
    onError: () => toast.error('Failed to send counter-offer'),
  });
};

export const useCancelServiceBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => serviceBookingsApi.cancel(id, reason),
    onSuccess: () => {
      toast.success('Service booking cancelled');
      qc.invalidateQueries({ queryKey: ['my-service-bookings'] });
      qc.invalidateQueries({ queryKey: ['provider-service-bookings'] });
    },
    onError: () => toast.error('Failed to cancel'),
  });
};
