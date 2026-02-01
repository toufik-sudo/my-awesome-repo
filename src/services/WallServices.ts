// -----------------------------------------------------------------------------
// Wall Services
// Migrated from old_app/src/services/WallServices.tsx
// -----------------------------------------------------------------------------

import { REDIRECT_STEP_ROUTES } from '@/constants/routes';
import {
  COMMENT_FILE_TYPE,
  DEFAULT_COMMENTS_LIST_SIZE,
  DEFAULT_OFFSET,
  POST_FILE_TYPE
} from '@/constants/api';
import {
  LIKES_LIST_LENGTH,
  POST_CONFIDENTIALITY_TYPES,
  POST_TYPE,
  POST_TYPES,
  TASK
} from '@/constants/wall/posts';
import { PROGRAM_JOIN_OPERATION, USER_PROGRAM_STATUS } from '@/constants/api/userPrograms';
import { FILE, IMAGE, VIDEO } from '@/constants/files';
import { convertBytesToMb, hasExtension, isFileOfType } from '@/utils/files';
import { MP4_VIDEO_FORMAT, VIDEO_TAG_SUPPORTED_FORMATS } from '@/constants/general';
import { FORM_FIELDS, MINIMUM_AGE_VALUE, SOCIAL_NETWORKS, socialMediaAccounts } from '@/constants/forms';
import { getConfidentialityOnlyOptions } from '@/services/posts/postsServices';
import { KPI_DETAILED_FIELDS, PERIODS, RESULTS, REVENUE, REWARDS } from '@/constants/wall/dashboard';
import { isFieldRequired } from '@/services/FormServices';
import { PAGE_TITLES, SETTINGS_PAGE_TITLES } from '@/constants/pageTitles';
import type { IFormField } from '@/types/forms/IForm';

// Types
type FileType = typeof POST_FILE_TYPE[keyof typeof POST_FILE_TYPE] | typeof COMMENT_FILE_TYPE[keyof typeof COMMENT_FILE_TYPE];

export interface IPostFileOption {
  format: string[];
  unsupportedExtensions?: string[];
  maxMbSize: number;
}

export interface INavigationUrl {
  title: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }> | null;
  url: string;
}

export interface IPostDate {
  startDate: Date | null;
  endDate?: Date | null;
  hasError?: boolean;
}

export interface IPostDateHandler {
  initialize: () => IPostDate;
  isValid: (postDate: IPostDate) => boolean;
  updateOnSubmit: (postDate: IPostDate) => IPostDate;
}

/**
 * Builds navigation URL object
 */
export const buildNavigationUrl = (
  title: string,
  IconComponent: React.ComponentType<{ size?: number; strokeWidth?: number }> | null = null,
  url: string
): INavigationUrl => ({
  title: `wall.navigation.${title}`,
  icon: IconComponent,
  url
});

/**
 * Handles redirect paths based on current step
 */
export const redirectBasedOnCurrentStep = (
  currentStep: string | undefined,
  history: { replace: (path: string) => void },
  currentPath: string
): void => {
  if (currentStep && !currentPath.includes(currentStep)) {
    history.replace(REDIRECT_STEP_ROUTES[currentStep] || '/');
  }
};

/**
 * Sets current user data
 */
export const getCurrentUsersData = (
  currentUsers: { data?: Array<{ programId: number; total: number }>; total?: number },
  selectedProgramId: number
): number => {
  if (!currentUsers.data) return 0;
  const userNr = currentUsers.data.find(program => program.programId === selectedProgramId);
  return userNr?.total ?? currentUsers.total ?? 0;
};

/**
 * Returns dd/mm/yy date format from string
 */
export const getDMYDateFormat = (date: string): string => {
  const dateObj = new Date(date);
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
};

/**
 * Returns class and label text for post type
 */
export const getClassTextPost = (
  type: number,
  withSecondaryColor: string,
  withPrimaryColor: string
): { postPublicText: string; currentColorClass: string } => {
  if (type === POST_TYPE.TASK) {
    return { postPublicText: 'authorCreated', currentColorClass: withPrimaryColor };
  }
  return { postPublicText: 'authorPublished', currentColorClass: withSecondaryColor };
};

/**
 * Returns class for user program status
 */
export const getClassForUserProgramStatus = (
  status: number,
  style: Record<string, string>
): string => {
  const statusMap: Record<number, string> = {
    [USER_PROGRAM_STATUS.ACTIVE]: style.userRowStatusElementActive,
    [USER_PROGRAM_STATUS.INACTIVE]: style.userRowStatusElementInactive,
    [USER_PROGRAM_STATUS.BLOCKED]: style.userRowStatusElementBlocked,
    [USER_PROGRAM_STATUS.PENDING]: style.userRowStatusElementInactive
  };
  return statusMap[status] || '';
};

/**
 * Updates users list on join validated
 */
export const updateUsersListOnJoinValidated = <T extends { programId: number; users: Array<{ uuid: string; status: number }> }>(
  usersState: T,
  { userId, operation, programId }: { userId: string; operation: string; programId: number }
): T => {
  if (programId !== usersState.programId) return usersState;
  const status = operation === PROGRAM_JOIN_OPERATION.REJECT ? USER_PROGRAM_STATUS.REJECTED : USER_PROGRAM_STATUS.ACTIVE;
  return { ...usersState, users: usersState.users.map(user => user.uuid !== userId ? user : { ...user, status }) };
};

