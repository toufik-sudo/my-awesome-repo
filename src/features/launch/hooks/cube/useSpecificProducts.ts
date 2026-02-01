// -----------------------------------------------------------------------------
// useSpecificProducts Hook
// Handles specific products selection for goals
// -----------------------------------------------------------------------------

import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { setLaunchDataStep } from '@/store/actions/launchActions';
import {
  CUBE,
  CUBE_SECTIONS,
  SIMPLIFIED_CUBE_TYPE,
} from '@/constants/wall/launch';
import {
  getValidForSpecificProducts,
  processProductIdsGoal,
  getUniqueSelectedIds,
  getUniqueFullProducts,
  type Cube,
  type Goal,
} from '@/services/CubeServices';

interface Product {
  id: number;
  name: string;
  description?: string;
  [key: string]: unknown;
}

interface UseSpecificProductsReturn {
  // State
  specificProducts: boolean | null;
  goalProductIds: number[];
  availableProducts: Product[];
  personaliseProducts: boolean;
  validateAvailable: boolean | undefined;
  isDisabledProducts: Record<number, boolean>;
  isAllProductsDisabled: boolean;
  isGenericProductsDisabled: boolean;

  // Actions
  handleSpecificProductsSelection: (isSpecific: boolean) => void;
  handleProductSelection: (productId: number) => void;
  handleValidation: () => void;
}

