/* eslint-disable quotes */
import { REVENUE } from 'constants/wall/dashboard';
import {
  ALLOCATION_MECHANISM_TYPE,
  ALLOCATION_MECHANISMS_TRANSLATIONS,
  BRACKET,
  BRACKET_INPUT_TYPE,
  FREEMIUM,
  GOAL_PRODUCTS_TO_DISPLAY,
  GROWTH,
  GROWTH_INPUT_TYPE,
  MEASUREMENT_TYPES,
  PDF_ALLOCATION_FREQUENCIES,
  PDF_SPENDING_POINTS_FREQUENCIES,
  PROGRAM_TYPES,
  QUICK,
  RANKING,
  RANKING_INPUT_TYPE,
  SIMPLE,
  VOLUME
} from 'constants/wall/launch';
import {
  extractCubeAllocationMechanisms,
  extractPointsData,
  getBracketLabelsByProgramAndMeasurementType
} from 'services/CubeServices';
import { hasNonNullValue } from 'utils/general';

/**
 * Hook used to create cube details for dynamic pdf creation
 *
 * @param launchData
 */
export const useCubeDetailsForPdfCreation = launchData => {
  if (!launchData || launchData.type === FREEMIUM) {
    return {
      mechanisms: null,
      correlatedGoals: false,
      translationsGoals: null,
      cube: null,
      declarationManualValidation: null,
      resultsManualValidation: null,
      pointsAllocationTranslation: null,
      pointsSpendingTranslation: null
    };
  }

  if (launchData.programJourney == QUICK) {
    return createQuickLaunchDetailsForPdfCreation(launchData);
  }

  const {
    cube = {},
    type,
    declarationManualValidation,
    resultsManualValidation,
    products = [],
    fullProducts = [],
    fullCategoriesProducts = []
  } = launchData;
  const programProducts = [...products, ...fullProducts, ...fullCategoriesProducts];
  const programProductsById = programProducts.reduce((acc, product) => {
    acc[product.id] = product.name;
    return acc;
  }, {});

  const pointsConfig = extractPointsData(cube);
  const pointsAllocationTranslation =
    PDF_ALLOCATION_FREQUENCIES[pointsConfig.allocationFrequency] || PDF_ALLOCATION_FREQUENCIES['default'];
  const pointsSpendingTranslation =
    PDF_SPENDING_POINTS_FREQUENCIES[pointsConfig.spendType] || PDF_SPENDING_POINTS_FREQUENCIES['default'];
  const programType = Number(type) ? type : PROGRAM_TYPES[type] || null;
  const cubeMechanisms = extractCubeAllocationMechanisms(cube);
  const { goals = [], correlated } = cube;
  const mechanisms = cubeMechanisms.map(mechanism => {
    const mechanismType = ALLOCATION_MECHANISMS_TRANSLATIONS[mechanism['type'].toLowerCase() || 'default'];

    return mechanismType[programType] || mechanismType['default'];
  });
  const goalTranslations = goals.map(goal => {
    const goalType = ALLOCATION_MECHANISM_TYPE[goal.allocationType] || {};
    const { main } = goal;

    const getBracketsTranslation = (goal, labels) => {
      return goal.brackets.map(bracket => {
        const bracketType = goalType.type == 'ranking' ? `Rank ${bracket.crt}` : `Tier ${bracket.crt}`;

        return `${bracketType}: ${getValueText(bracket, labels)}`;
      });
    };

    switch (goalType.category) {
      case SIMPLE: {
        const labels = getBracketLabelsByProgramAndMeasurementType(
          programType,
          goal.measurementType,
          BRACKET_INPUT_TYPE
        );

        return `${getValueText(main, labels)}`;
      }
      case BRACKET: {
        const labels = getBracketLabelsByProgramAndMeasurementType(
          programType,
          goal.measurementType,
          BRACKET_INPUT_TYPE
        );
        const bracketsTranslation = getBracketsTranslation(goal, labels);

        return `${bracketsTranslation.join('\n')}`;
      }
      case GROWTH: {
        const labels = getBracketLabelsByProgramAndMeasurementType(
          programType,
          goal.measurementType,
          GROWTH_INPUT_TYPE
        );
        const bracketsTranslation = getBracketsTranslation(goal, labels);

        return `${bracketsTranslation.join('\n')}`;
      }
      case RANKING: {
        const labels = getBracketLabelsByProgramAndMeasurementType(
          programType,
          goal.measurementType,
          RANKING_INPUT_TYPE
        );
        const bracketsTranslation = getBracketsTranslation(goal, labels);

        return `${bracketsTranslation.join('\n')}`;
      }
      default:
        return '';
    }
  });
  const translationsGoals = goalTranslations.map((goal, index) => {
    const goalTranslation = `Goal ${index + 1}\n${goal}`;
    const goalProducts =
      (goals[index].productIds && goals[index].productIds.map(productId => programProductsById[productId])) || [];
    const productsToDisplay = goalProducts.slice(0, GOAL_PRODUCTS_TO_DISPLAY + 1);
    let productsTranslation = '';
    if (productsToDisplay.length > 0) {
      productsTranslation = `Products added to this goal: ${productsToDisplay.join(', ')}`;
    }

    return `${goalTranslation} \n ${productsTranslation}`;
  });

  return {
    mechanisms,
    correlatedGoals: correlated,
    translationsGoals,
    cube,
    declarationManualValidation,
    resultsManualValidation,
    pointsAllocationTranslation,
    pointsSpendingTranslation
  };
};

