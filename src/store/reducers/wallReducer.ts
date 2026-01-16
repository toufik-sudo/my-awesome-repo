import { AnyAction } from 'redux';

import {
  SET_ACTIVE_PROGRAM,
  SET_PROGRAMS,
  SET_PROGRAM_USERS,
  SET_IS_PROGRAM_SELECTION_LOCKED,
  RELOAD_AGENDA,
  SET_POST_CREATED,
  SET_PLATFORMS,
  SET_SUPER_PLATFORMS,
  SET_ACTIVE_PLATFORM,
  SET_LINKED_EMAILS_DATA,
  SET_FORCED_PROGRAM,
  SET_REDIRECT_DATA,
  SET_USER_RANKINGS,
  SET_LOADING_PLATFORMS,
  SET_BENEFICIARY_POINTS,
  SET_PROGRAM_DETAILS,
  SET_SELECTED_PLATFORM,
  SET_USER_LOGGED_IN
} from 'store/actions/actionTypes';
import { IWallReducer } from 'interfaces/store/IStore';
import { initialWallState } from 'store/initialState/initialWallState';
import {
  handleSetActiveProgram,
  handleSetActivePlatform,
  handleSetForcedProgram
} from 'services/PlatformSelectionServices';
import { TASK } from 'constants/wall/posts';

/**
 * Wall reducer -> manages wall page state
 *
 * @param state
 * @param action
 */
export default (state: IWallReducer = initialWallState, action: AnyAction) => {
  switch (action.type) {
    case SET_PROGRAMS:
      return {
        ...state,
        programs: action.payload
      };
    case SET_PLATFORMS:
      return {
        ...state,
        platforms: action.payload
      };
    case SET_SUPER_PLATFORMS:
      return {
        ...state,
        superPlatforms: action.payload
      };
    case SET_ACTIVE_PROGRAM:
      return {
        ...state,
        isProgramSelectionLocked: true,
        ...handleSetActiveProgram(state.programs, action.selectedProgramId)
      };
    case SET_ACTIVE_PLATFORM:
      return {
        ...state,
        isProgramSelectionLocked: true,
        ...handleSetActivePlatform(state.platforms, action.payload)
      };
    case SET_LOADING_PLATFORMS:
      return {
        ...state,
        loadingPlatforms: action.payload
      };
    case SET_USER_RANKINGS:
      return {
        ...state,
        userRankings: action.payload
      };
    case SET_FORCED_PROGRAM:
      return {
        ...state,
        isProgramSelectionLocked: !action.payload.unlockSelection,
        ...handleSetForcedProgram(state.platforms, action.payload)
      };
    case SET_REDIRECT_DATA:
      return {
        ...state,
        redirectData: action.payload
      };
    case SET_PROGRAM_USERS:
      return {
        ...state,
        programUsers: action.payload
      };
    case SET_IS_PROGRAM_SELECTION_LOCKED:
      return {
        ...state,
        isProgramSelectionLocked: action.payload
      };
    case SET_POST_CREATED:
      return updateAgendaReloadState(state, action.payload.postType === TASK);
    case RELOAD_AGENDA:
      return updateAgendaReloadState(state, action.payload);
    case SET_LINKED_EMAILS_DATA:
      return {
        ...state,
        linkedEmailsData: action.payload
      };
    case SET_BENEFICIARY_POINTS:
      return {
        ...state,
        beneficiaryPoints: { ...state.beneficiaryPoints, ...action.payload }
      };
    case SET_PROGRAM_DETAILS:
      return { ...state, programDetails: { ...state.programDetails, [action.payload.programId]: action.payload.data } };
    case SET_SELECTED_PLATFORM:
      return {
        ...state,
        selectedPlatform: action.payload
      };
    case SET_USER_LOGGED_IN:
      return action.payload === false ? initialWallState : state;
    default:
      return state;
  }
};

const updateAgendaReloadState = (state, shouldReload) => ({ ...state, agenda: { reload: shouldReload } });
