// -----------------------------------------------------------------------------
// CubeServices
// Migrated from old_app/src/services/CubeServices.ts
// Core logic for program configuration, bracket allocation, and goal management
// -----------------------------------------------------------------------------

import { StringUtilities, ArrayUtilities } from '@/utils';
import { convertAsciiToString, convertToFloatNumber, getKeyByValue } from '@/utils/general';
import {
  ALLOCATION_MECHANISM_TYPE,
  ALLOCATION_TYPES,
  AVAILABLE,
  BASE_BRACKET_VALUE,
  BRACKET,
  BRACKET_FORM_TYPE,
  BRACKET_TYPE,
  CUBE_ALLOCATION_CATEGORY,
  CUBE_SECTIONS,
  DISABLED,
  FREQUENCY_TYPE,
  MAXIMUM_GOALS_NUMBER,
  MEASUREMENT_TYPE_LABELS,
  MEASUREMENT_TYPES,
  NEXT,
  PREVIOUS,
  PROGRAM_TYPES,
  SIMPLE,
  SPONSORSHIP,
  TIME_DAY_CONSTRAINTS,
  TIME_DROPDOWN_OPTIONS,
  TIME_MONTH_CONSTRAINTS,
  UNITS,
  VOLUME,
  FREQUENCY_TYPE_VALUES,
  GROWTH,
  RANKING
} from '@/constants/wall/launch';
import { DEPENDS_ON, HIGHER_THAN, LOWER_THAN, REGEX, REQUIRED } from '@/constants/validation';

// Types
export interface IBracket {
  min: string | number;
  max: string | number;
  value: string | number;
  status?: string;
  errors?: { min: string; max: string; equals: string };
  crt?: string;
}

export interface IGoal {
  specificProducts: boolean | null;
  measurementType: number | null;
  measurementName: string | null;
  allocationType: number | null;
  acceptedTypes: string[];
  measurementTypesValid: string[];
  productIds: number[];
  brackets: IBracket[];
  main: { min: string; max: string; value: string };
  validated: {
    specificProducts: boolean;
    measurementType: boolean;
    allocationType: boolean;
  };
}

export interface ICube {
  goals: IGoal[];
  correlated: boolean;
  frequencyAllocation?: string;
  spendType?: string;
  validityPoints?: { value: string; label: string };
  rewardPeopleManagers?: number;
  rewardPeopleManagerAccepted?: boolean;
  cubeValidated: {
    frequencyAllocation: boolean;
    spendType: boolean;
    validityPoints: boolean;
    rewardPeopleManagers: boolean;
  };
  acceptedCorrelatedGoals: Record<string, any>;
}

export interface IAllocationMechanism {
  allocationType: number;
  type: string;
  category: string;
}

export interface IDateDifference {
  dayDifference: number;
  monthDifference: number;
}

/**
 * Extracts allocation mechanism types from cube
 */
export const extractCubeAllocationMechanisms = (cube: ICube): IAllocationMechanism[] => {
  if (!cube || !ArrayUtilities.isNonEmptyArray(cube.goals)) {
    return [];
  }

  const mechanisms = cube.goals.reduce((acc: Record<string, IAllocationMechanism>, goal) => {
    const { allocationType } = goal;
    const mechanism = ALLOCATION_MECHANISM_TYPE[allocationType as keyof typeof ALLOCATION_MECHANISM_TYPE];
    
    if (!allocationType || !mechanism) {
      return acc;
    }
    
    if (!acc[mechanism.type]) {
      acc[mechanism.type] = {
        allocationType,
        ...mechanism
      };
    }

    return acc;
  }, {});

  return Object.values(mechanisms);
};

/**
 * Extract points configuration details from cube
 */
export const extractPointsData = (cube: ICube) => {
  if (!cube || !ArrayUtilities.isNonEmptyArray(cube.goals)) {
    return {};
  }

  return {
    allocationFrequency: cube.frequencyAllocation || FREQUENCY_TYPE_VALUES[cube.frequencyAllocation as keyof typeof FREQUENCY_TYPE_VALUES],
    spendType: cube.spendType,
    managerRatio: cube.rewardPeopleManagers || 0
  };
};

/**
 * Get style for goal details based on design colors
 */
