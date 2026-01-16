/* eslint-disable quotes */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { IStore } from 'interfaces/store/IStore';
import { getAllocationTypeFormsAvailability, getAllocationTypeId } from 'services/CubeServices';
import { ALLOCATION_TYPE } from 'constants/wall/launch';

/**
 * Hook used to handle cube allocation type forms
 *
 * @param cube
 * @param handleAllocationTypeSelection
 * @param index
 */
export const useCubeTypeForms = (cube, handleAllocationTypeSelection, index) => {
  const currentGoal = cube.goals[index];
  const { productIds, categoryIds, type } = useSelector((store: IStore) => store.launchReducer);
  const [activeTypeForm, setActiveTypeForm] = useState<null | string>(null);
  const cubeFormsAvailable = getAllocationTypeFormsAvailability(currentGoal, type, productIds, categoryIds);

  useEffect(() => {
    setActiveTypeForm(null);
  }, [currentGoal.measurementType]);

  useEffect(() => {
    setActiveTypeForm(currentGoal[ALLOCATION_TYPE]);
  }, [currentGoal[ALLOCATION_TYPE]]);

  const handleTypeFormSelection = step => {
    const currentAllocationId = getAllocationTypeId(step, currentGoal.measurementType);
    handleAllocationTypeSelection(index, currentAllocationId);
    setActiveTypeForm(currentAllocationId);
  };

  return {
    cubeFormsAvailable,
    activeTypeForm,
    type,
    setActiveTypeForm,
    handleTypeFormSelection,
    currentGoal
  };
};
