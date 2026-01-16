import { POST_CONFIDENTIALITY_TYPES, POST_VALIDATION } from 'constants/wall/posts';
import { isAnyKindOfAdmin, isAnyKindOfManager, getUserAuthorizations } from 'services/security/accessServices';

/**
 * Returns the options needed for confidentiality selection
 */
export const getConfidentialityOnlyOptions = () => {
  return [
    {
      label: 'wall.posts.confidentiality.program',
      type: POST_CONFIDENTIALITY_TYPES.PROGRAM_USERS
    },
    {
      label: 'wall.posts.confidentiality.specific',
      type: POST_CONFIDENTIALITY_TYPES.SPECIFIC_PEOPLE
    },
    {
      label: 'wall.posts.confidentiality.me',
      type: POST_CONFIDENTIALITY_TYPES.ME_ONLY
    }
  ];
};

/**
 *  Retrieves the operations allowed for the specific role
 *
 * @param role
 */
export const getPostEditOptions = (role = undefined) => {
  const userRights = getUserAuthorizations(role);
  const managerOptions = [
    {
      label: 'wall.posts.confidentiality.delete',
      type: POST_CONFIDENTIALITY_TYPES.DELETE
    }
  ];
  if (isAnyKindOfManager(userRights)) {
    return managerOptions;
  }
  const confidentialityOptions = getConfidentialityOnlyOptions();

  const adminOptions = [...confidentialityOptions, ...managerOptions];

  return isAnyKindOfAdmin(userRights) ? adminOptions : [];
};

/**
 * Method used to validate post data
 *
 * @param titleState
 * @param contentState
 * @param setHasError
 * @param setHasContentError
 * @param setDataStatus
 */
export const validatePostCreation = (titleState, contentState, setHasError, setHasContentError, setDataStatus) => {
  const postNameLength = titleState[0].trim().length;
  const postTextLength = contentState[0].trim().length;

  const hasTitleError = postNameLength > POST_VALIDATION.TITLE.max;
  const hasContentError = postTextLength > POST_VALIDATION.CONTENT.max;
  setHasError(hasTitleError);
  setHasContentError(hasContentError);
  const isValidData = postNameLength && postTextLength && !hasTitleError && !hasContentError;

  setDataStatus(isValidData);
};
