// -----------------------------------------------------------------------------
// useWallSelection Hook
// Migrated from old_app/src/hooks/wall/useWallSelection.ts
// -----------------------------------------------------------------------------

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { IWallState } from '../types';
import { initialWallState } from '../store/wallReducer';

/**
 * Selects wall reducer data from the store
 * Falls back to initial state if wall reducer is not yet added
 */
export const useWallSelection = (): IWallState => {
  return useSelector((state: RootState & { wallReducer?: IWallState }) => 
    state.wallReducer ?? initialWallState
  );
};

export default useWallSelection;
