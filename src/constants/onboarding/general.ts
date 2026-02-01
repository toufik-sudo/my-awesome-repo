// -----------------------------------------------------------------------------
// Onboarding Constants
// Migrated from old_app/src/constants/onboarding/general.ts
// -----------------------------------------------------------------------------

export const REGISTER_PAGES = Object.freeze({
  TITLE: 'title',
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  CROPPED_AVATAR: 'croppedAvatar',
  EMAIL: 'email',
  PASSWORD: 'password',
  PASSWORD_CONFIRMATION: 'passwordConfirmation'
});

export const ERROR_CODES = Object.freeze({
  INTERNAL_SERVER: 500,
  MANDATORY_FIELD: 1002,
  PASSWORD_MATCH: 1003,
  INVALID_FILE: 1010,
  FILE_SIZE_TOO_LARGE: 1011,
  DUPLICATE_VALUE: 1013
});

export enum REGISTER_PAGE_STEPS {
  TITLE = 1,
  NAME = 2,
  AVATAR = 3,
  EMAIL = 4,
  PASSWORD = 5
}

export const ONBOARDING_BENEFICIARY_USER_TYPE = 2;