export const getStyleForGoalDetails = (designColors: { colorContent: string; colorTask: string }) => {
  return Object.keys(ALLOCATION_MECHANISM_TYPE).reduce((acc: Record<string, { color?: string }>, key) => {
    const mechanism = ALLOCATION_MECHANISM_TYPE[Number(key) as keyof typeof ALLOCATION_MECHANISM_TYPE];
    if (!mechanism) return acc;
    const { category, type } = mechanism;
    acc[key] = {};
    
    if (category === SIMPLE || category === BRACKET || category === GROWTH || category === RANKING) {
      acc[key] = getStyleByGoalMeasurementType(designColors, type);
    }

    return acc;
  }, {});
};

const getStyleByGoalMeasurementType = (designColors: { colorContent: string; colorTask: string }, type: string) => {
  let color = designColors.colorContent;

  if (StringUtilities.equalsIgnoreCase(type, VOLUME)) {
    color = designColors.colorTask;
  }

  return { color };
};

/**
 * Method returns boolean for allocation type form availability
 */
export const getAllocationTypeFormsAvailability = (
  currentGoal: IGoal,
  type: string,
  productIds: number[] | null,
  categoryIds: number[] | null
): boolean => {
  const allBeforeCompleted =
    currentGoal.measurementType &&
    currentGoal.validated[CUBE_SECTIONS.MEASUREMENT_TYPE as keyof typeof currentGoal.validated] &&
    currentGoal.validated[CUBE_SECTIONS.SPECIFIC_PRODUCTS as keyof typeof currentGoal.validated];
  
  const onlyMeasurementTypeCompleted =
    type !== SPONSORSHIP && !productIds && currentGoal.validated[CUBE_SECTIONS.MEASUREMENT_TYPE as keyof typeof currentGoal.validated];

  let noProductsOrValidateProduct = false;
  if (type === SPONSORSHIP) {
    if (productIds || categoryIds) {
      noProductsOrValidateProduct = currentGoal.validated[CUBE_SECTIONS.SPECIFIC_PRODUCTS as keyof typeof currentGoal.validated];
    } else {
      noProductsOrValidateProduct = true;
    }
  }
  
  return !!(allBeforeCompleted || onlyMeasurementTypeCompleted || noProductsOrValidateProduct);
};

/**
 * Method used to get the allocation type id
 */
export const getAllocationTypeId = (step: string, measurementType: number | null): number => {
  return ALLOCATION_TYPES[step as keyof typeof ALLOCATION_TYPES]?.[measurementType || MEASUREMENT_TYPES.QUANTITY];
};

/**
 * Method used to return updated product ids for goal
 */
export const processProductIdsGoal = (cube: ICube, index: number, newProductId: number): number[] => {
  const updatedProductsIds = cube.goals[index].productIds;

  if (!updatedProductsIds) return [newProductId];

  if (updatedProductsIds.includes(newProductId)) {
    return updatedProductsIds.filter(id => id !== newProductId);
  }

  return [...updatedProductsIds, newProductId];
};

/**
 * Method returns boolean if the validate meets all requirements
 */
export const getValidForSpecificProducts = (
  specificProducts: boolean | null,
  cube: ICube,
  index: number
): boolean | undefined => {
  if (specificProducts !== null) {
    return !specificProducts || (specificProducts && !!cube.goals[index].productIds.length);
  }
};

/**
 * Method used to build a new empty goal
 */
export const buildGoalData = (): IGoal => {
  return {
    [CUBE_SECTIONS.SPECIFIC_PRODUCTS]: null,
    [CUBE_SECTIONS.MEASUREMENT_TYPE]: null,
    [CUBE_SECTIONS.MEASUREMENT_NAME]: null,
    [CUBE_SECTIONS.ALLOCATION_TYPE]: null,
    acceptedTypes: [...CUBE_ALLOCATION_CATEGORY],
    measurementTypesValid: Object.keys(MEASUREMENT_TYPES),
    productIds: [],
    brackets: [],
    main: { min: '', max: '', value: '' },
    validated: {
      [CUBE_SECTIONS.SPECIFIC_PRODUCTS]: false,
      [CUBE_SECTIONS.MEASUREMENT_TYPE]: false,
      [CUBE_SECTIONS.ALLOCATION_TYPE]: false
    }
  } as IGoal;
};

/**
 * Method used to return boolean if allocation fields are all correct
 */
export const getSimpleAllocationFieldAvailability = (form: { values: Record<string, any>; errors: Record<string, any> }): boolean => {
  return form.values[Object.keys(form.values)[0]] && !Object.keys(form.errors).length;
};

/**
 * Method used to process simple allocation values
 */
