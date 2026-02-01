// -----------------------------------------------------------------------------
// useAllocationType Hook
// Handles allocation type selection and form management for goals
// -----------------------------------------------------------------------------

import { useCallback, useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { setLaunchDataStep } from '@/store/actions/launchActions';
import {
  CUBE,
  CUBE_SECTIONS,
  ALLOCATION_TYPES,
  CUBE_ALLOCATION_CATEGORY,
  SIMPLE,
  BRACKET,
  GROWTH,
  RANKING,
  ALLOCATION_MAIN,
  SPONSORSHIP,
} from '@/constants/wall/launch';
import {
  getAllocationTypeFormsAvailability,
  getAllocationTypeId,
  filterAllocationTypes,
  type Cube,
  type Goal,
} from '@/services/CubeServices';

interface UseAllocationTypeReturn {
  // State
  activeTypeForm: string | null;
  allocationType: number | null;
  allocationValidated: boolean;
  allocationValue: { min: string; max: string; value: string };
  cubeFormsAvailable: boolean;
  acceptedTypes: string[];
  currentGoal: Goal;
  programType: string;
  measurementType: number | null;
  measurementName: string | null;

  // Actions
  handleTypeFormSelection: (step: string) => void;
  handleAllocationValidation: () => void;
  handleSimpleAllocationChange: (values: { min: string; max: string; value: string }) => void;
  handleBracketChange: (brackets: Array<{ min: string; max: string; value: string }>) => void;
}

export const useAllocationType = (goalIndex: number): UseAllocationTypeReturn => {
  const dispatch = useDispatch();

  const launchData = useSelector((state: RootState & { launchReducer?: Record<string, unknown> }) =>
    state.launchReducer || {}
  );

  const cube = launchData.cube as Cube;
  const programType = (launchData.type as string) || '';
  const productIds = (launchData.productIds as number[]) || [];
  const categoryIds = (launchData.categoryIds as number[]) || [];

  const currentGoal: Goal = cube?.goals?.[goalIndex] || {
    measurementType: null,
    measurementName: null,
    allocationType: null,
    acceptedTypes: [...CUBE_ALLOCATION_CATEGORY],
    measurementTypesValid: ['QUANTITY', 'VOLUME', 'ACTION'],
    main: { min: '', max: '', value: '' },
    brackets: [],
    validated: { specificProducts: false, measurementType: false, allocationType: false },
    specificProducts: null,
    productIds: [],
  };

  const [activeTypeForm, setActiveTypeForm] = useState<string | null>(null);

  const measurementType = currentGoal?.measurementType ?? null;
  const measurementName = currentGoal?.measurementName ?? null;
  const allocationType = currentGoal?.allocationType ?? null;
  const allocationValidated = currentGoal?.validated?.allocationType || false;
  const allocationValue = currentGoal?.main || { min: '', max: '', value: '' };

  // Check if there are products configured
  const launchDataExtended = launchData as Record<string, unknown>;
  const fullProducts = (launchDataExtended.fullProducts as unknown[]) || [];
  const fullCategoriesProducts = (launchDataExtended.fullCategoriesProducts as unknown[]) || [];
  const hasProductsConfigured = fullProducts.length > 0 || fullCategoriesProducts.length > 0;
  const personaliseProducts = (launchDataExtended.personaliseProducts as boolean) || hasProductsConfigured;

  // Check if allocation forms are available - show after measurement type is validated
  const cubeFormsAvailable = useMemo(() => {
    // Must have measurement type validated first
    if (!currentGoal?.validated?.measurementType) {
      return false;
    }
    
    // If products were configured, also need specific products validated
    if (personaliseProducts && hasProductsConfigured) {
      return currentGoal.validated.specificProducts;
    }
    
    return true;
  }, [currentGoal, personaliseProducts, hasProductsConfigured]);

  // Get accepted allocation types
  const acceptedTypes = useMemo(() => {
    if (!cube?.acceptedCorrelatedGoals?.length || goalIndex === 0) {
      return [...CUBE_ALLOCATION_CATEGORY];
    }

    if (!measurementType) return [];

    return filterAllocationTypes(
      ALLOCATION_TYPES,
      cube.acceptedCorrelatedGoals,
      measurementType,
      goalIndex
    );
  }, [cube?.acceptedCorrelatedGoals, measurementType, goalIndex]);

  // Reset active form when measurement type changes
  useEffect(() => {
    setActiveTypeForm(null);
  }, [measurementType]);

  // Sync active form with current allocation type
  useEffect(() => {
    if (allocationType) {
      // Determine which category this allocation type belongs to
      const category = Object.entries(ALLOCATION_TYPES).find(([key, values]) =>
        Object.values(values).includes(allocationType)
      )?.[0];
      
      if (category) {
        setActiveTypeForm(category);
      }
    }
  }, [allocationType]);

  // Handle type form selection
  const handleTypeFormSelection = useCallback(
    (step: string) => {
      if (!cube || allocationValidated) return;

      const currentAllocationId = getAllocationTypeId(step, measurementType);
      setActiveTypeForm(step);

      const updatedGoals = [...cube.goals];
      updatedGoals[goalIndex] = {
        ...updatedGoals[goalIndex],
        allocationType: currentAllocationId,
      };

      dispatch(setLaunchDataStep({
        key: CUBE,
        value: { ...cube, goals: updatedGoals },
      }));
    },
    [cube, goalIndex, measurementType, allocationValidated, dispatch]
  );

  // Handle allocation validation - toggle validation state
  const handleAllocationValidation = useCallback(() => {
    if (!cube) return;

    const currentValidated = cube.goals[goalIndex]?.validated?.allocationType || false;
    const updatedGoals = [...cube.goals];
    
    updatedGoals[goalIndex] = {
      ...updatedGoals[goalIndex],
      validated: {
        ...updatedGoals[goalIndex].validated,
        allocationType: !currentValidated,
      },
    };

    dispatch(setLaunchDataStep({
      key: CUBE,
      value: { ...cube, goals: updatedGoals },
    }));
  }, [cube, goalIndex, dispatch]);

  // Handle simple allocation change
  const handleSimpleAllocationChange = useCallback(
    (values: { min: string; max: string; value: string }) => {
      if (!cube) return;

      const updatedGoals = [...cube.goals];
      updatedGoals[goalIndex] = {
        ...updatedGoals[goalIndex],
        main: values,
      };

      dispatch(setLaunchDataStep({
        key: CUBE,
        value: { ...cube, goals: updatedGoals },
      }));
    },
    [cube, goalIndex, dispatch]
  );

  // Handle bracket change
  const handleBracketChange = useCallback(
    (brackets: Array<{ min: string; max: string; value: string }>) => {
      if (!cube) return;

      const updatedGoals = [...cube.goals];
      updatedGoals[goalIndex] = {
        ...updatedGoals[goalIndex],
        brackets: brackets.map((b) => ({
          ...b,
          status: 'available',
          errors: { min: '', max: '', equals: '' },
        })),
      };

      dispatch(setLaunchDataStep({
        key: CUBE,
        value: { ...cube, goals: updatedGoals },
      }));
    },
    [cube, goalIndex, dispatch]
  );

  return {
    activeTypeForm,
    allocationType,
    allocationValidated,
    allocationValue,
    cubeFormsAvailable,
    acceptedTypes,
    currentGoal,
    programType,
    measurementType,
    measurementName,
    handleTypeFormSelection,
    handleAllocationValidation,
    handleSimpleAllocationChange,
    handleBracketChange,
  };
};

export default useAllocationType;
