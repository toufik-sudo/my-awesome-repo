import zxcvbn from 'zxcvbn';
import Cookies from 'js-cookie';
import qs from 'qs';
import moment from 'moment';
import { convertToRaw } from 'draft-js';
import { toast } from 'react-toastify';

import AccountApi from 'api/AccountApi';
import FilesApi from 'api/FilesApi';
import InviteUserApi from 'api/InviteUsersApi';
import LaunchApi from 'api/LaunchApi';
import PlatformApi from 'api/PlatformApi';
import PointConversionsApi from 'api/PointConversionsApi';
import UserApi from 'api/UsersApi';
import WallSettingsApi from 'api/WallSettingsApi';
import envConfig from 'config/envConfig';
import axiosInstance from 'config/axiosConfig';
import {
  ACCOUNT_TYPE,
  API_V1,
  CONTACT_FORM_LOGS_ENDPOINT,
  FORGOT_PASSWORD_ENDPOINT,
  GENERATE_URL_ENDPOINT,
  GET_FORM_FIELDS_API,
  GET_FORM_FIELDS_API_FORM_TYPE,
  GET_FORM_FIELDS_API_PROGRAM_TYPE,
  GET_FORM_FIELDS_API_WITH_PRODUCTS,
  LOGIN_ENDPOINT,
  POST,
  RESET_PASSWORD_ENDPOINT,
  UPDATE_USER_ENDPOINT,
  UPLOAD_FILES_ENDPOINT,
  VALIDATE_TOKEN
} from 'constants/api';
import { IMAGE_FORM_DATA_FIELDS } from 'constants/files';
import { FORM_FIELDS, GENERIC_FORM_TYPES, socialMediaAccounts } from 'constants/forms';
import {
  CAN_REDIRECT_TO_EMAIL_ACTIVATION_PAGE,
  INVITED_ADMIN_PLATFORM,
  SELECTED_PLATFORM_COOKIE,
  USER_COOKIE_FIELDS,
  USER_DETAILS_COOKIE,
  UUID
} from 'constants/general';
import { SUCCESS_MODAL } from 'constants/modal';
import { CROPPED, USER_IMAGE_TYPE } from 'constants/personalInformation';
import { PAGE_NOT_FOUND, REDIRECT_MAPPING, WALL_ROUTE, WELCOME_EMAIL_ACTIVATION_ROUTE } from 'constants/routes';
import {
  GLOBAL,
  MAX_NUMBER_FOR_SIMPLIFIED_RULE,
  NOT_STRONG,
  PLATFORM_IDENTIFIER_LENGTH,
  TRIMMED_INPUT,
  UNIQUE_NAME
} from 'constants/validation';
import {
  BACKGROUND,
  COLOR_SIDEBAR,
  COLOR_TITLES,
  CONTENT,
  FONT,
  MAIN,
  MENU,
  ROBOTO,
  SIDEBARS_TITLES,
  TASK
} from 'constants/wall/design';
import {
  CONTENTS_COVER_ID,
  FREEMIUM,
  FREQUENCY_TYPE,
  FREQUENCY_TYPE_VALUES,
  LAUNCH_PROGRAM,
  LOYALTY,
  MEASUREMENT_TYPES,
  PROGRAM_CONFIDENTIALITY_OPEN,
  PROGRAM_CREATION_TYPES,
  PROGRAM_ID,
  PROGRAM_TYPES,
  QUICK,
  SOCIAL,
  WISYWIG_DATA_FIELD
} from 'constants/wall/launch';
import { handleUserAuthorizationToken, redirectCustomWall, redirectManager } from 'services/AccountServices';
import { retrieveOnboardingBeneficiaryCookie } from 'utils/LocalStorageUtils';
import { fileToAvatarFormData, fileToFormDataArray } from 'services/FileServices';
import { transferValuesToSocialMedia } from 'services/WallServices';
import { uploadFile } from 'store/actions/baseActions';
import { handleUpdateUserInformationRedirect, setCurrentStep } from 'store/actions/boardingActions';
import { setLaunchDataStep, setMultipleData } from 'store/actions/launchActions';
import { setModalState } from 'store/actions/modalActions';
import { base64ImageToBlob, convertToFloatNumber, getUserCookie } from 'utils/general';
import { getLocalStorage, removeLocalStorage, setLocalStorage } from 'services/StorageServies';
import { trimUrl } from 'utils/api';
import { clearUserData, getUserDetails, getUserUuid } from 'services/UserDataServices';
import { getDefaultColorsCode } from 'utils/getDefaultColorsCode';
import { handleApiFormValidation } from 'utils/validationUtils';
import { getUniqueSelectedIds } from 'services/CubeServices';
import { VALIDATE_TYPE, VALIDATE_TYPE_ERROR_REDIRECT } from 'constants/api/tokenValidation';
import { setHandleRedirectOnLogin } from './generalActions';
import { isAccountNotVerified } from 'services/security/accessServices';
import MomentUtilities from 'utils/MomentUtilities';

import modalStyle from 'assets/style/components/Modals/Modal.module.scss';
import { useParams } from 'react-router-dom';
import { WALL_BLOCK } from 'constants/wall/blocks';
import { freemem } from 'os';

const platformApi = new PlatformApi();
const wallSettingsApi = new WallSettingsApi();
const userApi = new UserApi();
const accountApi = new AccountApi();
const inviteUserApi = new InviteUserApi();
const pointConversionApi = new PointConversionsApi();
const filesApi = new FilesApi();

