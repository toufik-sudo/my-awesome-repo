// -----------------------------------------------------------------------------
// useGoalAllocation Hook
// Manages goal configuration with product/measurement type constraints
// -----------------------------------------------------------------------------

import { useState, useCallback, useMemo } from 'react';
import type { 
  GoalAllocation, 
  Product, 
  MeasurementType, 
  AllocationType,
  UsedCombination 
} from '@/types/goals';
import { 
  createEmptyGoal, 
  MIN_GOALS, 
  MAX_GOALS,
  GENERAL_PRODUCT 
} from '@/constants/goals';

interface UseGoalAllocationProps {
  configuredProducts?: Product[];
  onGoalsChange?: (goals: GoalAllocation[]) => void;
}

export const useGoalAllocation = ({ 
  configuredProducts = [], 
  onGoalsChange 
}: UseGoalAllocationProps = {}) => {
  const [goals, setGoals] = useState<GoalAllocation[]>([createEmptyGoal()]);

  // Available products: configured products + general product
  const products = useMemo(() => {
    if (configuredProducts.length > 0) {
      return [GENERAL_PRODUCT, ...configuredProducts];
    }
    return [GENERAL_PRODUCT];
  }, [configuredProducts]);

  // Track used product/measurement combinations across all goals
  const usedCombinations = useMemo<UsedCombination[]>(() => {
    return goals
      .filter(goal => goal.productId && goal.measurementType && goal.validated.measurementType)
      .map(goal => ({
        productId: goal.productId,
        measurementType: goal.measurementType!
      }));
  }, [goals]);

  // Get disabled measurement types for a specific goal and product
  const getDisabledMeasurementTypes = useCallback(
    (goalIndex: number, productId: string): MeasurementType[] => {
      if (!productId) return [];
      
      // Find all measurement types used by other goals with the same product
      return usedCombinations
        .filter((combo, idx) => {
          // Find the goal index for this combination
          const comboGoalIndex = goals.findIndex(
            (g, i) => 
              g.productId === combo.productId && 
              g.measurementType === combo.measurementType &&
              g.validated.measurementType
          );
          // Exclude current goal's own combination
          return combo.productId === productId && comboGoalIndex !== goalIndex;
        })
        .map(combo => combo.measurementType);
    },
    [usedCombinations, goals]
  );

  // Check if a specific product/measurement combination is available
  const isCombinationAvailable = useCallback(
    (productId: string, measurementType: MeasurementType, excludeGoalIndex?: number): boolean => {
      return !goals.some((goal, index) => {
        if (excludeGoalIndex !== undefined && index === excludeGoalIndex) return false;
        return (
          goal.productId === productId && 
          goal.measurementType === measurementType &&
          goal.validated.measurementType
        );
      });
    },
    [goals]
  );

  // Add a new goal
  const addGoal = useCallback(() => {
    if (goals.length >= MAX_GOALS) return;
    
    const newGoals = [...goals, createEmptyGoal()];
    setGoals(newGoals);
    onGoalsChange?.(newGoals);
  }, [goals, onGoalsChange]);

  // Remove a goal
  const removeGoal = useCallback((index: number) => {
    if (goals.length <= MIN_GOALS) return;
    
    const newGoals = goals.filter((_, i) => i !== index);
    setGoals(newGoals);
    onGoalsChange?.(newGoals);
  }, [goals, onGoalsChange]);

  // Update a goal
  const updateGoal = useCallback((index: number, updates: Partial<GoalAllocation>) => {
    setGoals(prevGoals => {
      const newGoals = [...prevGoals];
      const currentGoal = newGoals[index];
      
      // If product changes, reset measurement and allocation
      if (updates.productId && updates.productId !== currentGoal.productId) {
        newGoals[index] = {
          ...currentGoal,
          productId: updates.productId,
          measurementType: null,
          allocationType: null,
          allocationValue: undefined,
          validated: {
            product: true,
            measurementType: false,
            allocationType: false
          }
        };
      }
      // If measurement type changes, reset allocation
      else if (updates.measurementType && updates.measurementType !== currentGoal.measurementType) {
        newGoals[index] = {
          ...currentGoal,
          measurementType: updates.measurementType,
          allocationType: null,
          allocationValue: undefined,
          validated: {
            ...currentGoal.validated,
            measurementType: true,
            allocationType: false
          }
        };
      }
      // Otherwise, merge updates
      else {
        newGoals[index] = {
          ...currentGoal,
          ...updates,
          validated: {
            ...currentGoal.validated,
            ...(updates.validated || {})
          }
        };
      }
      
      onGoalsChange?.(newGoals);
      return newGoals;
    });
  }, [onGoalsChange]);

  // Validate a specific field of a goal
  const validateGoalField = useCallback((
    index: number, 
    field: keyof GoalAllocation['validated']
  ) => {
    setGoals(prevGoals => {
      const newGoals = [...prevGoals];
      newGoals[index] = {
        ...newGoals[index],
        validated: {
          ...newGoals[index].validated,
          [field]: true
        }
      };
      onGoalsChange?.(newGoals);
      return newGoals;
    });
  }, [onGoalsChange]);

  // Check if a goal is complete
  const isGoalComplete = useCallback((index: number): boolean => {
    const goal = goals[index];
    if (!goal) return false;
    
    return (
      !!goal.productId &&
      !!goal.measurementType &&
      !!goal.allocationType &&
      goal.validated.product &&
      goal.validated.measurementType &&
      goal.validated.allocationType
    );
  }, [goals]);

  // Check if all goals are complete
  const areAllGoalsComplete = useMemo(() => {
    return goals.length >= MIN_GOALS && goals.every((_, i) => isGoalComplete(i));
  }, [goals, isGoalComplete]);

  // Can add more goals
  const canAddGoal = goals.length < MAX_GOALS && isGoalComplete(goals.length - 1);

  // Can remove goals
  const canRemoveGoal = goals.length > MIN_GOALS;

  return {
    goals,
    products,
    addGoal,
    removeGoal,
    updateGoal,
    validateGoalField,
    getDisabledMeasurementTypes,
    isCombinationAvailable,
    canAddGoal,
    canRemoveGoal,
    isGoalComplete,
    areAllGoalsComplete
  };
};
