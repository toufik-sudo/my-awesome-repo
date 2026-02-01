// -----------------------------------------------------------------------------
// useSuperplatformManagement Hook
// Handles superplatform CRUD operations and selection logic
// -----------------------------------------------------------------------------

import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { platformsApi } from '@/api/PlatformsApi';
import { PLATFORM_HIERARCHIC_TYPE } from '@/constants/platforms';
import { IPlatform } from '../types';

interface CreatePlatformParams {
  name: string;
  hierarchicType: PLATFORM_HIERARCHIC_TYPE;
  parentPlatformId?: number;
}

interface SuperplatformManagementResult {
  // Selected items
  selectedSuperPlatform: IPlatform | null;
  selectedPlatform: IPlatform | null;
  
  // Selection handlers
  selectSuperPlatform: (platform: IPlatform | null) => void;
  selectPlatform: (platform: IPlatform | null) => void;
  clearSelections: () => void;
  
  // Platform operations
  createPlatform: (name: string, hierarchicType: PLATFORM_HIERARCHIC_TYPE, parentPlatformId?: number) => Promise<any>;
  updatePlatform: (platformId: number, updates: Partial<IPlatform>) => Promise<any>;
  deletePlatform: (platformId: number) => Promise<void>;
  
  // Mutation states
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  
  // Filtered platforms
  getSubPlatforms: (superPlatformId: number, allPlatforms: IPlatform[]) => IPlatform[];
  getProgramsForPlatform: (platformId: number, allPlatforms: IPlatform[]) => any[];
}

/**
 * Hook to manage superplatform operations
 */
export const useSuperplatformManagement = (): SuperplatformManagementResult => {
  const queryClient = useQueryClient();
  
  // Selection state
  const [selectedSuperPlatform, setSelectedSuperPlatform] = useState<IPlatform | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<IPlatform | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Create platform mutation
  const createMutation = useMutation({
    mutationFn: async ({ 
      name, 
      hierarchicType, 
      parentPlatformId 
    }: CreatePlatformParams) => {
      const platform: Record<string, any> = {
        name,
        hierarchicType,
      };
      if (parentPlatformId) {
        platform.parentPlatformId = parentPlatformId;
      }
      return platformsApi.createPlatform(platform);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to create platform');
    }
  });

  // Update platform mutation
  const updateMutation = useMutation({
    mutationFn: async ({ 
      platformId, 
      updates 
    }: { 
      platformId: number; 
      updates: Record<string, any>;
    }) => {
      return platformsApi.updatePlatform(platformId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to update platform');
    }
  });

  // Delete platform mutation
  const deleteMutation = useMutation({
    mutationFn: async (platformId: number) => {
      return platformsApi.deletePlatform(platformId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
      setSelectedPlatform(null);
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to delete platform');
    }
  });

  // Selection handlers
  const selectSuperPlatform = useCallback((platform: IPlatform | null) => {
    setSelectedSuperPlatform(platform);
    // Clear sub-platform selection when changing super platform
    setSelectedPlatform(null);
    setError(null);
  }, []);

  const selectPlatform = useCallback((platform: IPlatform | null) => {
    setSelectedPlatform(platform);
    setError(null);
  }, []);

  const clearSelections = useCallback(() => {
    setSelectedSuperPlatform(null);
    setSelectedPlatform(null);
    setError(null);
  }, []);

  // Platform operations
  const createPlatform = useCallback(async (
    name: string,
    hierarchicType: PLATFORM_HIERARCHIC_TYPE,
    parentPlatformId?: number
  ): Promise<any> => {
    return createMutation.mutateAsync({ name, hierarchicType, parentPlatformId });
  }, [createMutation]);

  const updatePlatform = useCallback(async (
    platformId: number,
    updates: Partial<IPlatform>
  ): Promise<any> => {
    return updateMutation.mutateAsync({ platformId, updates: updates as Record<string, any> });
  }, [updateMutation]);

  const deletePlatform = useCallback(async (platformId: number): Promise<void> => {
    return deleteMutation.mutateAsync(platformId);
  }, [deleteMutation]);

  // Helper to get sub-platforms for a super platform
  const getSubPlatforms = useCallback((
    superPlatformId: number,
    allPlatforms: IPlatform[]
  ): IPlatform[] => {
    const superPlatform = allPlatforms.find(p => p.id === superPlatformId);
    if (superPlatform?.subPlatforms) {
      return superPlatform.subPlatforms;
    }
    
    // Fallback: filter platforms by hierarchic type that might be under this super platform
    return allPlatforms.filter(p => 
      p.hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM
    );
  }, []);

  // Helper to get programs for a platform
  const getProgramsForPlatform = useCallback((
    platformId: number,
    allPlatforms: IPlatform[]
  ): any[] => {
    const platform = allPlatforms.find(p => p.id === platformId);
    return platform?.programs || [];
  }, []);

  return {
    selectedSuperPlatform,
    selectedPlatform,
    selectSuperPlatform,
    selectPlatform,
    clearSelections,
    createPlatform,
    updatePlatform,
    deletePlatform,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    error,
    getSubPlatforms,
    getProgramsForPlatform
  };
};

export default useSuperplatformManagement;
