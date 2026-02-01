// -----------------------------------------------------------------------------
// Wall Data Provider
// Loads platform and program data when user enters the dashboard
// Uses the correct API based on user role:
// - Super/Hyper users: /users/{uuid}/admin-programs
// - Regular users: /users/{uuid}/programs
// -----------------------------------------------------------------------------

import React, { useEffect, useCallback, createContext, useContext } from 'react';
import { useAppDispatch } from '@/hooks/store/useAppDispatch';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api';
import { 
  setPlatforms, 
  setSelectedPlatform, 
  setPrograms, 
  setLoadingPlatforms,
  setSelectedProgram,
  setSuperPlatforms
} from '../store/wallReducer';
import { ISelectedPlatform, IPlatform as IWallPlatform, IProgram } from '../types';
import { PLATFORM_HIERARCHIC_TYPE } from '@/constants/platforms';
import { getCurrentUser } from '@/services/AuthService';
import { getUserUuid, getSessionSelectedPlatform } from '@/services/UserDataServices';
import { DEFAULT_ALL_PROGRAMS } from '@/constants/wall/programButtons';
import { hasAtLeastSuperRole, isUserBeneficiary } from '@/services/security/accessServices';
import { PLATFORM_STATUS } from '@/constants/general';
import { PROGRAM_DETAILS_JOINED } from '@/constants/api/userPrograms';

interface WallDataProviderProps {
  children: React.ReactNode;
}

interface WallDataContextValue {
  refetch: () => void;
  isLoading: boolean;
}

const WallDataContext = createContext<WallDataContextValue>({
  refetch: () => {},
  isLoading: false
});

export const useWallData = () => useContext(WallDataContext);

/**
 * Get user's highest role from token
 */
const getUserHighestRole = (): number => {
  const user = getCurrentUser();
  return user?.hr ?? 0;
};

/**
 * Filter platforms to only include valid ones
 * Beneficiaries should not see blocked/expired platforms or platforms without programs
 * Super/Hyper platforms should not appear in the platform slider for regular platforms
 */
const isValidPlatform = (platform: IWallPlatform): boolean => {
  const role = platform.role || 0;
  const isBeneficiaryBlocked = 
    isUserBeneficiary(role) && 
    ((platform.status && platform.status === PLATFORM_STATUS.EXPIRED) || 
     !platform.programs || 
     platform.programs.length === 0);
  
  // In the platform slider we should NEVER show hyper or super platforms
  const isRegularOrSubPlatform = 
    platform.hierarchicType === PLATFORM_HIERARCHIC_TYPE.INDEPENDENT ||
    platform.hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM;
  
  return !isBeneficiaryBlocked && platform && platform.id && isRegularOrSubPlatform;
};

/**
 * Keep only accessible programs based on user role
 * Super+ roles can see all programs, others only see joined programs
 */
const keepAccessibleProgramsOnly = (platform: IWallPlatform): IWallPlatform => {
  if (!hasAtLeastSuperRole(platform.role || 0)) {
    const filteredPrograms = platform.programs.filter(
      program => program.status === PROGRAM_DETAILS_JOINED
    );
    return { ...platform, programs: filteredPrograms };
  }
  return platform;
};

/**
 * Add "All Programs" option if platform has multiple programs
 */
const addAllProgramsOption = (platform: IWallPlatform): IWallPlatform => {
  if (platform.programs.length > 1) {
    const allProgramsOption: IProgram = {
      id: 0,
      name: DEFAULT_ALL_PROGRAMS,
      uploadResultsFile: false,
      resultsDeclarationForm: false
    };
    return {
      ...platform,
      programs: [allProgramsOption, ...platform.programs]
    };
  }
  return platform;
};

/**
 * Map API platform response to Wall platform format
 */
const mapApiPlatformToWallPlatform = (apiPlatform: Record<string, unknown>): IWallPlatform => {
  return {
    id: apiPlatform.id as number,
    name: apiPlatform.name as string,
    nrOfPrograms: (apiPlatform.nrOfPrograms as number) || (apiPlatform.programs as IProgram[])?.length || 0,
    role: (apiPlatform.role as number) || 0,
    status: (apiPlatform.status as number) || 0,
    hierarchicType: (apiPlatform.hierarchicType as PLATFORM_HIERARCHIC_TYPE) || PLATFORM_HIERARCHIC_TYPE.INDEPENDENT,
    programs: ((apiPlatform.programs as IProgram[]) || []).map(prog => ({
      id: prog.id,
      name: prog.name,
      programType: prog.programType,
      programStatus: prog.programStatus,
      isOpen: prog.isOpen,
      isPeopleManager: prog.isPeopleManager,
      design: prog.design,
      uploadResultsFile: prog.uploadResultsFile ?? false,
      resultsDeclarationForm: prog.resultsDeclarationForm ?? false,
      status: prog.status,
      subscribed: prog.subscribed,
      visitedWall: prog.visitedWall,
      startDate: prog.startDate
    })),
    subPlatforms: (apiPlatform.subPlatforms as IWallPlatform[]) || [],
    platformType: (apiPlatform.platformType as { id: number; name: string }) || { id: 0, name: '' },
  };
};

/**
 * Flatten platforms including subPlatforms for super users
 */
const flattenPlatformsWithSubPlatforms = (platforms: IWallPlatform[]): IWallPlatform[] => {
  return platforms.reduce<IWallPlatform[]>((acc, platform) => {
    acc.push(platform);
    if (platform.subPlatforms && platform.subPlatforms.length) {
      return acc.concat(platform.subPlatforms);
    }
    return acc;
  }, []);
};

