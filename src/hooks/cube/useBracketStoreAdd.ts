// -----------------------------------------------------------------------------
// useBracketStoreAdd Hook
// Migrated from old_app/src/hooks/launch/cube/allocation/useBracketStoreAdd.ts
// -----------------------------------------------------------------------------

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { addAdditionalDisabledBracket, getBracketDisplayReady, type IBracket } from '@/services/cube/CubeServices';

/**
 * Hook used to handle store bracket addition on local state
 */
export const useBracketStoreAdd = (
  goalIndex: number,
  setBracketsData: (data: IBracket[]) => void
) => {
  const cube = useSelector((state: RootState & { launchReducer?: { cube?: any } }) => 
    state.launchReducer?.cube
  );

  useEffect(() => {
    if (cube?.goals?.[goalIndex]?.brackets?.length) {
      let displayBracketsData = getBracketDisplayReady(cube.goals[goalIndex].brackets);
      displayBracketsData = addAdditionalDisabledBracket(displayBracketsData);
      setBracketsData(displayBracketsData);
    }
  }, [cube?.goals?.[goalIndex]]);
};

export default useBracketStoreAdd;
