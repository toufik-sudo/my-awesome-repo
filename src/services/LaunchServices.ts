// -----------------------------------------------------------------------------
// Launch Services
// Migrated from old_app/src/services/LaunchServices.ts
// -----------------------------------------------------------------------------

import { FORM_FIELDS } from '@/constants/forms';
import { DOT_SEPARATOR, NAME } from '@/constants/general';
import { LAUNCH_PROGRAM_FIRST } from '@/constants/wall/launch';
import {
  CUBE_SECTIONS,
  PROGRAM,
  USERS,
  REWARDS,
  PRODUCTS,
  RESULTS,
  REWARDS_FULL,
  DESIGN,
  ECARD,
  CONTENTS,
  IA
} from '@/constants/wall/launch';
import { CUSTOMISE_COLORS } from '@/constants/wall/design';
import { buildFormField } from '@/services/FormServices';
import { objectToArrayKey } from '@/utils/general';

// Types
export interface ILaunchStep {
  name: string;
  available: boolean;
  component?: React.ComponentType;
  steps?: ILaunchSubStep[];
}

export interface ILaunchSubStep {
  component?: React.ComponentType;
  name?: string;
}

export interface IDropzoneTitle {
  className: string;
  type: string;
}

export interface IGoalData {
  measurementType: null;
  measurementName: null;
  allocationType: null;
  productIds: unknown[];
  validated: {
    measurementType: boolean;
    allocationType: boolean;
  };
}

export interface ISocialNetwork {
  value: string;
  active: boolean;
  canNextStep: boolean;
  hasError?: boolean;
}

// Dropzone title types
export const DROPZONE_TITLE_TYPE = {
  TITLE: 'title',
  ERROR: 'error'
} as const;

// Network error
export const NETWORK_ERROR = {
  message: 'Network Error',
  code: 'NETWORK_ERROR'
} as const;

// Can next step flag
export const CAN_NEXT_STEP = 'canNextStep';

/**
 * Process launch steps and set availability on each step
 */
export const processLaunchSteps = (
  allLaunchSteps: Record<string, ILaunchStep>,
  launchSteps: string[]
): ILaunchStep[] =>
  Object.keys(allLaunchSteps).map(key => ({
    ...allLaunchSteps[key],
    available: launchSteps.includes(allLaunchSteps[key].name)
  }));

/**
 * Returns only the quick launch steps
 */
export const getOnlyQuickLaunchSteps = (
  allLaunchSteps: Record<string, ILaunchStep>,
  quickLaunchSteps: string[]
): ILaunchStep[] => {
  const processedSteps: ILaunchStep[] = [];

  Object.keys(allLaunchSteps).forEach(key => {
    if (quickLaunchSteps.includes(allLaunchSteps[key].name)) {
      processedSteps.push(allLaunchSteps[key]);
    }
  });

  return processedSteps;
};

/**
 * Returns boolean on each step if it's available
 */
export const getAvailableStatus = (
  currentStepIndex: number,
  launchSteps: ILaunchStep[],
  stepIndex: number
) => ({
  prevAvailable: stepIndex > 1 || !!launchSteps[currentStepIndex - 1],
  nextAvailable: currentStepIndex < launchSteps.length - 1
});

/**
 * Returns style based on the current state
 */
export const processBarItemStyle = (
  stepDetail: {
    step: string;
    steps: Record<string, ILaunchStep>;
    stepKey: string;
    currentActiveStep: number;
  },
  index: number,
  style: {
    progressBarStepActive: string;
    progressBarStepNotAvailable: string;
    progressBarStepCompleted: string;
  }
) => {
  const { progressBarStepActive, progressBarStepNotAvailable, progressBarStepCompleted } = style;
  const { step, steps, stepKey, currentActiveStep } = stepDetail;

  const progressActive = step === steps[stepKey].name ? progressBarStepActive : '';
  const progressAvailable = !steps[stepKey].available ? progressBarStepNotAvailable : '';
  const progressCompleted = index <= currentActiveStep ? progressBarStepCompleted : '';

  return { progressActive, progressAvailable, progressCompleted };
};

