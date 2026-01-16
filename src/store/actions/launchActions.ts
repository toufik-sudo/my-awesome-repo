/* eslint-disable quotes */
import Cookies from 'js-cookie';

import LaunchApi from 'api/LaunchApi';
import axiosInstance from 'config/axiosConfig';
import { DOT_SEPARATOR, USER_DETAILS_COOKIE } from 'constants/general';
import { uploadFile } from 'store/actions/baseActions';
import {
  CREATE_NEW_GOAL,
  DELETE_GOAL,
  RESET_STEP_DATA,
  SET_LAUNCH_STEP_DATA,
  SET_MULTIPLE_STEP_DATA,
  SET_STORE_DATA
} from 'store/actions/actionTypes';
import {
  CATEGORIES,
  OFFSET_QUERY,
  PLATFORM_QUERY,
  SIZE_QUERY,
  PRODUCTS,
  UPLOAD_FILES_ENDPOINT,
  UPLOAD_USERS_LIST,
  MAX_SIZE,
  NO_OFFSET
} from 'constants/api';
import {
  AUTO_CLOSE_PROGRAM_NOTICE,
  CUBE,
  CUBE_SECTIONS,
  FULL,
  FULL_CATEGORIES_PRODUCTS,
  FULL_PRODUCTS,
  LAUNCH_PROGRAM_FIRST,
  LAUNCH_STEP_TYPES,
  INITIAL_BRACKET_VALUES,
  INSTANT,
  PROGRAM_CATEGORIES,
  PROGRAM_JOURNEY,
  PROGRAM_PRODUCTS,
  QUICK,
  SPONSORSHIP,
  VOLUME,
  MEASUREMENT_NAMES
} from 'constants/wall/launch';
import {
  getArrayOfProductsFromCategory,
  getOnlySelectedIds,
  processCategoriesForDropdown,
  processSelectedProduct
} from 'services/LaunchServices';
import { buildGoalData } from 'services/CubeServices';
import StringUtilities from 'utils/StringUtilities';

/**
 * Action used to set data step to store
 *
 * @param step
 */
export const setLaunchDataStep = step => ({
  type: SET_LAUNCH_STEP_DATA,
  payload: step
});

/**
 * Action used to set data step to store
 */
export const createNewGoal = (processCubeAllocations, launchStore, setIsLoading) => {
  const cubeApi = new LaunchApi();
  setIsLoading(true);

  return async dispatch => {
    let acceptedAllocationTypes = await cubeApi.getPossibleAllocationTypes({
      goals: processCubeAllocations,
      frequencyOfPointsAllocation: INSTANT,
      correlatedGoals: launchStore.cube.correlated
    });
    if (SPONSORSHIP === launchStore.type) {
      acceptedAllocationTypes = acceptedAllocationTypes.filter(
        types => types.measurementType !== new StringUtilities().capitalize(VOLUME)
      );
    }
    dispatch({
      type: CREATE_NEW_GOAL,
      payload: acceptedAllocationTypes
    });
    setIsLoading(false);
  };
};

/**
 * Action used to remove a goal
 */
export const deleteGoal = (processCubeAllocations, correlated) => {
  const cubeApi = new LaunchApi();
  //remove last goal, as that's the deleted goal
  if (processCubeAllocations.length > 1) {
    processCubeAllocations.pop();
  }

  return async dispatch => {
    const acceptedAllocationTypes = await cubeApi.getPossibleAllocationTypes({
      goals: processCubeAllocations,
      frequencyOfPointsAllocation: INSTANT,
      correlatedGoals: correlated
    });
    dispatch({
      type: DELETE_GOAL,
      payload: acceptedAllocationTypes
    });
  };
};

/**
 * Action used to set multiple data step to store
 *
 * @param steps
 */
export const setMultipleData = steps => ({
  type: SET_MULTIPLE_STEP_DATA,
  payload: steps
});

/**
 * Action used to reset a specific part of step data based on the current selections
 *
 * @param currentType
 * @param value
 * @param platform
 */
export const resetSpecificStepData = (currentType, value, platform) => ({
  type: RESET_STEP_DATA,
  payload: { currentType, value, platform }
});

/**
 * Method calls upload endpoint and submits data
 *
 * @param data
 */
export const uploadUsersList = data =>
  uploadFile(data, UPLOAD_USERS_LIST).then(({ data, status }) => ({ data, status }));

