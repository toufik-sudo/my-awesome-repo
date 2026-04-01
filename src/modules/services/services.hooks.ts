import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tourismServicesApi } from './services.api';
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