/**
 * Returns active step progress class
 */
export const getProgressActive = (
  stepIndex: string | number,
  index: number,
  style: { progressActive: string }
): string => (index <= parseInt(String(stepIndex)) ? style.progressActive : '');

/**
 * Returns only quick launch steps by name
 */
export const getActiveSteps = (
  launchSteps: string[],
  launchStepTypes: Record<string, ILaunchStep>
): string[] => {
  const filteredSteps = getOnlyQuickLaunchSteps(launchStepTypes, launchSteps);
  return filteredSteps.map(step => step.name);
};

/**
 * Filters messages that start with custom text
 */
export const launchProgramsTranslations = (
  messages: Record<string, string>,
  start: string,
  end: string
): string[] => Object.keys(messages).filter(key => key.startsWith(start) && !key.endsWith(end));

/**
 * Process the selection of a quick launch option
 */
export const processLaunchSelection = (selection: string) => {
  const [category, key, value] = selection.split(DOT_SEPARATOR);
  return { category, key, value };
};

/**
 * Sets value for start/end date in Range Datepicker
 */
export const setValue = (
  date: Date,
  type: 'startDate' | 'endDate',
  form: { setFieldValue: (field: string, value: unknown) => void; values: Record<string, unknown> }
) => {
  const { setFieldValue, values } = form;
  setFieldValue(FORM_FIELDS.PROGRAM_DURATION, {
    ...(values[FORM_FIELDS.PROGRAM_DURATION] as object),
    [type]: date
  });
};

/**
 * Returns dropzone title configuration
 */
export const getDropzoneTitle = (
  rejectedFiles: File[],
  serverError: string | null,
  styles: { userListDropzoneTitle: string; userListDropzoneTitleError: string }
): IDropzoneTitle => {
  let output: IDropzoneTitle = { className: styles.userListDropzoneTitle, type: DROPZONE_TITLE_TYPE.TITLE };

  if (rejectedFiles.length) {
    output = { className: styles.userListDropzoneTitleError, type: DROPZONE_TITLE_TYPE.ERROR };
  }

  if (serverError) {
    output = { className: styles.userListDropzoneTitleError, type: serverError };
  }

  return output;
};

/**
 * Returns boolean if there are invalid emails available
 */
export const hasInvalidEmail = (uploadResponse: {
  data?: { invalidRecords?: unknown[] };
} | null): boolean =>
  !uploadResponse ||
  !uploadResponse.data ||
  !uploadResponse.data.invalidRecords ||
  !uploadResponse.data.invalidRecords.length;

/**
 * Checks if StepIndex is a number
 */
export const checkIfStepIndexIsNumber = (stepIndex: string): boolean => /^\d+$/.test(stepIndex);

/**
 * Checks if form is completed
 */
export const isFormCompleted = (form: {
  values: Record<string, unknown>;
}): boolean =>
  Object.keys(form.values).some(
    key =>
      !form.values[key] ||
      (key === FORM_FIELDS.PROGRAM_DURATION &&
        !(form.values[key] as { end?: unknown }).end)
  );

/**
 * Checks if parameters form is completed
 */
export const isParametersFormCompleted = (form: {
  values: { programName?: string };
}): boolean => !form.values.programName;

/**
 * Validates submit form button based on plan type
 */
export const validateSubmitFormButton = (
  form: { values: Record<string, unknown> },
  isFreePlan: boolean
): boolean => {
  if (isFreePlan) return isParametersFormCompleted(form as { values: { programName?: string } });
  return isFormCompleted(form);
};

/**
 * Checks if Goal Options form is completed
 */
export const isGoalOptionsFormCompleted = ({
  values
}: {
  values: Record<string, unknown[]>;
}): boolean => {
  let isCompleted = false;

  Object.keys(values).some(key => {
    if (Array.isArray(values[key]) && values[key].length) {
      isCompleted = true;
      return true;
    }
    return false;
  });

  return isCompleted;
};