export const processSimpleAllocationValues = (values: Record<string, string>) => {
  const [value, min, max] = Object.keys(values);

  return {
    value: values[value],
    min: values[min],
    max: values[max]
  };
};

/**
 * Used for mapping programType and measurmentType to the according labels
 */
const getProgramMeasurementLabels = (programType: number | string, measurementType: number | string) => {
  const programTypeKey = StringUtilities.isString(programType)
    ? programType as string
    : getKeyByValue(PROGRAM_TYPES, programType as number);
  
  if (!Number(measurementType) && measurementType && StringUtilities.isString(measurementType)) {
    return { programTypeKey, measurementTypeLabel: (measurementType as string).toLowerCase() };
  }

  return {
    programTypeKey,
    measurementTypeLabel: measurementType === MEASUREMENT_TYPES.VOLUME ? VOLUME : UNITS
  };
};

/**
 * Returns bracket fields labels for given programType and measurement type
 */
export const getBracketLabelsByProgramAndMeasurementType = (
  programType: number,
  measurementType: number | string,
  inputType: Record<string, any>
) => {
  const { programTypeKey, measurementTypeLabel } = getProgramMeasurementLabels(programType, measurementType);
  const measurementTypeKey = MEASUREMENT_TYPE_LABELS[measurementTypeLabel as keyof typeof MEASUREMENT_TYPE_LABELS];
  const measurement = BRACKET_FORM_TYPE[programTypeKey as keyof typeof BRACKET_FORM_TYPE]?.[measurementTypeKey];

  return getBracketFieldsLabels(measurement, programTypeKey, inputType);
};

/**
 * Method used to get bracket fields labels
 */
export const getBracketFieldsLabels = (
  bracketFormType: string,
  type: string,
  inputType: Record<string, any>
) => {
  let baseTranslation = inputType[type];

  if (type !== SPONSORSHIP && baseTranslation) {
    baseTranslation = baseTranslation[bracketFormType];
  }

  return baseTranslation || {};
};

/**
 * Method used to get bracket type
 */
export const getBracketType = (type: string, measurementType: number): string | Record<string, string> | undefined => {
  const bracketFormType = BRACKET_FORM_TYPE[type as keyof typeof BRACKET_FORM_TYPE];

  if (type !== SPONSORSHIP && bracketFormType && typeof bracketFormType === 'object') {
    const measurementTypeKey = getKeyByValue(MEASUREMENT_TYPES, measurementType)?.toLowerCase();
    return measurementTypeKey ? (bracketFormType as Record<string, string>)[measurementTypeKey] : undefined;
  }

  return bracketFormType;
};

/**
 * Method used to handle validation on cube field
 */
export const cubeFieldValidationManager = (
  validation: Record<string, any>,
  value: string | number,
  bracketsData: IBracket[],
  index: number
): string => {
  const { currentBracket, nextBracket, previousBracket } = getBracket(bracketsData, index);
  const translationPrefix = 'form.validation';

  const errors = Object.keys(validation)
    .map(key => {
      const comparedToValue = currentBracket[validation[key] as keyof IBracket];
      const isNextAvailable =
        validation[key]?.type === NEXT &&
        nextBracket &&
        nextBracket[validation[key].target as keyof IBracket] &&
        nextBracket.status !== DISABLED;
      const isPreviousAvailable =
        validation[key]?.type === PREVIOUS && 
        previousBracket && 
        previousBracket[validation[key].target as keyof IBracket];

      switch (key) {
        case REGEX:
          return value && !validation[key].test(value) && `${translationPrefix}.percentage`;

        case LOWER_THAN:
          if (isNextAvailable) {
            return (
              convertToFloatNumber(value) > convertToFloatNumber(nextBracket[validation[key].target as keyof IBracket] as string | number) &&
              `${translationPrefix}.lowerThan`
            );
          }
          if (comparedToValue) {
            return (
              convertToFloatNumber(value) >= convertToFloatNumber(comparedToValue as string | number) &&
              `${translationPrefix}.lowerThan`
            );
          }
          return false;

        case HIGHER_THAN:
          if (isPreviousAvailable) {
            return (
              convertToFloatNumber(value) < convertToFloatNumber(previousBracket[validation[key].target as keyof IBracket] as string | number) &&
              `${translationPrefix}.higherThan`
            );
          }
          if (comparedToValue) {
            return (
              convertToFloatNumber(value) <= convertToFloatNumber(comparedToValue as string | number) &&
              `${translationPrefix}.higherThan`
            );
          }
          return false;

        case DEPENDS_ON:
          if (
            previousBracket &&
            (!previousBracket.max || convertToFloatNumber(value) < convertToFloatNumber(previousBracket.max))
          ) {
            return `${translationPrefix}.${validation[key].target}.${REQUIRED}`;
          }
          return false;

        case REQUIRED:
          return handleRequiredValidation(index, validation, value, bracketsData);
        
        default:
          return false;
      }
    })
    .filter(v => v);

  return (errors[0] as string) || '';
};

