// -----------------------------------------------------------------------------
// useCubeDetailsForPdfCreation Hook
// Migrated from old_app/src/hooks/pdf/useCubeDetailsForPdfCreation.ts
// -----------------------------------------------------------------------------

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
} from '@/constants/wall/launch';
import {
  extractCubeAllocationMechanisms,
  extractPointsData,
  getBracketLabelsByProgramAndMeasurementType,
  type ICube
} from '@/services/cube/CubeServices';
import { hasNonNullValue } from '@/utils/general';

interface ILaunchData {
  type?: string | number;
  programJourney?: string;
  cube?: ICube;
  declarationManualValidation?: boolean;
  resultsManualValidation?: boolean;
  products?: { id: number; name: string }[];
  fullProducts?: { id: number; name: string }[];
  fullCategoriesProducts?: { id: number; name: string }[];
  simpleAllocation?: {
    type: number;
    min?: string;
    max?: string;
    value?: string;
  };
  manualValidation?: boolean;
}

interface IPdfDetails {
  mechanisms: string[] | null;
  correlatedGoals: boolean;
  translationsGoals: string[] | null;
  cube: ICube | null;
  declarationManualValidation: boolean | null;
  resultsManualValidation: boolean | null;
  pointsAllocationTranslation: string | null;
  pointsSpendingTranslation: string | null;
}

/**
 * Function used to calculate information based on brackets and create text specific to that information
 */
