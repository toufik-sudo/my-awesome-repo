import ArrayUtilities from 'utils/ArrayUtilities';
import { isProgramFinished, isProgramInvitationPending, isProgramOngoing } from 'services/UsersServices';
import { IPlatform, IProgram } from 'interfaces/components/wall/IWallPrograms';
import { getUserAuthorizations, isAnyKindOfAdmin, isUserBeneficiary } from 'services/security/accessServices';

/**
 * Finds program by id in given list
 * @param programs
 * @param programId
 */
export const findProgramById = (programs = [], programId: number) => programs.find(p => p.id === programId) || {};

/**
 * Finds program by platform and id in given platforms list
 * @param platforms
 * @param platformId
 * @param programId
 */
export const findProgramByPlatformAndId = (platforms = [], platformId: number, programId: number) => {
  const platform = platforms.find(p => p.id === platformId);
  if (!platform) {
    return {};
  }

  return findProgramById(platform.programs, programId);
};

export const getOngoingProgramsWhereUserIsAdmin = (platforms: IPlatform[] = []): IProgram[] =>
  platforms
    .filter(({ role }) => isAnyKindOfAdmin(getUserAuthorizations(role)))
    .reduce((acc, { programs }) => acc.concat(programs.filter(program => isProgramOngoing(program))), []);
/**
 * Extracts programs from platforms into a single array, while keeping sort order
 * - invitations first, based on creation date (oldest first)
 * - programs running based on creation date
 * - programs under grace period based on creation date
 * - finished programs based on finish date
 * @implNote temporary sorting solution, until BE API provides this functionality
 * @param programs
 * @param platform
 */
export const prepareProgramsList = (programs = [], platformId) => {
  const mappedPrograms = preparePlatformPrograms(programs, platformId);
  mappedPrograms.sort(ArrayUtilities.sortBy(['statusOrder', 'programStatus', 'date']));

  return mappedPrograms;
};

/**
 * Filters given programs by type
 * @param programs
 * @param typeFilter
 */
export const filterProgramsByType = (programs: any[], typeFilter: { value: number }) => {
  if (!typeFilter || !typeFilter.value) {
    return programs;
  }

  return programs.filter(program => program.programType === typeFilter.value);
};

/**
 * Extracts and maps programs information from platform
 * @param programs
 * @param platform
 */
const preparePlatformPrograms = (programs, platform) =>
  programs
    .filter(program => !!program.id)
    .map(program => {
      const { id, name, isOpen, programType, status, programStatus, endDate } = program;

      return {
        ...{ id, name, isOpen, programType, status, programStatus, endDate },
        platform,
        statusOrder: isProgramInvitationPending(program) ? -1 : 1,
        date: isProgramFinished(program) ? new Date(program.endDate) : new Date(program.createdAt)
      };
    });

/**
 * Adds join request validation to in progress state
 * @param requestsState
 * @param userId
 * @param programId
 */
export const addJoinValidationInProgress = (requestsState, userId, programId) => ({
  ...requestsState,
  [userId]: [programId, ...(requestsState[userId] || [])]
});

/**
 * Removes completed join request validation from state
 * @param requestsState
 * @param userId
 * @param programId
 */
export const removeJoinValidation = (requestsState, userId, programId) => {
  const userRequests = {
    ...requestsState,
    [userId]: (requestsState[userId] || []).filter(pId => pId !== programId)
  };

  if (!userRequests[userId].length) {
    delete userRequests[userId];
  }

  return userRequests;
};

/**
 * Returns whether join request validation is in progress
 * @param requestsState
 * @param userId
 * @param programId
 */
export const isJoinRequestValidationInProgress = (requestsState, userId, programId) =>
  requestsState[userId] && requestsState[userId].includes(programId);

/**
 * Finds all programs from all platforms where user is beneficiary
 * @param platforms
 */
export const getAllProgramsWhereUserIsBeneficiary = (platforms: IPlatform[] = []): IProgram[] =>
  platforms.filter(({ role }) => isUserBeneficiary(role)).reduce((acc, { programs }) => acc.concat(programs), []);

/**
 * Finds program by status in given list
 * @param programs
 * @param programStatus
 */
export const findProgramsByStatus = (programs = [], programStatus: string) => {
  const activePrograms = [];

  programs.forEach(program => {
    if (program.status === programStatus) {
      activePrograms.push(program);
    }
  });

  return activePrograms;
};

/**
 * Finds program from platforms by program status
 * @param platforms
 * @param status
 */
export const findProgramsByRoleAndStatus = (platforms = [], status: string) => {
  if (!platforms) {
    return [];
  }

  return findProgramsByStatus(platforms, status);
};