/**
 * Method used to handle required cube validation
 */
export const handleRequiredValidation = (
  index: number,
  validation: Record<string, any>,
  value: string | number,
  bracketsData: IBracket[]
): string | false => {
  if (index === 0 && validation.required?.only === BRACKET_TYPE.FROM) {
    return false;
  }

  if (index && validation.required?.only === BRACKET_TYPE.TO && index + 3 !== bracketsData.length) {
    return false;
  }

  return !value && 'form.validation.required';
};

/**
 * Method used to return next/current/previous bracket
 */
export const getBracket = (bracketsData: IBracket[], index: number) => {
  const nextBracket = bracketsData[index + 1];
  const currentBracket = bracketsData[index];
  const previousBracket = bracketsData[index - 1];

  return { updatedBracketsData: bracketsData, nextBracket, currentBracket, previousBracket };
};

/**
 * Method used to get only available brackets
 */
export const getOnlyAvailableBrackets = (bracketsData: IBracket[]): IBracket[] => {
  return bracketsData.filter((bracketData, index) => {
    const isBracketEmpty = !bracketData.min && !bracketData.max && !bracketData.value && index > 1;
    if (isBracketEmpty) return false;

    return bracketData.status !== DISABLED;
  });
};

/**
 * Method used to return a bracket format that it's used on backend side
 */
export const getProcessedBrackets = (data: IBracket[]) =>
  data.map(({ min, max, value }, index) => ({ min, max, value, crt: convertAsciiToString(index) }));

/**
 * Method used to get all brackets errors
 */
export const getAllBracketsErrors = (
  onlyAvailableData: IBracket[],
  handleBracketValidation: (type: string, value: any, index: number, validations: any) => string,
  fieldLabels: Record<string, { validations: any }>
): string[] => {
  let errorsList: string[] = [];

  onlyAvailableData.forEach((bracket, index) => {
    errorsList = [
      ...errorsList,
      handleBracketValidation(
        BRACKET_TYPE.FROM,
        bracket[BRACKET_TYPE.FROM as keyof IBracket],
        index,
        fieldLabels[BRACKET_TYPE.FROM]?.validations
      ),
      handleBracketValidation(
        BRACKET_TYPE.TO,
        bracket[BRACKET_TYPE.TO as keyof IBracket],
        index,
        fieldLabels[BRACKET_TYPE.TO]?.validations
      ),
      handleBracketValidation(
        BRACKET_TYPE.EQUALS,
        bracket[BRACKET_TYPE.EQUALS as keyof IBracket],
        index,
        fieldLabels[BRACKET_TYPE.EQUALS]?.validations
      )
    ].filter(e => e);
  });

  return errorsList;
};

/**
 * Method used to get the disabled bracket
 */
export const getDisabledBracket = (bracketsData: IBracket[]): IBracket | undefined => 
  bracketsData.find(bracket => bracket.status === DISABLED);

/**
 * Method used to set bracket status to available
 */
export const setBracketStatusAvailable = (
  bracketsData: IBracket[],
  index: number,
  bracket: IBracket
): IBracket[] => {
  const updatedBracketsData = [...bracketsData];
  updatedBracketsData.splice(index, 1, {
    ...bracket,
    [BRACKET_TYPE.STATUS]: AVAILABLE
  });

  return updatedBracketsData;
};

/**
 * Method used to return boolean on last step validated
 */
export const isLastStepValidated = (goal: IGoal): boolean => {
  const validationKeys = Object.keys(goal.validated);
  const values = validationKeys.map(key => goal.validated[key as keyof typeof goal.validated]);
  return values[values.length - 1];
};

/**
 * Method used to return boolean on max length
 */
export const isMaximumGoalsAchieved = (cube: ICube): boolean => cube.goals.length < MAXIMUM_GOALS_NUMBER;

/**
 * Method used to return capitalized measurement type value
 */
