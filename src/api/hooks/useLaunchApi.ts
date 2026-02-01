// -----------------------------------------------------------------------------
// Launch API Hooks
// React Query hooks for program launch/creation
// -----------------------------------------------------------------------------

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { launchApi } from '@/api/LaunchApi';
import { programsApi } from '@/api/ProgramsApi';
import { platformsApi } from '@/api/PlatformsApi';
import type { IProgram } from '@/api/types';

// Query keys
export const launchKeys = {
  all: ['launch'] as const,
  allocationTypes: (platformId: number, programType: number) => 
    [...launchKeys.all, 'allocationTypes', platformId, programType] as const,
  categories: (params: Record<string, unknown>) => 
    [...launchKeys.all, 'categories', params] as const,
  platforms: () => [...launchKeys.all, 'platforms'] as const,
  availablePlatforms: () => [...launchKeys.platforms(), 'available'] as const,
  programUrlCheck: (url: string) => 
    [...launchKeys.all, 'urlCheck', url] as const,
};

/**
 * Fetch possible allocation types for a program
 */
export function useAllocationTypes(platformId: number | undefined, programType: number | undefined) {
  return useQuery({
    queryKey: launchKeys.allocationTypes(platformId || 0, programType || 0),
    queryFn: async () => {
      if (!platformId) return [];
      return launchApi.getPossibleAllocationTypes({ platformId, programType });
    },
    enabled: !!platformId,
    staleTime: 300000, // 5 minutes
  });
}

/**
 * Fetch categories for program setup
 */
export function useCategories(params: { platform?: number; size?: number; offset?: number }) {
  return useQuery({
    queryKey: launchKeys.categories(params),
    queryFn: () => launchApi.getCategories(params),
    enabled: !!params.platform,
    staleTime: 300000,
  });
}

/**
 * Fetch platforms available for program creation
 */
export function useAvailablePlatforms() {
  return useQuery({
    queryKey: launchKeys.availablePlatforms(),
    queryFn: async () => {
      const result = await platformsApi.getPlatforms({});
      return result.entries || [];
    },
    staleTime: 60000,
  });
}

/**
 * Check if program URL is available
 */
export function useProgramUrlCheck(url: string | undefined) {
  return useQuery({
    queryKey: launchKeys.programUrlCheck(url || ''),
    queryFn: async () => {
      if (!url) return { available: true };
      // This would typically call an endpoint to check URL availability
      // For now, we'll return a placeholder
      return { available: true };
    },
    enabled: !!url && url.length >= 3,
    staleTime: 10000,
  });
}

/**
 * Launch/create a new program
 */
export function useLaunchProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await launchApi.launchProgram(payload);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate programs list
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: launchKeys.platforms() });
    },
  });
}

/**
 * Update an existing program
 */
export function useUpdateLaunchedProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { programId: number; data: Partial<IProgram> }) => {
      return launchApi.updateProgram(payload);
    },
    onSuccess: (_, { programId }) => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['programs', 'detail', programId] });
    },
  });
}

export interface ILaunchPayload {
  // Program basics
  name: string;
  type: number;
  platformId: number;
  creationType: number;
  customUrl?: string;
  
  // Duration
  startDate: Date;
  endDate?: Date;
  
  // Configuration
  open: boolean;
  currency: number;
  
  // Registration settings
  registerFormFields?: string[];
  registerManualValidation?: boolean;
  notifyOfNewRegistrations?: boolean;
  sendEmailInvites?: boolean;
  invitedUsersFile?: string;
  
  // Results settings
  resultsDeclarationForm?: boolean;
  uploadResultsFile?: boolean;
  resultsFormFields?: string[];
  declarationManualValidation?: boolean;
  notifyOfNewResultsDeclaration?: boolean;
  
  // Terms
  termsAndConditionsVersion?: string;
  termsAndCondition?: string | null;
}

/**
 * Construct quick launch payload
 */
export function constructQuickLaunchPayload(launchData: Record<string, any>, tcUploadId?: string): ILaunchPayload {
  return {
    name: launchData.programName,
    startDate: launchData.duration?.start ? new Date(launchData.duration.start) : new Date(),
    endDate: launchData.duration?.end ? new Date(launchData.duration.end) : undefined,
    type: launchData.type,
    currency: 1,
    platformId: launchData.platform?.id,
    creationType: 1, // Quick launch
    registerFormFields: launchData.invitedUsersFields,
    registerManualValidation: launchData.manualValidation || false,
    notifyOfNewRegistrations: launchData.emailNotify || false,
    open: launchData.confidentiality === 'OPEN',
    declarationManualValidation: launchData.resultsManualValidation || false,
    notifyOfNewResultsDeclaration: launchData.resultsEmailNotify || false,
    customUrl: launchData.extendUrl,
    sendEmailInvites: launchData.acceptedEmailInvitation || false,
    resultsDeclarationForm: true,
    uploadResultsFile: true,
    termsAndCondition: tcUploadId || null,
  };
}

/**
 * Construct full launch payload (includes more options)
 */
export function constructFullLaunchPayload(launchData: Record<string, any>, tcUploadId?: string): ILaunchPayload {
  const quickPayload = constructQuickLaunchPayload(launchData, tcUploadId);
  
  return {
    ...quickPayload,
    creationType: 2, // Full launch
    resultsDeclarationForm: launchData.resultChannel?.declarationForm || false,
    uploadResultsFile: launchData.resultChannel?.fileImport || false,
    resultsFormFields: launchData.resultsUsersFields,
    invitedUsersFile: launchData.invitedUserData?.invitedUsersFile,
  };
}
