// -----------------------------------------------------------------------------
// useProgramsData Hook
// Determines which API to use based on user roles and fetches programs accordingly
// Uses /users/{uuid}/admin-programs for: Hyper Admin, Super Admin/Super CM/Manager for superplatforms
// Uses /users/{uuid}/programs for: Regular users/beneficiaries
// NEVER uses anonymous endpoints - always user-based
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/api/UsersApi';
import { getUserUuid, getUserDetails } from '@/services/UserDataServices';
import { ROLE } from '@/constants/security/access';
import { PLATFORM_HIERARCHIC_TYPE } from '@/constants/platforms';
import { isUserHyperAdmin, isUserSuperAdmin, isUserSuperCommunityManager, isUserManager, hasAtLeastSuperRole } from '@/services/security/accessServices';
import { IPlatform, IProgram } from '../types';

interface ProgramsDataResult {
  platforms: IPlatform[];
  programs: IProgram[];
  superPlatforms: IPlatform[];
  independentPlatforms: IPlatform[];
  subPlatforms: IPlatform[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  shouldUseAdminApi: boolean;
}

interface UserDataWithRoles {
  roles?: Array<{ platformId: number; role: number; hierarchicType?: number }>;
  hierarchicRole?: number;
  highestRole?: number;
  hr?: number;
  role?: number;
  uuid?: string;
}

/**
 * Check if user has super/manager role for any superplatform
 */
const hasSuperPlatformRole = (userData: UserDataWithRoles | null): boolean => {
  if (!userData?.roles) return false;
  
  return userData.roles.some(roleEntry => {
    const isSuperOrManagerRole = 
      isUserSuperAdmin(roleEntry.role) || 
      isUserSuperCommunityManager(roleEntry.role) || 
      isUserManager(roleEntry.role);
    
    // Check if this role is for a superplatform (hierarchicType 3 = SUPER_PLATFORM)
    const isOnSuperPlatform = roleEntry.hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM;
    
    return isSuperOrManagerRole && isOnSuperPlatform;
  });
};

/**
 * Get user data from storage for role checking
 */
const getUserDataFromStorage = (): UserDataWithRoles | null => {
  try {
    const details = getUserDetails();
    return details as UserDataWithRoles;
  } catch {
    return null;
  }
};

/**
 * Determine if user should use admin-programs API
 * Conditions:
 * 1. User is Hyper Admin
 * 2. User is Super Admin/Super CM/Manager for one or more superplatforms
 */
const shouldUseAdminProgramsApi = (userData: UserDataWithRoles | null): boolean => {
  if (!userData) return false;
  
  const highestRole = userData.hr ?? userData.highestRole ?? userData.role ?? ROLE.BENEFICIARY;
  
  // Hyper Admin always uses admin-programs
  if (isUserHyperAdmin(highestRole)) {
    return true;
  }
  
  // Check if user has super admin role or higher
  if (hasAtLeastSuperRole(highestRole)) {
    return true;
  }
  
  // Check if user has Super Admin/Super CM/Manager role for any superplatform
  if (hasSuperPlatformRole(userData)) {
    return true;
  }
  
  return false;
};

/**
 * Normalize platform data from API response to wall types
 */
const normalizePlatform = (platform: any): IPlatform => ({
  id: platform.id,
  name: platform.name,
  role: platform.role ?? 0,
  status: platform.status ?? 0,
  hierarchicType: platform.hierarchicType ?? PLATFORM_HIERARCHIC_TYPE.INDEPENDENT,
  nrOfPrograms: platform.nrOfPrograms ?? platform.programs?.length ?? 0,
  programs: (platform.programs || []).map(normalizeProgram),
  subPlatforms: platform.subPlatforms?.map(normalizePlatform),
  platformType: platform.platformType ?? { id: 0, name: '' }
});

/**
 * Normalize program data from API response to wall types
 */
const normalizeProgram = (program: any): IProgram => ({
  id: program.id,
  name: program.name,
  programType: program.programType,
  programStatus: program.programStatus,
  isOpen: program.isOpen,
  isPeopleManager: program.isPeopleManager,
  design: program.design,
  uploadResultsFile: program.uploadResultsFile ?? false,
  resultsDeclarationForm: program.resultsDeclarationForm ?? false,
  status: program.status,
  subscribed: program.subscribed,
  visitedWall: program.visitedWall,
  startDate: program.startDate
});

/**
 * Hook to fetch programs data using the appropriate API based on user roles
 * Always uses user-based endpoints: /users/{uuid}/programs or /users/{uuid}/admin-programs
 */
export const useProgramsData = (): ProgramsDataResult => {
  const userUuid = getUserUuid();
  const userData = getUserDataFromStorage();
  const shouldUseAdminApi = shouldUseAdminProgramsApi(userData);

  // Query for admin-programs API: /users/{uuid}/admin-programs
  const adminQuery = useQuery({
    queryKey: ['user-admin-programs', userUuid],
    queryFn: async () => {
      if (!userUuid) {
        throw new Error('No user UUID available');
      }
      return usersApi.getAdminPrograms(userUuid, { platformsSize: 200 });
    },
    enabled: !!userUuid && shouldUseAdminApi,
    staleTime: 60000,
  });

  // Query for regular user programs API: /users/{uuid}/programs
  const userProgramsQuery = useQuery({
    queryKey: ['user-programs', userUuid],
    queryFn: async () => {
      if (!userUuid) {
        throw new Error('No user UUID available');
      }
      const data = await usersApi.getUserPrograms(userUuid, { platformsSize: 200 });
      
      // Normalize the response structure
      return {
        platforms: data.platforms || data || [],
        total: data.total || data.platforms?.length || 0
      };
    },
    enabled: !!userUuid && !shouldUseAdminApi,
    staleTime: 60000,
  });

  // Determine which query result to use
  const activeQuery = shouldUseAdminApi ? adminQuery : userProgramsQuery;
  const data = activeQuery.data;

  // Extract platforms from response and normalize
  const rawPlatforms = data?.platforms || [];
  const platforms: IPlatform[] = rawPlatforms.map(normalizePlatform);
  
  // Separate by hierarchic type
  const superPlatforms = platforms.filter(
    p => p.hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM ||
         p.hierarchicType === PLATFORM_HIERARCHIC_TYPE.HYPER_PLATFORM
  );
  
  const subPlatforms = platforms.filter(
    p => p.hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM
  );
  
  const independentPlatforms = platforms.filter(
    p => p.hierarchicType === PLATFORM_HIERARCHIC_TYPE.INDEPENDENT ||
         !p.hierarchicType
  );

  // Extract all programs from platforms
  const programs: IProgram[] = platforms.flatMap(p => p.programs || []);

  return {
    platforms,
    programs,
    superPlatforms,
    subPlatforms,
    independentPlatforms,
    total: data?.total || 0,
    isLoading: activeQuery.isLoading,
    isError: activeQuery.isError,
    refetch: activeQuery.refetch,
    shouldUseAdminApi
  };
};

export default useProgramsData;
