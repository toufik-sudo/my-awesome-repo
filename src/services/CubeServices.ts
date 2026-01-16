/* eslint-disable quotes */
import StringUtilities from 'utils/StringUtilities';
import ArrayUtilities from 'utils/ArrayUtilities';
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
  GROWTH
} from 'constants/wall/launch';
import { convertAsciiToString, convertToFloatNumber, getKeyByValue } from 'utils/general';
import { DEPENDS_ON, HIGHER_THAN, LOWER_THAN, REGEX, REQUIRED } from 'constants/validation';
import { RANKING } from 'constants/api';

/**
 * Extracts allocation mechanism types
 * @param cube
 */
export const extractCubeAllocationMechanisms = cube => {
  if (!cube || !ArrayUtilities.isNonEmptyArray(cube.goals)) {
    return [];
  }

  const mechanisms = cube.goals.reduce((mechanisms, { allocationType }) => {
    const mechanism = ALLOCATION_MECHANISM_TYPE[allocationType];
    if (!allocationType || !cube || !ArrayUtilities.isNonEmptyArray(cube.goals)) {
      return [];
    }
    if (!mechanisms[mechanism.type]) {
      mechanisms[mechanism.type] = {
        allocationType,
        ...mechanism
      };
    }

    return mechanisms;
  }, {});

  return Object.values(mechanisms);
};

/**
 * Extract points configuration details from cibe.
 * @param cube
 */
export const extractPointsData = cube => {
  if (!cube || !ArrayUtilities.isNonEmptyArray(cube.goals)) {
    return {};
  }

  return {
    allocationFrequency: cube.frequencyOfAllocation || FREQUENCY_TYPE_VALUES[cube.frequencyAllocation],
    spendType: cube.spendType,
    managerRatio: cube.rewardManagers || 0
  };
};

export const getStyleForGoalDetails = designColors => {
  return Object.keys(ALLOCATION_MECHANISM_TYPE).reduce((acc, key) => {
    const { category, type } = ALLOCATION_MECHANISM_TYPE[key];
    acc[key] = {};
    if (category === SIMPLE || category === BRACKET || category===GROWTH || category===RANKING ) {
      acc[key] = getStyleByGoalMeasurementType(designColors, type);
    }

    return acc;
  }, {});
};

const getStyleByGoalMeasurementType = (designColors, type: string) => {
  let color = designColors.colorContent;

  if (StringUtilities.equalsIgnoreCase(type, VOLUME)) {
    color = designColors.colorTask;
  }

  return { color };
};

/**
 * Method returns boolean for allocation type form availability
 *
 * @param currentGoal
 * @param type
 * @param productIds
 */
export const getAllocationTypeFormsAvailability = (currentGoal, type, productIds, categoryIds) => {
  const allBeforeCompleted =
    currentGoal.measurementType &&
    currentGoal.validated[CUBE_SECTIONS.MEASUREMENT_TYPE] &&
    currentGoal.validated[CUBE_SECTIONS.SPECIFIC_PRODUCTS];
  const onlyMeasurementTypeCompleted =
    type !== SPONSORSHIP && !productIds && currentGoal.validated[CUBE_SECTIONS.MEASUREMENT_TYPE];

  let noProductsOrValidateProduct;
  if (type === SPONSORSHIP) {
    if (productIds || categoryIds) {
      noProductsOrValidateProduct = currentGoal.validated[CUBE_SECTIONS.SPECIFIC_PRODUCTS];
    } else {
      noProductsOrValidateProduct = true;
    }
  }
  return allBeforeCompleted || onlyMeasurementTypeCompleted || noProductsOrValidateProduct;
};

/**
 * Method used to get the allocation type id
 *
 * @param step
 * @param measurementType
 */
export const getAllocationTypeId = (step, measurementType) => {
  return ALLOCATION_TYPES[step][measurementType || MEASUREMENT_TYPES.QUANTITY];
};

/**
 * Method used to return product
 * @param cube
 * @param index
 * @param newProductId
 */
