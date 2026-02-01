// -----------------------------------------------------------------------------
// useBracketAllocation Hook
// Migrated from old_app/src/hooks/launch/cube/allocation/useBracketAllocation.ts
// -----------------------------------------------------------------------------

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { BRACKET_INPUT_TYPE, CUBE_SECTIONS, DISABLED, INITIAL_BRACKET_VALUES } from '@/constants/wall/launch';
import type { RootState } from '@/store';
import { useCubeSectionValidation } from './useCubeSectionValidation';
import {
  getAllBracketsErrors,
  getDisabledBracket,
  getOnlyAvailableBrackets,
  getProcessedBrackets,
  setBracketStatusAvailable,
  type IBracket
} from '@/services/cube/CubeServices';
import { setBracketValues } from '@/store/actions/launchActions';
import { useBracket } from './useBracket';
import { useBracketStoreAdd } from './useBracketStoreAdd';

/**
 * Hook used to handle bracket allocation data
 */
export const useBracketAllocation = (
  goalIndex: number,
  fieldLabels: Record<string, { validations: any }>
) => {
  const dispatch = useDispatch();
  const [bracketsData, setBracketsData] = useState<IBracket[]>([...(INITIAL_BRACKET_VALUES as unknown as IBracket[])]);
  
  const cube = useSelector((state: RootState & { launchReducer?: { cube?: any } }) => 
    state.launchReducer?.cube
  );
  
  const { handleItemValidation } = useCubeSectionValidation(goalIndex);
  const { handleBracketValidation } = useBracket(goalIndex, bracketsData, setBracketsData, BRACKET_INPUT_TYPE);

  useBracketStoreAdd(goalIndex, setBracketsData);

  const bootstrapBracketSelection = () => {
    const onlyAvailableData = getOnlyAvailableBrackets(bracketsData);
    const processedData = getProcessedBrackets(onlyAvailableData);
    const bracketErrors = getAllBracketsErrors(onlyAvailableData, handleBracketValidation, fieldLabels);
    
    if (cube) {
      setBracketValues(goalIndex, processedData, dispatch, cube);
    }
    
    if (bracketErrors.length) return null;
    handleItemValidation(CUBE_SECTIONS.ALLOCATION_TYPE);
  };

  useEffect(() => {
    const disabledBracket = getDisabledBracket(bracketsData);
    if (!disabledBracket) return;
    
    const indexOfDisabledBracket = bracketsData.indexOf(disabledBracket);
    const lastAvailableBracket = bracketsData[indexOfDisabledBracket - 1];
    const lastBracket = bracketsData[bracketsData.length - 1];
    const bracketCanBeAvailable = lastAvailableBracket?.max && lastBracket?.status === DISABLED;
    
    if (bracketCanBeAvailable) {
      const updatedBracketsData = setBracketStatusAvailable(bracketsData, indexOfDisabledBracket, disabledBracket);
      setBracketsData([...updatedBracketsData]);
    }
  }, [bracketsData]);

  return { bootstrapBracketSelection, setBracketsData, bracketsData };
};

export default useBracketAllocation;
