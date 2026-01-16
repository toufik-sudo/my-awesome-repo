/* eslint-disable quotes */
import React from 'react';
import { LucideIcon } from 'lucide-react';
import ArrayUtilities from 'utils/ArrayUtilities';
import MomentUtilities from 'utils/MomentUtilities';
import StringUtilities from 'utils/StringUtilities';
import { REDIRECT_STEP_ROUTES } from 'constants/routes';
import { COMMENT_FILE_TYPE, DEFAULT_COMMENTS_LIST_SIZE, DEFAULT_OFFSET, FileType, POST_FILE_TYPE } from 'constants/api';
import { LIKES_LIST_LENGTH, POST_CONFIDENTIALITY_TYPES, POST_TYPE, POST_TYPES, TASK } from 'constants/wall/posts';
import { PROGRAM_JOIN_OPERATION, USER_PROGRAM_STATUS } from 'constants/api/userPrograms';
import { FILE, IMAGE, VIDEO } from 'constants/files';
import { convertBytesToMb, hasExtension, isFileOfType } from 'utils/files';
import { IPostFileOption } from 'interfaces/components/wall/IPostFileOption';
import { HTML_TAGS, MP4_VIDEO_FORMAT, VIDEO_TAG_SUPPORTED_FORMATS } from 'constants/general';
import { emptyFn } from 'utils/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import {
  WALL_CREATE_ACCOUNT_FIELDS,
  WALL_USER_PERSONAL_INFORMATION_FIELDS
} from 'constants/formDefinitions/formDeclarations';
import { FORM_FIELDS, MINIMUM_AGE_VALUE, SOCIAL_NETWORKS, socialMediaAccounts } from 'constants/forms';
import { getConfidentialityOnlyOptions } from 'services/posts/postsServices';
import { KPI_DETAILED_FIELDS, PERIODS, RESULTS, REVENUE, REWARDS } from 'constants/wall/dashboard';
import { IFormField } from 'interfaces/forms/IForm';
import { isFieldRequired } from 'services/FormServices';
import { PAGE_TITLES, SETTINGS_PAGE_TITLES } from 'constants/pageTitles';

const arrayUtilities = new ArrayUtilities();

export const buildNavigationUrl: any = (title, IconComponent: LucideIcon | null = null, url) => ({
  title: `wall.navigation.${title}`,
  icon: IconComponent ? <IconComponent size={22} strokeWidth={1.5} /> : null,
  url
});

/**
 * Method handles redirect paths based on current step
 */
export const redirectBasedOnCurrentStep = (currentStep, history, currentPath) => {
  if (currentStep && !currentPath.includes(currentStep)) {
    return history.replace(REDIRECT_STEP_ROUTES[currentStep]);
  }
};

/**
 * Method used to set current user data
 * @param currentUsers
 * @param selectedProgramId
 */
export const getCurrentUsersData = (currentUsers, selectedProgramId) => {
  if (!currentUsers.data) {
    return 0;
  }
  const userNr = currentUsers.data.find(program => program.programId === selectedProgramId);

  return userNr && (userNr.total !== undefined || userNr.total !== null) ? userNr.total : currentUsers.total;
};

/**
 * Method returns dd/mm/yy date format from string
 * @param date
 */
export function getDMYDateFormat(date: string): string {
  const dateObj: Date = new Date(date);
  const month: number = dateObj.getMonth() + 1;
  const day: number = dateObj.getDate();
  const year: number = dateObj.getFullYear();

  return (day < 10 ? '0' + day : day) + '/' + (month < 10 ? '0' + month : month) + '/' + year;
}

/**
 * Method used to get class and label text
 *
 * @param type
 * @param withSecondaryColor
 * @param withPrimaryColor
 */
export const getClassTextPost = (type, withSecondaryColor, withPrimaryColor) => {
  let postPublicText = 'authorPublished';
  let currentColorClass = withSecondaryColor;
  if (type === POST_TYPE.TASK) {
    currentColorClass = withPrimaryColor;
    postPublicText = 'authorCreated';
  }

  return { postPublicText, currentColorClass };
};

