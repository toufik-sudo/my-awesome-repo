// -----------------------------------------------------------------------------
// useBracketLabels Hook
// Migrated from old_app/src/hooks/launch/cube/allocation/useBracketLabels.ts
// -----------------------------------------------------------------------------

import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { getBracketFieldsLabels, getBracketType } from '@/services/cube/CubeServices';

/**
 * Hook used to handle bracket labels
 */
export const useBracketLabels = (goalIndex: number, inputType: Record<string, any>) => {
  const launchState = useSelector((state: RootState & { launchReducer?: { type?: string; cube?: any } }) => 
    state.launchReducer
  );
  
  const type = launchState?.type || '';
  const cube = launchState?.cube;
  const currentGoal = cube?.goals?.[goalIndex];
  const measurementType = currentGoal?.measurementType;
  const bracketFormType = getBracketType(type, measurementType);
  const fieldLabels = getBracketFieldsLabels(
    typeof bracketFormType === 'string' ? bracketFormType : '', 
    type, 
    inputType
  );

  return { fieldLabels };
};

export default useBracketLabels;