/**
 * Action used on submit reseller form
 *
 * @param values
 * @param props
 * @param dispatch
 * @param targetModal
 */
export const contactLogsSubmitAction = async (values, props, dispatch, targetModal = null) => {
  const { setSubmitting, resetForm } = props;
  try {
    const dates = values.data.contactDates && values.data.contactDates.map(date => moment(date).utc());
    const processedValues = {
      ...values,
      data: {
        ...values.data,
        contactDates: dates
      }
    };

    if (processedValues.data.needTraining === true) {
      processedValues.data.needTraining = 'true';
    }

    if (processedValues.data.needsSuperAdmin === true) {
      processedValues.data.needsSuperAdmin = 'true';
    }

    await axiosInstance().post(CONTACT_FORM_LOGS_ENDPOINT, processedValues);
    if (targetModal) {
      dispatch(setModalState(false, targetModal));
    }

    let data = {};
    if (values.type === GENERIC_FORM_TYPES.RESELLER) {
      data = { customStyle: modalStyle.modalSuccessReseller };
    }
    await dispatch(setModalState(true, SUCCESS_MODAL, data));
    resetForm();
  } catch (err) {
    handleApiFormValidation(props, values, err.response);
  }
  setSubmitting(false);
};

export const handleLoginBeneficiaryOnboarding = async () => {
  const { programId } = retrieveOnboardingBeneficiaryCookie();
  if (!programId) {
    return;
  }
  try {
    await inviteUserApi.inviteBeneficiaryUser({ programId, autoInvite: true });
  } catch (e) {
    // do nothing
  }
};

/**
 * Login action to login into application
 *
 * @param values
 * @param props
 * @param history
 * @param setFormLoading
 * @param dispatch
 * @param isOnboardingFlow
 */
export const loginSubmitAction = async (values, props, history, setFormLoading, dispatch, isOnboardingFlow = false, isCustomWall = false, customUrl = null) => {
  setFormLoading(true);
  const { email, password } = values;
  clearUserData();
  try {
    const {
      headers: { authorization }
    } = await axiosInstance().post(LOGIN_ENDPOINT, { email, password });
    const decodedToken = handleUserAuthorizationToken(authorization);
    const userStep = getUserCookie(USER_COOKIE_FIELDS.STEP);
    if (isAccountNotVerified(decodedToken.status)) {
      return redirectManager(history, REDIRECT_MAPPING.NOT_ACTIVATED);
    }

    if (isCustomWall && customUrl) {
      // await dispatch(setHandleRedirectOnLogin(true));
      // history.push(customUrl);
      // return;
      redirectCustomWall(history, customUrl);
    }

    if (isOnboardingFlow) {
      await handleLoginBeneficiaryOnboarding();
    }

    if (decodedToken.invitedToPlatform) {
      await setCurrentStep(REDIRECT_MAPPING.PERSONAL_INFORMATION_STEP);
      decodedToken.step = REDIRECT_MAPPING.PERSONAL_INFORMATION_STEP;
    }

    const { location } = history;
    if (userStep >= REDIRECT_MAPPING.WALL_ROUTE_STEP && location.state && location.state.prevLocation) {
      return (window.location = location.state.prevLocation);
    }

    dispatch(setHandleRedirectOnLogin(true));
    redirectManager(history, decodedToken.step);
  } catch ({ response }) {
    handleApiFormValidation(props, values, response);
    setFormLoading(false);
  }
};

/**
 * Create account action to register into application
 *
 * @param values
 * @param props
 * @param history
 * @param type
 * @param setFormLoading
 * @param handleError
 */
export const createAccountSubmitAction = async (values, props, history, { id }, setFormLoading, handleError) => {
  console.log(values);
  const { email, createAccountPassword, passwordConfirmation } = values;
  const { score } = zxcvbn(values.createAccountPassword);
  if (score < 2) return props.setFieldError(GLOBAL, NOT_STRONG);
  setFormLoading(true);

  const payload: any = {
    email,
    password: createAccountPassword,
    passwordConfirmation,
    type: ACCOUNT_TYPE.BENEFICIARY,
    platformTypeId: Number(id) || null,
    step: 1
  };
  const platformId = getLocalStorage(INVITED_ADMIN_PLATFORM);

  if (platformId) payload.platformId = Number(JSON.parse(platformId));

  try {
    const data = await accountApi.createAccount(payload);
    if (data) Cookies.set(UUID, data.uuid);
    if (platformId) removeLocalStorage(INVITED_ADMIN_PLATFORM);
    setLocalStorage(CAN_REDIRECT_TO_EMAIL_ACTIVATION_PAGE, true);
    history.push(WELCOME_EMAIL_ACTIVATION_ROUTE);
  } catch (err) {
    handleError(props, values, err);
  }

  props.setSubmitting(false);
  setFormLoading(false);
};

/**
 * Forgot password action that triggers the email sent
 *
 * @param values
 * @param props
 * @param history
 * @param setForgotSubmitted
 * @param setFormLoading
 */
export const forgotPasswordAction = (values, props, history, setForgotSubmitted, setFormLoading) => {
  setFormLoading(true);
  const { email } = values;
  return axiosInstance()
    .post(FORGOT_PASSWORD_ENDPOINT, { email, url: `http://${window.location.host}/landing/passwordReset/` })
    .then(() => setForgotSubmitted(true))
    .catch(err => handleApiFormValidation(props, values, err.response))
    .finally(() => setFormLoading(false));
};