export const getClassForUserProgramStatus = (status, style) => {
  const { userRowStatusElementActive, userRowStatusElementInactive, userRowStatusElementBlocked } = style;

  if (status === USER_PROGRAM_STATUS.ACTIVE) {
    return userRowStatusElementActive;
  }

  if (status === USER_PROGRAM_STATUS.INACTIVE) {
    return userRowStatusElementInactive;
  }

  if (status === USER_PROGRAM_STATUS.BLOCKED) {
    return userRowStatusElementBlocked;
  }

  if (status === USER_PROGRAM_STATUS.PENDING) {
    return userRowStatusElementInactive;
  }

  return '';
};

export const updateUsersListOnJoinValidated = (usersState, { userId, operation, programId }) => {
  if (programId !== usersState.programId) {
    return usersState;
  }

  const status =
    operation === PROGRAM_JOIN_OPERATION.REJECT ? USER_PROGRAM_STATUS.REJECTED : USER_PROGRAM_STATUS.ACTIVE;

  return {
    ...usersState,
    users: usersState.users.map(user => (user.uuid !== userId ? user : { ...user, status }))
  };
};

/**
 *  Method which filters from all the users declarations on the platform the ones which match the given programId
 *
 * @param platformUserDeclarations
 * @param selectedProgramId
 */
export const getMatchingUserDeclarations = (platformUserDeclarations, selectedProgramId) => {
  const programUserDeclarations = platformUserDeclarations.find(el => el.programId == (selectedProgramId || 'all'));

  return programUserDeclarations && Object.prototype.hasOwnProperty.call(programUserDeclarations, 'userDeclarations')
    ? programUserDeclarations.userDeclarations
    : [];
};

/**
 * Method which loops through an array of user declarations and depending on the information on them (quantity, amount)
 * creates the labels which are displayed on the block of statements from the wall.
 *
 * The program name will be trimmed to a certain length
 *
 * @param currentUserDeclarations
 * @param intl
 */
export const createDeclarationLinesLabels = (currentUserDeclarations, intl) => {
  const declarationsInfoArray = [];
  currentUserDeclarations.forEach(el => {
    const declarationInfo = [];

    if (el.quantity) {
      declarationInfo.push(el.quantity);
    }

    if (el.amount) {
      declarationInfo.push(intl.formatMessage({ id: 'wall.userDeclarations.block.amount' }, { amount: el.amount }));
    }

    const length = 25;
    const trimmedProgramName =
      el.program.name.length > length ? el.program.name.substring(0, length - 3) + '...' : el.program.name;
    declarationInfo.push(trimmedProgramName);

    declarationsInfoArray.push(declarationInfo.join(' - '));
  });

  return declarationsInfoArray;
};

/**
 * Method returns hh:mm hour format from string
 * @param date
 */
export function getHMHourFormat(date: string): string {
  const dateObj: Date = new Date(date);
  const hours: number = dateObj.getHours();
  const minutes: number = dateObj.getMinutes();

  return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
}

/**
 * Returns the media type description for the given fileType
 * @param fileType
 */
export const resolveMediaType = (fileType: FileType): string => {
  if (isImage(fileType)) {
    return IMAGE;
  }

  if (isVideo(fileType)) {
    return VIDEO;
  }

  return FILE;
};

/**
 * Checks whether given file type is an image file type for a post / post comment
 * @param fileType
 */
const isImage = (fileType: FileType) =>
  POST_FILE_TYPE.POST_IMAGE === fileType || COMMENT_FILE_TYPE.COMMENT_IMAGE === fileType;

/**
 * Checks whether given file type is an vido file type for a post / post comment
 * @param fileType
 */
const isVideo = (fileType: FileType) =>
  POST_FILE_TYPE.POST_VIDEO === fileType || COMMENT_FILE_TYPE.COMMENT_VIDEO === fileType;

/**
 * Returns the video type based on fileExtension. Defaults to mp4 for unsupported video tag formates.
 * @param fileExtension
 */
export const resolveVideoType = fileExtension => {
  if (!fileExtension || !VIDEO_TAG_SUPPORTED_FORMATS.includes(fileExtension)) {
    return MP4_VIDEO_FORMAT;
  }

  return fileExtension;
};

/**
 * Validates a file (size and format).
 * @param param0
 * @param param0.fileType the file configuration to validate against
 * @param param0.file the file to validate
 */
