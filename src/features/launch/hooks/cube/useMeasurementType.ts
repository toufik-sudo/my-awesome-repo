// -----------------------------------------------------------------------------
// useMeasurementType Hook
// Handles measurement type selection for goals
// -----------------------------------------------------------------------------

import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { setLaunchDataStep } from '@/store/actions/launchActions';
import {
  CUBE,
  CUBE_SECTIONS,
  MEASUREMENT_TYPES,
  MEASUREMENT_NAMES,
  INITIAL_BRACKET_VALUES,
  SIMPLIFIED_CUBE_TYPE,
  SPONSORSHIP,
} from '@/constants/wall/launch';
import { buildGoalData, type Cube, type Goal } from '@/services/CubeServices';

interface UseMeasurementTypeReturn {
  // State
  programType: string;
  measurementType: number | null;
  measurementName: string | null;
  measurementTypeValidated: boolean;
  productIds: number[];
  categoryIds: number[];
  isMeasurementTypeVisible: boolean;
  currentMeasurementTypes: string[];
  isDisabledMeasurementTypes: Record<string, boolean>;

  // Actions
  handleMeasurementTypeSelection: (type: number) => void;
  handleValidation: () => void;
}

export const useMeasurementType = (goalIndex: number): UseMeasurementTypeReturn => {
  const dispatch = useDispatch();

  const launchData = useSelector((state: RootState & { launchReducer?: Record<string, unknown> }) =>
    state.launchReducer || {}
  );

  const cube = launchData.cube as Cube;
  const programType = (launchData.type as string) || '';
  const productIds = (launchData.productIds as number[]) || [];
  const categoryIds = (launchData.categoryIds as number[]) || [];

  const currentGoal = cube?.goals?.[goalIndex];
  const measurementType = currentGoal?.measurementType ?? null;
  const measurementName = currentGoal?.measurementName ?? null;
  const measurementTypeValidated = currentGoal?.validated?.measurementType || false;
  const specificProductsValidated = currentGoal?.validated?.specificProducts || false;

  // Check if there are products configured in launch data
  const fullProducts = (launchData.fullProducts as unknown[]) || [];
  const fullCategoriesProducts = (launchData.fullCategoriesProducts as unknown[]) || [];
  const hasProductsConfigured = fullProducts.length > 0 || fullCategoriesProducts.length > 0;
  const personaliseProducts = (launchData.personaliseProducts as boolean) || hasProductsConfigured;

  // Determine if measurement type section should be visible
  const isMeasurementTypeVisible = useMemo(() => {
    if (!programType) return false;
    
    // If products were configured (personalise products), require product selection to be validated first
    if (personaliseProducts && hasProductsConfigured) {
      return specificProductsValidated;
    }
    
    // If no products configured, show measurement type directly
    return true;
  }, [programType, specificProductsValidated, personaliseProducts, hasProductsConfigured]);

  // Get available measurement types
  const currentMeasurementTypes = useMemo(() => {
    // Default measurement types
    const types = ['QUANTITY', 'VOLUME'];
    
    // Add ACTION type for certain program types
    if (programType !== SPONSORSHIP) {
      types.push('ACTION');
    }
    
    return types;
  }, [programType]);

  // Calculate disabled measurement types based on product overlap with previous goals
  // Key logic: If a product is selected in this goal AND in a previous goal, 
  // the measurement type used by that previous goal for that product should be disabled
  const isDisabledMeasurementTypes = useMemo(() => {
    const disabled: Record<string, boolean> = {
      VOLUME: false,
      QUANTITY: false,
      ACTION: false,
    };
    
    if (goalIndex === 0 || !cube?.goals) {
      return disabled;
    }
    
    const currentGoalProductIds = currentGoal?.productIds || [];
    const currentGoalIsGeneric = currentGoal?.specificProducts === false;
    
    // Get previous goals
    const previousGoals = cube.goals.filter((_, i) => i < goalIndex);
    
    // Check each measurement type
    currentMeasurementTypes.forEach((measurementTypeKey) => {
      const measurementTypeLowerCase = measurementTypeKey.toLowerCase();
      
      // Check if this goal uses specific products
      if (currentGoal?.specificProducts && currentGoalProductIds.length > 0) {
        // For each product in the current goal
        currentGoalProductIds.forEach((prodId) => {
          // Check if any previous goal has this product with a measurement type
          previousGoals.forEach((prevGoal) => {
            if (
              prevGoal.specificProducts && 
              prevGoal.productIds?.includes(prodId) &&
              prevGoal.validated?.measurementType
            ) {
              // Get the measurement name of the previous goal
              const prevMeasurementName = prevGoal.measurementName;
              
              // If this product was used with this measurement type, disable it
              if (prevMeasurementName === measurementTypeLowerCase) {
                // ACTION and QUANTITY are interchangeable (both are count-based)
                if (measurementTypeLowerCase === 'action' || measurementTypeLowerCase === 'quantity') {
                  disabled['ACTION'] = true;
                  disabled['QUANTITY'] = true;
                } else {
                  disabled['VOLUME'] = true;
                }
              }
            }
          });
        });
      } else if (currentGoalIsGeneric) {
        // For generic (all products) goal, check if any previous goal used specific products
        previousGoals.forEach((prevGoal) => {
          if (prevGoal.specificProducts && prevGoal.validated?.measurementType) {
            const prevMeasurementName = prevGoal.measurementName;
            
            // If previous goal used specific products with this measurement type
            if (prevMeasurementName === measurementTypeLowerCase) {
              if (measurementTypeLowerCase === 'action' || measurementTypeLowerCase === 'quantity') {
                disabled['ACTION'] = true;
                disabled['QUANTITY'] = true;
              } else {
                disabled['VOLUME'] = true;
              }
            }
          }
        });
      }
    });
    
    return disabled;
  }, [goalIndex, cube, currentMeasurementTypes, currentGoal]);

  // Handle measurement type selection
  const handleMeasurementTypeSelection = useCallback(
    (type: number) => {
      if (!cube) return;

      const updatedGoals = [...cube.goals];
      
      // Reset goal data if no type
      if (!type) {
        updatedGoals[goalIndex] = buildGoalData();
        dispatch(setLaunchDataStep({
          key: CUBE,
          value: { ...cube, goals: updatedGoals },
        }));
        return;
      }

      // Map type 3 (action) to type 2 (volume) for measurementType but keep name
      const actualMeasurementType = type === 3 ? 2 : type;
      
      updatedGoals[goalIndex] = {
        ...updatedGoals[goalIndex],
        measurementType: actualMeasurementType,
        measurementName: MEASUREMENT_NAMES[type] || null,
        allocationType: null,
        validated: {
          ...updatedGoals[goalIndex].validated,
          allocationType: false,
        },
        main: {
          [SIMPLIFIED_CUBE_TYPE.MIN]: '',
          [SIMPLIFIED_CUBE_TYPE.MAX]: '',
          [SIMPLIFIED_CUBE_TYPE.VALUE]: '',
        },
        brackets: INITIAL_BRACKET_VALUES as any,
      };

      dispatch(setLaunchDataStep({
        key: CUBE,
        value: { ...cube, goals: updatedGoals },
      }));
    },
    [cube, goalIndex, dispatch]
  );

  // Handle validation - toggle validation state
  const handleValidation = useCallback(() => {
    if (!cube) return;

    const currentValidated = cube.goals[goalIndex]?.validated?.measurementType || false;
    const updatedGoals = [...cube.goals];

    if (currentValidated) {
      // Un-validating (Edit mode) - reset downstream steps
      updatedGoals[goalIndex] = {
        ...updatedGoals[goalIndex],
        validated: {
          ...updatedGoals[goalIndex].validated,
          measurementType: false,
          allocationType: false,
        },
        // Reset allocation when un-validating
        allocationType: null,
        main: {
          [SIMPLIFIED_CUBE_TYPE.MIN]: '',
          [SIMPLIFIED_CUBE_TYPE.MAX]: '',
          [SIMPLIFIED_CUBE_TYPE.VALUE]: '',
        },
        brackets: INITIAL_BRACKET_VALUES as any,
      };
    } else {
      // Validating - just set the flag
      updatedGoals[goalIndex] = {
        ...updatedGoals[goalIndex],
        validated: {
          ...updatedGoals[goalIndex].validated,
          measurementType: true,
        },
      };
    }

    dispatch(setLaunchDataStep({
      key: CUBE,
      value: { ...cube, goals: updatedGoals },
    }));
  }, [cube, goalIndex, dispatch]);

  return {
    programType,
    measurementType,
    measurementName,
    measurementTypeValidated,
    productIds,
    categoryIds,
    isMeasurementTypeVisible,
    currentMeasurementTypes,
    isDisabledMeasurementTypes,
    handleMeasurementTypeSelection,
    handleValidation,
  };
};

export default useMeasurementType;
