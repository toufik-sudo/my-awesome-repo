import { USER_LIST_FORM_DATA_FIELDS } from 'constants/files';
import { DURATION_DATE_FIELD } from 'constants/formDefinitions/genericFields';
import {
  DEFAULT_INPUT,
  DISABLED,
  FORM_FIELDS,
  NON_FLOATING_ELEMENT,
  OPTIONS_LIST,
  SMALLER_FONT_ELEMENT
} from 'constants/forms';
import { DOT_SEPARATOR, NAME, PROGRAM_BTN_CLASS } from 'constants/general';
import { LAUNCH_FIRST } from 'constants/routes';
import {
  BASE_INPUT_CONSTRAINT_GROUP,
  CUSTOM_URL_INPUT_CONSTRAINT_GROUP,
  INPUT_TYPE_CONSTRAINT,
  PROGRAM_URL_CONSTRAINT_GROUP
} from 'constants/validation';
import { CUSTOMISE_COLORS } from 'constants/wall/design';
import {
  CAN_NEXT_STEP,
  CUBE_SECTIONS,
  DESIGN,
  DROPZONE_TITLE_TYPE,
  ECARD,
  LAUNCH_STEP_TYPES,
  NETWORK_ERROR
} from 'constants/wall/launch';
import { IReactIntl } from 'interfaces/IGeneral';
import { uploadUsersList } from 'store/actions/launchActions';
import { buildFormField } from 'services/FormServices';
import { objectToArrayKey } from 'utils/general';

/**
 * Method processes launch steps and sets the availability on each step
 *
 * @param allLaunchSteps
 * @param launchSteps
 */
export const processLaunchSteps = (allLaunchSteps, launchSteps) =>
  Object.keys(allLaunchSteps).map(key => ({
    ...allLaunchSteps[key],
    available: launchSteps.includes(allLaunchSteps[key].name)
  }));

/**
 * Method returns only the quick launch steps
 *
 * @param allLaunchSteps
 * @param quickLaunchSteps
 */
export const getOnlyQuickLaunchSteps = (allLaunchSteps, quickLaunchSteps) => {
  const processedSteps = [];

  Object.keys(allLaunchSteps).forEach(key => {
    if (quickLaunchSteps.includes(allLaunchSteps[key].name)) {
      processedSteps.push(allLaunchSteps[key]);
    }
  });

  return processedSteps;
};

/**
 * Method returns boolean on each step if it's available
 *
 * @param currentStepIndex
 * @param launchSteps
 * @param stepIndex
 */
export const getAvailableStatus = (currentStepIndex, launchSteps, stepIndex) => {
  return {
    prevAvailable: stepIndex > 1 || launchSteps[currentStepIndex - 1],
    nextAvailable: currentStepIndex < launchSteps.length - 1
  };
};

/**
 * Method returns style based on the current state
 *
 * @param stepDetail
 * @param index
 * @param style
 */
export const processBarItemStyle = (stepDetail, index, style) => {
  const { progressBarStepActive, progressBarStepNotAvailable, progressBarStepCompleted } = style;
  const { step, steps, stepKey, currentActiveStep } = stepDetail;

  const progressActive = step === steps[stepKey].name ? progressBarStepActive : '';
  const progressAvailable = !steps[stepKey].available ? progressBarStepNotAvailable : '';
  const progressCompleted = index <= currentActiveStep ? progressBarStepCompleted : '';

  return { progressActive, progressAvailable, progressCompleted };
};

/**
 *Method returns active step index
 *
 * @param stepIndex
 * @param index
 * @param style
 */
export const getProgressActive = (stepIndex, index, style) =>
  index <= parseInt(stepIndex) ? style.progressActive : '';

/**
 * Method returns only quick launch steps
 */
export const getActiveSteps = launchSteps =>
  objectToArrayKey(getOnlyQuickLaunchSteps(LAUNCH_STEP_TYPES, launchSteps), NAME);

/**
 * Method returns component for the active step
 *
 * @param step
 * @param stepIndex
 */
export const getActiveStepComponent = (step, stepIndex, isModify?: boolean) => {
  // if (isModify && (step == DESIGN || step == ECARD) && stepIndex == "1") {
  //   return LAUNCH_STEP_TYPES[step].steps[parseInt(stepIndex, 10)].component;
  // }
  return LAUNCH_STEP_TYPES[step].steps[parseInt(stepIndex, 10) - 1].component;
};

