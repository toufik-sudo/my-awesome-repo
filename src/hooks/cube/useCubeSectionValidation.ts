// -----------------------------------------------------------------------------
// useCubeSectionValidation Hook
// Migrated from old_app/src/hooks/launch/cube/useCubeSectionValidation.ts
// -----------------------------------------------------------------------------

import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { setLaunchDataStep } from '@/store/actions/launchActions';
import { CUBE } from '@/constants/wall/launch';

/**
 * Hook used to handle cube section validation
 */
export const useCubeSectionValidation = (index: number) => {
  const dispatch = useDispatch();
  const cube = useSelector((state: RootState & { launchReducer?: { cube?: any } }) => 
    state.launchReducer?.cube
  );

  const handleItemValidation = (target: string) => {
    if (!cube) return;
    
    const updatedGoals = [...cube.goals];
    updatedGoals[index] = {
      ...updatedGoals[index],
      validated: {
        ...updatedGoals[index].validated,
        [target]: true
      }
    };
    
    dispatch(setLaunchDataStep({ key: CUBE, value: { ...cube, goals: updatedGoals } }));
  };

  return { handleItemValidation };
};

export default useCubeSectionValidation;