export const getCapitalizedMeasurementTypeValue = (measurementType: number): string => {
  return StringUtilities.capitalize(getKeyByValue(MEASUREMENT_TYPES, measurementType)?.toLowerCase() || '');
};

/**
 * Method used to get data ready to be sent to backend
 */
export const getPossibleAllocationData = ({
  allocationType,
  measurementType,
  productIds,
  specificProducts
}: {
  allocationType: number | null;
  measurementType: number | null;
  productIds: number[];
  specificProducts: boolean | null;
}) => {
  if (allocationType) {
    let measurementTypeParam = measurementType;
    if (measurementType === 3) {
      measurementTypeParam = 1;
    }
    return {
      measurementType: getCapitalizedMeasurementTypeValue(measurementTypeParam || MEASUREMENT_TYPES.QUANTITY),
      allocationType,
      productIds,
      specificProducts
    };
  }
};

/**
 * Method used to apply get possible allocation on each goal from cube
 */
export const getAllocationTypes = (cube: ICube) => 
  cube.goals.map(goal => getPossibleAllocationData(goal)).filter(goal => goal);

/**
 * Method used to check if current allocation matches the filtered results
 */
export const isAllocationMatched = (
  type: { allocationType: number; measurementType: string },
  currentAllocationTypes: Record<string, Record<number, number>>,
  measurementType: number,
  allocation: string
): boolean => {
  return (
    type.allocationType === currentAllocationTypes[allocation]?.[measurementType] &&
    type.measurementType === getCapitalizedMeasurementTypeValue(measurementType)
  );
};

/**
 * Method used to get all matched allocation types
 */
export const getMatchedAllocationTypes = (
  filteredAllocationTypes: { allocationType: number; measurementType: string }[],
  currentAllocationTypes: Record<string, Record<number, number>>,
  measurementType: number,
  allocation: string
): boolean =>
  filteredAllocationTypes.some(type => isAllocationMatched(type, currentAllocationTypes, measurementType, allocation));

/**
 * Method used to filter allocation types
 */
export const filterAllocationTypes = (
  currentAllocationTypes: Record<string, Record<number, number>>,
  filteredAllocationTypes: { allocationType: number; measurementType: string }[],
  measurementType: number,
  index: number
): string[] => {
  // if we have only 1 goal, reset filteredAllocationTypes to let user select any goal type
  let filtered = filteredAllocationTypes;
  if (index === 0 && filtered.length) {
    filtered = [];
  }
  
  if (filtered.length) {
    return Object.keys(currentAllocationTypes).filter(allocation =>
      filtered.some(type => isAllocationMatched(type, currentAllocationTypes, measurementType, allocation))
    );
  }

  return index ? [] : Object.keys(currentAllocationTypes);
};

/**
 * Method used to get bracket ready to be displayed (errors + status)
 */
export const getBracketDisplayReady = (currentBrackets: IBracket[]): IBracket[] =>
  currentBrackets.map((bracket, index) => ({
    ...bracket,
    errors: { min: '', max: '', equals: '' },
    status: index !== currentBrackets.length - 1 ? AVAILABLE : DISABLED
  }));

/**
 * Method used to add an additional bracket when lower than 3
 */
export const addAdditionalDisabledBracket = (displayBracketsData: IBracket[]): IBracket[] => {
  if (displayBracketsData.length < 3) {
    return [...displayBracketsData, { ...BASE_BRACKET_VALUE, [BRACKET_TYPE.STATUS]: DISABLED } as IBracket];
  }

  return displayBracketsData;
};

/**
 * Method used to get all accepted measurement array
 */
export const getAcceptedMeasurementTypeArray = (cube: ICube) => 
  cube.acceptedCorrelatedGoals ? Object.values(cube.acceptedCorrelatedGoals).map((type: any) => type.measurementType) : [];

/**
 * Method used to get upper case flatten array
 */
export const getUppercaseMeasurementTypeKeys = (currentAcceptedMeasurementTypes: string[][]): string[] => {
  const flattened = currentAcceptedMeasurementTypes.flat();
  return ArrayUtilities.flatArray(flattened).map(type => type.toUpperCase());
};

/**
 * Method used to push to frequency array based on time difference
 */
