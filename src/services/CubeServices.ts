// -----------------------------------------------------------------------------
// CubeServices - Goal and Allocation Processing
// Migrated from old_app/src/services/CubeServices.ts
// -----------------------------------------------------------------------------

import {
  ALLOCATION_MECHANISM_TYPE,
  ALLOCATION_TYPES,
  CUBE_SECTIONS,
  MEASUREMENT_TYPES,
  MEASUREMENT_TYPE_LABELS,
  MAXIMUM_GOALS_NUMBER,
  FREQUENCY_TYPE,
  FREQUENCY_TYPE_VALUES,
  BRACKET_TYPE,
  AVAILABLE,
  DISABLED,
  BASE_BRACKET_VALUE,
  TIME_DAY_CONSTRAINTS,
  TIME_MONTH_CONSTRAINTS,
  TIME_DROPDOWN_OPTIONS,
  SIMPLE,
  BRACKET,
  GROWTH,
  RANKING,
  VOLUME,
  UNITS,
  SPONSORSHIP,
  CUBE_ALLOCATION_CATEGORY,
} from '@/constants/wall/launch';

// Types
export interface Goal {
  specificProducts: boolean | null;
  measurementType: number | null;
  measurementName: string | null;
  allocationType: number | null;
  acceptedTypes: string[];
  measurementTypesValid: string[];
  productIds: number[];
  categoryIds?: number[];
  main: { min: string; max: string; value: string };
  brackets: BracketData[];
  validated: {
    specificProducts: boolean;
    measurementType: boolean;
    allocationType: boolean;
  };
}

export interface BracketData {
  min: string;
  max: string;
  value: string;
  status: string;
  errors: { min: string; max: string; equals: string };
}

export interface Cube {
  goals: Goal[];
  acceptedCorrelatedGoals: AcceptedAllocationType[];
  cubeValidated: {
    frequencyAllocation: boolean;
    spendType: boolean;
    validityPoints: boolean;
    rewardPeopleManagers: boolean;
  };
  frequencyAllocation: string;
  spendType: string;
  rewardPeopleManagers: number;
  rewardPeopleManagerAccepted: boolean;
  validityPoints: { value: string; label: string };
  correlated?: boolean;
}

export interface AcceptedAllocationType {
  allocationType: number;
  measurementType: string;
  productIds?: number[];
  specificProducts?: boolean;
}

// ============= Goal Building =============

/**
 * Build an empty goal data structure
 */
export const buildGoalData = (): Goal => ({
  specificProducts: null,
  measurementType: null,
  measurementName: null,
  allocationType: null,
  acceptedTypes: [...CUBE_ALLOCATION_CATEGORY],
  measurementTypesValid: Object.keys(MEASUREMENT_TYPES),
  productIds: [],
  main: { min: '', max: '', value: '' },
  brackets: [],
  validated: {
    specificProducts: false,
    measurementType: false,
    allocationType: false,
  },
});

// ============= Allocation Type Utilities =============

/**
 * Get allocation type ID based on step and measurement type
 */
export const getAllocationTypeId = (step: string, measurementType: number | null): number => {
  return ALLOCATION_TYPES[step]?.[measurementType || MEASUREMENT_TYPES.QUANTITY] || 0;
};

/**
 * Check if allocation type forms are available
 */
export const getAllocationTypeFormsAvailability = (
  currentGoal: Goal,
  type: string,
  productIds: number[] | null,
  categoryIds?: number[] | null
): boolean => {
  const allBeforeCompleted =
    currentGoal.measurementType &&
    currentGoal.validated.measurementType &&
    currentGoal.validated.specificProducts;

  const onlyMeasurementTypeCompleted =
    type !== SPONSORSHIP && !productIds?.length && currentGoal.validated.measurementType;

  let noProductsOrValidateProduct = false;
  if (type === SPONSORSHIP) {
    if (productIds?.length || categoryIds?.length) {
      noProductsOrValidateProduct = currentGoal.validated.specificProducts;
    } else {
      noProductsOrValidateProduct = true;
    }
  }

  return Boolean(allBeforeCompleted || onlyMeasurementTypeCompleted || noProductsOrValidateProduct);
};

/**
 * Get capitalized measurement type value
 */
