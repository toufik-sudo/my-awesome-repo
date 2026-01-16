import { ISortable } from 'interfaces/api/ISortable';
import { EMAIL_CAMPAIGNS_SORTING, SORTING_CREATE_USER_LIST } from 'constants/api/communications';
import { DEFAULT_USER_LIST_SIZE } from 'constants/api';
import { SORT_DIRECTION } from 'constants/api/sorting';

export const CAMPAIGN_STATUS_NOT_SUPPORTED = 'notSupported';
export const DEFAULT_FILTER_EMAIL_CAMPAIGN_LIST: ISortable = {
  sortBy: EMAIL_CAMPAIGNS_SORTING.ID,
  sortDirection: SORT_DIRECTION.DESC
};
export const DEFAULT_GET_USERS_QUERY = { view: 'list', size: DEFAULT_USER_LIST_SIZE };
export const DEFAULT_FILTER_CREATE_USER_LIST: ISortable = {
  sortBy: SORTING_CREATE_USER_LIST.ID,
  sortDirection: SORT_DIRECTION.DESC
};
export enum CAMPAIGN_CREATE_IMAGE_ID {
  LOGO = 'logoId',
  PICTURE = 'pictureID'
}

export const CAMPAIGN_STATUS_LIST = {
  ALL: { value: 'all', code: undefined },
  PENDING: { value: 'pending', code: 1 },
  SENDING: { value: 'sending', code: 2 },
  FINISHED: { value: 'finished', code: 5 },
  FAILED: { value: 'failed', code: 6 }
};

export const CAMPAIGN_STATUS_IDS = Object.values(CAMPAIGN_STATUS_LIST)
  .filter(value => !!value)
  .reduce((accumulator, status) => {
    accumulator[status.code] = status.value;
    return accumulator;
  }, {});

export const WYSIWYG_TOOLBAR_OPTIONS = [
  'inline',
  'blockType',
  'fontSize',
  'fontFamily',
  'list',
  'textAlign',
  'colorPicker',
  'link',
  'emoji',
  'image',
  'history'
];
