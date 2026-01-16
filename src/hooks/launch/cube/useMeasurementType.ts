/* eslint-disable quotes */
import { useDispatch, useSelector } from 'react-redux';

import { IStore } from 'interfaces/store/IStore';
import { CUBE, CUBE_SECTIONS, INITIAL_BRACKET_VALUES, SIMPLIFIED_CUBE_TYPE, SPONSORSHIP } from 'constants/wall/launch';
import { useCubeSectionValidation } from 'hooks/launch/cube/useCubeSectionValidation';
import { setLaunchDataStep } from 'store/actions/launchActions';

/**
 * Hook used to handle measurement type data
 *
 * @param cube
 * @param index
 */
export const useMeasurementType = (cube, index) => {
  const dispatch = useDispatch();
  const { type, productIds, categoryIds } = useSelector((store: IStore) => store.launchReducer);
  const { handleItemValidation } = useCubeSectionValidation(index);

  const getMeasurementTypeVisibleState = () => {
    if (!type) {
      return null;
    }
    const isSpecificProductsAndValidated =
      type !== SPONSORSHIP && cube.goals[index].validated[CUBE_SECTIONS.SPECIFIC_PRODUCTS];

    return type !== SPONSORSHIP || isSpecificProductsAndValidated || null;
  };

  const handleMeasurementTypeValidation = target => {
    handleItemValidation(target);
    const updatedGoals = cube.goals;
    updatedGoals[index][CUBE_SECTIONS.ALLOCATION_TYPE] = null;
    updatedGoals[index].validated[CUBE_SECTIONS.ALLOCATION_TYPE] = false;
    updatedGoals[index].brackets = INITIAL_BRACKET_VALUES;
    updatedGoals[index].main = {
      [SIMPLIFIED_CUBE_TYPE.MIN]: '',
      [SIMPLIFIED_CUBE_TYPE.MAX]: '',
      [SIMPLIFIED_CUBE_TYPE.VALUE]: ''
    };
    dispatch(setLaunchDataStep({ key: CUBE, value: { ...cube, goals: updatedGoals } }));
  };

  return { type, getMeasurementTypeVisibleState, productIds, handleMeasurementTypeValidation, categoryIds };
};