export const processProductIdsGoal = (cube, index, newProductId) => {
  const updatedProductsIds = cube.goals[index].productIds;

  if (!updatedProductsIds) return [newProductId];

  if (updatedProductsIds && updatedProductsIds.includes(newProductId)) {
    return updatedProductsIds.filter(id => id !== newProductId);
  }

  if (updatedProductsIds && !updatedProductsIds.includes(newProductId)) {
    return [...updatedProductsIds, newProductId];
  }
};

/**
 * Method returns boolean if the validate meets all requirements
 *
 * @param specificProducts
 * @param cube
 * @param index
 */
export const getValidForSpecificProducts = (specificProducts, cube, index) => {
  if (specificProducts !== null) {
    return !specificProducts || (specificProducts && !!cube.goals[index].productIds.length);
  }
};

/**
 * Method used to replace an empty goal
 */
export const buildGoalData = () => {
  return {
    [CUBE_SECTIONS.SPECIFIC_PRODUCTS]: null,
    [CUBE_SECTIONS.MEASUREMENT_TYPE]: null,
    [CUBE_SECTIONS.MEASUREMENT_NAME]: null,
    [CUBE_SECTIONS.ALLOCATION_TYPE]: null,
    acceptedTypes: [...CUBE_ALLOCATION_CATEGORY],
    measurementTypesValid: Object.keys(MEASUREMENT_TYPES),
    productIds: [],
    validated: {
      [CUBE_SECTIONS.SPECIFIC_PRODUCTS]: false,
      [CUBE_SECTIONS.MEASUREMENT_TYPE]: false,
      [CUBE_SECTIONS.ALLOCATION_TYPE]: false
    }
  };
};

/**
 * Method used to return boolean if allocation fields are all correct
 *
 * @param form
 */
export const getSimpleAllocationFieldAvailability = form =>
  form.values[Object.keys(form.values).map(key => key)[0]] && !Object.keys(form.errors).length;

/**
 * Method used to process simple allocation values
 *
 * @param values
 */
export const processSimpleAllocationValues = values => {
  const [value, min, max] = Object.keys(values);

  return {
    value: values[value],
    min: values[min],
    max: values[max]
  };
};

/**
 * Used for mapping programType and measurmentType to the according labels when their values can be string or number
 *
 * @param programType
 * @param measurementType
 */
const getProgramMeasurementLabels = (programType, measurementType) => {
  const programTypeKey = StringUtilities.isString(programType)
    ? programType
    : getKeyByValue(PROGRAM_TYPES, programType);
  if (!Number(measurementType) && measurementType && StringUtilities.isString(measurementType)) {
    return { programTypeKey, measurementTypeLabel: measurementType.toLowerCase() };
  }

  return {
    programTypeKey,
    measurementTypeLabel: measurementType === MEASUREMENT_TYPES.VOLUME ? VOLUME : UNITS
  };
};

/**
 * Returns bracket fields labels for given programType and measurement type
 * @param programType
 * @param measurementType
 * @param inputType
 */
export const getBracketLabelsByProgramAndMeasurementType = (
  programType: number,
  measurementType: string,
  inputType
) => {
  const { programTypeKey, measurementTypeLabel } = getProgramMeasurementLabels(programType, measurementType);
  const measurementTypeKey = MEASUREMENT_TYPE_LABELS[measurementTypeLabel];
  const measurement = BRACKET_FORM_TYPE[programTypeKey][measurementTypeKey];

  return getBracketFieldsLabels(measurement, programTypeKey, inputType);
};
/**
 * Method used to get bracket fields labels
 *
 * @param bracketFormType
 * @param type
 * @param inputType
 */
export const getBracketFieldsLabels = (bracketFormType, type, inputType) => {
  let baseTranslation = inputType[type];

  if (type !== SPONSORSHIP) {
    baseTranslation = baseTranslation[bracketFormType];
  }

  return baseTranslation;
};

/**
 * Method used to get bracket type
 *
 * @param type
 * @param measurementType
 */
