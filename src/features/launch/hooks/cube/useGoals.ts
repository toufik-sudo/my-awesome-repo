// -----------------------------------------------------------------------------
// useGoals Hook
// Manages goals state for the Rewards & Goals step
// -----------------------------------------------------------------------------

import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { setLaunchDataStep } from '@/store/actions/launchActions';
import {
  CUBE,
  MAXIMUM_GOALS_NUMBER,
} from '@/constants/wall/launch';
import {
  buildGoalData,
  getAllocationTypes,
  isLastStepValidated,
  isMaximumGoalsAchieved,
  type Goal,
  type Cube,
} from '@/services/CubeServices';
import { launchApi } from '@/api/LaunchApi';
import { INSTANT, SPONSORSHIP, VOLUME } from '@/constants/wall/launch';

interface UseGoalsReturn {
  goals: Goal[];
  cube: Cube;
  selectedGoalIndex: number;
  canAddGoal: boolean;
  totalGoals: number;
  maxGoals: number;
  isAllGoalsValidated: boolean;
  isCorrelated: boolean;
  addGoal: () => Promise<void>;
  removeGoal: () => Promise<void>;
  selectGoal: (index: number) => void;
  validateGoalSection: (goalIndex: number, section: keyof Goal['validated']) => void;
  resetGoal: (goalIndex: number) => void;
  isGoalComplete: (goalIndex: number) => boolean;
  getGoalProgress: (goalIndex: number) => number;
}

export const useGoals = (): UseGoalsReturn => {
  const dispatch = useDispatch();
  
  const launchData = useSelector((state: RootState & { launchReducer?: Record<string, unknown> }) =>
    state.launchReducer || {}
  );
  
  const cube = (launchData.cube || {
    goals: [buildGoalData()],
    acceptedCorrelatedGoals: [],
    cubeValidated: {
      frequencyAllocation: false,
      spendType: false,
      validityPoints: false,
      rewardPeopleManagers: false,
    },
    frequencyAllocation: '',
    spendType: '',
    rewardPeopleManagers: 0,
    rewardPeopleManagerAccepted: true,
    validityPoints: { value: '1y', label: '1 Year' },
    correlated: false,
  }) as Cube;

  const goals = cube.goals || [buildGoalData()];
  const selectedGoalIndex = (launchData.selectedGoalIndex as number) || 0;
  const programType = launchData.type as string;
  const isCorrelated = cube.correlated || false;

  // Check if all goals are fully validated (allocation type validated)
  const isAllGoalsValidated = useMemo(() => {
    if (goals.length === 0) return false;
    return goals.every((goal) => goal.validated.allocationType);
  }, [goals]);

  // Check if we can add more goals:
  // 1. Not at max goals limit
  // 2. Last goal must have allocation validated (fully complete)
  const canAddGoal = useMemo(() => {
    if (goals.length >= MAXIMUM_GOALS_NUMBER) return false;
    
    const lastGoal = goals[goals.length - 1];
    if (!lastGoal) return false;
    
    // Last goal must have allocation type validated to add a new goal
    return lastGoal.validated.allocationType === true;
  }, [goals]);

  // Select a goal
  const selectGoal = useCallback((index: number) => {
    dispatch(setLaunchDataStep({ key: 'selectedGoalIndex', value: index }));
  }, [dispatch]);

  // Add a new goal
  const addGoal = useCallback(async () => {
    if (!canAddGoal) return;

    try {
      const processCubeAllocations = getAllocationTypes(cube);
      
      // Get accepted allocation types from API
      let acceptedAllocationTypes = await launchApi.getPossibleAllocationTypes({
        goals: processCubeAllocations,
        frequencyOfPointsAllocation: INSTANT,
        correlatedGoals: isCorrelated,
      });

      // Filter out volume for sponsorship programs
      if (programType === SPONSORSHIP) {
        acceptedAllocationTypes = acceptedAllocationTypes.filter(
          (type: { measurementType: string }) => 
            type.measurementType.toLowerCase() !== VOLUME.toLowerCase()
        );
      }

      const newGoals = [...goals, buildGoalData()];
      
      dispatch(setLaunchDataStep({
        key: CUBE,
        value: {
          ...cube,
          goals: newGoals,
          acceptedCorrelatedGoals: acceptedAllocationTypes,
        },
      }));

      // Select the new goal
      selectGoal(newGoals.length - 1);
    } catch (error) {
      console.error('Failed to add goal:', error);
    }
  }, [canAddGoal, cube, goals, isCorrelated, programType, dispatch, selectGoal]);

  // Remove the last goal
  const removeGoal = useCallback(async () => {
    if (goals.length <= 1) return;

    try {
      const processCubeAllocations = getAllocationTypes(cube);
      // Remove last goal's allocation
      if (processCubeAllocations.length > 1) {
        processCubeAllocations.pop();
      }

      const acceptedAllocationTypes = await launchApi.getPossibleAllocationTypes({
        goals: processCubeAllocations,
        frequencyOfPointsAllocation: INSTANT,
        correlatedGoals: isCorrelated,
      });

      const newGoals = goals.slice(0, -1);
      
      dispatch(setLaunchDataStep({
        key: CUBE,
        value: {
          ...cube,
          goals: newGoals,
          acceptedCorrelatedGoals: acceptedAllocationTypes,
        },
      }));

      // Select last goal if current is out of range
      if (selectedGoalIndex >= newGoals.length) {
        selectGoal(newGoals.length - 1);
      }
    } catch (error) {
      console.error('Failed to remove goal:', error);
    }
  }, [goals, cube, isCorrelated, selectedGoalIndex, dispatch, selectGoal]);

  // Validate a section of a goal
  const validateGoalSection = useCallback(
    (goalIndex: number, section: keyof Goal['validated']) => {
      const updatedGoals = [...goals];
      updatedGoals[goalIndex] = {
        ...updatedGoals[goalIndex],
        validated: {
          ...updatedGoals[goalIndex].validated,
          [section]: !updatedGoals[goalIndex].validated[section],
        },
      };
      
      dispatch(setLaunchDataStep({
        key: CUBE,
        value: { ...cube, goals: updatedGoals },
      }));
    },
    [goals, cube, dispatch]
  );

  // Reset a goal
  const resetGoal = useCallback(
    (goalIndex: number) => {
      const updatedGoals = [...goals];
      updatedGoals[goalIndex] = buildGoalData();
      
      dispatch(setLaunchDataStep({
        key: CUBE,
        value: { ...cube, goals: updatedGoals },
      }));
    },
    [goals, cube, dispatch]
  );

  // Check if goal is complete
  const isGoalComplete = useCallback(
    (goalIndex: number): boolean => {
      const goal = goals[goalIndex];
      if (!goal) return false;
      return goal.validated.allocationType;
    },
    [goals]
  );

  // Get goal progress percentage
  const getGoalProgress = useCallback(
    (goalIndex: number): number => {
      const goal = goals[goalIndex];
      if (!goal) return 0;

      const sections = Object.values(goal.validated);
      const validated = sections.filter(Boolean).length;
      return Math.round((validated / sections.length) * 100);
    },
    [goals]
  );

  return {
    goals,
    cube,
    selectedGoalIndex,
    canAddGoal,
    totalGoals: goals.length,
    maxGoals: MAXIMUM_GOALS_NUMBER,
    isAllGoalsValidated,
    isCorrelated,
    addGoal,
    removeGoal,
    selectGoal,
    validateGoalSection,
    resetGoal,
    isGoalComplete,
    getGoalProgress,
  };
};

export default useGoals;