/**
 * Returns hh:mm hour format from string
 */
export const getHMHourFormat = (date: string): string => {
  const dateObj = new Date(date);
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
};

/**
 * Returns the media type description for the given fileType
 */
export const resolveMediaType = (fileType: FileType): string => {
  if (fileType === POST_FILE_TYPE.POST_IMAGE || fileType === COMMENT_FILE_TYPE.COMMENT_IMAGE) return IMAGE;
  if (fileType === POST_FILE_TYPE.POST_VIDEO || fileType === COMMENT_FILE_TYPE.COMMENT_VIDEO) return VIDEO;
  return FILE;
};

/**
 * Returns the video type based on fileExtension
 */
export const resolveVideoType = (fileExtension?: string): string => {
  if (!fileExtension || !VIDEO_TAG_SUPPORTED_FORMATS.includes(fileExtension)) return MP4_VIDEO_FORMAT;
  return fileExtension;
};

/**
 * Validates a file (size and format)
 */
export const validatePostFile = ({ fileType, file }: { fileType: IPostFileOption; file?: File }): { isValid: boolean; error?: string; maxSize?: number } => {
  if (!file) return { isValid: true };
  if (fileType.format.length && !isFileOfType(file, fileType.format)) return { isValid: false, error: 'wall.posts.file.error.format' };
  if (convertBytesToMb(file.size) > fileType.maxMbSize) return { isValid: false, error: 'wall.posts.file.error.size', maxSize: fileType.maxMbSize };
  return { isValid: true };
};

/**
 * Returns total points for a program
 */
export const getProgramsPoints = (selectedProgramId: number | null, pointsData: { platforms?: Array<{ id: number; points: number; programs?: Array<{ id: number; points: number }> }> }, platformId: number): number => {
  if (!pointsData.platforms?.length) return 0;
  const selectedPlatformData = pointsData.platforms.find(p => p.id === platformId);
  if (!selectedPlatformData) return 0;
  if (!selectedProgramId) return selectedPlatformData.points;
  const selectedProgram = selectedPlatformData.programs?.find(p => p.id === selectedProgramId);
  return selectedProgram?.points ? Math.floor(selectedProgram.points) : 0;
};

/**
 * Returns create post payload
 */
export const getPostCreateData = (
  platformId: number, postType: string, createPostNameState: [string, unknown], createPostTextState: [string, unknown],
  isPinned: boolean, confidentiality: number, selectedUsers: unknown[], programId: number, fileId: number | null, postDate: Record<string, unknown>
) => ({
  platformId, type: POST_TYPES[postType as keyof typeof POST_TYPES], title: createPostNameState[0], content: createPostTextState[0],
  isPinned, ...postDate, confidentialityType: confidentiality,
  specificUserIds: confidentiality === POST_CONFIDENTIALITY_TYPES.SPECIFIC_PEOPLE ? selectedUsers : [],
  specificProgramIds: [programId], fileId
});

/**
 * Returns like name list for desktop
 */
export const getLikesFormattedList = (likeNames: string[], intl: { formatMessage: (d: { id: string }, v?: Record<string, unknown>) => string }, noOfLikes: number): string[] => {
  if (noOfLikes <= LIKES_LIST_LENGTH) return likeNames;
  const firstN = likeNames.slice(0, LIKES_LIST_LENGTH);
  firstN.push(intl.formatMessage({ id: 'wall.posts.like.liked.desktop' }, { likeNumber: noOfLikes - LIKES_LIST_LENGTH }));
  return firstN;
};

/**
 * Returns yy/mm/dd date format from string
 */
export const getYMDDateFormat = (date: string): string => {
  const dateObj = new Date(date);
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  return `${dateObj.getFullYear()}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
};

/**
 * Returns settings selected tab title
 */
export const getSettingsPageTitle = (): string => {
  let title: string = PAGE_TITLES.DEFAULT;
  SETTINGS_PAGE_TITLES.forEach(item => {
    if (window.location.pathname.indexOf(item.toLowerCase().replace(/ /g, '')) !== -1) {
      title = item;
    }
  });
  return title;
};

/**
 * Returns post date handler based on post type
 */
export const getPostDateHandler = (postType: string): IPostDateHandler => {
  if (postType === TASK) {
    return {
      initialize: () => ({ startDate: null, endDate: null, hasError: true }),
      isValid: ({ startDate, endDate }) => !!(startDate && endDate && endDate >= startDate),
      updateOnSubmit: (postDate) => {
        if (postDate.startDate && postDate.startDate < new Date()) postDate.startDate = new Date();
        if (postDate.endDate && postDate.startDate && postDate.endDate < postDate.startDate) postDate.endDate = postDate.startDate;
        return postDate;
      }
    };
  }
  return {
    initialize: () => ({ startDate: null }),
    isValid: ({ startDate }) => !!(startDate && startDate >= new Date()),
    updateOnSubmit: (postDate) => {
      if (postDate.startDate && postDate.startDate < new Date()) postDate.startDate = new Date();
      return postDate;
    }
  };
};

/**
 * Replaces values from the string (by using rules) and returns the result
 */
export const getFormattedTitle = (title: string, rules: Record<string, string>): string => {
  const regExp = new RegExp(Object.keys(rules).join('|'), 'gi');
  return title.replace(regExp, item => rules[item]);
};