export const getCapitalizedMeasurementTypeValue = (measurementType: number): string => {
  const key = Object.keys(MEASUREMENT_TYPES).find(
    (k) => MEASUREMENT_TYPES[k as keyof typeof MEASUREMENT_TYPES] === measurementType
  );
  return key ? key.charAt(0).toUpperCase() + key.slice(1).toLowerCase() : 'Quantity';
};

/**
 * Get possible allocation data for API
 */
export const getPossibleAllocationData = (goal: Goal): AcceptedAllocationType | undefined => {
  if (goal.allocationType) {
    let measurementTypeParam = goal.measurementType;
    if (measurementTypeParam === 3) {
      measurementTypeParam = 1;
    }
    return {
      measurementType: getCapitalizedMeasurementTypeValue(measurementTypeParam || MEASUREMENT_TYPES.QUANTITY),
      allocationType: goal.allocationType,
      productIds: goal.productIds,
      specificProducts: goal.specificProducts || false,
    };
  }
  return undefined;
};

/**
 * Get all allocation types from cube goals
 */
export const getAllocationTypes = (cube: Cube): AcceptedAllocationType[] => {
  return cube.goals.map((goal) => getPossibleAllocationData(goal)).filter(Boolean) as AcceptedAllocationType[];
};

// ============= Goal Validation =============

/**
 * Check if last step is validated
 */
export const isLastStepValidated = (goal: Goal): boolean => {
  const validationKeys = Object.keys(goal.validated) as (keyof Goal['validated'])[];
  return goal.validated[validationKeys[validationKeys.length - 1]];
};

/**
 * Check if maximum goals achieved
 */
export const isMaximumGoalsAchieved = (cube: Cube): boolean => {
  return cube.goals.length < MAXIMUM_GOALS_NUMBER;
};

/**
 * Check if specific products validation is available
 */
export const getValidForSpecificProducts = (
  specificProducts: boolean | null,
  cube: Cube,
  index: number
): boolean | undefined => {
  if (specificProducts !== null) {
    return !specificProducts || (specificProducts && cube.goals[index].productIds.length > 0);
  }
  return undefined;
};

// ============= Product Processing =============

/**
 * Process product IDs for a goal
 */
export const processProductIdsGoal = (
  cube: Cube,
  index: number,
  newProductId: number
): number[] => {
  const updatedProductsIds = cube.goals[index].productIds;

  if (!updatedProductsIds || updatedProductsIds.length === 0) {
    return [newProductId];
  }

  if (updatedProductsIds.includes(newProductId)) {
    return updatedProductsIds.filter((id) => id !== newProductId);
  }

  return [...updatedProductsIds, newProductId];
};

/**
 * Get unique selected IDs from combined products
 */
export const getUniqueSelectedIds = (combinedFullProducts: Array<{ id: number }>): number[] => {
  return Array.from(new Set(combinedFullProducts.map((item) => item.id)));
};

/**
 * Get unique full products
 */
export const getUniqueFullProducts = <T extends { id: number }>(
  uniqueSelectedIds: number[],
  combinedFullProducts: T[]
): T[] => {
  return uniqueSelectedIds
    .map((key) => combinedFullProducts.find((obj) => obj.id === key))
    .filter(Boolean) as T[];
};

// ============= Simple Allocation =============

/**
 * Check if simple allocation field is available
 */
export const getSimpleAllocationFieldAvailability = (form: {
  values: Record<string, string>;
  errors: Record<string, string>;
}): boolean => {
  const keys = Object.keys(form.values);
  return form.values[keys[0]] !== '' && Object.keys(form.errors).length === 0;
};

/**
 * Process simple allocation values
 */
export const processSimpleAllocationValues = (
  values: Record<string, string>
): { value: string; min: string; max: string } => {
  const [value, min, max] = Object.keys(values);
  return {
    value: values[value] || '',
    min: values[min] || '',
    max: values[max] || '',
  };
};

// ============= Bracket Utilities =============

/**
 * Get bracket at index with neighbors
 */
export const getBracket = (
  bracketsData: BracketData[],
  index: number
): {
  updatedBracketsData: BracketData[];
  nextBracket: BracketData | undefined;
  currentBracket: BracketData;
  previousBracket: BracketData | undefined;
} => {
  return {
    updatedBracketsData: bracketsData,
    nextBracket: bracketsData[index + 1],
    currentBracket: bracketsData[index],
    previousBracket: bracketsData[index - 1],
  };
};

/**
 * Get only available brackets
 */
