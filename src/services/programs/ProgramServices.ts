// -----------------------------------------------------------------------------
// Program Services
// Migrated from old_app/src/services/ProgramServices.ts
// -----------------------------------------------------------------------------

import ArrayUtilities from '@/utils/ArrayUtilities';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface IProgram {
  id: number;
  name: string;
  isOpen?: boolean;
  programType?: number;
  status?: string;
  programStatus?: string;
  endDate?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface IPlatform {
  id: number;
  name?: string;
  role?: string;
  programs: IProgram[];
  [key: string]: unknown;
}

export interface IPreparedProgram extends IProgram {
  platform: number;
  statusOrder: number;
  date: Date;
}

export interface JoinRequestState {
  [userId: string]: number[];
}

// -----------------------------------------------------------------------------
// Program Status Helpers
// -----------------------------------------------------------------------------

const PROGRAM_STATUS = {
  ONGOING: 'ONGOING',
  FINISHED: 'FINISHED',
  PENDING: 'PENDING',
  INVITATION_PENDING: 'INVITATION_PENDING',
} as const;

/**
 * Checks if program is currently ongoing
 */
export const isProgramOngoing = (program: IProgram): boolean => {
  return program.status === PROGRAM_STATUS.ONGOING || program.programStatus === PROGRAM_STATUS.ONGOING;
};

/**
 * Checks if program has finished
 */
export const isProgramFinished = (program: IProgram): boolean => {
  return program.status === PROGRAM_STATUS.FINISHED || program.programStatus === PROGRAM_STATUS.FINISHED;
};

/**
 * Checks if program invitation is pending
 */
export const isProgramInvitationPending = (program: IProgram): boolean => {
  return program.status === PROGRAM_STATUS.INVITATION_PENDING || 
         program.programStatus === PROGRAM_STATUS.INVITATION_PENDING;
};

// -----------------------------------------------------------------------------
// Role Helpers
// -----------------------------------------------------------------------------

/**
 * Checks if user role is beneficiary
 */
export const isUserBeneficiary = (role?: string): boolean => {
  return role === 'BENEFICIARY' || role === 'beneficiary';
};

/**
 * Checks if user is any kind of admin
 */
export const isAnyKindOfAdmin = (authorizations: string[]): boolean => {
  const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'PLATFORM_ADMIN', 'PROGRAM_ADMIN'];
  return authorizations.some((auth) => adminRoles.includes(auth.toUpperCase()));
};

// -----------------------------------------------------------------------------
// Program Lookup Functions
// -----------------------------------------------------------------------------

/**
 * Finds program by ID in given list
 * 
 * @param programs - Array of programs to search
 * @param programId - ID of program to find
 * @returns Found program or empty object
 */
export const findProgramById = (
  programs: IProgram[] = [],
  programId: number
): IProgram | Record<string, never> => {
  return programs.find((p) => p.id === programId) || {};
};

/**
 * Finds program by platform and program ID
 * 
 * @param platforms - Array of platforms
 * @param platformId - Platform ID
 * @param programId - Program ID
 * @returns Found program or empty object
 */
export const findProgramByPlatformAndId = (
  platforms: IPlatform[] = [],
  platformId: number,
  programId: number
): IProgram | Record<string, never> => {
  const platform = platforms.find((p) => p.id === platformId);
  if (!platform) {
    return {};
  }
  return findProgramById(platform.programs, programId);
};

// -----------------------------------------------------------------------------
// Program Filtering & Preparation
// -----------------------------------------------------------------------------

/**
 * Extracts and maps programs with sorting metadata
 */
const preparePlatformPrograms = (
  programs: IProgram[],
  platformId: number
): IPreparedProgram[] => {
  return programs
    .filter((program) => !!program.id)
    .map((program) => {
      const { id, name, isOpen, programType, status, programStatus, endDate, createdAt } = program;

      return {
        id,
        name,
        isOpen,
        programType,
        status,
        programStatus,
        endDate,
        platform: platformId,
        statusOrder: isProgramInvitationPending(program) ? -1 : 1,
        date: isProgramFinished(program) 
          ? new Date(endDate || Date.now()) 
          : new Date(createdAt || Date.now()),
      };
    });
};

/**
 * Prepares and sorts programs list for display
 * - Invitations first (oldest first)
 * - Running programs by creation date
 * - Finished programs by end date
 * 
 * @param programs - Array of programs
 * @param platformId - Platform ID
 * @returns Sorted array of prepared programs
 */
export const prepareProgramsList = (
  programs: IProgram[] = [],
  platformId: number
): IPreparedProgram[] => {
  const mappedPrograms = preparePlatformPrograms(programs, platformId);
  mappedPrograms.sort(ArrayUtilities.sortBy(['statusOrder', 'programStatus', 'date']));
  return mappedPrograms;
};

/**
 * Filters programs by type
 * 
 * @param programs - Array of programs
 * @param typeFilter - Filter object with value property
 * @returns Filtered programs
 */
export const filterProgramsByType = (
  programs: IProgram[],
  typeFilter?: { value: number }
): IProgram[] => {
  if (!typeFilter?.value) {
    return programs;
  }
  return programs.filter((program) => program.programType === typeFilter.value);
};

/**
 * Finds programs by status
 */
export const findProgramsByStatus = (
  programs: IProgram[] = [],
  programStatus: string
): IProgram[] => {
  return programs.filter((program) => program.status === programStatus);
};

/**
 * Finds programs by role and status across platforms
 */
export const findProgramsByRoleAndStatus = (
  platforms: IPlatform[] = [],
  status: string
): IProgram[] => {
  if (!platforms?.length) {
    return [];
  }
  
  const allPrograms = platforms.flatMap((p) => p.programs || []);
  return findProgramsByStatus(allPrograms, status);
};

/**
 * Gets ongoing programs where user is admin
 */
export const getOngoingProgramsWhereUserIsAdmin = (
  platforms: IPlatform[] = [],
  getUserAuthorizations: (role?: string) => string[]
): IProgram[] => {
  return platforms
    .filter(({ role }) => isAnyKindOfAdmin(getUserAuthorizations(role)))
    .flatMap(({ programs }) => programs.filter(isProgramOngoing));
};

/**
 * Gets all programs where user is beneficiary
 */
export const getAllProgramsWhereUserIsBeneficiary = (
  platforms: IPlatform[] = []
): IProgram[] => {
  return platforms
    .filter(({ role }) => isUserBeneficiary(role))
    .flatMap(({ programs }) => programs);
};

// -----------------------------------------------------------------------------
// Join Request Management
// -----------------------------------------------------------------------------

/**
 * Adds join validation to in-progress state
 */
export const addJoinValidationInProgress = (
  requestsState: JoinRequestState,
  userId: string,
  programId: number
): JoinRequestState => ({
  ...requestsState,
  [userId]: [programId, ...(requestsState[userId] || [])],
});

/**
 * Removes completed join request from state
 */
export const removeJoinValidation = (
  requestsState: JoinRequestState,
  userId: string,
  programId: number
): JoinRequestState => {
  const userRequests = {
    ...requestsState,
    [userId]: (requestsState[userId] || []).filter((pId) => pId !== programId),
  };

  if (!userRequests[userId].length) {
    delete userRequests[userId];
  }

  return userRequests;
};

/**
 * Checks if join request validation is in progress
 */
export const isJoinRequestValidationInProgress = (
  requestsState: JoinRequestState,
  userId: string,
  programId: number
): boolean => {
  return requestsState[userId]?.includes(programId) ?? false;
};