/**
 * Method filters the messages that start with a custom text
 *
 */
export const launchProgramsTranslations = (messages: IReactIntl, start: string, end: string) => {
  return Object.keys(messages).filter(key => key.startsWith(start) && !key.endsWith(end));
};

/**
 * Process the selection of a quick launch option
 *
 * @param selection
 */
export const processLaunchSelection = selection => {
  const [category, key, value] = selection.split(DOT_SEPARATOR);

  return { category, key, value };
};

/**
 * Method returns value for start date and end date for Range Datepicker
 *
 * @param date
 * @param type
 * @param form
 */
export const setValue = (date, type, form) => {
  const { setFieldValue, values } = form;

  setFieldValue(FORM_FIELDS.PROGRAM_DURATION, { ...values[FORM_FIELDS.PROGRAM_DURATION], [type]: date });
};

/**
 * Handle user list on drop callback event
 *
 * @param userFileId
 * @param fileToFormData
 * @param setState
 * @param platformId
 */
export const handleUserListOnDrop = (
  userFileId,
  fileToFormData,
  { setUploadResponse, setFileUploading, setServerError },
  platformId
) => async file => {
  setServerError(null);
  if (!file.length) return;
  setFileUploading(true);
  const fileFormData = fileToFormData([file[0], file[0].name, userFileId, platformId], USER_LIST_FORM_DATA_FIELDS);
  try {
    const res = await uploadUsersList(fileFormData);

    setUploadResponse(res);
    setServerError(null);
  } catch (e) {
    if (e && e.message === NETWORK_ERROR.message) {
      setUploadResponse({ data: NETWORK_ERROR, status: NETWORK_ERROR.code });
      setServerError(NETWORK_ERROR.code);

      return;
    }
    setUploadResponse(e.response);
    setServerError(e.response.data.code);
  } finally {
    setFileUploading(false);
  }
};

/**
 * Method returns an object with the corresponding class and type
 *
 * @param rejectedFiles
 * @param serverError
 * @param userListDropzoneTitle
 * @param userListDropzoneTitleError
 */

export const getDropzoneTitle = (rejectedFiles, serverError, { userListDropzoneTitle, userListDropzoneTitleError }) => {
  let output = { className: userListDropzoneTitle, type: DROPZONE_TITLE_TYPE.TITLE };

  if (rejectedFiles.length) {
    output = { className: userListDropzoneTitleError, type: DROPZONE_TITLE_TYPE.ERROR };
  }

  if (serverError) {
    output = { className: userListDropzoneTitleError, type: serverError };
  }

  return output;
};

/**
 * Method returns boolean if there are invalid emails available
 *
 * @param uploadResponse
 */
export const hasInvalidEmail = uploadResponse =>
  !uploadResponse ||
  !uploadResponse.data ||
  !uploadResponse.data.invalidRecords ||
  !uploadResponse.data.invalidRecords.length;

/**
 * Method checks if StepIndex is a number
 *
 * @param stepIndex
 */
export const checkIfStepIndexIsNumber = stepIndex => /^\d+$/.test(stepIndex);

/**
 * Method checks if form is completed
 *
 * @param form
 */
export const isFormCompleted = form => {
  return Object.keys(form.values).some(
    key => !form.values[key] || (key === FORM_FIELDS.PROGRAM_DURATION && !form.values[key].end)
  );
};

/**
 * Method returns the button confirguration for program type buttons
 *
 * @param isFreePlan
 */
export const getProgramTypeButtons = isFreePlan => {
  let className = '';

  if (isFreePlan) {
    className = PROGRAM_BTN_CLASS.DISABLED;
  }

  return [
    { textId: 'welcome.page.launch.full', className },
    { textId: 'form.submit.duplicate', className: PROGRAM_BTN_CLASS.DISABLED },
    { textId: 'welcome.page.launch.quick', className: PROGRAM_BTN_CLASS.SECONDARY }
  ];
};

/**
 * Method checks if the parameters form is completed
 *
 * @param form
 */
export const isParametersFormCompleted = form => !form.values.programName;

/**
 * Method check form field based on type of paid plan
 *
 * @param form
 */
