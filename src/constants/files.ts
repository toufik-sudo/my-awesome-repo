// -----------------------------------------------------------------------------
// Files Constants
// Migrated from old_app/src/constants/files.ts
// -----------------------------------------------------------------------------

export const FILE = 'file';
export const IMAGE = 'image';
export const VIDEO = 'video';
export const WYSIWYG = 'wysiwyg';

export enum FORM_DATA_FIELDS {
  FILE = 'file',
  FILENAME = 'filename',
  TYPE = 'type',
  INVITED_USERS_FILE = 'invitedUsersFile',
  PLATFORM_ID = 'platformId'
}

export const IMAGE_FORM_DATA_FIELDS = [FORM_DATA_FIELDS.FILE, FORM_DATA_FIELDS.FILENAME, FORM_DATA_FIELDS.TYPE];
export const USER_LIST_FORM_DATA_FIELDS = [
  FORM_DATA_FIELDS.FILE,
  FORM_DATA_FIELDS.FILENAME,
  FORM_DATA_FIELDS.INVITED_USERS_FILE,
  FORM_DATA_FIELDS.PLATFORM_ID
];

export const FILE_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  DOCUMENT: 'document',
  OTHER: 'other'
} as const;

export const COMMUNICATIONS_IMAGE_PREVIEW_SIZES = {
  LOGO: { height: 125, width: 250 },
  PICTURE: { height: 'auto', width: 300 }
};
