// -----------------------------------------------------------------------------
// Wall Actions
// Migrated from old_app/src/store/actions/wallActions.ts
// -----------------------------------------------------------------------------

import {
  RELOAD_AGENDA,
  SET_ACTIVE_PLATFORM,
  SET_ACTIVE_PROGRAM,
  SET_FORCED_PROGRAM,
  SET_IS_PROGRAM_SELECTION_LOCKED,
  SET_LINKED_EMAILS_DATA,
  SET_PLATFORMS,
  SET_POST_CREATED,
  SET_PROGRAM_USERS,
  SET_PROGRAMS,
  SET_REDIRECT_DATA,
  SET_USER_RANKINGS,
  SET_LOADING_PLATFORMS,
  SET_BENEFICIARY_POINTS,
  SET_PROGRAM_DETAILS,
  SET_SELECTED_PLATFORM,
  SET_SUPER_PLATFORMS
} from './actionTypes';
import { TDynamicObject } from '@/types/store';

/**
 * Action for setting reload state for agenda
 */
export const setAgendaReload = (shouldReload: boolean) => ({
  type: RELOAD_AGENDA,
  payload: shouldReload
});

/**
 * Action for notifying the creation of a post/task
 */
export const notifyPostCreated = (postData: unknown) => ({
  type: SET_POST_CREATED,
  payload: postData
});

/**
 * Action adds to store payload containing program data
 */
export const setPrograms = (payload: TDynamicObject) => ({
  type: SET_PROGRAMS,
  payload
});

/**
 * Action to set the given platforms
 */
export const setPlatforms = (payload: unknown) => ({
  type: SET_PLATFORMS,
  payload
});

/**
 * Action to set the given super/hyper platforms
 */
export const setSuperPlatforms = (payload: unknown) => ({
  type: SET_SUPER_PLATFORMS,
  payload
});

/**
 * Action to set the active platform
 */
export const setActivePlatform = (payload: unknown) => ({
  type: SET_ACTIVE_PLATFORM,
  payload
});

/**
 * Action set the given user rankings
 */
export const setUserRankings = (payload: unknown) => ({
  type: SET_USER_RANKINGS,
  payload
});

/**
 * Action to set the redirect data needed
 */
export const setOnRedirectData = (payload: unknown) => ({
  type: SET_REDIRECT_DATA,
  payload
});

/**
 * Action searches for the given programId and sets the found platform and program
 */
export const forceActiveProgram = ({
  programId = undefined,
  forcedPlatformId = undefined,
  unlockSelection = undefined
}: {
  programId?: number;
  forcedPlatformId?: number;
  unlockSelection?: boolean;
}) => ({
  type: SET_FORCED_PROGRAM,
  payload: { programId, forcedPlatformId, unlockSelection }
});

/**
 * Action used to set selectedProgramId on store
 */
export const setActiveProgramData = (selectedProgramId: string | number) => ({
  type: SET_ACTIVE_PROGRAM,
  selectedProgramId
});

/**
 * Action used to set loading state for platforms on store
 */
export const setLoadingPlatforms = (payload: boolean) => ({
  type: SET_LOADING_PLATFORMS,
  payload
});

/**
 * Action to save program user data in store
 */
export const setProgramUsersData = (payload: object) => ({
  type: SET_PROGRAM_USERS,
  payload
});

/**
 * Action to lock/unlock program selection
 */
export const setIsProgramSelectionLocked = (payload: boolean) => ({
  type: SET_IS_PROGRAM_SELECTION_LOCKED,
  payload
});

/**
 * Action adds to store payload containing linkedEmails data
 */
export const setLinkedEmailsData = (payload: string[]) => ({
  type: SET_LINKED_EMAILS_DATA,
  payload
});

/**
 * Action set the given user beneficiary points
 */
export const setUserBeneficiaryPoints = (payload: unknown) => ({
  type: SET_BENEFICIARY_POINTS,
  payload
});

/**
 * Action set the program details
 */
export const setProgramDetails = (programId: number, data: unknown) => ({
  type: SET_PROGRAM_DETAILS,
  payload: { programId, data }
});

/**
 * Action to set the selected platform
 */
export const setSelectedPlatform = (payload: unknown) => ({
  type: SET_SELECTED_PLATFORM,
  payload
});