export const validateSubmitFormButton = (form, isFreePlan) => {
  if (isFreePlan) return isParametersFormCompleted(form);

  return isFormCompleted(form);
};

/* Method checks if the Goal Options form is completed
 *
 * @param form
 */
export const isGoalOptionsFormCompleted = ({ values }) => {
  let isCompleted = false;

  Object.keys(values).some(key => {
    if (OPTIONS_LIST[key] && values[key].length) {
      isCompleted = true;

      return true;
    }

    return false;
  });

  return isCompleted;
};

/**
 * Method handles selectable field selection
 *
 * @param field
 * @param fieldName
 * @param selectedFields
 * @param setSelectedFields
 */
export const handleFieldCustomSelection = (field, fieldName, selectedFields, setSelectedFields) => {
  if (!selectedFields.includes(fieldName)) return setSelectedFields([...selectedFields, fieldName]);
  if (field.mandatory) return null;

  return setSelectedFields(selectedFields.filter(selectedField => selectedField !== fieldName));
};

/**
 * Method returns array of preselected (default) fields
 *
 * @param fields
 */
export const getDefaultUserFields = fields => {
  let defaultFields = [];

  fields.forEach(field => {
    const fieldName = getFieldName(field);
    if (field.default) return (defaultFields = [...defaultFields, fieldName]);
  });

  return defaultFields;
};

/**
 * Method uses stored data and compares with the existing to set the selected fields
 *
 * @param data
 * @param invitedUsersFields
 */
export const getStoredUserFields = (data, invitedUsersFields) => {
  if (!invitedUsersFields) return data;

  return data.map(field => {
    const fieldName = getFieldName(field);

    return { ...field, default: invitedUsersFields.includes(fieldName) };
  });
};

/**
 * Function used in order to build the Program Parameters elements
 * @param customUrl
 * @param extendUrl
 * @param programName
 * @param duration
 * @param baseProgramUrl
 * @param isFreePlan
 * @param isFreemium
 */
export const buildUrlField = (
  customUrl,
  { extendUrl, programName },
  duration,
  baseProgramUrl,
  isFreePlan,
  isFreemium
) => {
  const fields = [
    {
      ...buildFormField({
        initialValue: programName,
        label: FORM_FIELDS.PROGRAM_NAME,
        style: NON_FLOATING_ELEMENT,
        constraints: { ...BASE_INPUT_CONSTRAINT_GROUP, trim: true }
      })
    },
    {
      ...buildFormField({
        label: FORM_FIELDS.PROGRAM_URL,
        initialValue: `${baseProgramUrl}${extendUrl ? extendUrl : ''}${customUrl}`,
        constraints: PROGRAM_URL_CONSTRAINT_GROUP,
        style: { ...NON_FLOATING_ELEMENT, ...DISABLED, ...DEFAULT_INPUT, ...SMALLER_FONT_ELEMENT }
      })
    },
    {
      ...buildFormField({
        initialValue: extendUrl || customUrl,
        label: FORM_FIELDS.EXTEND_URL,
        constraints: isFreePlan ? INPUT_TYPE_CONSTRAINT : CUSTOM_URL_INPUT_CONSTRAINT_GROUP,
        style: { ...NON_FLOATING_ELEMENT, ...{ isHidden: isFreePlan } }
      })
    },
    { ...DURATION_DATE_FIELD(duration) }
  ];
  return isFreemium ? fields.filter(field => field.label !== 'duration') : fields;
};

/**
 *  Function used in order to build the Contents Field elements
 *
 * @param contentsTitle
 * @param bannerTitle
 */
export const buildContentsFormField = ({ contentsTitleParam, bannerTitleParam, labelTitle, labelBanner }) => {
  return [
    {
      ...buildFormField({
        initialValue: contentsTitleParam,
        label: labelTitle,
        style: { ...NON_FLOATING_ELEMENT },
        constraints: BASE_INPUT_CONSTRAINT_GROUP,
        
      })
    },
    {
      ...buildFormField({
        initialValue: bannerTitleParam,
        label: labelBanner,
        style: { ...NON_FLOATING_ELEMENT },
        constraints: {},
        hasExplanation: true
      })
    }
  ];
};

/**
 * Method redirects to first launch step
 */