/**
 * Handles selectable field selection
 */
export const handleFieldCustomSelection = (
  field: { mandatory?: boolean },
  fieldName: string,
  selectedFields: string[],
  setSelectedFields: (fields: string[]) => void
): void => {
  if (!selectedFields.includes(fieldName)) {
    setSelectedFields([...selectedFields, fieldName]);
    return;
  }
  if (field.mandatory) return;

  setSelectedFields(selectedFields.filter(selectedField => selectedField !== fieldName));
};

/**
 * Returns array of preselected (default) fields
 */
export const getDefaultUserFields = (
  fields: Array<{ key: string; default?: boolean }>
): string[] => {
  const defaultFields: string[] = [];

  fields.forEach(field => {
    const fieldName = getFieldName(field);
    if (field.default) {
      defaultFields.push(fieldName);
    }
  });

  return defaultFields;
};

/**
 * Uses stored data and compares with existing to set selected fields
 */
export const getStoredUserFields = (
  data: Array<{ key: string; default?: boolean }>,
  invitedUsersFields: string[] | null
): Array<{ key: string; default: boolean }> => {
  if (!invitedUsersFields) return data as Array<{ key: string; default: boolean }>;

  return data.map(field => {
    const fieldName = getFieldName(field);
    return { ...field, default: invitedUsersFields.includes(fieldName) };
  });
};

/**
 * Redirects to first launch step
 */
export const redirectToFirstStep = (): void => {
  (window as Window).location.href = LAUNCH_PROGRAM_FIRST;
};

/**
 * Redirects to specified route
 */
export const redirectToRoute = (route: string): void => {
  (window as Window).location.href = route;
};

/**
 * Returns field name for a launch program field (loyalty.example)
 */
export const getFieldName = (field: { key: string }): string =>
  field.key.split(DOT_SEPARATOR)[1];

/**
 * Processes product data for create product API call
 */
export const processProductData = ({
  platformId,
  productName,
  productId,
  categoryIds
}: {
  platformId: number;
  productName: string;
  productId: number;
  categoryIds: number[];
}) => ({
  platformId,
  products: [
    {
      name: productName,
      pictureId: productId,
      categoryIds
    }
  ]
});

/**
 * Processes categories for dropdown
 */
export const processCategoriesForDropdown = (
  data: Array<{ id: number; name: string }>
): Array<{ value: number; label: string }> =>
  data.map(category => ({ value: category.id, label: category.name }));

/**
 * Returns only the id of categories for product creation
 */
export const processCategoriesForCreateProductCreation = (
  categories: Array<{ value: number }>
): number[] => categories.map(category => category.value);

/**
 * Returns JS style for dropdown
 */
export const getDropdownStyle = (
  _styles: unknown,
  { isSelected }: { isSelected: boolean }
) => ({
  backgroundColor: isSelected ? '#78bb7bcf' : '#fff',
  color: isSelected ? '#fff' : '#000',
  padding: '1.5rem 0.5rem',
  fontSize: '1.2rem',
  cursor: 'pointer'
});

/**
 * Processes array of product ids
 */
export const processSelectedProduct = (
  product: number,
  programProducts: number[] | null
): number[] => {
  let productsArray = [product];

  if (programProducts && !programProducts.includes(product)) {
    productsArray = [...programProducts, product];
  }
  if (programProducts && programProducts.includes(product)) {
    productsArray = programProducts.filter(item => item !== product);
  }

  return productsArray;
};

/**
 * Returns initial values ready to be stored in redux
 */
export const getInitialColors = (font: string): Record<string, string> => {
  const initialValues: Record<string, string> = { font };

  CUSTOMISE_COLORS.forEach(colorData => {
    const { name, color, colors } = colorData;

    if (colors) {
      colors.forEach(({ name: colorName, color: colorValue }) => {
        initialValues[colorName] = colorValue;
      });
      return;
    }

    if (color) {
      initialValues[name] = color;
    }
  });

  return initialValues;
};

