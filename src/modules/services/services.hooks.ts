import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { tourismServicesApi } from './services.api';
import { serviceBookingsApi, type ServiceBookingDto } from './service-bookings.api';
import type { TourismServiceFilters } from '@/types/tourism-service.types';
import { MOCK_SERVICES } from './services.mock';
import { SERVICE_CATEGORIES } from './services.constants';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

/** Generate mock category counts from mock services */
const getMockCategoryCounts = () => {
  const counts: Record<string, number> = {};
  MOCK_SERVICES.forEach(s => {
    counts[s.category] = (counts[s.category] || 0) + 1;
  });
  // Add zero-count for all categories so they appear in the filter
  SERVICE_CATEGORIES.forEach(cat => {
    if (!counts[cat]) counts[cat] = 0;
  });
  return Object.entries(counts)
    .map(([category, count]) => ({ category, count }))
    .filter(c => c.count > 0);
};

export const useServices = (filters: TourismServiceFilters = {}) => {
  return useQuery({
    queryKey: ['tourism-services', filters],
    queryFn: async () => {
      try {
        const response = await tourismServicesApi.getAll(filters);
        if (response?.data?.length > 0) return response;
        if (USE_MOCK) return { data: MOCK_SERVICES, total: MOCK_SERVICES.length, page: 1, limit: 20, totalPages: 1 };
        return response;
      } catch {
        if (USE_MOCK) return { data: MOCK_SERVICES, total: MOCK_SERVICES.length, page: 1, limit: 20, totalPages: 1 };
        throw new Error('Failed to fetch services');
      }
    },
  });
};

export const useServiceDetail = (id: string) => {
  return useQuery({
    queryKey: ['tourism-service', id],
    queryFn: () => tourismServicesApi.getById(id),
    enabled: !!id,
  });
};

export const useServiceCategories = () => {
  return useQuery({
    queryKey: ['service-categories'],
    queryFn: async () => {
      try {
        const data = await tourismServicesApi.getCategories();
        if (data?.length > 0) return data;
        if (USE_MOCK) return getMockCategoryCounts();
        return data;
      } catch {
        if (USE_MOCK) return getMockCategoryCounts();
        throw new Error('Failed to fetch categories');
      }
    },
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => tourismServicesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tourism-services'] });
      queryClient.invalidateQueries({ queryKey: ['service-categories'] });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => tourismServicesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tourism-services'] });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tourismServicesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tourism-services'] });
      queryClient.invalidateQueries({ queryKey: ['service-categories'] });
    },
  });
};

/** Fetch service availability for a date range. */
export const useServiceAvailability = (
  serviceId: string | undefined,
  startDate: string,
  endDate: string,
) => {
  return useQuery({
    queryKey: ['service-availability', serviceId, startDate, endDate],
    queryFn: () => serviceBookingsApi.getAvailability(serviceId!, startDate, endDate),
    enabled: !!serviceId && !!startDate && !!endDate,
    staleTime: 60_000,
  });
};

/** Create a new service booking. */
export const useCreateServiceBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ServiceBookingDto) => serviceBookingsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['service-availability'] });
    },
  });
};


/**
 * Infinite-scroll variant of useServices.
 * Loads pages server-side; exposes a flat array of services.
 */
export const useServicesInfinite = (
  filters: Omit<TourismServiceFilters, 'page'> = {},
  pageSize = 20,
) => {
  const query = useInfiniteQuery({
    queryKey: ['tourism-services', 'infinite', { ...filters, limit: pageSize }],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const res = await tourismServicesApi.getAll({ ...filters, page: pageParam, limit: pageSize });
        if (res?.data?.length || !USE_MOCK) {
          return {
            data: res?.data ?? [],
            total: res?.total ?? 0,
            page: res?.page ?? pageParam,
            limit: res?.limit ?? pageSize,
            totalPages: res?.totalPages ?? Math.max(1, Math.ceil((res?.total ?? 0) / pageSize)),
          };
        }
        const start = (pageParam - 1) * pageSize;
        const slice = MOCK_SERVICES.slice(start, start + pageSize);
        return {
          data: slice,
          total: MOCK_SERVICES.length,
          page: pageParam,
          limit: pageSize,
          totalPages: Math.max(1, Math.ceil(MOCK_SERVICES.length / pageSize)),
        };
      } catch {
        if (USE_MOCK) {
          const start = (pageParam - 1) * pageSize;
          const slice = MOCK_SERVICES.slice(start, start + pageSize);
          return {
            data: slice,
            total: MOCK_SERVICES.length,
            page: pageParam,
            limit: pageSize,
            totalPages: Math.max(1, Math.ceil(MOCK_SERVICES.length / pageSize)),
          };
        }
        return { data: [], total: 0, page: pageParam, limit: pageSize, totalPages: 1 };
      }
    },
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.totalPages ? last.page + 1 : undefined),
  });

  const items = useMemo(
    () => (query.data?.pages ?? []).flatMap((p: any) => p.data),
    [query.data],
  );
  const total = query.data?.pages?.[0]?.total ?? items.length;

  return { ...query, items, total };
};