export const useSpecificProducts = (goalIndex: number): UseSpecificProductsReturn => {
  const dispatch = useDispatch();

  const launchData = useSelector((state: RootState & { launchReducer?: Record<string, unknown> }) =>
    state.launchReducer || {}
  );

  const cube = launchData.cube as Cube;
  const fullProducts = (launchData.fullProducts as Product[]) || [];
  const fullCategoriesProducts = (launchData.fullCategoriesProducts as Product[]) || [];
  // Check if products were configured - this determines if product selection step is shown
  const personaliseProducts = (launchData.personaliseProducts as boolean) || 
    fullProducts.length > 0 || fullCategoriesProducts.length > 0;
  const productIds = (launchData.productIds as number[]) || [];

  const currentGoal = cube?.goals?.[goalIndex];
  const specificProducts = currentGoal?.specificProducts ?? null;
  const goalProductIds = currentGoal?.productIds || [];
  const specificProductsValidated = currentGoal?.validated?.specificProducts || false;

  // Combine products from both sources
  const combinedFullProducts = useMemo(() => {
    return [...fullProducts, ...fullCategoriesProducts];
  }, [fullProducts, fullCategoriesProducts]);

  // Get unique products
  const uniqueSelectedIds = useMemo(() => {
    return getUniqueSelectedIds(combinedFullProducts);
  }, [combinedFullProducts]);

  const availableProducts = useMemo(() => {
    return getUniqueFullProducts(uniqueSelectedIds, combinedFullProducts);
  }, [uniqueSelectedIds, combinedFullProducts]);

  // Validate availability
  const validateAvailable = useMemo(() => {
    if (!cube) return undefined;
    return getValidForSpecificProducts(specificProducts, cube, goalIndex);
  }, [specificProducts, cube, goalIndex]);

  // Calculate disabled products based on previous goals
  // Products are NOT disabled just because they're used in previous goals
  // They can be reused BUT with different measurement types
  const { isDisabledProducts, isAllProductsDisabled, isGenericProductsDisabled } = useMemo(() => {
    const disabled: Record<number, boolean> = {};
    let allDisabled = false;
    let genericDisabled = false;

    if (goalIndex >= 1 && cube?.goals) {
      const previousGoals = cube.goals.filter((_, i) => i < goalIndex);
      
      // Generic products disabled if any previous goal used generic (all products)
      genericDisabled = previousGoals.some((goal) => goal.specificProducts === false && goal.validated?.specificProducts);

      // Products are NOT completely disabled - they can be reused with different measurement types
      // This allows the same product to have multiple goals with different metrics
      if (availableProducts.length) {
        let hasAvailable = false;
        availableProducts.forEach((product) => {
          // Check if this product has been used with ALL available measurement types
          const usedMeasurementTypes = new Set<string>();
          previousGoals.forEach((goal) => {
            if (goal.specificProducts && goal.productIds?.includes(product.id) && goal.validated?.measurementType) {
              if (goal.measurementName) {
                usedMeasurementTypes.add(goal.measurementName);
                // ACTION and QUANTITY are interchangeable
                if (goal.measurementName === 'action') usedMeasurementTypes.add('quantity');
                if (goal.measurementName === 'quantity') usedMeasurementTypes.add('action');
              }
            }
          });
          
          // Product is disabled only if it has been used with ALL measurement types
          const allTypesUsed = usedMeasurementTypes.has('quantity') && 
                               usedMeasurementTypes.has('volume') &&
                               usedMeasurementTypes.has('action');
          
          if (allTypesUsed) {
            disabled[product.id] = true;
          } else {
            hasAvailable = true;
          }
        });
        allDisabled = !hasAvailable;
      }
    }

    return {
      isDisabledProducts: disabled,
      isAllProductsDisabled: allDisabled,
      isGenericProductsDisabled: genericDisabled,
    };
  }, [goalIndex, cube?.goals, availableProducts]);

  // Handle specific products selection
  const handleSpecificProductsSelection = useCallback(
    (isSpecific: boolean) => {
      if (!cube) return;

      const updatedGoals = [...cube.goals];
      updatedGoals[goalIndex] = {
        ...updatedGoals[goalIndex],
        specificProducts: isSpecific,
        measurementType: null,
        measurementName: null,
        validated: {
          ...updatedGoals[goalIndex].validated,
          measurementType: false,
        },
        productIds: isSpecific ? updatedGoals[goalIndex].productIds : [],
      };

      dispatch(setLaunchDataStep({
        key: CUBE,
        value: { ...cube, goals: updatedGoals },
      }));
    },
    [cube, goalIndex, dispatch]
  );

  // Handle individual product selection
  const handleProductSelection = useCallback(
    (productId: number) => {
      if (!cube) return;

      const updatedProductsIds = processProductIdsGoal(cube, goalIndex, productId);
      const updatedGoals = [...cube.goals];
      updatedGoals[goalIndex] = {
        ...updatedGoals[goalIndex],
        productIds: updatedProductsIds,
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

    const currentValidated = cube.goals[goalIndex]?.validated?.specificProducts || false;
    const updatedGoals = [...cube.goals];
    
    if (currentValidated) {
      // Un-validating (Edit mode) - reset downstream steps
      updatedGoals[goalIndex] = {
        ...updatedGoals[goalIndex],
        validated: {
          ...updatedGoals[goalIndex].validated,
          specificProducts: false,
          measurementType: false,
          allocationType: false,
        },
        // Reset downstream selections
        measurementType: null,
        measurementName: null,
        allocationType: null,
        main: {
          [SIMPLIFIED_CUBE_TYPE.MIN]: '',
          [SIMPLIFIED_CUBE_TYPE.MAX]: '',
          [SIMPLIFIED_CUBE_TYPE.VALUE]: '',
        },
      };
    } else {
      // Validating - just set the flag
      updatedGoals[goalIndex] = {
        ...updatedGoals[goalIndex],
        validated: {
          ...updatedGoals[goalIndex].validated,
          specificProducts: true,
        },
      };
    }

    dispatch(setLaunchDataStep({
      key: CUBE,
      value: { ...cube, goals: updatedGoals },
    }));
  }, [cube, goalIndex, dispatch]);

  return {
    specificProducts,
    goalProductIds,
    availableProducts,
    personaliseProducts,
    validateAvailable,
    isDisabledProducts,
    isAllProductsDisabled,
    isGenericProductsDisabled,
    handleSpecificProductsSelection,
    handleProductSelection,
    handleValidation,
  };
};

export default useSpecificProducts;