/**
 * Update user action that updates the user information
 *
 * @param values
 * @param props
 * @param setFormLoading
 * @param formatMessage
 */
export const updateUserInformation = (values, props, setFormLoading, formatMessage) => {
  return axiosInstance()
    .patch(`${UPDATE_USER_ENDPOINT}/${getUserCookie(USER_COOKIE_FIELDS.UUID)}`, values)
    .then(() => {
      if (values.platformIdentifier) {
        platformApi.updatePlatform(getUserCookie(USER_COOKIE_FIELDS.PLATFORM_ID), { name: values.platformIdentifier });
      }
    })
    .then(() =>
      handleUpdateUserInformationRedirect()
    )
    .catch(err => {
      toast(formatMessage({ id: 'toast.message.generic.error' }));
      handleApiFormValidation(props, values, err.response);
    })
    .finally(() => setFormLoading(false));
};

/**
 * Update user action that updates the user account information
 *
 * @param values
 * @param props
 * @param setFormLoading
 */
export const updateAccountInformation = (values, props, setFormLoading) => {
  return userApi
    .updateUserDetails(getUserUuid(), values)
    .then(() => window.location.reload())
    .catch(err => handleApiFormValidation(props, values, err.response))
    .finally(() => setFormLoading(false));
};

/**
 * Method calls upload endpoint and submits data
 *
 * @param data
 * @param props
 * NOTE: used eslint disable due to not recognising process window variable
 */
export const uploadPicture = async (data, props) => {
  try {
    const res = await uploadFile(data, UPLOAD_FILES_ENDPOINT);
    return res.data;
  } catch (e) {
    props.setErrors({ global: `upload.failed` });
    return Promise.reject();
  }
};

/**
 * Method checks if the given platform name is valid and unique
 * @param values
 * @param props
 * @param setFormLoading
 */
const hasValidPlatformName = async (values, props, setFormLoading) => {
  if (values.platformIdentifier.trim().length < PLATFORM_IDENTIFIER_LENGTH.MIN) {
    props.setErrors({ [TRIMMED_INPUT]: TRIMMED_INPUT });
    return false;
  }

  const hasUniqueName = await platformApi.hasUniqueName(values.platformIdentifier);
  if (!hasUniqueName) {
    props.setErrors({ [UNIQUE_NAME]: UNIQUE_NAME });
    setFormLoading(false);
    return false;
  }

  return true;
};

/**
 *  Submit all personal information data
 * @param fullAvatar
 * @param croppedAvatar
 * @param avatarConfig
 * @param values
 * @param props
 * @param setFormLoading
 * @param formatMessage
 */
export const submitPersonalInformation = async (
  { fullAvatar, croppedAvatar, avatarConfig },
  values,
  props,
  setFormLoading,
  formatMessage,
  isExistingSuperAdminInvite = false
) => {
  console.log("CA ARRIVE")
  let fullImageFile: any;
  let croppedImageFile: any;
  let fullImageFormData: FormData;

  if (!isExistingSuperAdminInvite) {
    try {
      fullImageFile = await base64ImageToBlob(fullAvatar);
      croppedImageFile = await base64ImageToBlob(croppedAvatar);
      fullImageFormData = fileToFormDataArray(
        [
          [fullImageFile, croppedImageFile],
          [avatarConfig.name, `${CROPPED}${avatarConfig.name}`],
          [USER_IMAGE_TYPE.USER_PROFILE_PICTURE, USER_IMAGE_TYPE.USER_CROPPED_PROFILE_PICTURE]
        ],
        IMAGE_FORM_DATA_FIELDS
      );
    } catch (e) {
      console.log('form.validation.image.required')
      props.setErrors({ requiredImage: 'form.validation.image.required', e });
      return;
    }
  }

  const userDetails: any = JSON.parse(Cookies.get(USER_DETAILS_COOKIE));

  try {
    setFormLoading(true);
    if (!userDetails.invitedToPlatform && !(await hasValidPlatformName(values, props, setFormLoading))) {
      return setFormLoading(false);
    }
    let valuesWithImages = values;
    if (!isExistingSuperAdminInvite) {
      const imageUploadResponse = await uploadPicture(fullImageFormData, props);
      valuesWithImages = getProfileImagesId(values, imageUploadResponse);
    }
    if (userDetails.invitedToPlatform) {
      const body = { ...valuesWithImages, platformId: userDetails.invitedToPlatform };
      await accountApi.joinAnAdmin(body);
    }
    console.log(values)

    await updateUserInformation(valuesWithImages, props, setFormLoading, formatMessage);
  } catch (e) {
    handleApiFormValidation(props, values, e.response);
    setFormLoading(false);
  }

};

/**
 * Reset password action
 *
 * @param values
 * @param props
 * @param history
 * @param setForgotSubmitted
 * @param setFormLoading
 */
export const resetPasswordAction = (values, props, history, setForgotSubmitted, setFormLoading) => {
  setFormLoading(true);
  const { createAccountPassword, passwordConfirmation, token } = values;
  const payload = {
    password: createAccountPassword,
    passwordConfirmation: passwordConfirmation,
    token: token
  };

  return axiosInstance(false)
    .put(RESET_PASSWORD_ENDPOINT, payload)
    .then(() => setForgotSubmitted(true))
    .catch(err => handleApiFormValidation(props, values, err.response))
    .finally(() => setFormLoading(false));
};