export const getOnlyAvailableBrackets = (bracketsData: BracketData[]): BracketData[] => {
  return bracketsData.filter((bracketData, index) => {
    const isBracketEmpty = !bracketData.min && !bracketData.max && !bracketData.value && index > 1;
    if (isBracketEmpty) return false;
    return bracketData.status !== DISABLED;
  });
};

/**
 * Get processed brackets for backend
 */
export const getProcessedBrackets = (
  data: BracketData[]
): Array<{ min: string; max: string; value: string; crt: string }> => {
  return data.map(({ min, max, value }, index) => ({
    min,
    max,
    value,
    crt: String.fromCharCode(65 + index), // A, B, C...
  }));
};

/**
 * Get bracket ready for display
 */
export const getBracketDisplayReady = (currentBrackets: BracketData[]): BracketData[] => {
  return currentBrackets.map((bracket, index) => ({
    ...bracket,
    errors: { min: '', max: '', equals: '' },
    status: index !== currentBrackets.length - 1 ? AVAILABLE : DISABLED,
  }));
};

/**
 * Add additional disabled bracket
 */
export const addAdditionalDisabledBracket = (displayBracketsData: BracketData[]): BracketData[] => {
  if (displayBracketsData.length < 3) {
    return [
      ...displayBracketsData,
      { ...BASE_BRACKET_VALUE, status: DISABLED } as BracketData,
    ];
  }
  return displayBracketsData;
};

/**
 * Set bracket status to available
 */
export const setBracketStatusAvailable = (
  bracketsData: BracketData[],
  index: number,
  bracket: BracketData
): BracketData[] => {
  const updatedBracketsData = [...bracketsData];
  updatedBracketsData.splice(index, 1, {
    ...bracket,
    status: AVAILABLE,
  });
  return updatedBracketsData;
};

/**
 * Get disabled bracket
 */
export const getDisabledBracket = (bracketsData: BracketData[]): BracketData | undefined => {
  return bracketsData.find((bracket) => bracket.status === DISABLED);
};

// ============= Allocation Mechanism Extraction =============

/**
 * Extract cube allocation mechanisms
 */
export const extractCubeAllocationMechanisms = (
  cube: Cube
): Array<{ allocationType: number; type: string; category: string }> => {
  if (!cube || !Array.isArray(cube.goals) || cube.goals.length === 0) {
    return [];
  }

  const mechanisms: Record<string, { allocationType: number; type: string; category: string }> = {};

  cube.goals.forEach(({ allocationType }) => {
    if (!allocationType) return;
    
    const mechanism = ALLOCATION_MECHANISM_TYPE[allocationType];
    if (mechanism && !mechanisms[mechanism.type]) {
      mechanisms[mechanism.type] = {
        allocationType,
        ...mechanism,
      };
    }
  });

  return Object.values(mechanisms);
};

/**
 * Extract points data from cube
 */
export const extractPointsData = (
  cube: Cube
): { allocationFrequency?: number; spendType?: string; managerRatio: number } => {
  if (!cube || !Array.isArray(cube.goals) || cube.goals.length === 0) {
    return { managerRatio: 0 };
  }

  return {
    allocationFrequency: FREQUENCY_TYPE_VALUES[cube.frequencyAllocation as keyof typeof FREQUENCY_TYPE_VALUES],
    spendType: cube.spendType,
    managerRatio: cube.rewardPeopleManagers || 0,
  };
};

// ============= Frequency Utilities =============

/**
 * Handle date differences for frequency types
 */
export const handleDateDifferences = (
  dateDifference: { dayDifference: number; monthDifference: number },
  frequencyTypes: string[]
): string[] => {
  const { dayDifference, monthDifference } = dateDifference;
  let returnedFrequencyTypes = [...frequencyTypes];

  if (dayDifference > TIME_DAY_CONSTRAINTS.WEEK) {
    returnedFrequencyTypes = [...frequencyTypes, FREQUENCY_TYPE.WEEKLY];
  }
  if (dayDifference > TIME_DAY_CONSTRAINTS.MONTH) {
    returnedFrequencyTypes = [...frequencyTypes, FREQUENCY_TYPE.WEEKLY, FREQUENCY_TYPE.MONTHLY];
  }
  if (monthDifference > TIME_MONTH_CONSTRAINTS.QUARTER) {
    returnedFrequencyTypes = [
      ...frequencyTypes,
      FREQUENCY_TYPE.WEEKLY,
      FREQUENCY_TYPE.MONTHLY,
      FREQUENCY_TYPE.QUARTER,
    ];
  }

  return [...new Set(returnedFrequencyTypes)];
};

