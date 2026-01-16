import qs from 'qs';

import axiosInstance from 'config/axiosConfig';
import PostsApi from 'api/PostsApi';
import {
  COMMENTS_QUERY,
  DEFAULT_COMMENTS_LIST_SIZE,
  DEFAULT_OFFSET,
  OFFSET_QUERY,
  PINS,
  POST,
  POSTS_ENDPOINT,
  SIZE_QUERY,
  USERS_ENDPOINT,
  VIEW_TYPE
} from 'constants/api';
import {
  RELOAD_AGENDA,
  SET_ACTIVE_PLATFORM,
  SET_ACTIVE_PROGRAM,
  SET_FORCED_PROGRAM,
  SET_IS_PROGRAM_SELECTION_LOCKED,
  SET_LINKED_EMAILS_DATA,
  SET_PLATFORMS,
  SET_POST_CREATED,
  SET_PROGRAM_USERS,
  SET_PROGRAMS,
  SET_REDIRECT_DATA,
  SET_USER_RANKINGS,
  SET_LOADING_PLATFORMS,
  SET_BENEFICIARY_POINTS,
  SET_PROGRAM_DETAILS,
  SET_SELECTED_PLATFORM,
  SET_SUPER_PLATFORMS
} from 'store/actions/actionTypes';
import { TDynamicObject } from 'interfaces/IGeneral';

/**
 * Action for setting reload state for agenda
 * @param shouldReload
 */
export const setAgendaReload = (shouldReload: boolean) => ({
  type: RELOAD_AGENDA,
  payload: shouldReload
});

/**
 * Action for notifying the creation of a post/task
 * @param postData
 */
export const notifyPostCreated = postData => ({
  type: SET_POST_CREATED,
  payload: postData
});

/**
 * Action adds to store payload(IPriceObject[]) containing program data
 *
 * @param payload
 */
export const setPrograms = (payload: TDynamicObject) => {
  return {
    type: SET_PROGRAMS,
    payload
  };
};

/**
 * Action to set the given platforms
 *
 * @param payload
 */
export const setPlatforms = payload => {
  return {
    type: SET_PLATFORMS,
    payload
  };
};

/**
 * Action to set the given super/hyper platforms
 *
 * @param payload
 */
export const setSuperPlatforms = payload => {
  return {
    type: SET_SUPER_PLATFORMS,
    payload
  };
};

/**
 * Action to set the given platforms
 *
 * @param payload
 */
export const setActivePlatform = payload => {
  return {
    type: SET_ACTIVE_PLATFORM,
    payload
  };
};

/**
 * Action set the given user rankings
 *
 * @param payload
 */
export const setUserRankings = payload => {
  return {
    type: SET_USER_RANKINGS,
    payload
  };
};

/**
 * Action to set the redirect data needed
 *
 * @param payload programId
 */
export const setOnRedirectData = payload => {
  return {
    type: SET_REDIRECT_DATA,
    payload
  };
};

/**
 * Action searches for the given programId and sets the found platform and program or sets the first platform and program
 *
 * @param payload programId
 */
export const forceActiveProgram = ({
  programId = undefined,
  forcedPlatformId = undefined,
  unlockSelection = undefined
}) => {
  return {
    type: SET_FORCED_PROGRAM,
    payload: { programId, forcedPlatformId, unlockSelection }
  };
};

/**
 * Method used to set the program id on cookie and store
 * @param selectedProgramIndex
 * @param programs
 * @param dispatch
 */
export const setSelectedProgram = (selectedProgramIndex: number, programs: any[], dispatch: any) => {
  if (selectedProgramIndex > programs.length || !programs[selectedProgramIndex]) {
    return;
  }

  dispatch(setActiveProgramData(programs[selectedProgramIndex].id));
};

/**
 * Action used to set selectedProgramId on store
 * @param selectedProgramId
 */
export const setActiveProgramData = (selectedProgramId: string) => {
  return {
    type: SET_ACTIVE_PROGRAM,
    selectedProgramId
  };
};

/**
 * Action used to set loading state for platforms on store
 * @param payload
 */
export const setLoadingPlatforms = (payload: boolean) => ({
  type: SET_LOADING_PLATFORMS,
  payload
});

/**
 * Action to save program user data in store
 * @param payload
 */
export const setProgramUsersData = (payload: object) => {
  return {
    type: SET_PROGRAM_USERS,
    payload
  };
};

/**
 * Action to lock/unlock program selection
 * @param payload
 */
export const setIsProgramSelectionLocked = (payload: boolean) => {
  return {
    type: SET_IS_PROGRAM_SELECTION_LOCKED,
    payload
  };
};

/**
 * Api call to get users of all programs
 * @param platform
 */
export const getUsersNr = (platform: number) =>
  axiosInstance().get(USERS_ENDPOINT, { params: { platform, view: VIEW_TYPE.COUNTER } });

/**
 * Service to get data from api call action
 */
export const getProgramUserNumber = async platformId => {
  try {
    const { data } = await getUsersNr(platformId);
    return data;
  } catch (e) {
    return { data: [], total: 0 };
  }
};

/**
 * Method used to call get posts api
 */

