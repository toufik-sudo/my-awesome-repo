// -----------------------------------------------------------------------------
// Declarations Constants
// Migrated from old_app/src/constants/api/declarations.ts
// -----------------------------------------------------------------------------

import { SORT_DIRECTION } from '@/constants/api/index';

export enum USER_DECLARATION_STATUS {
  DELETED = 0,
  PENDING = 1,
  VALIDATED = 2,
  DECLINED = 3,
  POINTS_ALLOCATED = 4
}

export enum USER_DECLARATION_SOURCE {
  FORM = 1,
  FILE_UPLOAD = 2
}

export enum USER_DECLARATIONS_SORTING {
  NONE = '',
  AMOUNT = 'amount',
  COMPANY_NAME = 'companyName',
  FIRST_NAME = 'firstName',
  ID = 'id',
  OCCURRED_ON = 'dateOfEvent',
  PRODUCT_NAME = 'productName',
  PROGRAM_NAME = 'programName',
  PROGRAM_TYPE = 'programType',
  QUANTITY = 'quantity',
  SOURCE = 'source',
  STATUS = 'status',
  USER = 'user',
  VALIDATED_BY = 'validatedBy'
}

export enum POINT_CONVERSIONS_SORTING {
  COMPANY = 'company',
  BRAND_NAME = 'brandName',
  AMOUNT = 'amount',
  NAME = 'name',
  EMAIL = 'email',
  SUPERPLATFORM_NAME = 'superplatformName',
  PLATFORM_NAME = 'platformName',
  PROGRAM = 'program',
  POINTS_TO_CONVERT = 'pointsToConvert',
  STATUS = 'status',
  QUANTITY = 'quantity',
  VALIDATED_BY = 'validatedBy',
  ORDER_UUID = 'orderUuid',
  CURRENCY = 'currency',
  PERSONAL_MESSAGE = 'personalMessage',
  PRODUCT_TOKEN = 'productToken',
  TRANSACTION_ID = 'transactionRefId',
  PHONE = 'phone',
  REF_ID = 'userUuid',
  ERROR_CODE = 'errorCode',
  ERROR_MESSAGE = 'errorMessage',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export const BASE_USER_DECLARATIONS_BLOCK_FILTER = Object.freeze({
  offset: 0,
  sortDirection: SORT_DIRECTION.DESC,
  sortBy: 'id',
  size: 3
});

export const USER_DECLARATIONS_DEFAULT_SORT = Object.freeze({
  sortBy: USER_DECLARATIONS_SORTING.OCCURRED_ON,
  sortDirection: SORT_DIRECTION.DESC
});

export const POINT_CONVERSIONS_DEFAULT_SORT = Object.freeze({
  sortBy: POINT_CONVERSIONS_SORTING.STATUS,
  sortDirection: SORT_DIRECTION.DESC
});

export enum USER_DECLARATION_STATUS_OPERATION {
  VALIDATE = 'validate',
  DECLINE = 'decline'
}

export const ERROR_CODES = Object.freeze({
  USER_DECLARATION_CHANGED: 1018,
  PROOF_FILE_LARGE: 1011,
  PROOF_FILE_INVALID_TYPE: 1010
});

export const UPLOAD_DECLARATIONS_ERROR_CODES = Object.freeze({
  UPLOAD_FILE_INVALID_COLUMNS: 1008,
  UPLOAD_FILE_INVALID_ROWS: 1009,
  UPLOAD_FILE_INVALID_TYPE: 1010,
  UPLOAD_FILE_LARGE: 1011,
  UPLOAD_FILE_DUPLICATE_VALUE: 1013,
  UPLOAD_FILE_INVALID_HEADER: 1014
});

export const PROOF_FILE_MB_MAX_SIZE = 10;
export const PROOF_FILE_ACCEPTED_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'png'];

export enum DECLARATION_FILE_TYPE {
  PROOF = 15
}

export enum DECLARATION_TEMPLATE_TYPE {
  CSV = 'csv',
  XLS = 'xls',
  XLSX = 'xlsx'
}

export enum DECLARATION_TEMPLATE_DOWNLOAD_TYPE {
  'csv' = 'csv',
  'xls' = 'xls',
  'xlsx' = 'xlsx'
}

export const ACCEPTED_DECLARATION_UPLOAD_TYPES = Object.values(DECLARATION_TEMPLATE_TYPE);
export const ACCEPTED_DECLARATION_UPLOAD_MB_SIZE = 10;
