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

export const VIDEO = 'video';
export const IMAGE = 'image';
export const FILE = 'file';
export const WYSIWYG = 'wysiwyg';
export const COMMUNICATIONS_IMAGE_PREVIEW_SIZES = {
  LOGO: { height: 125, width: 250 },
  PICTURE: { height: 'auto', width: 300 }
};