/**
 * Processes product IDs for goal
 */
export const processProductIdsGoal = (
  cube: { goals: Array<{ productIds?: number[] }> },
  index: number,
  newProductId: number
): number[] => {
  const updatedProductsIds = cube.goals[index].productIds;

  if (!updatedProductsIds) {
    return [newProductId];
  }

  if (updatedProductsIds.includes(newProductId)) {
    return updatedProductsIds.filter(id => id !== newProductId);
  }

  return [...updatedProductsIds, newProductId];
};

/**
 * Returns boolean if validation meets all requirements
 */
export const getValidForSpecificProducts = (
  specificProducts: boolean | null,
  cube: { goals: Array<{ productIds: number[] }> },
  index: number
): boolean | undefined => {
  if (specificProducts !== null) {
    return !specificProducts || (specificProducts && !!cube.goals[index].productIds.length);
  }
};

/**
 * Builds empty goal data
 */
export const buildGoalData = (): IGoalData => ({
  [CUBE_SECTIONS.MEASUREMENT_TYPE]: null,
  [CUBE_SECTIONS.MEASUREMENT_NAME]: null,
  [CUBE_SECTIONS.ALLOCATION_TYPE]: null,
  productIds: [],
  validated: {
    [CUBE_SECTIONS.MEASUREMENT_TYPE]: false,
    [CUBE_SECTIONS.ALLOCATION_TYPE]: false
  }
});

/**
 * Returns boolean if allocation fields are all correct
 */
export const getSimpleAllocationFieldAvailability = (form: {
  values: Record<string, unknown>;
  errors: Record<string, unknown>;
}): boolean =>
  !!form.values[Object.keys(form.values)[0]] && !Object.keys(form.errors).length;

/**
 * Processes simple allocation values
 */
export const processSimpleAllocationValues = (
  values: Record<string, unknown>
): { value: unknown; min: unknown; max: unknown } => {
  const keys = Object.keys(values);
  return {
    value: values[keys[0]],
    min: values[keys[1]],
    max: values[keys[2]]
  };
};

/**
 * Extracts data from store variable for social media
 */
export const extractSocialData = (
  socialMediaAccounts: Record<string, string> | null
): Record<string, ISocialNetwork> => {
  const storeData: Record<string, ISocialNetwork> = {};

  if (socialMediaAccounts) {
    Object.keys(socialMediaAccounts).forEach(
      socialElement =>
        (storeData[socialElement] = {
          value: socialMediaAccounts[socialElement],
          active: true,
          [CAN_NEXT_STEP]: true
        })
    );
  }
  return storeData;
};

/**
 * Prepares data to save in store for social networks
 */
export const prepareSocialStoreData = (
  socialNetworks: Record<string, ISocialNetwork>
): Record<string, string> => {
  const socialNetworksStore: Record<string, string> = {};

  Object.keys(socialNetworks).forEach(socialNetwork => {
    const network = socialNetworks[socialNetwork];
    if (network && network.value?.length > 0 && network.active) {
      socialNetworksStore[socialNetwork] = network.value;
    }
  });

  return socialNetworksStore;
};

/**
 * Validates data on page for social networks
 */
export const validateNextStep = (
  socialNetworks: Record<string, ISocialNetwork>
): boolean =>
  Object.keys(socialNetworks)
    .map(key => socialNetworks[key].canNextStep && !socialNetworks[key].hasError)
    .filter(valid => valid === false).length === 0;

/**
 * Gets only selected category ids
 */
export const getOnlySelectedIds = <T extends { id: number }>(
  categoryList: T[],
  filteredCategoryIds: number[]
): T[] => categoryList.filter(category => filteredCategoryIds.includes(category.id));

/**
 * Gets products from all selected categories
 */
export const getArrayOfProductsFromCategory = <T extends { products: P[] }, P>(
  filteredCategories: T[]
): P[] => {
  const filteredFullCategories: P[] = [];
  filteredCategories.forEach(category => filteredFullCategories.push(...category.products));
  return filteredFullCategories;
};