export const validatePostFile = ({
  fileType,
  file
}: {
  fileType: IPostFileOption;
  file?: File;
}): { isValid: boolean; error?: string; maxSize?: number } => {
  if (!file) {
    return { isValid: true };
  }

  if (!isValidFileFormat(fileType, file)) {
    return { isValid: false, error: 'wall.posts.file.error.format' };
  }

  if (convertBytesToMb(file.size) > fileType.maxMbSize) {
    return { isValid: false, error: 'wall.posts.file.error.size', maxSize: fileType.maxMbSize };
  }

  return { isValid: true };
};

/**
 * Checks whether a file format is valid (by type or extension).
 * @param fileType restrictions for fiel type
 * @param file the file to validate
 */
const isValidFileFormat = (fileType: IPostFileOption, file: File): boolean => {
  if (fileType.format.length && !isFileOfType(file, fileType.format)) {
    return false;
  }

  if (fileType.unsupportedExtensions && hasExtension(file, fileType.unsupportedExtensions)) {
    return false;
  }

  return true;
};

/**
 * Method used to return the total points for a program
 * @param selectedProgramId
 * @param pointsData
 * @param platformId
 */
export const getProgramsPoints = (selectedProgramId, pointsData, platformId) => {
  if (!Object.keys(pointsData).length) {
    return 0;
  }
  const selectedPlatformData = pointsData.platforms.find(platform => (platform.id = platformId));

  if (!selectedProgramId) {
    return selectedPlatformData.points;
  }
  const selectedProgram = selectedPlatformData.programs.find(program => program.id === selectedProgramId);

  return selectedProgram && selectedProgram.points ? Math.floor(selectedProgram.points) : 0;
};

/**
 * Method used to return create post payload
 *
 * @param platformId
 * @param postType
 * @param createPostNameState
 * @param createPostTextState
 * @param isPinned
 * @param confidentiality
 * @param selectedUsers
 * @param programId
 * @param fileId
 */
export const getPostCreateData = (
  platformId: number,
  postType,
  createPostNameState: [string, React.Dispatch<React.SetStateAction<string>>],
  createPostTextState: [string, React.Dispatch<React.SetStateAction<string>>],
  isPinned,
  confidentiality: number,
  selectedUsers: any[],
  programId,
  fileId,
  postDate
) => {
  return {
    platformId: platformId,
    type: POST_TYPES[postType],
    title: createPostNameState[0],
    content: createPostTextState[0],
    isPinned: isPinned,
    ...postDate,
    confidentialityType: confidentiality,
    specificUserIds: confidentiality === POST_CONFIDENTIALITY_TYPES.SPECIFIC_PEOPLE ? selectedUsers : [],
    specificProgramIds: [programId],
    fileId: fileId
  };
};

/**
 * Method is used to handle confidentiality option change
 * @param closeAuthorizeModal
 * @param setPostUsersList
 * @param selectedUsers
 * @param setPostConfidentiality
 * @param updatePost
 */
export const handleOptionClick = (
  closeAuthorizeModal,
  setPostUsersList,
  selectedUsers,
  setPostConfidentiality,
  updatePost
) => {
  closeAuthorizeModal();
  setPostUsersList ? setPostUsersList(selectedUsers) : emptyFn();
  !setPostConfidentiality
    ? selectedUsers.length && updatePost(POST_CONFIDENTIALITY_TYPES.SPECIFIC_PEOPLE)
    : setPostConfidentiality(POST_CONFIDENTIALITY_TYPES.SPECIFIC_PEOPLE);
};

/**
 * Method used to return like name list
 * @param likeNames
 * @param postIsLiked
 * @param currentUser
 * @param noOfLikes
 */
export const getLikesPlaceholder = (postIsLiked, likeNames, currentUser, noOfLikes) => {
  if (likeNames.length === 1) {
    return postIsLiked ? currentUser : likeNames[0];
  }

  return (
    <DynamicFormattedMessage
      tag={HTML_TAGS.SPAN}
      id={'wall.posts.like.liked.list'}
      values={{ user: postIsLiked ? currentUser : likeNames[0], likeNumber: noOfLikes - 1 }}
    />
  );
};

