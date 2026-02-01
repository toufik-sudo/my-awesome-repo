// -----------------------------------------------------------------------------
// Platforms API Hooks
// React Query hooks for platform data fetching
// -----------------------------------------------------------------------------

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { platformsApi, IPlatformSearchCriteria } from '@/api';
import { IPlatform } from '@/api/types';

// Query keys
export const platformsKeys = {
  all: ['platforms'] as const,
  lists: () => [...platformsKeys.all, 'list'] as const,
  list: (filters?: IPlatformSearchCriteria) => [...platformsKeys.lists(), filters] as const,
  details: () => [...platformsKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...platformsKeys.details(), id] as const,
  types: () => [...platformsKeys.all, 'types'] as const,
};

/**
 * Fetch platform types (for pricing)
 */
export function usePlatformTypes() {
  return useQuery({
    queryKey: platformsKeys.types(),
    queryFn: () => platformsApi.getPlatformTypes(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch paginated list of platforms
 */
export function usePlatforms(searchCriteria?: IPlatformSearchCriteria) {
  return useQuery({
    queryKey: platformsKeys.list(searchCriteria),
    queryFn: () => platformsApi.getPlatforms(searchCriteria),
    staleTime: 30000,
  });
}

/**
 * Fetch platform details by ID
 */
export function usePlatformDetails(platformId: string | number | undefined) {
  return useQuery({
    queryKey: platformsKeys.detail(platformId || ''),
    queryFn: () => platformsApi.getPlatformDetails(String(platformId)),
    enabled: !!platformId,
    staleTime: 60000,
  });
}

/**
 * Check if platform name is unique
 */
export function useCheckPlatformName(name: string, currentPlatformId?: number) {
  return useQuery({
    queryKey: [...platformsKeys.all, 'checkName', name],
    queryFn: () => platformsApi.isNameUnique(name, currentPlatformId),
    enabled: name.length > 2,
    staleTime: 10000,
  });
}

/**
 * Create platform mutation
 */
export function useCreatePlatform() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (platform: Partial<IPlatform>) => platformsApi.createPlatform(platform),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: platformsKeys.lists() });
    },
  });
}

/**
 * Update platform mutation
 */
export function useUpdatePlatform() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      platformId,
      updates,
    }: {
      platformId: number;
      updates: Partial<IPlatform>;
    }) => platformsApi.updatePlatform(platformId, updates),
    onSuccess: (_, { platformId }) => {
      queryClient.invalidateQueries({ queryKey: platformsKeys.detail(platformId) });
      queryClient.invalidateQueries({ queryKey: platformsKeys.lists() });
    },
  });
}

/**
 * Delete platform mutation
 */
export function useDeletePlatform() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (platformId: number) => platformsApi.deletePlatform(platformId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: platformsKeys.lists() });
    },
  });
}