const getValueText = (main: { min?: string; max?: string; value?: string }, labels: Record<string, { value?: string }>) => {
  const hasRewardOnly = main.min || main.max;
  const rewardText = labels?.value?.value === 'percentage' ? `${main.value}% of rewards` : `${main.value}€`;
  let text = `Get ${rewardText}`;

  const getLabelValue = (labelValue?: string) => {
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
    const minUnit = labels?.min?.value ? getLabelValue(labels.min.value) : '';
    const maxUnit = labels?.max?.value ? getLabelValue(labels.max.value) : '';
    
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
 */
const createQuickLaunchDetailsForPdfCreation = (launchData: ILaunchData): IPdfDetails => {
  const { simpleAllocation, cube, type, manualValidation, resultsManualValidation } = launchData;
  const alloc = simpleAllocation || { type: 1 };

  const mechanisms = [alloc.type === MEASUREMENT_TYPES.VOLUME ? 'revenue' : VOLUME];
  const programType = Number(type) ? Number(type) : PROGRAM_TYPES[type as keyof typeof PROGRAM_TYPES] || null;

  const goalTranslation = (allocation: typeof alloc) => {
    if (!programType) return '';
    const labels = getBracketLabelsByProgramAndMeasurementType(programType, allocation.type || 1, BRACKET_INPUT_TYPE);
    return `${getValueText(allocation as { min?: string; max?: string; value?: string }, labels)}`;
  };

  const translationsGoals = [`Goal 1\n${goalTranslation(alloc)}`];
  const pointsConfig = cube ? extractPointsData(cube) : {};
  const pointsAllocationTranslation =
    PDF_ALLOCATION_FREQUENCIES[pointsConfig.allocationFrequency as keyof typeof PDF_ALLOCATION_FREQUENCIES] || PDF_ALLOCATION_FREQUENCIES['default'];

  const pointsSpendingTranslation =
    PDF_SPENDING_POINTS_FREQUENCIES[pointsConfig.spendType as keyof typeof PDF_SPENDING_POINTS_FREQUENCIES] || PDF_SPENDING_POINTS_FREQUENCIES['default'];

  return {
    mechanisms,
    correlatedGoals: false,
    translationsGoals,
    cube: null,
    declarationManualValidation: manualValidation || null,
    resultsManualValidation: resultsManualValidation || null,
    pointsAllocationTranslation,
    pointsSpendingTranslation
  };
};

/**
 * Hook used to create cube details for dynamic pdf creation
 */
export const useCubeDetailsForPdfCreation = (launchData: ILaunchData | null): IPdfDetails => {
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

  if (launchData.programJourney === QUICK) {
    return createQuickLaunchDetailsForPdfCreation(launchData);
  }

  const {
    cube,
    type,
    declarationManualValidation,
    resultsManualValidation,
    products = [],
    fullProducts = [],
    fullCategoriesProducts = []
  } = launchData;

  if (!cube) {
    return {
      mechanisms: null,
      correlatedGoals: false,
      translationsGoals: null,
      cube: null,
      declarationManualValidation: declarationManualValidation || null,
      resultsManualValidation: resultsManualValidation || null,
      pointsAllocationTranslation: null,
      pointsSpendingTranslation: null
    };
  }

  const programProducts = [...products, ...fullProducts, ...fullCategoriesProducts];
  const programProductsById = programProducts.reduce((acc: Record<number, string>, product) => {
    acc[product.id] = product.name;
    return acc;
  }, {});

  const pointsConfig = extractPointsData(cube);
  const pointsAllocationTranslation =
    PDF_ALLOCATION_FREQUENCIES[pointsConfig.allocationFrequency as keyof typeof PDF_ALLOCATION_FREQUENCIES] || PDF_ALLOCATION_FREQUENCIES['default'];
  const pointsSpendingTranslation =
    PDF_SPENDING_POINTS_FREQUENCIES[pointsConfig.spendType as keyof typeof PDF_SPENDING_POINTS_FREQUENCIES] || PDF_SPENDING_POINTS_FREQUENCIES['default'];
  
  const programType = Number(type) ? Number(type) : PROGRAM_TYPES[type as keyof typeof PROGRAM_TYPES] || null;
  const cubeMechanisms = extractCubeAllocationMechanisms(cube);
  const { goals = [], correlated } = cube;

  const mechanisms = cubeMechanisms.map(mechanism => {
    const mechanismType = ALLOCATION_MECHANISMS_TRANSLATIONS[mechanism.type?.toLowerCase() || 'default'] || ALLOCATION_MECHANISMS_TRANSLATIONS['default'];
    return programType ? mechanismType[programType] || mechanismType['default'] : mechanismType['default'];
  });

  const goalTranslations = goals.map(goal => {
    const goalTypeData = goal.allocationType 
      ? ALLOCATION_MECHANISM_TYPE[goal.allocationType as keyof typeof ALLOCATION_MECHANISM_TYPE] 
      : null;
    const { main } = goal;

    const getBracketsTranslation = (goalItem: typeof goal, labels: Record<string, any>) => {
      return goalItem.brackets.map(bracket => {
        const bracketType = goalTypeData?.type === 'ranking' ? `Rank ${bracket.crt}` : `Tier ${bracket.crt}`;
        return `${bracketType}: ${getValueText(bracket as { min?: string; max?: string; value?: string }, labels)}`;
      });
    };

    if (!programType || !goalTypeData) return '';

    switch (goalTypeData.category) {
      case SIMPLE: {
        const labels = getBracketLabelsByProgramAndMeasurementType(
          programType,
          goal.measurementType || 1,
          BRACKET_INPUT_TYPE
        );
        return `${getValueText(main, labels)}`;
      }
      case BRACKET: {
        const labels = getBracketLabelsByProgramAndMeasurementType(
          programType,
          goal.measurementType || 1,
          BRACKET_INPUT_TYPE
        );
        const bracketsTranslation = getBracketsTranslation(goal, labels);
        return `${bracketsTranslation.join('\n')}`;
      }
      case GROWTH: {
        const labels = getBracketLabelsByProgramAndMeasurementType(
          programType,
          goal.measurementType || 1,
          GROWTH_INPUT_TYPE
        );
        const bracketsTranslation = getBracketsTranslation(goal, labels);
        return `${bracketsTranslation.join('\n')}`;
      }
      case RANKING: {
        const labels = getBracketLabelsByProgramAndMeasurementType(
          programType,
          goal.measurementType || 1,
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
    declarationManualValidation: declarationManualValidation || null,
    resultsManualValidation: resultsManualValidation || null,
    pointsAllocationTranslation,
    pointsSpendingTranslation
  };
};

export default useCubeDetailsForPdfCreation;
