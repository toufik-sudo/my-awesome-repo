import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { BRACKET_INPUT_TYPE, CUBE_SECTIONS, DISABLED, INITIAL_BRACKET_VALUES } from 'constants/wall/launch';
import { IStore } from 'interfaces/store/IStore';
import { useCubeSectionValidation } from 'hooks/launch/cube/useCubeSectionValidation';
import {
  getAllBracketsErrors,
  getDisabledBracket,
  getOnlyAvailableBrackets,
  getProcessedBrackets,
  setBracketStatusAvailable
} from 'services/CubeServices';
import { setBracketValues } from 'store/actions/launchActions';
import { useBracket } from 'hooks/launch/cube/allocation/useBracket';
import { useBracketStoreAdd } from 'hooks/launch/cube/allocation/useBracketStoreAdd';

/**
 * Hook used to handle bracket allocation data
 *
 * @param goalIndex
 * @param fieldLabels
 */
export const useBracketAllocation = (goalIndex, fieldLabels) => {
  const dispatch = useDispatch();
  const [bracketsData, setBracketsData] = useState([...INITIAL_BRACKET_VALUES]);
  const { cube } = useSelector((store: IStore) => store.launchReducer);
  const { handleItemValidation } = useCubeSectionValidation(goalIndex);
  const { handleBracketValidation } = useBracket(goalIndex, bracketsData, setBracketsData, BRACKET_INPUT_TYPE);

  useBracketStoreAdd(goalIndex, setBracketsData);

  const bootstrapBracketSelection = () => {
    const onlyAvailableData = getOnlyAvailableBrackets(bracketsData);
    const processedData = getProcessedBrackets(onlyAvailableData);
    const bracketErrors = getAllBracketsErrors(onlyAvailableData, handleBracketValidation, fieldLabels);
    setBracketValues(goalIndex, processedData, dispatch, cube);
    if (bracketErrors.length) return null;
    handleItemValidation(CUBE_SECTIONS.ALLOCATION_TYPE);
  };

  useEffect(() => {
    const disabledBracket = getDisabledBracket(bracketsData);
    const indexOfDisabledBracket = bracketsData.indexOf(disabledBracket);
    const lastAvailableBracket = bracketsData[indexOfDisabledBracket - 1];
    const lastBracket = bracketsData[bracketsData.length - 1];
    const bracketCanBeAvailable = lastAvailableBracket && lastAvailableBracket.max && lastBracket.status === DISABLED;
    if (bracketCanBeAvailable) {
      const updatedBracketsData = setBracketStatusAvailable(bracketsData, indexOfDisabledBracket, disabledBracket);
      setBracketsData([...updatedBracketsData]);
    }
  }, [bracketsData]);

  return { bootstrapBracketSelection, setBracketsData, bracketsData };
};