/**
 * Method adds to program journey the current launch type (quick || full)
 *
 * @param journey
 * @param dispatch
 */
export const setJourneyType = (journey, dispatch) => {
  if (journey && (journey.includes(QUICK) || journey.includes(FULL))) {
    const journeyInfo = journey.split(DOT_SEPARATOR);

    dispatch(setLaunchDataStep({ key: PROGRAM_JOURNEY, value: journeyInfo[journeyInfo.length - 1] }));
  }
};

/**
 * Method calls create products api and creates a product
 *
 * @param productData
 * @param setProductError
 * @param setProductCreated
 */
export const createProductAction = async (productData, setProductError, setProductCreated) => {
  try {
    await axiosInstance().post(PRODUCTS, productData);
    return new Promise(resolve => {
      setProductCreated(true);
      setTimeout(() => setProductCreated(false), AUTO_CLOSE_PROGRAM_NOTICE);
      resolve(true);
    });
  } catch (e) {
    setProductError(`launchProgram.products.invalid.${e.response.data.invalidRecords[0].error.code}`);
  }
};

/**
 * Method used to upload a product picture
 *
 * @param formDataImage
 * @param setProductError
 */
export const uploadProductImage = async (formDataImage, setProductError) => {
  try {
    const { data } = await uploadFile(formDataImage, UPLOAD_FILES_ENDPOINT);

    return data[0].id;
  } catch (e) {
    setProductError('launchProgram.products.invalid.network');
  }
};

/**
 * Method gets the categories processed for dropdown
 */