export const handleDateDifferences = (
  dateDifference: IDateDifference,
  setFrequencyTypes: (types: string[]) => void,
  frequencyTypes: string[]
): void => {
  const { dayDifference, monthDifference } = dateDifference;
  let returnedFrequencyTypes = [...frequencyTypes];

  if (dayDifference > TIME_DAY_CONSTRAINTS.WEEK) {
    returnedFrequencyTypes = [...frequencyTypes, FREQUENCY_TYPE.WEEKLY];
  }
  if (dayDifference > TIME_DAY_CONSTRAINTS.MONTH) {
    returnedFrequencyTypes = [...frequencyTypes, FREQUENCY_TYPE.WEEKLY, FREQUENCY_TYPE.MONTHLY];
  }
  if (monthDifference > TIME_MONTH_CONSTRAINTS.QUARTER) {
    returnedFrequencyTypes = [...frequencyTypes, FREQUENCY_TYPE.WEEKLY, FREQUENCY_TYPE.MONTHLY, FREQUENCY_TYPE.QUARTER];
  }

  setFrequencyTypes([...new Set([...returnedFrequencyTypes])]);
};

/**
 * Method used to get dropdown dropdown values
 */
export const getTimeValidityOptions = (
  formatMessage: (descriptor: { id: string }, values?: Record<string, any>) => string,
  count: number,
  type: { value: string; id: string }
) => {
  const dropdownOptions = [];
  let currentIndex = 0;
  
  for (let i = 0; i < count; i++) {
    const newDropdownOption = {
      value: `${++currentIndex}${type.value}`,
      label: formatMessage({ id: `launchProgram.cube.validity.${type.id}` }, { value: currentIndex })
    };

    dropdownOptions.push(newDropdownOption);
  }

  return dropdownOptions;
};

/**
 * Method used to get initial validation option
 */
export const getInitialValidityPoints = (
  formatMessage: (descriptor: { id: string }, values?: Record<string, any>) => string
) => {
  return {
    value: `1${TIME_DROPDOWN_OPTIONS.YEAR.VALUE}`,
    label: formatMessage({ id: `launchProgram.cube.validity.${TIME_DROPDOWN_OPTIONS.YEAR.LABEL}` }, { value: 1 })
  };
};

/**
 * Method used to get translated value for validityPoints selection
 */
export const translateValidityPoints = (
  formatMessage: (descriptor: { id: string }, values?: Record<string, any>) => string,
  value: string
) => {
  const type = value.slice(-1);
  const index = value.substring(0, value.length - 1);
  const option = Object.values(TIME_DROPDOWN_OPTIONS).find(opt => opt.VALUE === type);

  return {
    value: value,
    label: option ? formatMessage({ id: `launchProgram.cube.validity.${option.LABEL}` }, { value: index }) : ''
  };
};

/**
 * Method used to get all unique products ids
 */
export const getUniqueSelectedIds = (combinedFullProducts: { id: number }[]): number[] =>
  Array.from(new Set(combinedFullProducts.map(item => item.id)));

/**
 * Method used to get unique full products
 */
export const getUniqueFullProducts = <T extends { id: number }>(
  uniqueSelectedIds: number[],
  combinedFullProducts: T[]
): (T | undefined)[] =>
  uniqueSelectedIds.map(key => combinedFullProducts.find(obj => obj.id === key));

export default {
  extractCubeAllocationMechanisms,
  extractPointsData,
  getStyleForGoalDetails,
  getAllocationTypeFormsAvailability,
  getAllocationTypeId,
  processProductIdsGoal,
  getValidForSpecificProducts,
  buildGoalData,
  getSimpleAllocationFieldAvailability,
  processSimpleAllocationValues,
  getBracketLabelsByProgramAndMeasurementType,
  getBracketFieldsLabels,
  getBracketType,
  cubeFieldValidationManager,
  handleRequiredValidation,
  getBracket,
  getOnlyAvailableBrackets,
  getProcessedBrackets,
  getAllBracketsErrors,
  getDisabledBracket,
  setBracketStatusAvailable,
  isLastStepValidated,
  isMaximumGoalsAchieved,
  getCapitalizedMeasurementTypeValue,
  getPossibleAllocationData,
  getAllocationTypes,
  isAllocationMatched,
  getMatchedAllocationTypes,
  filterAllocationTypes,
  getBracketDisplayReady,
  addAdditionalDisabledBracket,
  getAcceptedMeasurementTypeArray,
  getUppercaseMeasurementTypeKeys,
  handleDateDifferences,
  getTimeValidityOptions,
  getInitialValidityPoints,
  translateValidityPoints,
  getUniqueSelectedIds,
  getUniqueFullProducts
};