/**
 * Function used to calculate information based on brackets and create text specific to that information
 *
 * @param main
 * @param labels
 */
const getValueText = (main, labels) => {
  const hasRewardOnly = main.min || main.max;
  const rewardText = labels.value.value === 'percentage' ? `${main.value}% of rewards` : `${main.value}€`;
  let text = `Get ${rewardText}`;

  const getLabelValue = labelValue => {
    switch (labelValue) {
      case 'percentage':
        return '%';
      case 'sales':
        return 'sales';
      case 'euro':
        return '€';
      default:
        return '';
    }
  };

  if (hasRewardOnly !== '') {
    const hasMinThreshold = !!main.min && hasNonNullValue(main.min) && !!Number(main.min);
    const hasMaxThreshold = !!main.max && hasNonNullValue(main.max) && !!Number(main.max);
    const minUnit = labels.min && labels.min.value ? getLabelValue(labels.min.value) : '';
    const maxUnit = labels.max && labels.max.value ? getLabelValue(labels.min.value) : '';
    if (!hasMinThreshold || !hasMaxThreshold) {
      text = hasMinThreshold
        ? `From ${main.min} ${minUnit} to get ${rewardText}.`
        : `Up to ${main.max} ${maxUnit} to get ${rewardText}.`;
    }
    if (hasMinThreshold && hasMaxThreshold) {
      text = `From ${main.min} ${minUnit} to ${main.max} ${maxUnit} to get ${rewardText}`;
    }
  }

  return text;
};

/**
 * Function used to create pdf data based on simplified allocation for quick launch
 *
 * @param launchData
 */
const createQuickLaunchDetailsForPdfCreation = launchData => {
  const { simpleAllocation = {}, cube = {}, type, manualValidation, resultsManualValidation } = launchData;

  const mechanisms = [simpleAllocation.type == MEASUREMENT_TYPES.VOLUME ? REVENUE : VOLUME];
  const programType = Number(type) ? type : PROGRAM_TYPES[type] || null;

  const goalTranslation = simpleAllocation => {
    const labels = getBracketLabelsByProgramAndMeasurementType(programType, simpleAllocation.type, BRACKET_INPUT_TYPE);

    return `${getValueText(simpleAllocation, labels)}`;
  };

  const translationsGoals = [`Goal 1\n${goalTranslation(simpleAllocation)}`];
  const pointsConfig = extractPointsData(cube);
  const pointsAllocationTranslation =
    PDF_ALLOCATION_FREQUENCIES[pointsConfig.allocationFrequency] || PDF_ALLOCATION_FREQUENCIES['default'];

  const pointsSpendingTranslation =
    PDF_SPENDING_POINTS_FREQUENCIES[pointsConfig.spendType] || PDF_SPENDING_POINTS_FREQUENCIES['default'];

  return {
    mechanisms,
    correlatedGoals: false,
    translationsGoals,
    cube: null,
    declarationManualValidation: manualValidation,
    resultsManualValidation,
    pointsAllocationTranslation,
    pointsSpendingTranslation
  };
};