export const redirectToFirstStep = () => ((window as any).location = LAUNCH_FIRST);
/**
 * Method redirects to the specified route step
 */
export const redirectToRoute = (route) => ((window as any).location = route);

/**
 * Method returns field name for a launch program field (loyalty.example)
 *
 * @param field
 */
export const getFieldName = field => field.key.split(DOT_SEPARATOR)[1];

/**
 * Method used to process product data to be used on create product api call
 *
 * @param productName
 * @param productId
 * @param categoryIds
 *
 * NOTE: platform id should be dynamic once the platform id creation ticket is ready
 */
export const processProductData = ({ platformId, productName, productId, categoryIds }) => {
  return {
    platformId,
    products: [
      {
        name: productName,
        pictureId: productId,
        categoryIds
      }
    ]
  };
};

/**
 * Method processes the data for categories
 *
 * @param data
 */
export const processCategoriesForDropdown = data =>
  data.map(category => ({ value: category.id, label: category.name }));

/**
 * Method returns only the id of the categories to be used on product creation
 *
 * @param categories
 */
export const processCategoriesForCreateProductCreation = categories => categories.map(category => category.value);

/**
 * Method used to get the js style for dropdown
 *
 * @param styles
 * @param isSelected
 */
export const getDropdownStyle = (styles, { isSelected }) => ({
  backgroundColor: isSelected ? '#78bb7bcf' : '#fff',
  color: isSelected ? '#fff' : '#000',
  padding: '1.5rem 0.5rem',
  fontSize: '1.2rem',
  cursor: 'pointer'
});

/**
 * Method returns a processed array of products ids
 *
 * @param product
 * @param programProducts
 */
export const processSelectedProduct = (product, programProducts) => {
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
 * Method returns initial values ready to be stored in redux
 */
export const getInitialColors = font => {
  const initialValues = { font };
  CUSTOMISE_COLORS.forEach(colorData => {
    const { name, color, colors } = colorData;

    if (colors) {
      colors.forEach(({ name, color }) => {
        initialValues[name] = color;
      });

      return initialValues;
    }

    initialValues[name] = color;
  });

  return initialValues;
};

/**
 * Method used to return product
 * @param cube
 * @param index
 * @param newProductId
 */
export const processProductIdsGoal = (cube, index, newProductId) => {
  const updatedProductsIds = cube.goals[index].productIds;

  if (!updatedProductsIds) {
    return [newProductId];
  }

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
  const value = Object.keys(values)[0];
  const min = Object.keys(values)[1];
  const max = Object.keys(values)[2];

  return {
    value: values[value],
    min: values[min],
    max: values[max]
  };
};

/**
 * Service used to extract data from store variable
 * @param socialMediaAccounts
 */
export const extractSocialData = socialMediaAccounts => {
  const storeData = {};

  if (socialMediaAccounts) {
    Object.keys(socialMediaAccounts).map(
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
 * Service used to prepare data to save in store
 * @param socialNetworks
 */
export const prepareSocialStoreData = socialNetworks => {
  const socialNetworksStore = {};
  Object.keys(socialNetworks).forEach(socialNetwork => {
    if (socialNetworks[socialNetwork] && socialNetworks[socialNetwork].value?.length > 0 && socialNetworks[socialNetwork].active)
      socialNetworksStore[socialNetwork] = socialNetworks[socialNetwork].value;
  });

  return socialNetworksStore;
};

/**
 * Service used to validate data on page
 * @param socialNetworks
 */
export const validateNextStep = socialNetworks => {
  return (
    Object.keys(socialNetworks)
      .map(key => socialNetworks[key].canNextStep && !socialNetworks[key].hasError)
      .filter(valid => valid === false).length === 0
  );
};

/**
 * Method used to get only selected category ids
 *
 * @param categoryList
 * @param filteredCategoryIds
 */
export const getOnlySelectedIds = (categoryList, filteredCategoryIds) =>
  categoryList.filter(category => filteredCategoryIds.includes(category.id));

/**
 * Method used to get products from all selected categories
 *
 * @param filteredCategories
 */
export const getArrayOfProductsFromCategory = filteredCategories => {
  const filteredFullCategories = [];
  filteredCategories.forEach(category => filteredFullCategories.push(...category.products));

  return filteredFullCategories;
};