/**
 * Method used to return like name list for the desktop
 * @param likeNames
 * @param intl
 * @param noOfLikes
 */
export const getLikesFormattedList = (likeNames, intl, noOfLikes) => {
  if (noOfLikes <= LIKES_LIST_LENGTH) {
    return likeNames;
  }
  const firstNElements = likeNames.filter((item, count) => count < LIKES_LIST_LENGTH);
  firstNElements.push(
    intl.formatMessage({ id: 'wall.posts.like.liked.desktop' }, { likeNumber: noOfLikes - LIKES_LIST_LENGTH })
  );

  return firstNElements;
};

/**
 * Method returns selectedOption
 * @param confidentialityType
 */
export const getSelectedOption = confidentialityType => {
  const postConfidentialityOptions = getConfidentialityOnlyOptions();
  return postConfidentialityOptions.find(item => item.type === confidentialityType);
};

export const getPostDateHandler = postType => {
  if (postType === TASK) {
    return {
      initialize: () => ({ startDate: null, hasError: true }),
      isValid: ({ startDate, endDate }) => startDate && endDate && endDate >= startDate,
      updateOnSubmit: postDate => {
        if (postDate.startDate < new Date()) {
          postDate.startDate = new Date();
        }
        if (postDate.endDate < postDate.startDate) {
          postDate.endDate = postDate.startDate;
        }

        return postDate;
      }
    };
  }

  return {
    initialize: () => ({ startDate: null }),
    isValid: ({ startDate }) => startDate && !MomentUtilities.isDateBefore(startDate, new Date()),
    updateOnSubmit: postDate => {
      if (postDate.startDate < new Date()) {
        postDate.startDate = new Date();
      }

      return postDate;
    }
  };
};

/**
 * Method returns yy/mm/dd date format from string
 * @param date
 */
export function getYMDDateFormat(date: string): string {
  const dateObj: Date = new Date(date);
  const month: number = dateObj.getMonth() + 1;
  const day: number = dateObj.getDate();
  const year: number = dateObj.getFullYear();

  return year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
}

/**
 * Method returns personal account information fields
 * @param keys
 * @param userData
 */
export const getAccountGeneralFields = (keys, userData) => {
  const isUpdateForm = true;

  return prepareAccountDataFields(userData, keys, WALL_CREATE_ACCOUNT_FIELDS, isUpdateForm);
};

/**
 * Method returns account general information information fields
 * @param fieldsValues
 * @param userData
 * @param keys
 */
export const getAccountPersonalFieldsAndValues = (fieldsValues, userData, keys) => {
  const fields = prepareAccountDataFields(userData, keys, WALL_USER_PERSONAL_INFORMATION_FIELDS);
  fields.forEach(field => (fieldsValues[field.label] = field.initialValue));

  return fields;
};

/**
 * Method prepares account fields
 * @param userData user account data
 * @param fieldKeys fields to include
 * @param formFields account form fields
 * @param isUpdateForm
 */
export const prepareAccountDataFields = (
  userData: any,
  fieldKeys: string[],
  formFields: IFormField[],
  isUpdateForm = false
) => {
  const stringUtilities = new StringUtilities();

  const fields = formFields.map((field: IFormField) => {
    const { label } = field;
    if (label === FORM_FIELDS.BIRTH_DATE) {
      return prepareBirthDateField(userData, field);
    }

    const isRequired = isFieldRequired(field);
    const includeAsSocialField =
      SOCIAL_NETWORKS.includes(label) && (userData[socialMediaAccounts] || isRequired || isUpdateForm);

    if (includeAsSocialField) {
      return prepareSocialAccountField(userData, field);
    }

    const shouldCapitalize = label === FORM_FIELDS.TITLE;
    if (isRequired || fieldKeys.includes(label)) {
      // const value = shouldCapitalize ? stringUtilities.capitalize(userData[label]) : userData[label];
      const value = userData[label];

      return { ...field, initialValue: value };
    }
  });

  return ArrayUtilities.definedValuesOnly(fields);
};

const prepareSocialAccountField = (userData: any, field: IFormField) => {
  const initialValue = (userData.socialMediaAccounts || {})[field.label];

  return { ...field, initialValue: initialValue || '' };
};