/**
 * Provider that fetches platform and program data when entering the dashboard
 * and syncs it to Redux store
 */
export const WallDataProvider: React.FC<WallDataProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const userUuid = getUserUuid();
  const userHighestRole = getUserHighestRole();
  const isSuperUser = hasAtLeastSuperRole(userHighestRole);

  // Fetch user's platforms and programs using the correct endpoint based on role
  const { data: platformsData, isLoading, isSuccess, isError, refetch } = useQuery({
    queryKey: ['user-programs', userUuid, isSuperUser ? 'admin' : 'regular'],
    queryFn: async () => {
      if (!userUuid) {
        throw new Error('No user UUID available');
      }
      
      console.log('[WallDataProvider] Fetching platforms for user role:', userHighestRole, 'isSuperUser:', isSuperUser);
      
      if (isSuperUser) {
        // Call /users/{uuid}/admin-programs for super/hyper users
        const response = await usersApi.getAdminPrograms(userUuid, { platformsSize: 200 });
        console.log('[WallDataProvider] Using admin-programs endpoint');
        return { platforms: response.platforms };
      } else {
        // Call /users/{uuid}/programs for regular users
        const response = await usersApi.getUserPrograms(userUuid);
        console.log('[WallDataProvider] Using programs endpoint');
        return response;
      }
    },
    enabled: !!userUuid,
    staleTime: 30000,
    retry: 2,
  });

  // Refetch function that invalidates the cache and forces a fresh fetch
  const handleRefetch = useCallback(() => {
    console.log('[WallDataProvider] Refreshing platform data...');
    queryClient.invalidateQueries({ queryKey: ['user-programs'] });
    refetch();
  }, [queryClient, refetch]);

  // Get user's preferred platform from session or token
  const getUserPlatformId = useCallback((): number | undefined => {
    // First check session storage
    const sessionPlatform = getSessionSelectedPlatform();
    if (sessionPlatform?.id) {
      return sessionPlatform.id as number;
    }
    // Fall back to token
    const user = getCurrentUser();
    return user?.platformId;
  }, []);

  // Select the initial platform and program
  const selectInitialPlatform = useCallback((platforms: IWallPlatform[]) => {
    if (!platforms.length) return;

    const userPlatformId = getUserPlatformId();
    
    // Find user's preferred platform or default to first one
    let platformIndex = 0;
    if (userPlatformId) {
      const foundIndex = platforms.findIndex(p => p.id === userPlatformId);
      if (foundIndex >= 0) {
        platformIndex = foundIndex;
      }
    }

    const platformToSelect = platforms[platformIndex];

    if (platformToSelect) {
      const selectedPlatform: ISelectedPlatform = {
        index: platformIndex,
        name: platformToSelect.name,
        id: platformToSelect.id,
        role: platformToSelect.role,
        status: platformToSelect.status,
        hierarchicType: platformToSelect.hierarchicType || PLATFORM_HIERARCHIC_TYPE.INDEPENDENT,
      };

      dispatch(setSelectedPlatform(selectedPlatform));

      // Set the programs from this platform
      if (platformToSelect.programs && platformToSelect.programs.length > 0) {
        dispatch(setPrograms(platformToSelect.programs));
        
        // Select first program (or first real program if "All Programs" exists)
        const programIndex = platformToSelect.programs[0]?.id === 0 ? 1 : 0;
        const selectedProgram = platformToSelect.programs[programIndex] || platformToSelect.programs[0];
        
        if (selectedProgram) {
          dispatch(setSelectedProgram(
            selectedProgram.id,
            programIndex,
            selectedProgram.name
          ));
        }
      }
    }
  }, [dispatch, getUserPlatformId]);

  // Sync platforms to Redux when data is loaded
  useEffect(() => {
    if (isLoading) {
      dispatch(setLoadingPlatforms(true));
    }

    if (isSuccess && platformsData?.platforms) {
      // Map API platforms to wall platform format
      let allPlatforms = (platformsData.platforms as Record<string, unknown>[])
        .map(mapApiPlatformToWallPlatform);
      
      // For super users, flatten platforms to include subPlatforms
      if (isSuperUser) {
        allPlatforms = flattenPlatformsWithSubPlatforms(allPlatforms);
      }
      
      // Filter and process platforms
      const processedPlatforms = allPlatforms
        .map(keepAccessibleProgramsOnly)
        .filter(isValidPlatform)
        .map(addAllProgramsOption);
      
      // Super platforms are those that are not in the valid platforms list
      const superPlatforms = allPlatforms.filter(
        platform => !processedPlatforms.includes(platform) && platform
      );
      
      console.log('[WallDataProvider] Loaded platforms:', processedPlatforms.length, 'Super platforms:', superPlatforms.length);
      
      dispatch(setPlatforms(processedPlatforms));
      dispatch(setSuperPlatforms(superPlatforms));
      dispatch(setLoadingPlatforms(false));
      
      // Select initial platform
      selectInitialPlatform(processedPlatforms);
    }

    if (isError) {
      console.error('[WallDataProvider] Failed to load platforms');
      dispatch(setLoadingPlatforms(false));
    }
  }, [isLoading, isSuccess, isError, platformsData, dispatch, selectInitialPlatform, isSuperUser]);

  const contextValue: WallDataContextValue = {
    refetch: handleRefetch,
    isLoading
  };

  return (
    <WallDataContext.Provider value={contextValue}>
      {children}
    </WallDataContext.Provider>
  );
};

export default WallDataProvider;
