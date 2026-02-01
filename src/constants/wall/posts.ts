// -----------------------------------------------------------------------------
// Posts Constants
// Migrated from old_app/src/constants/wall/posts.tsx
// -----------------------------------------------------------------------------

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
} as const;

export const unsupportedExtensions = [
  'ade', 'adp', 'apk', 'appx', 'appxbundle', 'bat', 'cab', 'chm', 'cmd', 'com',
  'cpl', 'dll', 'dmg', 'exe', 'hta', 'ins', 'isp', 'iso', 'jar', 'js', 'jse',
  'lib', 'lnk', 'mde', 'msc', 'msi', 'msix', 'msixbundle', 'msp', 'mst', 'nsh',
  'pif', 'ps1', 'scr', 'sct', 'shb', 'sys', 'vb', 'vbe', 'vbs', 'vxd', 'wsc',
  'wsf', 'wsh'
];

export const MAX_MB_SIZES = {
  MAX_10: 10,
  MAX_100: 100,
  MAX_30: 30,
} as const;

export const POST_VALIDATION = {
  TITLE: { max: 50 },
  CONTENT: { max: 1000 }
} as const;

export const ADD_COMMENT = 'addComment';

export enum POST_CONFIDENTIALITY_TYPES {
  ME_ONLY = 1,
  PROGRAM_USERS = 2,
  SPECIFIC_PEOPLE = 3,
  DELETE = 4
}

export const LIKES_LIST_LENGTH = 10;

export enum POST_VIEW_TYPE {
  WALL = 'wall',
  AGENDA = 'agenda'
}

export const AGENDA_DAYS_LOAD_INTERVAL = 7;
export const AGENDA_MAX_TASKS_NO_TOGGLE = 4;

// Date formats for agenda
export const DEFAULT_ISO_DATE_FORMAT = 'yyyy-MM-dd';
