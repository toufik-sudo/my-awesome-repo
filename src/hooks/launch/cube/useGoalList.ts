/* eslint-disable quotes */
import { useDispatch, useSelector } from 'react-redux';

import { IStore } from 'interfaces/store/IStore';
import { setAllocationType, setMechanismType, setSpecificProducts } from 'store/actions/launchActions';
import { ALLOCATION_TYPE } from 'constants/wall/launch';

/**
 * Hook used to handle goal list (selection)
 */
export const useGoalList = () => {
  const launch = useSelector((store: IStore) => store.launchReducer);
  const { cube } = launch;
  const dispatch = useDispatch();
  const handleSpecificProductsSelection = (index, state) => setSpecificProducts(index, state, dispatch, launch);
  const handleMethodMechanismSelection = (index, state) => setMechanismType(index, state, dispatch, cube);
  const handleAllocationTypeSelection = (index, state) =>
    setAllocationType(index, state, dispatch, cube, ALLOCATION_TYPE);

  return { handleSpecificProductsSelection, handleMethodMechanismSelection, cube, handleAllocationTypeSelection };
};