export const getBracketType = (type, measurementType) => {
  let bracketFormType = BRACKET_FORM_TYPE[type];

  if (type !== SPONSORSHIP) {
    const measurementTypeKey = getKeyByValue(MEASUREMENT_TYPES, measurementType).toLowerCase();
    bracketFormType = BRACKET_FORM_TYPE[type][measurementTypeKey];
  }

  return bracketFormType;
};

/**
 * Method used to handle validation on cube field
 *
 * @param validation
 * @param value
 * @param bracketsData
 * @param index
 */
export const cubeFieldValidationManager = (validation, value, bracketsData, index) => {
  const { currentBracket, nextBracket, previousBracket } = getBracket(bracketsData, index);
  const translationPrefix = 'form.validation';

  return (
    Object.keys(validation)
      .map(key => {
        const comparedToValue = currentBracket[validation[key]];
        const isNextAvailable =
          validation[key].type === NEXT &&
          nextBracket &&
          nextBracket[validation[key].target] &&
          nextBracket.status !== DISABLED;
        const isPreviousAvailable =
          validation[key].type === PREVIOUS && previousBracket && previousBracket[validation[key].target];

        switch (key) {
          case REGEX:
            return value && !validation[key].test(value) && `${translationPrefix}.percentage`;

          case LOWER_THAN:
            if (isNextAvailable) {
              return (
                convertToFloatNumber(value) > convertToFloatNumber(nextBracket[validation[key].target]) &&
                `${translationPrefix}.lowerThan`
              );
            }
            if (comparedToValue) {
              return (
                convertToFloatNumber(value) >= convertToFloatNumber(currentBracket[validation[key]]) &&
                `${translationPrefix}.lowerThan`
              );
            }

            return false;

          case HIGHER_THAN:
            if (isPreviousAvailable) {
              return (
                convertToFloatNumber(value) < convertToFloatNumber(previousBracket[validation[key].target]) &&
                `${translationPrefix}.higherThan`
              );
            }
            if (comparedToValue) {
              return (
                convertToFloatNumber(value) <= convertToFloatNumber(currentBracket[validation[key]]) &&
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
      .filter(value => value)[0] || ''
  );
};

/**
 * Method used to handle required cube validation
 *
 * @param index
 * @param validation
 * @param value
 * @param bracketsData
 */
export const handleRequiredValidation = (index, validation, value, bracketsData) => {
  if (index === 0 && validation.required.only === BRACKET_TYPE.FROM) {
    return false;
  }

  if (index && validation.required.only === BRACKET_TYPE.TO && index + 3 !== bracketsData.length) {
    return false;
  }

  return !value && 'form.validation.required';
  
};

/**
 * Method used to return next/current/previous bracket
 *
 * @param bracketsData
 * @param index
 */
export const getBracket = (bracketsData, index) => {
  const updatedBracketsData = bracketsData;
  const nextBracket = updatedBracketsData[index + 1];
  const currentBracket = updatedBracketsData[index];
  const previousBracket = updatedBracketsData[index - 1];

  return { updatedBracketsData, nextBracket, currentBracket, previousBracket };
};

/**
 * Method used to get only available brackets
 *
 * @param bracketsData
 */
export const getOnlyAvailableBrackets = bracketsData => {
  return bracketsData.filter((bracketData, index) => {
    const isBracketEmpty = !bracketData.min && !bracketData.max && !bracketData.value && index > 1;
    if (isBracketEmpty) return false;

    return bracketData.status !== DISABLED;
  });
};

/**
 * Method used to return a bracket format that it's used on backend side
 *
 * @param data
 */
export const getProcessedBrackets = data =>
  data.map(({ min, max, value }, index) => ({ min, max, value, crt: convertAsciiToString(index) }));

/**
 * Method used to get all brackets errors
 *
 * @param onlyAvailableData
 * @param handleBracketValidation
 * @param fieldLabels
 */
export const getAllBracketsErrors = (onlyAvailableData, handleBracketValidation, fieldLabels) => {
  let errorsList = [];

  onlyAvailableData.map((bracket, index) => {
    errorsList = [
      ...errorsList,
      handleBracketValidation(
        BRACKET_TYPE.FROM,
        bracket[BRACKET_TYPE.FROM],
        index,
        fieldLabels[BRACKET_TYPE.FROM].validations
      ),
      handleBracketValidation(
        BRACKET_TYPE.TO,
        bracket[BRACKET_TYPE.TO],
        index,
        fieldLabels[BRACKET_TYPE.TO].validations
      ),
      handleBracketValidation(
        BRACKET_TYPE.EQUALS,
        bracket[BRACKET_TYPE.EQUALS],
        index,
        fieldLabels[BRACKET_TYPE.EQUALS].validations
      )
    ].filter(bracket => bracket);
  });

  return errorsList;
};

/**
 * Method used to get the disabled bracket
 *
 * @param bracketsData
 */
export const getDisabledBracket = bracketsData => bracketsData.filter(bracket => bracket.status === DISABLED)[0];

/**
 * Method used to set bracket status to available
 *
 * @param bracketsData
 * @param index
 * @param bracket
 */
export const setBracketStatusAvailable = (bracketsData, index, bracket) => {
  const updatedBracketsData = bracketsData;

  updatedBracketsData.splice(index, 1, {
    ...bracket,
    [BRACKET_TYPE.STATUS]: AVAILABLE
  });

  return updatedBracketsData;
};

/**
 * Method used to return boolean on last step validated
 *
 * @param goal
 */
export const isLastStepValidated = goal => {
  const validationKeys = Object.keys(goal.validated);

  return validationKeys.map(key => goal.validated[key])[validationKeys.length - 1];
};

/**
 * Method used to return boolean on max length
 *
 * @param cube
 */
export const isMaximumGoalsAchieved = cube => cube.goals.length < MAXIMUM_GOALS_NUMBER;

/**
 * Method used to return capitalied measurement type
 * @param measurementType
 */
export const getCapitalizedMeasurementTypeValue = measurementType => {
  return new StringUtilities().capitalize(getKeyByValue(MEASUREMENT_TYPES, measurementType).toLowerCase());
};

/**
 * Method used to get data ready to be sent to backend
 *
 * @param allocationType
 * @param measurementType
 */
export const getPossibleAllocationData = ({ allocationType, measurementType, productIds, specificProducts }) => {
  if (allocationType) {
    let measurementTypeParam = measurementType;
    if (measurementType == 3) {
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
 *
 * @param cube
 */
export const getAllocationTypes = cube => cube.goals.map(goal => getPossibleAllocationData(goal)).filter(goal => goal);

/**
 * Method used to check if current allocation matches the filtered results
 *
 * @param type
 * @param currentAllocationTypes
 * @param measurementType
 * @param allocation
 */
export const isAllocationMatched = (type, currentAllocationTypes, measurementType, allocation) => {
  return (
    type.allocationType === currentAllocationTypes[allocation][measurementType] &&
    type.measurementType === getCapitalizedMeasurementTypeValue(measurementType)
  );
};

/**
 * Method used to get all matched allocation types
 *
 * @param filteredAllocationTypes
 * @param currentAllocationTypes
 * @param measurementType
 * @param allocation
 */
export const getMatchedAllocationTypes = (
  filteredAllocationTypes,
  currentAllocationTypes,
  measurementType,
  allocation
) =>
  filteredAllocationTypes.some(type => {
    return (
      type.allocationType === currentAllocationTypes[allocation][measurementType] &&
      type.measurementType === getCapitalizedMeasurementTypeValue(measurementType)
    );
  });

/**
 * Method used to filter allocation types
 *
 * @param currentAllocationTypes
 * @param filteredAllocationTypes
 * @param measurementType
 * @param index
 *
 * NOTE: if the index is higher than 0 and no compatible allocation type is found, the returned array will be empty
 */
export const filterAllocationTypes = (currentAllocationTypes, filteredAllocationTypes, measurementType, index) => {
  // if we have only 1 goal, we need to reset the filteredAllocationTypes in order to let the user select any goal type
  if (index === 0 && filteredAllocationTypes.length) {
    filteredAllocationTypes = [];
  }
  if (filteredAllocationTypes.length) {
    return Object.keys(currentAllocationTypes).filter(allocation => {
      return filteredAllocationTypes.some(type => {
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
 * Method used to get bracket ready to be displayed (errors + status)
 *
 * @param currentBrackets
 */
export const getBracketDisplayReady = currentBrackets =>
  currentBrackets.map((bracket, index) => ({
    ...bracket,
    errors: { min: '', max: '', equals: '' },
    status: index !== currentBrackets.length - 1 ? AVAILABLE : DISABLED
  }));

/**
 * Method used to add an additional bracket when lower than 3
 *
 * @param displayBracketsData
 */
export const addAdditionalDisabledBracket = displayBracketsData => {
  if (displayBracketsData.length < 3) {
    return [...displayBracketsData, { ...BASE_BRACKET_VALUE, [BRACKET_TYPE.STATUS]: DISABLED }];
  }

  return displayBracketsData;
};

/**
 * Method used to get all accepted measurement array
 *
 * @param cube
 */
export const getAcceptedMeasurementTypeArray = cube => cube.acceptedCorrelatedGoals.map(type => type.measurementType);

/**
 * Method used to get upper case flatten array
 *
 * @param currentAcceptedMeasurementTypes
 */
export const getUppercaseMeasurementTypeKeys = currentAcceptedMeasurementTypes => {
  const arrayUtilities = new ArrayUtilities();

  return arrayUtilities.flatArray(currentAcceptedMeasurementTypes).map(type => type.toUpperCase());
};

/**
 * Method used to push to frequency array based on time difference
 *
 * @param dateDifference
 * @param setFrequencyTypes
 * @param frequencyTypes
 */
export const handleDateDifferences = (dateDifference, setFrequencyTypes, frequencyTypes) => {
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

  // @ts-ignore
  setFrequencyTypes([...new Set([...returnedFrequencyTypes])]);
};

/**
 * Method used to get dropdown dropdown values
 * @param formatMessage
 * @param count
 * @param type
 */
export const getTimeValidityOptions = (formatMessage, count, type) => {
  const dropdownOptions = [];
  let currentIndex = 0;
  for (let i = 0; i < count; i++) {
    const newDropdownOption = {
      value: `${++currentIndex}${type.value}`,
      label: `${formatMessage({ id: `launchProgram.cube.validity.${type.id}` }, { value: currentIndex })}`
    };

    dropdownOptions.push(newDropdownOption);
  }

  return dropdownOptions;
};

/**
 * Method used to get initial validation option
 *
 * @param formatMessage
 */
export const getInitialValidityPoints = formatMessage => {
  return {
    value: `1${TIME_DROPDOWN_OPTIONS.YEAR.VALUE}`,
    label: `${formatMessage({ id: `launchProgram.cube.validity.${TIME_DROPDOWN_OPTIONS.YEAR.LABEL}` }, { value: 1 })}`
  };
};

/**
 * Method used to get translated value for validityPoints selection
 *
 * @param formatMessage
 * @param value
 */
export const translateValidityPoints = (formatMessage, value) => {
  const type = value.slice(-1);
  const index = value.substr(0, value.length - 1);
  const option = Object.values(TIME_DROPDOWN_OPTIONS).find(option => option.VALUE == type);

  return {
    value: value,
    label: `${formatMessage({ id: `launchProgram.cube.validity.${option.LABEL}` }, { value: index })}`
  };
};

/**
 * Method used to get all unique products ids
 *
 * @param combinedFullProducts
 */
export const getUniqueSelectedIds = combinedFullProducts =>
  Array.from(new Set(combinedFullProducts.map(item => item.id)));

/**
 * Method used to get unique full products
 *
 * @param uniqueSelectedIds
 * @param combinedFullProducts
 */
export const getUniqueFullProducts = (uniqueSelectedIds, combinedFullProducts) =>
  uniqueSelectedIds.map(key => combinedFullProducts.find(obj => obj.id === key));