export const getPostsData: any = params => {
  return axiosInstance()
    .get(POSTS_ENDPOINT, {
      params,
      paramsSerializer: params =>
        qs.stringify(params, {
          skipNulls: true
        })
    })
    .then(({ data }) => {
      const groupedPosts = data.posts.map(post => ({ ...post, isPinned: false }));
      if (data.pinnedPost && params.offset === DEFAULT_OFFSET) {
        groupedPosts.unshift({ ...data.pinnedPost, isPinned: true });
      }

      return { groupedPosts, total: data.total };
    })
    .catch(() => {
      return { groupedPosts: [], total: 0 };
    });
};

/**
 * Method sets the number of likes, the className for the button and calls remove or delete methods
 * @param noOfLikesState
 * @param postId
 * @param setIsDisabled
 * @param postIsLiked
 * @param setIsLiked
 */
export const setNumberOfLikes = ({
  noOfLikesState,
  postId,
  setIsDisabled,
  postIsLiked,
  setIsLiked,
  addRemoveNames
}) => {
  if (!postIsLiked) {
    return addLikeToPost(postId, noOfLikesState, setIsLiked, setIsDisabled, addRemoveNames);
  }

  return removeLikeFromPost(postIsLiked, noOfLikesState, setIsLiked, setIsDisabled, addRemoveNames);
};

/**
 * Method adds a like to a given postId
 * @param postId
 * @param noOfLikesState
 * @param setIsLiked
 * @param setIsDisabled
 * @param addRemoveNames
 */

const addLikeToPost = async (postId, noOfLikesState, setIsLiked, setIsDisabled, addRemoveNames) => {
  const [noOfLikes, setNoOfLikes] = noOfLikesState;
  setIsDisabled(true);
  setIsLiked(true);
  setNoOfLikes(noOfLikes + 1);

  try {
    const likeId = await new PostsApi().likePost(postId);
    setIsLiked(likeId);
    addRemoveNames(true);
  } catch (e) {
    setNoOfLikes(noOfLikes);
    setIsLiked(false);
  }
  setIsDisabled(false);
};

/**
 * Method deletes a like with a given id from post
 * @param likeId
 * @param noOfLikesState
 * @param setIsLiked
 * @param setIsDisabled
 * @param addRemoveNames
 */
const removeLikeFromPost = async (likeId, noOfLikesState, setIsLiked, setIsDisabled, addRemoveNames) => {
  const [noOfLikes, setNoOfLikes] = noOfLikesState;
  setIsDisabled(true);
  setIsLiked(false);
  setNoOfLikes(noOfLikes - 1);

  try {
    await new PostsApi().unlikePost(likeId);
    setIsLiked(false);
    addRemoveNames(false);
  } catch (e) {
    setNoOfLikes(noOfLikes);
    setIsLiked(likeId);
  }
  setIsDisabled(false);
};

/**
 * Method pins or unpins a post
 * @param isPinned
 * @param id
 * @param programId
 * @param dispatch
 * @param setTriggerPin
 * @param setIsDisabled
 */
export const setPinStatus = async ({
  isPinned,
  id,
  programs: fullPrograms,
  dispatch,
  setTriggerPin,
  setIsDisabled,
  platformId: platform
}) => {
  const programs = fullPrograms.filter(({ id }) => id).map(({ id }) => id);
  if (!isPinned) {
    setIsDisabled(true);

    return setIsPinned(id, programs, platform, dispatch, setTriggerPin, setIsDisabled);
  }

  try {
    setIsDisabled(true);
    const data = await axiosInstance().delete(`${POSTS_ENDPOINT}/${id}/${PINS}`, { data: { platform, programs } });
    if (data) {
      setTriggerPin(i => i + 1);
    }
  } catch (e) {
    // Nothing to do here
  }
  setIsDisabled(false);
};

/**
 * Method sets isPinned status and dispatch getPostData
 * @param id
 * @param programs
 * @param platformId
 * @param dispatch
 * @param setTriggerPin
 * @param setIsDisabled
 */
export const setIsPinned = async (id, programs, platformId, dispatch, setTriggerPin, setIsDisabled) => {
  try {
    const data = await axiosInstance().post(`${POSTS_ENDPOINT}/${id}/${PINS}`, {
      platform: platformId,
      programs: programs
    });
    if (data) {
      setTriggerPin(i => i + 1);
    }
  } catch (e) {
    // Nothing to do here
  }
  setIsDisabled(false);
};

/**
 * Method used to call get comments api
 * @param id
 * @param offset
 */
export const getCommentsData = async (id, offset) => {
  try {
    const data = await axiosInstance().get(
      `${COMMENTS_QUERY}${POST}=${id}${SIZE_QUERY}${DEFAULT_COMMENTS_LIST_SIZE}${OFFSET_QUERY}${offset}`
    );
    if (data) {
      return data.data;
    }
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Action adds to store payload(string[]) containing linkedEmails data
 *
 * @param payload
 */
export const setLinkedEmailsData = (payload: string[]) => {
  return {
    type: SET_LINKED_EMAILS_DATA,
    payload
  };
};

/**
 * Action set the given user rankings
 *
 * @param payload
 */
export const setUserBeneficiaryPoints = payload => {
  return {
    type: SET_BENEFICIARY_POINTS,
    payload
  };
};

/**
 * Action set the given user rankings
 *
 * @param programId
 * @param data
 */
export const setProgramDetails = (programId, data) => {
  return {
    type: SET_PROGRAM_DETAILS,
    payload: { programId, data }
  };
};

/**
 * Action to set the selected platform
 *
 * @param payload
 */
export const setSelectedPlatform = payload => {
  return {
    type: SET_SELECTED_PLATFORM,
    payload
  };
};