const prepareBirthDateField = (userData: any, field: IFormField) => {
  const fieldValue = userData[FORM_FIELDS.BIRTH_DATE];

  return {
    ...field,
    initialValue: fieldValue ? new Date(fieldValue) : undefined,
    maxValue: new Date().setFullYear(new Date().getFullYear() - MINIMUM_AGE_VALUE)
  };
};

/**
 * Funtion maps social network data on given object.
 * @param values
 */
export const transferValuesToSocialMedia = values => {
  if (!values) {
    return;
  }

  const formattedSocialMediaAccounts = SOCIAL_NETWORKS.reduce((acc, element) => {
    if (values[element]) {
      acc[element] = values[element];
    }
    delete values[element];

    return acc;
  }, {});

  if (Object.values(formattedSocialMediaAccounts).length) {
    values[socialMediaAccounts] = formattedSocialMediaAccounts;
  }
};

/**
 * Method returns prepared data for dashboard kpi tabs
 * @param data
 */
export const getIndividualKpiData = data => {
  const formattedResult = {
    participants: {},
    results: {},
    rewards: {},
    revenue: {}
  };
  Object.keys(KPI_DETAILED_FIELDS).forEach(key => {
    const declarationsData = data.declarations;

    if (key === KPI_DETAILED_FIELDS[RESULTS].name) {
      return (formattedResult[key] = {
        total: declarationsData.total.quantity,
        validated: declarationsData.validated.quantity,
        declined: declarationsData.declined.quantity
      });
    }
    if (key === KPI_DETAILED_FIELDS[REVENUE].name) {
      return (formattedResult[key] = {
        total: declarationsData.total.value,
        validated: declarationsData.validated.value,
        declined: declarationsData.declined.value,
        pointBudgetSoFar: data.rewards.totalInCurrency
      });
    }
    if (key === KPI_DETAILED_FIELDS[REWARDS].name) {
      return (formattedResult[key] = {
        totalInPoints: data.rewards.totalInPoints,
        burned: data.rewards.converted,
        notBurned: data.rewards.inConversion,
        expired: data.rewards.expired
      });
    }

    return (formattedResult[key] = data[key]);
  });

  Object.keys(formattedResult).forEach(element => {
    if (formattedResult[element][PERIODS]) {
      delete formattedResult[element][PERIODS];
    }
  });

  return formattedResult;
};

/**
 * Method searches and returns the oldest date
 * @param programs
 */
export const getDefaultStartDate = programs => {
  const programDates = [];

  programs.forEach(program => {
    if (program.startDate) {
      programDates.push(program.startDate);
    }
  });

  if (programDates.length) {
    return arrayUtilities.getOldestDate(programDates);
  }

  return new Date();
};

/**
 * Method sets the offset for the commentsList
 * @param commentsWereDeleted
 * @param offsetFromComment
 * @param offset
 * @param setCommentsWereDeleted
 * @param newCommentsList
 */
export const getCommentsListOffset = (
  commentsWereDeleted,
  offsetFromComment,
  offset,
  setCommentsWereDeleted,
  newCommentsList
) => {
  {
    if (commentsWereDeleted) {
      offsetFromComment = offset;
      setCommentsWereDeleted(false);
    } else {
      offsetFromComment === DEFAULT_OFFSET || newCommentsList.length === DEFAULT_COMMENTS_LIST_SIZE
        ? (offsetFromComment = DEFAULT_COMMENTS_LIST_SIZE)
        : (offsetFromComment = offset + DEFAULT_COMMENTS_LIST_SIZE);
    }
  }
  return offsetFromComment;
};

/**
 * Returns settings selected tab title
 */
export const getSettingsPageTitle = () => {
  let title = PAGE_TITLES.DEFAULT;
  SETTINGS_PAGE_TITLES.forEach(item => {
    const formattedItem = item.replace(/ /g, '');
    if (window.location.pathname.indexOf(formattedItem.toLowerCase()) !== -1) {
      title = item;
    }
  });

  return title;
};

/**
 * Method replaces values from the string (by using rules) and returns the result
 * @param title
 * @param rules
 */
export const getFormattedTitle = (title, rules) => {
  const regExp = new RegExp(Object.keys(rules).join('|'), 'gi');

  return title.replace(regExp, item => rules[item]);
};
