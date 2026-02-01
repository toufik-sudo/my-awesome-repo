// -----------------------------------------------------------------------------
// Wall Reducer
// Migrated from old_app/src/store/reducers/wallReducer.ts
// -----------------------------------------------------------------------------

import { IWallState, ISelectedPlatform, IPlatform } from '../types';
import { PLATFORM_HIERARCHIC_TYPE } from '@/constants/platforms';

// Action types
export const WALL_ACTIONS = {
  SET_PLATFORMS: 'wall/SET_PLATFORMS',
  SET_SUPER_PLATFORMS: 'wall/SET_SUPER_PLATFORMS',
  SET_PROGRAMS: 'wall/SET_PROGRAMS',
  SET_SELECTED_PROGRAM: 'wall/SET_SELECTED_PROGRAM',
  SET_SELECTED_PLATFORM: 'wall/SET_SELECTED_PLATFORM',
  SET_LOADING_PLATFORMS: 'wall/SET_LOADING_PLATFORMS',
  SET_PROGRAM_DETAILS: 'wall/SET_PROGRAM_DETAILS',
  RESET_WALL_STATE: 'wall/RESET_WALL_STATE',
  FORCE_ACTIVE_PROGRAM: 'wall/FORCE_ACTIVE_PROGRAM',
} as const;

// Initial state
const initialSelectedPlatform: ISelectedPlatform = {
  index: null,
  name: '',
  id: undefined,
  role: undefined,
  status: null,
  hierarchicType: undefined,
};

export const initialWallState: IWallState = {
  programs: [],
  platforms: [],
  superPlatforms: [],
  selectedProgramId: undefined,
  selectedProgramIndex: null,
  isProgramSelectionLocked: false,
  selectedProgramName: '',
  selectedProgramDetail: {},
  selectedPlatform: initialSelectedPlatform,
  loadingPlatforms: true,
  programDetails: {},
};

// Action interfaces
interface SetPlatformsAction {
  type: typeof WALL_ACTIONS.SET_PLATFORMS;
  payload: IWallState['platforms'];
}

interface SetSuperPlatformsAction {
  type: typeof WALL_ACTIONS.SET_SUPER_PLATFORMS;
  payload: IPlatform[];
}

interface SetProgramsAction {
  type: typeof WALL_ACTIONS.SET_PROGRAMS;
  payload: IWallState['programs'];
}

interface SetSelectedProgramAction {
  type: typeof WALL_ACTIONS.SET_SELECTED_PROGRAM;
  payload: {
    id: number | undefined;
    index: number | null;
    name: string;
  };
}

interface SetSelectedPlatformAction {
  type: typeof WALL_ACTIONS.SET_SELECTED_PLATFORM;
  payload: ISelectedPlatform;
}

interface SetLoadingPlatformsAction {
  type: typeof WALL_ACTIONS.SET_LOADING_PLATFORMS;
  payload: boolean;
}

interface SetProgramDetailsAction {
  type: typeof WALL_ACTIONS.SET_PROGRAM_DETAILS;
  payload: {
    programId: number;
    details: Record<string, unknown>;
  };
}

interface ResetWallStateAction {
  type: typeof WALL_ACTIONS.RESET_WALL_STATE;
}

interface ForceActiveProgramAction {
  type: typeof WALL_ACTIONS.FORCE_ACTIVE_PROGRAM;
  payload: {
    forcedPlatformId?: number;
    programId?: number;
    unlockSelection?: boolean;
  };
}

type WallAction =
  | SetPlatformsAction
  | SetSuperPlatformsAction
  | SetProgramsAction
  | SetSelectedProgramAction
  | SetSelectedPlatformAction
  | SetLoadingPlatformsAction
  | SetProgramDetailsAction
  | ResetWallStateAction
  | ForceActiveProgramAction;

// Reducer
const wallReducer = (state = initialWallState, action: WallAction): IWallState => {
  switch (action.type) {
    case WALL_ACTIONS.SET_PLATFORMS:
      return {
        ...state,
        platforms: action.payload,
        loadingPlatforms: false,
      };

    case WALL_ACTIONS.SET_SUPER_PLATFORMS:
      return {
        ...state,
        superPlatforms: action.payload,
      };

    case WALL_ACTIONS.SET_PROGRAMS:
      return {
        ...state,
        programs: action.payload,
      };

    case WALL_ACTIONS.SET_SELECTED_PROGRAM:
      return {
        ...state,
        selectedProgramId: action.payload.id,
        selectedProgramIndex: action.payload.index,
        selectedProgramName: action.payload.name,
      };

    case WALL_ACTIONS.SET_SELECTED_PLATFORM:
      return {
        ...state,
        selectedPlatform: action.payload,
      };

    case WALL_ACTIONS.SET_LOADING_PLATFORMS:
      return {
        ...state,
        loadingPlatforms: action.payload,
      };

    case WALL_ACTIONS.SET_PROGRAM_DETAILS:
      return {
        ...state,
        programDetails: {
          ...state.programDetails,
          [action.payload.programId]: action.payload.details,
        },
      };

    case WALL_ACTIONS.RESET_WALL_STATE:
      return initialWallState;

    default:
      return state;
  }
};

export default wallReducer;

// Action creators
export const setPlatforms = (platforms: IWallState['platforms']): SetPlatformsAction => ({
  type: WALL_ACTIONS.SET_PLATFORMS,
  payload: platforms,
});

export const setSuperPlatforms = (platforms: IPlatform[]): SetSuperPlatformsAction => ({
  type: WALL_ACTIONS.SET_SUPER_PLATFORMS,
  payload: platforms,
});

export const setPrograms = (programs: IWallState['programs']): SetProgramsAction => ({
  type: WALL_ACTIONS.SET_PROGRAMS,
  payload: programs,
});

export const setSelectedProgram = (
  id: number | undefined,
  index: number | null,
  name: string
): SetSelectedProgramAction => ({
  type: WALL_ACTIONS.SET_SELECTED_PROGRAM,
  payload: { id, index, name },
});

export const setSelectedPlatform = (platform: ISelectedPlatform): SetSelectedPlatformAction => ({
  type: WALL_ACTIONS.SET_SELECTED_PLATFORM,
  payload: platform,
});

export const setLoadingPlatforms = (loading: boolean): SetLoadingPlatformsAction => ({
  type: WALL_ACTIONS.SET_LOADING_PLATFORMS,
  payload: loading,
});

export const setProgramDetails = (
  programId: number,
  details: Record<string, unknown>
): SetProgramDetailsAction => ({
  type: WALL_ACTIONS.SET_PROGRAM_DETAILS,
  payload: { programId, details },
});

export const resetWallState = (): ResetWallStateAction => ({
  type: WALL_ACTIONS.RESET_WALL_STATE,
});

/**
 * Force active program action creator
 * Used when selecting a platform for program creation
 */
export const forceActiveProgram = (payload: {
  forcedPlatformId?: number;
  programId?: number;
  unlockSelection?: boolean;
}): ForceActiveProgramAction => ({
  type: WALL_ACTIONS.FORCE_ACTIVE_PROGRAM,
  payload,
});