/**
 * Get time validity options
 */
export const getTimeValidityOptions = (
  formatMessage: (id: { id: string }, values?: Record<string, number>) => string,
  count: number,
  type: { value: string; id: string }
): Array<{ value: string; label: string }> => {
  const dropdownOptions: Array<{ value: string; label: string }> = [];

  for (let i = 1; i <= count; i++) {
    dropdownOptions.push({
      value: `${i}${type.value}`,
      label: formatMessage({ id: `launchProgram.cube.validity.${type.id}` }, { value: i }),
    });
  }

  return dropdownOptions;
};

/**
 * Get initial validity points
 */
export const getInitialValidityPoints = (
  formatMessage: (id: { id: string }, values?: Record<string, number>) => string
): { value: string; label: string } => {
  return {
    value: `1${TIME_DROPDOWN_OPTIONS.YEAR.VALUE}`,
    label: formatMessage({ id: `launchProgram.cube.validity.${TIME_DROPDOWN_OPTIONS.YEAR.LABEL}` }, { value: 1 }),
  };
};

/**
 * Translate validity points
 */
export const translateValidityPoints = (
  formatMessage: (id: { id: string }, values?: Record<string, number>) => string,
  value: string
): { value: string; label: string } => {
  const type = value.slice(-1);
  const index = parseInt(value.substring(0, value.length - 1), 10);
  const option = Object.values(TIME_DROPDOWN_OPTIONS).find((opt) => opt.VALUE === type);

  return {
    value,
    label: option
      ? formatMessage({ id: `launchProgram.cube.validity.${option.LABEL}` }, { value: index })
      : value,
  };
};

// ============= Allocation Type Filtering =============

/**
 * Filter allocation types based on accepted allocations
 */
export const filterAllocationTypes = (
  currentAllocationTypes: Record<string, Record<number, number>>,
  filteredAllocationTypes: AcceptedAllocationType[],
  measurementType: number,
  index: number
): string[] => {
  // If first goal, reset to allow any goal type
  if (index === 0 && filteredAllocationTypes.length) {
    filteredAllocationTypes = [];
  }

  if (filteredAllocationTypes.length) {
    return Object.keys(currentAllocationTypes).filter((allocation) => {
      return filteredAllocationTypes.some((type) => {
        return (
          type.allocationType === currentAllocationTypes[allocation][measurementType] &&
          type.measurementType === getCapitalizedMeasurementTypeValue(measurementType)
        );
      });
    });
  }

  return index ? [] : Object.keys(currentAllocationTypes);
};

/**
 * Check if allocation is matched
 */
export const isAllocationMatched = (
  type: AcceptedAllocationType,
  currentAllocationTypes: Record<string, Record<number, number>>,
  measurementType: number,
  allocation: string
): boolean => {
  return (
    type.allocationType === currentAllocationTypes[allocation][measurementType] &&
    type.measurementType === getCapitalizedMeasurementTypeValue(measurementType)
  );
};

/**
 * Get accepted measurement type array
 */
export const getAcceptedMeasurementTypeArray = (cube: Cube): string[] => {
  return cube.acceptedCorrelatedGoals.map((type) => type.measurementType);
};

export default {
  buildGoalData,
  getAllocationTypeId,
  getAllocationTypeFormsAvailability,
  getCapitalizedMeasurementTypeValue,
  getPossibleAllocationData,
  getAllocationTypes,
  isLastStepValidated,
  isMaximumGoalsAchieved,
  getValidForSpecificProducts,
  processProductIdsGoal,
  getUniqueSelectedIds,
  getUniqueFullProducts,
  getSimpleAllocationFieldAvailability,
  processSimpleAllocationValues,
  getBracket,
  getOnlyAvailableBrackets,
  getProcessedBrackets,
  getBracketDisplayReady,
  addAdditionalDisabledBracket,
  setBracketStatusAvailable,
  getDisabledBracket,
  extractCubeAllocationMechanisms,
  extractPointsData,
  handleDateDifferences,
  getTimeValidityOptions,
  getInitialValidityPoints,
  translateValidityPoints,
  filterAllocationTypes,
  isAllocationMatched,
  getAcceptedMeasurementTypeArray,
};