export const getCategoriesForDropdown = async platform => {
  const launchApi = new LaunchApi();
  try {
    const data = await launchApi.getCategories({
      platform,
      size: MAX_SIZE,
      offset: NO_OFFSET,
      withProducts: 0
    });

    return processCategoriesForDropdown(data.categories);
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Method used to get the products
 *
 * @param productListState
 * @param selectedPlatform
 */
export const getProductsAction = async (productListState, selectedPlatform) => {
  const [, setProductList] = productListState;
  const userData = JSON.parse(Cookies.get(USER_DETAILS_COOKIE));
  const platformId = (selectedPlatform && selectedPlatform.id) || userData.platformId;
  try {
    if (platformId) {
      const { data } = await axiosInstance().get(
        `${PRODUCTS}${PLATFORM_QUERY}${platformId}${SIZE_QUERY}${MAX_SIZE}${OFFSET_QUERY}${NO_OFFSET}`
      );

      setProductList(data.products);
    }
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Method used to get the categories
 *
 * @param categoriesListState
 * @param selectedPlatform
 */
export const getCategoryAction = async (categoriesListState, selectedPlatform) => {
  const [, setCategoryList] = categoriesListState;
  const userData = JSON.parse(Cookies.get(USER_DETAILS_COOKIE));
  const platformId = (selectedPlatform && selectedPlatform.id) || userData.platformId;

  try {
    const data = await new LaunchApi().getCategories({
      platform: platformId,
      size: MAX_SIZE,
      offset: NO_OFFSET,
      withProducts: 1
    });
    setCategoryList(data.categories);
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Method used to create a new category
 */
export const createNewCategory = async (payload, setProductError, setProductCreated) => {
  try {
    await axiosInstance().post(`${CATEGORIES}`, payload);
    return new Promise(resolve => {
      setProductCreated(true);
      setTimeout(() => setProductCreated(false), AUTO_CLOSE_PROGRAM_NOTICE);
      resolve(true);
    });
  } catch (e) {
    setProductError(`launchProgram.products.invalid.${e.response.data.invalidRecords[0].error.code}`);
  }
};

/**
 * Method dispatches selected products to program products key in store
 *
 * @param item
 * @param programItems
 * @param dispatch
 * @param key
 */
export const handleItemSelectionAction = (item, programItems, dispatch, key) => {
  const value = processSelectedProduct(item, programItems);

  dispatch(setLaunchDataStep({ key, value }));

  return value;
};

/**
 * Method dispatches multiple selection to program products key in store
 *
 * @param productList
 * @param allSelected
 * @param dispatch
 */
export const handleItemMultipleSelectionAction = (productList, allSelected, dispatch) => {
  const value = productList.map(({ id }) => id);
  if (allSelected) {
    dispatch(setLaunchDataStep({ key: PROGRAM_PRODUCTS, value: [] }));
    return dispatch(setLaunchDataStep({ key: FULL_PRODUCTS, value: [] }));
  }

  dispatch(setLaunchDataStep({ key: FULL_PRODUCTS, value: productList }));
  dispatch(setLaunchDataStep({ key: PROGRAM_PRODUCTS, value }));
};

/**
 * Method handles full item to be set on store
 *
 * @param category
 * @param dispatch
 * @param categoryIds
 * @param categoryList
 */
export const handleFullItemsCategoryStore = (category, dispatch, categoryIds, categoryList) => {
  const filteredCategoryIds = handleItemSelectionAction(category, categoryIds, dispatch, PROGRAM_CATEGORIES);
  const filteredCategories = getOnlySelectedIds(categoryList, filteredCategoryIds);
  const selectedProductsFromCategory = getArrayOfProductsFromCategory(filteredCategories);

  dispatch(
    setLaunchDataStep({
      key: FULL_CATEGORIES_PRODUCTS,
      value: selectedProductsFromCategory
    })
  );
};

/**
 * Method handles full item from a category to be set on store
 *
 * @param product
 * @param dispatch
 * @param productIds
 * @param productList
 */
export const handleFullItemSetStore = (product, dispatch, productIds, productList) => {
  const filteredProductsId = handleItemSelectionAction(product, productIds, dispatch, PROGRAM_PRODUCTS);
  dispatch(
    setLaunchDataStep({
      key: FULL_PRODUCTS,
      value: productList.filter(product => filteredProductsId.includes(product.id))
    })
  );
};

/**
 * Method used to set specific product on store (cube key)
 *
 * @param index
 * @param state
 * @param dispatch
 * @param launch
 */
export const setSpecificProducts = (index, state, dispatch, launch) => {
  const { cube, productIds } = launch;
  const updatedGoals = cube.goals;
  updatedGoals[index].specificProducts = state;
  updatedGoals[index][CUBE_SECTIONS.MEASUREMENT_TYPE] = null;
  updatedGoals[index][CUBE_SECTIONS.MEASUREMENT_NAME] = null;
  updatedGoals[index].validated[CUBE_SECTIONS.MEASUREMENT_TYPE] = false;
  if (!state) {
    updatedGoals[index].productIds = state ? productIds : [];
  }
  dispatch(setLaunchDataStep({ key: CUBE, value: { ...cube, goals: updatedGoals } }));
};

/**
 * Action used to set bracket values on a goal
 *
 * @param index
 * @param state
 * @param dispatch
 * @param cube
 */
export const setBracketValues = (index, state, dispatch, cube) => {
  const updatedGoals = cube.goals;

  updatedGoals[index].brackets = state;
  dispatch(setLaunchDataStep({ key: CUBE, value: { ...cube, goals: updatedGoals } }));
};

/**
 * Method used to set specific product on store (cube key)
 *
 * @param index
 * @param state
 * @param dispatch
 * @param cube
 */
export const setMechanismType = (index, state, dispatch, cube) => {
  const updatedGoals = cube.goals;
  if (!state) {
    updatedGoals[index] = buildGoalData();
  }

  updatedGoals[index][CUBE_SECTIONS.MEASUREMENT_TYPE] = state == 3 ? 2 : state;
  updatedGoals[index][CUBE_SECTIONS.MEASUREMENT_NAME] = MEASUREMENT_NAMES[state];
  updatedGoals[index][CUBE_SECTIONS.ALLOCATION_TYPE] = null;
  updatedGoals[index].validated[CUBE_SECTIONS.ALLOCATION_TYPE] = false;
  updatedGoals[index][CUBE_SECTIONS.MAIN] = { min: '', max: '', value: '' };
  updatedGoals[index].brackets = INITIAL_BRACKET_VALUES;
  dispatch(setLaunchDataStep({ key: CUBE, value: { ...cube, goals: updatedGoals } }));
};

/**
 * Method used to set specific product on store (cube key)
 *
 * @param index
 * @param state
 * @param dispatch
 * @param cube
 * @param key
 */
export const setAllocationType = (index, state, dispatch, cube, key) => {
  const updatedGoals = cube.goals;
  if (!state) {
    updatedGoals[index] = buildGoalData();
  }
  updatedGoals[index][key] = state;
  dispatch(setLaunchDataStep({ key: CUBE, value: { ...cube, goals: updatedGoals } }));
};

/**
 * Method used to validate a section
 *
 * @param cube
 * @param target
 * @param index
 * @param dispatch
 */
export const validateItem = (cube, target, index, dispatch) => {
  const updatedGoals = cube.goals;
  updatedGoals[index].validated[target] = !updatedGoals[index].validated[target];
  dispatch(setLaunchDataStep({ key: CUBE, value: { ...cube, goals: updatedGoals } }));
};

/**
 * Method used to set filtered allocation type
 *
 * @param index
 * @param state
 * @param dispatch
 * @param cube
 */
export const setFilteredAllocationType = (index, state, dispatch, cube) => {
  const updatedGoals = cube.goals;

  if (updatedGoals[updatedGoals.length - 1].acceptedTypes.length === state.length) {
    return;
  }
  if (!state.length) {
    updatedGoals[updatedGoals.length - 1] = buildGoalData();
  }

  updatedGoals[updatedGoals.length - 1].acceptedTypes = state;
  dispatch(setLaunchDataStep({ key: CUBE, value: { ...cube, goals: updatedGoals } }));
};

/**
 * Set store data for app store
 *
 * @param data
 */
export const setStoreData = data => {
  return {
    type: SET_STORE_DATA,
    payload: data
  };
};

/**
 * Method manages redirect based on the last uncompleted step from program launch
 *
 * @param data
 * @param history
 */
export const launchStepManager = (data, history) => {
  const routeParams = history.location.pathname.split('/');
  const type = routeParams[0] == '' ? routeParams[2] : routeParams[1];
  const pageIndex = routeParams[0] == '' ? routeParams[3] : routeParams[2];

  if (undefined === data.programJourney && LAUNCH_PROGRAM_FIRST !== history.location.pathname) {
    window.location = (LAUNCH_PROGRAM_FIRST as unknown) as Location;
  }
  if (type && pageIndex) {
    const req = createStepRequirements(LAUNCH_STEP_TYPES[type], data);

    checkStepRequirements(req, pageIndex, data);
  }
};

/**
 * Create a requirements array for checking if the step requirements are met, and data is set in store
 *
 * @param pageSettings
 * @param data
 */
function createStepRequirements(pageSettings, data) {
  let req;

  pageSettings.steps.forEach(programReq => {
    if (undefined !== programReq[data.programJourney]) {
      req = {
        ...req,
        [programReq.index]: {
          requirements: programReq[data.programJourney].requirements,
          redirectTo: programReq[data.programJourney].redirectTo,
          alternateRequirements: programReq[data.programJourney].alternateRequirements || null,
          alternateRedirect: programReq[data.programJourney].alternateRedirect || null
        }
      };
    }
  });

  return req;
}

/**
 * Check if launchData has the fields required for the step we are in
 * and redirect accordingly if the requirements are not met
 *
 * @param req
 * @param pageIndex
 * @param data
 */
function checkStepRequirements(req, pageIndex, data) {
  if (undefined === req || undefined === req[pageIndex]) {
    return;
  }

  if (undefined !== req[pageIndex].requirements && req[pageIndex].requirements.length > 0) {
    req[pageIndex].requirements.forEach(field => {
      if (undefined === data[field] || null === data[field]) {
        window.location = (req[pageIndex].redirectTo as unknown) as Location;
      }

      // In some cases, we have dependencies based on other field values (ex: on products page, full journey,
      // we need to redirect user to user first/second pages based on uploaded user file and accepted email invitation)
      if (undefined !== req[pageIndex].alternateRequirements && null !== req[pageIndex].alternateRedirect) {
        const shouldRedirect = Object.keys(req[pageIndex].alternateRequirements).some(keyField => {
          return (
            field == keyField && data[keyField] && undefined === data[req[pageIndex].alternateRequirements[keyField]]
          );
        });
        if (shouldRedirect) {
          window.location = (req[pageIndex].alternateRedirect as unknown) as Location;
        }
      }
    });
  }
}

/**
 * Method used to set filtered measurement type
 *
 * @param index
 * @param state
 * @param dispatch
 * @param cube
 */
export const setFilteredMeasurementType = (index, state, dispatch, cube) => {
  const updatedGoals = cube.goals;
  if (!updatedGoals[index + 1]) return;

  updatedGoals[index + 1].measurementTypesValid = state;
  dispatch(setLaunchDataStep({ key: CUBE, value: { ...cube, goals: updatedGoals } }));
};
