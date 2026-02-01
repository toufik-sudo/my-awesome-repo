// -----------------------------------------------------------------------------
// Programs API Hooks
// React Query hooks for program data fetching
// -----------------------------------------------------------------------------

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { programsApi, IProgramSearchCriteria } from '@/api';
import { IProgram } from '@/api/types';

// Query keys
export const programsKeys = {
  all: ['programs'] as const,
  lists: () => [...programsKeys.all, 'list'] as const,
  list: (filters: IProgramSearchCriteria) => [...programsKeys.lists(), filters] as const,
  details: () => [...programsKeys.all, 'detail'] as const,
  detail: (id: number) => [...programsKeys.details(), id] as const,
  anonymous: (id: number) => [...programsKeys.detail(id), 'anonymous'] as const,
  onboarding: (id: number) => [...programsKeys.detail(id), 'onboarding'] as const,
  formFields: (id: number) => [...programsKeys.detail(id), 'formFields'] as const,
  platform: (platformId: number) => [...programsKeys.all, 'platform', platformId] as const,
};

/**
 * Fetch paginated list of programs
 */
export function usePrograms(searchCriteria: IProgramSearchCriteria) {
  return useQuery({
    queryKey: programsKeys.list(searchCriteria),
    queryFn: () => programsApi.getPrograms(searchCriteria),
    staleTime: 30000,
  });
}

/**
 * Fetch program details by ID
 */
export function useProgramDetails(programId: number | undefined) {
  return useQuery({
    queryKey: programsKeys.detail(programId || 0),
    queryFn: () => programsApi.getProgramDetails(programId!),
    enabled: !!programId,
    staleTime: 60000,
  });
}

/**
 * Fetch anonymous program details (no auth required)
 */
export function useAnonymousProgramDetails(programId: number | undefined) {
  return useQuery({
    queryKey: programsKeys.anonymous(programId || 0),
    queryFn: () => programsApi.getAnonymousProgramDetails(programId!),
    enabled: !!programId,
  });
}

/**
 * Fetch onboarding program details
 */
export function useOnboardingProgramDetails(programId: number | undefined) {
  return useQuery({
    queryKey: programsKeys.onboarding(programId || 0),
    queryFn: () => programsApi.getOnboardingProgramDetails(programId!),
    enabled: !!programId,
  });
}

/**
 * Fetch programs for a specific platform
 */
export function usePlatformPrograms(platformId: number | undefined) {
  return useQuery({
    queryKey: programsKeys.platform(platformId || 0),
    queryFn: () => programsApi.getPlatformPrograms(platformId!),
    enabled: !!platformId,
  });
}

/**
 * Fetch program form fields
 */
export function useProgramFormFields(programId: number | undefined) {
  return useQuery({
    queryKey: programsKeys.formFields(programId || 0),
    queryFn: () => programsApi.getProgramFormFields(programId!),
    enabled: !!programId,
  });
}

/**
 * Create program mutation
 */
export function useCreateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (program: Partial<IProgram>) => programsApi.createProgram(program),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: programsKeys.lists() });
      if (data.platformId) {
        queryClient.invalidateQueries({ queryKey: programsKeys.platform(data.platformId) });
      }
    },
  });
}

/**
 * Update program mutation
 */
export function useUpdateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ programId, updates }: { programId: number; updates: Partial<IProgram> }) =>
      programsApi.updateProgram(programId, updates),
    onSuccess: (data, { programId }) => {
      queryClient.invalidateQueries({ queryKey: programsKeys.detail(programId) });
      queryClient.invalidateQueries({ queryKey: programsKeys.lists() });
    },
  });
}

/**
 * Delete program mutation
 */
export function useDeleteProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (programId: number) => programsApi.deleteProgram(programId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programsKeys.lists() });
    },
  });
}
