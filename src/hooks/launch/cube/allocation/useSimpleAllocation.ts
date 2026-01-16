import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import StringUtilities from 'utils/StringUtilities';
import { IStore } from 'interfaces/store/IStore';
import { getKeyByValue } from 'utils/general';
import { ALLOCATION_MAIN, CUBE_SECTIONS, MEASUREMENT_TYPES } from 'constants/wall/launch';
import { setAllocationType } from 'store/actions/launchActions';
import { useCubeSectionValidation } from 'hooks/launch/cube/useCubeSectionValidation';
import { processSimpleAllocationValues } from 'services/CubeServices';

const stringUtilities = new StringUtilities();

/**
 * Hook used to handle simple allocation form
 *
 * @param index
 */
export const useSimpleAllocation = index => {
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const { handleItemValidation } = useCubeSectionValidation(index);
  const { type, cube } = useSelector((store: IStore) => store.launchReducer);
  const currentGoal = cube.goals[index];
  const allocationType = currentGoal.validated.allocationType;
  const measurementType = currentGoal.measurementType;
  const allocationValue = currentGoal.main;
  const measurementTypeKey = measurementType ? getKeyByValue(MEASUREMENT_TYPES, measurementType).toLowerCase() : '';
  const programBudget = useSelector<IStore>((store: IStore) => store.launchReducer.programBudget);

  const handleSimplifiedAllocation = (index, values) => {
    const processedAllocation = processSimpleAllocationValues(values);
    const decimalMin = parseFloat(stringUtilities.decimalReplace(processedAllocation.min));
    const decimalMax = parseFloat(stringUtilities.decimalReplace(processedAllocation.max));
    if (decimalMin >= decimalMax) return setError('launchProgram.cube.minMax.error');
    if (processedAllocation.value > programBudget) return setError('launchProgram.cube.budget.error');

    setError('');
    handleItemValidation(CUBE_SECTIONS.ALLOCATION_TYPE);
    setAllocationType(index, processedAllocation, dispatch, cube, ALLOCATION_MAIN);
  };

  return { type, measurementTypeKey, allocationType, handleSimplifiedAllocation, allocationValue, error };
};
