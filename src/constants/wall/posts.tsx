import { faUserCheck, faUserTag, faTimesCircle, faLock } from '@fortawesome/free-solid-svg-icons';

import { COMMENT_FILE_TYPE, POST_FILE_TYPE } from 'constants/api';
import { IPostFileOption } from 'interfaces/components/wall/IPostFileOption';

export enum POST_TYPE {
  EXPRESS_YOURSELF = 1,
  TASK = 2
}

export const THRESHOLD = 3000;
export const HEIGHT = 300;

export const TASK = 'Task';
export const POST = 'Post';
export const CREATE_POST_TITLE = 'createPostTitle';
export const CREATE_POST_CONTENT = 'createPostContent';

export const POST_TYPES = {
  [POST]: 1,
  [TASK]: 2
};

export const unsupportedExtensions = [
  'ade',
  'adp',
  'apk',
  'appx',
  'appxbundle',
  'bat',
  'cab',
  'chm',
  'cmd',
  'com',
  'cpl',
  'dll',
  'dmg',
  'exe',
  'hta',
  'ins',
  'isp',
  'iso',
  'jar',
  'js',
  'jse',
  'lib',
  'lnk',
  'mde',
  'msc',
  'msi',
  'msix',
  'msixbundle',
  'msp',
  'mst',
  'nsh',
  'pif',
  'ps1',
  'scr',
  'sct',
  'shb',
  'sys',
  'vb',
  'vbe',
  'vbs',
  'vxd',
  'wsc',
  'wsf',
  'wsh'
];

export const MAX_MB_SIZES = {
  MAX_10: 10,
  MAX_100: 100,
  MAX_30: 30,
};

export const POST_VALIDATION = {
  TITLE: { max: 50 },
  CONTENT: { max: 1000 }
};

export const POST_FILE_UPLOAD_OPTIONS: ReadonlyArray<IPostFileOption> = Object.freeze([
  {
    label: 'wall.posts.file.upload.image',
    type: POST_FILE_TYPE.POST_IMAGE,
    format: 'image/*',
    maxMbSize: MAX_MB_SIZES.MAX_10
  },
  {
    label: 'wall.posts.file.upload.video',
    type: POST_FILE_TYPE.POST_VIDEO,
    format: 'video/*',
    maxMbSize: MAX_MB_SIZES.MAX_30
  },
  {
    label: 'wall.posts.file.upload.other',
    type: POST_FILE_TYPE.POST_OTHERS,
    format: '',
    maxMbSize: MAX_MB_SIZES.MAX_10,
    unsupportedExtensions: unsupportedExtensions
  }
]);

export const COMMENT_FILE_TYPE_OPTIONS: ReadonlyArray<IPostFileOption> = Object.freeze([
  {
    label: 'wall.posts.file.upload.image',
    type: COMMENT_FILE_TYPE.COMMENT_IMAGE,
    format: 'image/*',
    maxMbSize: MAX_MB_SIZES.MAX_10
  },
  {
    label: 'wall.posts.file.upload.video',
    type: COMMENT_FILE_TYPE.COMMENT_VIDEO,
    format: 'video/*',
    maxMbSize: MAX_MB_SIZES.MAX_30
  },
  {
    label: 'wall.posts.file.upload.other',
    type: COMMENT_FILE_TYPE.COMMENT_OTHERS,
    format: '',
    maxMbSize: MAX_MB_SIZES.MAX_10,
    unsupportedExtensions: unsupportedExtensions
  }
]);

export const ADD_COMMENT = 'addComment';

export enum POST_CONFIDENTIALITY_TYPES {
  ME_ONLY = 1,
  PROGRAM_USERS = 2,
  SPECIFIC_PEOPLE = 3,
  DELETE = 4
}

export const CONFIDENTIALITY_OPTIONS_ICONS = {
  [POST_CONFIDENTIALITY_TYPES.ME_ONLY]: faLock,
  [POST_CONFIDENTIALITY_TYPES.PROGRAM_USERS]: faUserTag,
  [POST_CONFIDENTIALITY_TYPES.SPECIFIC_PEOPLE]: faUserCheck,
  [POST_CONFIDENTIALITY_TYPES.DELETE]: faTimesCircle
};

export const CONFIDENTIALITY_DROPDOWN_STYLES = {
  control: base => ({
    ...base,
    border: 0,
    boxShadow: 'none',
    marginRight: '0px'
  }),
  menu: base => ({
    ...base,
    width: '20rem'
  }),
  option: base => ({
    ...base,
    backgroundColor: 'transparent'
  })
};

export const LIKES_LIST_LENGTH = 10;
export enum POST_VIEW_TYPE {
  WALL = 'wall',
  AGENDA = 'agenda'
}

export const AGENDA_DAYS_LOAD_INTERVAL = 7;
export const AGENDA_MAX_TASKS_NO_TOGGLE = 4;