/**
 * Action validates a token and continues with the next page
 *
 * @param token
 * @param setValid
 * @param history
 * @param type
 */
export const validateToken = async (token, setValid, history, type) => {
  try {
    await axiosInstance().post(VALIDATE_TOKEN, { token, type });
  } catch (e) {
    history.push(VALIDATE_TYPE_ERROR_REDIRECT[type] || PAGE_NOT_FOUND);
    if (type === VALIDATE_TYPE.EMAIL_CONFIRMATION) return Promise.reject();
  }

  return Promise.resolve();
};

export const getProfileImagesId = (values, imageUploadResponse) => {
  if (imageUploadResponse && imageUploadResponse.length && imageUploadResponse[0].id && imageUploadResponse[1].id) {
    return {
      ...values,
      croppedPictureId: imageUploadResponse[1].id,
      originalPictureId: imageUploadResponse[0].id
    };
  }
};

/**
 * Method calls endpoint in order to generate program URL
 */
export const generateProgramURL = () => {
  return axiosInstance()({
    method: POST,
    url: `${trimUrl(envConfig.backendUrl, API_V1)}${API_V1}${GENERATE_URL_ENDPOINT}`
  });
};

/**
 * Create Program parameters launch action
 *
 * @param values
 * @param setNextStep
 * @param dispatch
 * @param type
 */
export const launchProgramParametersAction = (values, setNextStep, dispatch, type) => {
  //no duration for freemium
  if (!values.url.includes(FREEMIUM)) {
    const momentUtilities = new MomentUtilities();
    const start = moment(values.duration.start);
    const end = moment(values.duration.end);
    const { yearDifference } = momentUtilities.getDiff(start, end);
    const setGlobalError = error => setMultipleData({ category: LAUNCH_PROGRAM, values: { globalError: error } });

    if (!values.duration.end && type !== LOYALTY) return dispatch(setGlobalError('launchProgram.date.end.required'));
    if (yearDifference >= 3 && type !== LOYALTY) return dispatch(setGlobalError('launchProgram.date.limit.year'));
  }
  dispatch(setMultipleData({ category: LAUNCH_PROGRAM, values }));
  setNextStep();
};

/**
 * Create Program parameters launch action
 *
 * @param values
 * @param setNextStep
 * @param dispatch
 * @param simpleAllocation
 */
export const launchProgramSimpleAllocationSubmit = (values, setNextStep, dispatch, simpleAllocation) => {
  const [value, min, max] = Object.keys(values);
  let error = '';

  if (convertToFloatNumber(values[min]) >= convertToFloatNumber(values[max])) error = 'launchProgram.cube.minMax.error';
  if (convertToFloatNumber(values[max]) > MAX_NUMBER_FOR_SIMPLIFIED_RULE) error = 'launchProgram.cube.max.error';

  dispatch(
    setMultipleData({
      category: LAUNCH_PROGRAM,
      values: {
        simpleAllocation: {
          type: simpleAllocation.type || 1,
          value: values[value],
          min: values[min],
          max: values[max],
          globalError: error
        }
      }
    })
  );

  if (error) return;

  setNextStep();
};

/**
 * Create Contents Page launch action
 *
 * @param values
 * @param contentGeneralData
 * @param coverContext
 * @param props
 */
export const contentsPageParametersAction = async (values, dispatch, setNextStep, editorData, coverContext, stepIndex, props) => {
  // const { step, stepIndex } = useParams();
  const { contentsCoverConfig, contentsCroppedCover, setContentsCroppedAvatar } = coverContext;
  // const { dispatch, setNextStep, editorData } = contentGeneralData;
  // If contentsCover was changed or a new picture was uploaded (contentsCroppedCover has base64 representation),
  // we need to upload the new image to server and set info in localstorage

  let contentsCoverId = CONTENTS_COVER_ID;
  let wysiwigDataField = WISYWIG_DATA_FIELD;
  if (stepIndex == '1') {
    wysiwigDataField = WISYWIG_DATA_FIELD;
    contentsCoverId = CONTENTS_COVER_ID;
  } else {
    const indexConst = (stepIndex - 1).toString();
    wysiwigDataField = WISYWIG_DATA_FIELD + indexConst;
    contentsCoverId = CONTENTS_COVER_ID + indexConst;
  }
  if (contentsCroppedCover && contentsCroppedCover.includes('base64')) {

    const croppedCoverData = await fileToAvatarFormData(
      contentsCroppedCover,
      contentsCoverConfig,
      USER_IMAGE_TYPE.PAGE_IMAGE
    );
    try {
      const { data: coverResponse }: any = await uploadFile(croppedCoverData, UPLOAD_FILES_ENDPOINT);
      dispatch(setLaunchDataStep({ key: contentsCoverId, value: coverResponse[0].id }));
      setContentsCroppedAvatar(coverResponse[0].publicPath);
    } catch (err) {
      handleApiFormValidation(props, values, err.response);
    }
  }
  dispatch(setMultipleData({ values }));
  dispatch(setLaunchDataStep({ key: wysiwigDataField, value: JSON.stringify(convertToRaw(editorData)) }));
  setNextStep();
};

