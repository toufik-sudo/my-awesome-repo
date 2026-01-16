import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useMultiStep } from 'hooks/launch/useMultiStep';
import { IStore } from 'interfaces/store/IStore';
import { getAllocationTypes, isLastStepValidated, isMaximumGoalsAchieved } from 'services/CubeServices';
import { createNewGoal } from 'store/actions/launchActions';

/**
 * Hook used to handle cube controls (add goal and next)
 *
 * @param goal
 * @param index
 * @param setSelectedGoal
 */
export const useCubeControls = (goal, index, setSelectedGoal) => {
  const {
    stepSet: { setNextStep }
  } = useMultiStep();
  const launchStore = useSelector((store: IStore) => store.launchReducer);
  const { cube } = launchStore;
  const goalsLength = cube.goals.length;
  const isAllFormsValidated = cube.goals[goalsLength - 1].validated.allocationType;
  const correlated = cube.correlated;
  const [isLoading, setIsLoading] = useState(false);
  const addGoalVisible =
    isLastStepValidated(goal) && isMaximumGoalsAchieved(cube) && goalsLength - 1 === index && isAllFormsValidated;
  const dispatch = useDispatch();
  const correlatedValid = correlated && isAllFormsValidated && cube.goals.length > 1;
  const notCorrelatedValid = !correlated && isAllFormsValidated;

  const handleCreateNewGoal = () => {
    const processCubeAllocations = getAllocationTypes(cube);
    dispatch(createNewGoal(processCubeAllocations, launchStore, setIsLoading));
    setSelectedGoal(goalsLength + 1);
  };

  return {
    setNextStep,
    isLoading,
    addGoalVisible,
    handleCreateNewGoal,
    isAllFormsValidated,
    correlatedValid,
    notCorrelatedValid
  };
};
