// -----------------------------------------------------------------------------
// useWallSelection Hook
// Consolidated from old_app and features - single source of truth
// -----------------------------------------------------------------------------

import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { IWallState } from '@/features/wall/types';
import { initialWallState } from '@/features/wall/store/wallReducer';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface WallPlatform {
  id: number;
  name: string;
  role?: string;
  status?: string;
  hierarchicType?: string;
}

export interface WallProgram {
  id: number;
  name: string;
  status?: string;
}

export interface WallSelection {
  selectedPlatform?: WallPlatform;
  selectedProgramId?: number;
  selectedProgramName?: string;
  loadingPlatforms?: boolean;
  platforms?: WallPlatform[];
  programs?: WallProgram[];
}

// -----------------------------------------------------------------------------
// Hooks
// -----------------------------------------------------------------------------

/**
 * Selects full wall reducer state from Redux store
 * Falls back to initial state if wall reducer is not yet added
 */
export const useWallSelection = (): IWallState => {
  return useSelector((state: RootState & { wallReducer?: IWallState }) => 
    state.wallReducer ?? initialWallState
  );
};

/**
 * Returns the current platform id from store
 */
export const usePlatformIdSelection = (): number | undefined => {
  const { selectedPlatform } = useWallSelection();
  return selectedPlatform?.id;
};

/**
 * Returns the current program id from store
 */
export const useProgramIdSelection = (): number | undefined => {
  const { selectedProgramId } = useWallSelection();
  return selectedProgramId;
};

export default useWallSelection;