/**
 * Method calls endpoint in order to generate program URL (quick/full)
 *
 * @param programJourney
 * @param type
 * @param platformType
 * @param withProducts
 */
export const getFormFields = (programJourney, type, platformType, withProducts) =>
  axiosInstance().get(
    `${GET_FORM_FIELDS_API}${programJourney}${GET_FORM_FIELDS_API_PROGRAM_TYPE}${type}${GET_FORM_FIELDS_API_FORM_TYPE}${platformType}${GET_FORM_FIELDS_API_WITH_PRODUCTS}${withProducts}`
  );

/**
 * Create program action
 *
 * @param launchStoreData
 * @param dispatch
 * @param setLaunchError
 * @param setLoading
 * @param blob
 */
export const createProgramSubmitAction = async (launchStoreData, dispatch, setLaunchError, setLoading, blob = null) => {
  const userData = getUserDetails();
  setLoading(true);

  let uploadedTC = null;
  if (blob) {
    const dateNow = MomentUtilities.formatDateAsIso();
    const file = new File([blob], `${launchStoreData.programName}-${dateNow}`, { type: blob.type });
    const files = [{ file: file, filename: `${launchStoreData.programName}-${dateNow}`, type: 16 }];
    uploadedTC = await filesApi.uploadFiles(files).then(response => response.data[0].id);
  }
  const payload = constructProgramCreationPayload(launchStoreData, uploadedTC);

  if (payload.type === PROGRAM_TYPES[FREEMIUM]) {
    payload.cube = {};
  }
  // payload.landingPicture = 662;
  if (payload.isModify) {
    new LaunchApi()
      .updateProgram(payload)
      .then(res => {
        const { programId } = res.data;
        Cookies.set(USER_DETAILS_COOKIE, JSON.stringify({ ...userData, programId }));
        dispatch(setLaunchDataStep({ key: PROGRAM_ID, value: programId }));
        Cookies.remove(SELECTED_PLATFORM_COOKIE);
        redirectToNewProgramWall(programId, launchStoreData);
      })
      .catch(err => {
        if (err.response && err.response.data) setLaunchError(err.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  } else {
    new LaunchApi()
      .launchProgram(payload)
      .then(res => {
        const { programId } = res.data;
        Cookies.set(USER_DETAILS_COOKIE, JSON.stringify({ ...userData, programId }));
        dispatch(setLaunchDataStep({ key: PROGRAM_ID, value: programId }));
        Cookies.remove(SELECTED_PLATFORM_COOKIE);
        redirectToNewProgramWall(programId, launchStoreData);
      })
      .catch(err => {
        if (err.response && err.response.data) setLaunchError(err.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }

};

const redirectToNewProgramWall = (programId: number, launchStoreData) => {
  const redirectQuery = qs.stringify(
    {
      programId,
      programName: launchStoreData.programName,
      platformId: launchStoreData.platform.id
    },
    { skipNulls: true }
  );
  window.location = (`${WALL_ROUTE}?${redirectQuery}` as unknown) as Location;
};

/**
 * Create payload for createProgram API call based on program launch type (quick/full)
 *
 * @param launchStoreData
 * @param tcUploadId
 */
const constructProgramCreationPayload = (launchStoreData, tcUploadId) => {
  if (launchStoreData.programJourney == QUICK) {
    return constructQuickLaunchPayload(launchStoreData, true, tcUploadId);
  }

  return constructFullLaunchPayload(launchStoreData, tcUploadId);
};

/**
 * Create payload for quick launch program option
 *
 * @param launchStoreData
 * @param withSimplifiedCube
 * @param tcUploadId
 */
const constructQuickLaunchPayload = (launchStoreData, withSimplifiedCube = true, tcUploadId) => {
  let payload: any = {
    name: launchStoreData.programName,
    startDate: launchStoreData.duration
      ? new Date(MomentUtilities.getStartOfDay(launchStoreData.duration.start))
      : new Date(),
    type: PROGRAM_TYPES[launchStoreData.type],
    currency: 1, // static value ATM of implementation (no currency change/selection)
    platformId: launchStoreData.platform.id,
    creationType: PROGRAM_CREATION_TYPES[launchStoreData.programJourney],
    registerFormFields: launchStoreData.invitedUsersFields,
    registerManualValidation: launchStoreData.manualValidation,
    notifyOfNewRegistrations: launchStoreData.emailNotify,
    open: launchStoreData.confidentiality == PROGRAM_CONFIDENTIALITY_OPEN,
    declarationManualValidation: launchStoreData.resultsManualValidation,
    notifyOfNewResultsDeclaration: launchStoreData.resultsEmailNotify,
    customUrl: launchStoreData.extendUrl,
    sendEmailInvites: launchStoreData.acceptedEmailInvitation,
    resultsDeclarationForm:
      (launchStoreData.programJourney === QUICK && true) || launchStoreData.resultChannel.declarationForm,
    uploadResultsFile: (launchStoreData.programJourney === QUICK && true) || launchStoreData.resultChannel.fileImport,
    termsAndConditionsVersion: envConfig.termsAndConditions.launch,
    termsAndCondition: tcUploadId || null
  };

  if (launchStoreData.duration && launchStoreData.duration.end) {
    payload = {
      ...payload,
      endDate: new Date(MomentUtilities.getEndOfDay(launchStoreData.duration.end))
    };
  }

  if (launchStoreData.invitedUserData && launchStoreData.invitedUserData.invitedUsersFile) {
    payload = { ...payload, invitedUsersFile: launchStoreData.invitedUserData.invitedUsersFile };
  }

  if (launchStoreData.resultsUsersFields) {
    payload = { ...payload, resultsFormFields: launchStoreData.resultsUsersFields };
  }
  if (launchStoreData.iaCompany) {
    payload = { ...payload, iaCompany: launchStoreData.iaCompany };
  }

  if (withSimplifiedCube) {
    const cube = {
      frequencyOfAllocation: 1,
      spendType: 1,
      correlatedGoals: false,
      validityOfPoints: '1Y',
      goals: [
        {
          measurementType: launchStoreData.simpleAllocation.type,
          measurementName: launchStoreData.measurementName,
          name: 'goal1',
          forSpecificProducts: false,
          allocationType: launchStoreData.simpleAllocation.type,
          main: {
            min: launchStoreData.simpleAllocation.min.replace(',', '.'),
            max: launchStoreData.simpleAllocation.max.replace(',', '.'),
            value: Number(launchStoreData.simpleAllocation.value),
            currency: 1
          },
          value: Number(launchStoreData.simpleAllocation.value)
        }
      ]
    };
    payload = { ...payload, cube: cube };
  }

  return payload;
};

/**
 * Create payload for full launch program option
 *
 * @param launchStoreData
 * @param tcUploadId
 */
const constructFullLaunchPayload = (launchStoreData, tcUploadId) => {
  let payload = constructQuickLaunchPayload(launchStoreData, false, tcUploadId);
  const defaultColorCodes = getDefaultColorsCode();
  let content: any = [
    { companyLogo: launchStoreData.companyLogo },
    { companyAvatarImgName: launchStoreData.companyAvatar.avatarConfig?.name },
    { backgroundCover: launchStoreData.backgroundCover },
    { companyCoverImgName: launchStoreData.companyCover.avatarConfig?.name },
    { identificationCoverId: launchStoreData.identificationCoverId },
    { identificationCoverImgName: launchStoreData.identificationCover.avatarConfig?.name },
    { contentsCoverId: launchStoreData.contentsCoverId },
    { contentsCoverIdImgName: launchStoreData.contentsCover.avatarConfig?.name }
  ]
  if (launchStoreData.type == FREEMIUM) {
    content.push({ contentsCoverId1: launchStoreData.contentsCoverId1 });
    content.push({ contentsCoverId1ImgName: launchStoreData.contentsCover1?.avatarConfig?.name });
    content.push({ contentsCoverId2: launchStoreData.contentsCoverId2 });
    content.push({ contentsCoverId2ImgName: launchStoreData.contentsCover2?.avatarConfig?.name });
    content.push({ contentsCoverId3: launchStoreData.contentsCoverId3 });
    content.push({ contentsCoverId3ImgName: launchStoreData.contentsCover3?.avatarConfig?.name });
    content.push({ contentsCoverId4: launchStoreData.contentsCoverId4 });
    content.push({ contentsCoverId4ImgName: launchStoreData.contentsCover4?.avatarConfig?.name });
  }

  let pages = launchStoreData.type == FREEMIUM && launchStoreData.contentsTitle1 ? [
    {
      menuTitle: launchStoreData.contentsTitle,
      bannerTitle: launchStoreData.bannerTitle,
      pictureId: launchStoreData.contentsCoverId,
      content: launchStoreData.wysiwigDataField
    },
    {
      menuTitle: launchStoreData.contentsTitle1,
      bannerTitle: WALL_BLOCK.USER_BLOCK,
      pictureId: launchStoreData.contentsCoverId1,
      content: launchStoreData.wysiwigDataField1
    },
    {
      menuTitle: launchStoreData.contentsTitle2,
      bannerTitle: WALL_BLOCK.POINTS_BLOCK,
      pictureId: launchStoreData.contentsCoverId2,
      content: launchStoreData.wysiwigDataField2
    },
    {
      menuTitle: launchStoreData.contentsTitle3,
      bannerTitle: WALL_BLOCK.DECLARATIONS_BLOCK,
      pictureId: launchStoreData.contentsCoverId3,
      content: launchStoreData.wysiwigDataField3
    },
    {
      menuTitle: launchStoreData.contentsTitle4,
      bannerTitle: WALL_BLOCK.PAYMENT_BLOCK,
      pictureId: launchStoreData.contentsCoverId4,
      content: launchStoreData.wysiwigDataField4
    },
    {
      menuTitle: WALL_BLOCK.IMAGES_IDS,
      bannerTitle: WALL_BLOCK.IMAGES_IDS,
      pictureId: 0,
      content: content ? JSON.stringify(content) : ""
    }
  ] : [
    {
      menuTitle: launchStoreData.contentsTitle,
      bannerTitle: launchStoreData.bannerTitle,
      pictureId: launchStoreData.contentsCoverId,
      content: launchStoreData.wysiwigDataField
    }, {
      menuTitle: WALL_BLOCK.IMAGES_IDS,
      bannerTitle: WALL_BLOCK.IMAGES_IDS,
      pictureId: 0,
      content: content ? JSON.stringify(content) : ""
    }];
  // Extra parameters needed for full launch
  payload = {
    ...payload,
    design: {
      companyName: launchStoreData.companyName,
      companyLogo: launchStoreData.companyLogo,
      backgroundCover: launchStoreData.backgroundCover,
      colorMainButtons: (launchStoreData.design && launchStoreData.design.colorMainButtons) || defaultColorCodes[MAIN],
      colorSidebarTitles:
        (launchStoreData.design && launchStoreData.design.colorSidebarTitles) || defaultColorCodes[SIDEBARS_TITLES],
      colorMenu: (launchStoreData.design && launchStoreData.design.colorMenu) || defaultColorCodes[MENU],
      colorContent: (launchStoreData.design && launchStoreData.design.colorContent) || defaultColorCodes[CONTENT],
      colorTask: (launchStoreData.design && launchStoreData.design.colorTask) || defaultColorCodes[TASK],
      colorFont: (launchStoreData.design && launchStoreData.design.colorFont) || defaultColorCodes[FONT],
      colorBackground:
        (launchStoreData.design && launchStoreData.design.colorBackground) || defaultColorCodes[BACKGROUND],
      colorSidebar: (launchStoreData.design && launchStoreData.design.colorSidebar) || defaultColorCodes[COLOR_SIDEBAR],
      colorTitles: (launchStoreData.design && launchStoreData.design.colorTitles) || defaultColorCodes[COLOR_TITLES],
      font: (launchStoreData.design && launchStoreData.design.font) || ROBOTO
    },
    budget: launchStoreData.programBudget >= 0 ? Number(launchStoreData.programBudget) : null,
    categoryIds: launchStoreData.categoryIds ? launchStoreData.categoryIds : [],
    pages: pages,
    landingTitle: launchStoreData.identificationTitle,
    landingDescription: launchStoreData.identificationText,
    landingPicture: launchStoreData.identificationCoverId,
    socialMediaAccounts: {
      facebook: launchStoreData.socialMediaAccounts.facebook,
      twitter: launchStoreData.socialMediaAccounts.twitter,
      linkedin: launchStoreData.socialMediaAccounts.linkedin,
      instagram: launchStoreData.socialMediaAccounts.instagram,
      custom: launchStoreData.socialMediaAccounts.custom
    },
    ecardPrograms: launchStoreData.eCardSelectdList,
    isModify: launchStoreData.isModify,
    programRanking: launchStoreData.programRanking
  };

  let cube: any = {};
  if (launchStoreData.cube && launchStoreData.cube.goals?.length > 0) {
    const goals = [];
    launchStoreData.cube.goals.map(goal => {
      const brackets = [];
      if (goal.brackets.length) {
        goal.brackets.map(bracket => {
          if (bracket.value) {
            brackets.push({
              crt: bracket.crt,
              min: Number(bracket.min),
              max: Number(bracket.max),
              value: Number(bracket.value)
            });
          }
        });
      }
      const val = goal.main ? goal.main.value : "";
      let constructedGoal: any = {
        measurementType: goal.measurementType || MEASUREMENT_TYPES.QUANTITY,
        measurementName: goal.measurementName,
        name: 'goal ' + (goals.length + 1),
        forSpecificProducts: (launchStoreData.personaliseProducts && goal.specificProducts) || false,
        allocationType: goal.allocationType,
        productIds: goal.productIds || [],
        value: convertToFloatNumber(val),
        brackets
      };
      const val2 = goal.main ? goal.main.min : ""

      if (val != "") {
        const val3 = goal.main.max ? goal.main.max : ""
        constructedGoal = {
          ...constructedGoal,
          main: {
            min: convertToFloatNumber(val2) || null,
            max: convertToFloatNumber(val3) || null,
            value: convertToFloatNumber(goal.main.value),
            currency: 1
          }
        };
      }
      goals.push(constructedGoal);
    });
    cube = {
      frequencyOfAllocation: launchStoreData.cube.frequencyAllocation
        ? FREQUENCY_TYPE_VALUES[launchStoreData.cube.frequencyAllocation]
        : FREQUENCY_TYPE_VALUES[FREQUENCY_TYPE.INSTANTANEOUSLY],
      spendType: launchStoreData.cube.spendType,
      correlatedGoals: launchStoreData.cube.correlated,
      validityOfPoints: launchStoreData.cube.validityPoints.value.toUpperCase(),
      rewardManagers: launchStoreData.cube.rewardPeopleManagerAccepted ? launchStoreData.cube.rewardPeopleManagers : 0,
      goals: goals
    };



  }
  const combinedFullProducts = [
    ...(launchStoreData.fullProducts || []),
    ...(launchStoreData.fullCategoriesProducts || [])
  ];
  const productIds = getUniqueSelectedIds(combinedFullProducts);




  payload = { ...payload, productIds, cube: cube, id: launchStoreData.programId };

  return payload;
};

/**
 * Update all personal information data
 * @param fullAvatar
 * @param croppedAvatar
 * @param avatarConfig
 * @param values
 * @param props
 * @param setFormLoading
 * @param setImageError
 * @param userData
 * @param safeToDelete
 */
export const submitUpdatePersonalInformation = async (
  { fullAvatar, croppedAvatar, avatarConfig },
  values,
  props,
  setFormLoading,
  setImageError,
  userData,
  safeToDelete,
  isSettingForm
) => {
  const valuesData = values.values;
  transferValuesToSocialMedia(valuesData);

  if (!valuesData[socialMediaAccounts]) {
    valuesData[socialMediaAccounts] = {
      [socialMediaAccounts[SOCIAL.FACEBOOK]]: null,
      [socialMediaAccounts[SOCIAL.TWITTER]]: null,
      [socialMediaAccounts[SOCIAL.LINKEDIN]]: null
    };
  }

  if (!valuesData[FORM_FIELDS.BIRTH_DATE]) {
    valuesData[FORM_FIELDS.BIRTH_DATE] = '';
  }
  const commonFields = getCommonFields(values, userData, safeToDelete);

  if (!croppedAvatar) {
    return setImageError({ requiredImage: 'form.validation.image.required' });
  }

  setFormLoading(true);
  let valuesWithImages;
  try {
    valuesWithImages = await getValuesWithImages(fullAvatar, croppedAvatar, avatarConfig, props, valuesData);
    await callUpdateAccountWithImages(valuesWithImages, props, commonFields, setFormLoading);
  } catch (e) {
    await callUpdateAccountWithoutImages(values, commonFields, props, setFormLoading, isSettingForm);
  } finally {
    props.setSubmitting(false);
  }
};

/**
 * Method returns images for the account
 * @param fullAvatar
 * @param croppedAvatar
 * @param avatarConfig
 * @param props
 * @param values
 */
export const getValuesWithImages = async (fullAvatar, croppedAvatar, avatarConfig, props, values) => {
  if (!avatarConfig.name && croppedAvatar) {
    avatarConfig.name = 'default';
  }
  const fullImageFile = await base64ImageToBlob(fullAvatar);
  const croppedImageFile = await base64ImageToBlob(croppedAvatar);
  const fullImageFormData = fileToFormDataArray(
    [
      [fullImageFile, croppedImageFile],
      [avatarConfig.name, `${CROPPED}${avatarConfig.name}`],
      [USER_IMAGE_TYPE.USER_PROFILE_PICTURE, USER_IMAGE_TYPE.USER_CROPPED_PROFILE_PICTURE]
    ],
    IMAGE_FORM_DATA_FIELDS
  );
  const imageUploadResponse = await uploadPicture(fullImageFormData, props);

  return getProfileImagesId(values, imageUploadResponse);
};

/**
 * Method returns an object containing all values (key - value)
 * @param values
 * @param userData
 * @param safeToDelete
 */
export const getCommonFields = (values, userData, safeToDelete) => {
  const linkedEmails = values.linkedEmails.length || !safeToDelete ? values.linkedEmails : userData.linkedEmails;
  const commonFieldsValues = {};
  commonFieldsValues[FORM_FIELDS.EMAIL] = values.email;
  commonFieldsValues['linkedEmails'] = linkedEmails;

  Object.keys(values.personalInformation).map(item => {
    commonFieldsValues[item] = values.personalInformation[item];
  });

  return { ...commonFieldsValues };
};

/**
 * Method used to call change password API
 * @param values
 * @param props
 * @param history
 * @param setFormLoading
 * @param dispatch
 * @param formatMessage
 */
export const changePasswordSubmitAction = async (values, props, history, setFormLoading, dispatch, formatMessage) => {
  const { oldPassword, newPassword, newPasswordConfirmation } = values;
  const { resetForm } = props;
  const data = {
    oldPassword,
    password: newPassword,
    passwordConfirmation: newPasswordConfirmation
  };
  setFormLoading(true);
  try {
    await wallSettingsApi.confirmPassword(RESET_PASSWORD_ENDPOINT, data);
    toast(formatMessage({ id: 'wall.settings.password.update.success' }));
    resetForm();
  } catch (err) {
    handleApiFormValidation(props, values, err.response);
    toast(formatMessage({ id: 'wall.settings.password.update.failed' }));
  }
  setFormLoading(false);
};

/**
 * Method updated account if image was updated
 * @param valuesWithImages
 * @param props
 * @param commonFields
 * @param setFormLoading
 */
export const callUpdateAccountWithImages = async (valuesWithImages, props, commonFields, setFormLoading) => {
  try {
    await updateAccountInformation(
      {
        ...valuesWithImages,
        ...commonFields
      },
      props,
      setFormLoading
    );
  } catch (e) {
    props.setSubmitting(false);
  }
};

/**
 * Method updated account if image was not updated
 * @param values
 * @param commonFields
 * @param props
 * @param setFormLoading
 */
export const callUpdateAccountWithoutImages = async (values, commonFields, props, setFormLoading, isSettingForm) => {
  const valuesParams = isSettingForm ? values.values : {
    ...values.values,
    ...commonFields
  };

  try {
    await updateAccountInformation(
      valuesParams,
      props,
      setFormLoading
    );
  } catch (e) {
    setFormLoading(false);
    props.setSubmitting(false);
  }
};

/**
 * Method block/unblock user based on status
 * @param programId
 * @param uuid
 * @param operation
 * @param setUserBlockingError
 * @param refreshPrograms
 */
export const blockUnblockUser = (
  programId: number,
  uuid: string,
  operation: string,
  setUserBlockingError,
  refreshPrograms
) => {
  userApi
    .updateProgramUsers(programId, uuid, operation)
    .then(() => {
      refreshPrograms();
      setUserBlockingError(false);
    })
    .catch(() => {
      setUserBlockingError(true);
    });

  return null;
};

/**
 * Method that updates the point conversion status to validated
 *
 * @param pointConversion
 */
export const validatePointConversion = pointConversion => pointConversionApi.validatePointConversion(pointConversion);
