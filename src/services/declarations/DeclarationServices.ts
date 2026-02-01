// -----------------------------------------------------------------------------
// Declaration Services
// Migrated from old_app/src/services/UserDeclarationServices.ts
// -----------------------------------------------------------------------------

import { format } from 'date-fns';
import { extractErrorCode } from '@/utils/api';
import { convertBytesToMb, hasExtension, convertMbToBytes } from '@/utils/files';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

export const USER_DECLARATION_STATUS = {
  PENDING: 'PENDING',
  VALIDATED: 'VALIDATED',
  DECLINED: 'DECLINED',
  POINTS_ALLOCATED: 'POINTS_ALLOCATED',
} as const;

export type DeclarationStatus = typeof USER_DECLARATION_STATUS[keyof typeof USER_DECLARATION_STATUS];

export const USER_DECLARATION_SOURCE = {
  FORM: 'FORM',
  FILE_UPLOAD: 'FILE_UPLOAD',
} as const;

export type DeclarationSource = typeof USER_DECLARATION_SOURCE[keyof typeof USER_DECLARATION_SOURCE];

export const PROGRAM_TYPES = {
  CHALLENGE: 1,
  LOYALTY: 2,
  SPONSORSHIP: 3,
} as const;

export const ERROR_CODES = {
  PROOF_FILE_LARGE: 'PROOF_FILE_LARGE',
  PROOF_FILE_INVALID_TYPE: 'PROOF_FILE_INVALID_TYPE',
} as const;

export const UPLOAD_DECLARATIONS_ERROR_CODES = {
  UPLOAD_FILE_INVALID_TYPE: 1,
  UPLOAD_FILE_LARGE: 2,
} as const;

const ACCEPTED_DECLARATION_UPLOAD_TYPES = ['pdf', 'jpg', 'jpeg', 'png', 'gif'];
const ACCEPTED_DECLARATION_UPLOAD_MB_SIZE = 10;
const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';
const TIME_FORMAT = 'HH:mm';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface DeclarationStatusSettings {
  statusStyle: string;
  statusDescriptionId: string;
  variant: 'default' | 'pending' | 'success' | 'destructive' | 'warning';
}

export interface Declaration {
  id?: string | number;
  dateOfEvent?: string | Date;
  product?: { name: string };
  otherProductName?: string;
  [key: string]: unknown;
}

export interface BeneficiaryData {
  userId?: string;
  beneficiaryId?: string;
  [key: string]: unknown;
}

export interface ProgramData {
  type: number;
  cube?: {
    goals?: Array<{ measurementName: string }>;
  };
  [key: string]: unknown;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: number;
}

// -----------------------------------------------------------------------------
// Status Helpers
// -----------------------------------------------------------------------------

/**
 * Checks if declaration status is pending
 */
export const isPendingStatus = (status: DeclarationStatus): boolean => {
  return status === USER_DECLARATION_STATUS.PENDING;
};

/**
 * Checks if declaration status is validated
 */
export const isValidatedStatus = (status: DeclarationStatus): boolean => {
  return status === USER_DECLARATION_STATUS.VALIDATED;
};

/**
 * Checks if declaration status is declined
 */
export const isDeclinedStatus = (status: DeclarationStatus): boolean => {
  return status === USER_DECLARATION_STATUS.DECLINED;
};

/**
 * Checks if declaration status is allocated
 */
export const isAllocatedStatus = (status: DeclarationStatus): boolean => {
  return status === USER_DECLARATION_STATUS.POINTS_ALLOCATED;
};

/**
 * Gets display settings for declaration status
 * 
 * @param declarationStatus - Current status
 * @returns Status styling configuration
 */
export const getDeclarationStatusSettings = (
  declarationStatus: DeclarationStatus
): DeclarationStatusSettings => {
  const statusDescriptionId = `userDeclaration.status.${declarationStatus}`;

  if (isPendingStatus(declarationStatus)) {
    return {
      statusStyle: 'declaration-status-pending',
      statusDescriptionId,
      variant: 'pending',
    };
  }

  if (isAllocatedStatus(declarationStatus)) {
    return {
      statusStyle: 'declaration-status-allocated',
      statusDescriptionId,
      variant: 'warning',
    };
  }

  if (isDeclinedStatus(declarationStatus)) {
    return {
      statusStyle: 'declaration-status-declined',
      statusDescriptionId,
      variant: 'destructive',
    };
  }

  if (isValidatedStatus(declarationStatus)) {
    return {
      statusStyle: 'declaration-status-validated',
      statusDescriptionId,
      variant: 'success',
    };
  }

  return {
    statusStyle: 'declaration-status-default',
    statusDescriptionId,
    variant: 'default',
  };
};

// -----------------------------------------------------------------------------
// Error Handling
// -----------------------------------------------------------------------------

/**
 * Translates declaration creation error codes to i18n message keys
 */
export const resolveDeclarationCreateErrorMessage = (response: unknown): string => {
  const errorCode = extractErrorCode(response);

  if (errorCode === ERROR_CODES.PROOF_FILE_LARGE || errorCode === ERROR_CODES.PROOF_FILE_INVALID_TYPE) {
    return `wall.userDeclaration.add.error.${errorCode}`;
  }

  return 'wall.userDeclaration.add.error.general';
};

// -----------------------------------------------------------------------------
// Data Extraction
// -----------------------------------------------------------------------------

/**
 * Extracts declaration data for a specific field
 * Handles special field transformations for various declaration types
 * 
 * @param declaration - Declaration object
 * @param fieldName - Name of field to extract
 * @param sponsorshipDetails - Parsed sponsorship details (optional)
 * @returns Field value
 */
export const extractDeclarationDataForField = (
  declaration: Declaration = {},
  fieldName: string,
  sponsorshipDetails?: Record<string, unknown>
): unknown => {
  // Product name fallback
  if (fieldName === 'productName' && !declaration[fieldName]) {
    return declaration.product?.name || declaration.otherProductName;
  }

  // Time of sale formatting
  if (fieldName === 'timeOfSale' && !declaration[fieldName] && declaration.dateOfEvent) {
    const date = new Date(declaration.dateOfEvent);
    return format(date, TIME_FORMAT);
  }

  // Date formatting
  if (fieldName === 'dateOfEvent' && declaration.dateOfEvent) {
    return format(new Date(declaration.dateOfEvent), DEFAULT_DATE_FORMAT);
  }

  if (fieldName === 'dateOfSponsorship' && declaration.dateOfEvent) {
    return format(new Date(declaration.dateOfEvent), DEFAULT_DATE_FORMAT);
  }

  // Sponsorship field mappings
  if (sponsorshipDetails) {
    const sponsorshipFieldMap: Record<string, string> = {
      sponsorshipAddress: 'sponsorshipAddress',
      sponsorshipTitle: 'sponsorshipTitle',
      sponsorshipFirstName: 'sponsorshipFirstName',
      sponsorshipLastName: 'sponsorshipLastName',
      sponsorshipCompanyName: 'sponsorshipCompanyName',
      sponsorshipZipCode: 'sponsorshipZipCode',
      sponsorshipEmail: 'sponsorshipEmail',
      sponsorshipCity: 'sponsorshipCity',
      sponsorshipPhoneNumber: 'sponsorshipPhoneNumber',
    };

    const mappedField = sponsorshipFieldMap[fieldName];
    if (mappedField && sponsorshipDetails[mappedField] !== undefined) {
      return sponsorshipDetails[mappedField];
    }

    if (fieldName === 'contactAgreement') {
      return !!sponsorshipDetails.contactAgreement;
    }
  }

  return declaration[fieldName];
};

// -----------------------------------------------------------------------------
// Date/Time Helpers
// -----------------------------------------------------------------------------

/**
 * Merges date and time into a single Date object
 */
const createDeclarationDateOfEvent = (
  dateOfEvent: Date | string | undefined,
  timeOfSale: Date | string | undefined
): Date | undefined => {
  if (!dateOfEvent) {
    return timeOfSale ? new Date(timeOfSale) : undefined;
  }

  const date = new Date(dateOfEvent);
  
  if (timeOfSale) {
    const time = new Date(timeOfSale);
    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
  }

  return date;
};

// -----------------------------------------------------------------------------
// Data Preparation
// -----------------------------------------------------------------------------

/**
 * Prepares declaration data for API submission based on program type
 * 
 * @param values - Form values
 * @param beneficiaryData - Beneficiary information
 * @param programData - Program configuration
 * @returns Prepared declaration payload
 */
export const prepareDeclarationData = (
  values: Record<string, unknown>,
  beneficiaryData: BeneficiaryData,
  programData: ProgramData
): Record<string, unknown> => {
  const { type } = programData;

  // Challenge or Loyalty program
  if (type === PROGRAM_TYPES.CHALLENGE || type === PROGRAM_TYPES.LOYALTY) {
    const dateOfEvent = createDeclarationDateOfEvent(
      values.dateOfEvent as Date,
      values.timeOfSale as Date
    );

    const amount = values.amount 
      ? Number(String(values.amount).replace(',', '.'))
      : undefined;
    
    const quantity = values.quantity
      ? Number(String(values.quantity).replace(',', '.'))
      : 0;

    return {
      ...values,
      ...beneficiaryData,
      productName: undefined,
      amount,
      quantity,
      dateOfEvent,
    };
  }

  // Sponsorship program
  if (type === PROGRAM_TYPES.SPONSORSHIP) {
    const dateOfEvent = values.dateOfSponsorship 
      ? new Date(values.dateOfSponsorship as string)
      : undefined;

    const sponsorshipDetails = {
      companyName: values.companyName,
      civility: values.sponsorshipTitle,
      customerLastName: values.sponsorshipLastName,
      customerFirstName: values.sponsorshipFirstName,
      address: values.sponsorshipAddress,
      zipCode: values.sponsorshipZipCode,
      city: values.sponsorshipCity,
      phoneNumber: values.sponsorshipPhoneNumber,
      email: values.sponsorshipEmail,
      title: values.sponsorshipCivility,
      proofOfFile: values.proofOfSale,
      accessAgreement: !!values.contactAgreement,
    };

    return {
      ...values,
      ...beneficiaryData,
      ...sponsorshipDetails,
      productName: undefined,
      amount: 1,
      quantity: 1,
      dateOfEvent,
    };
  }

  // Default fallback
  return {
    ...values,
    ...beneficiaryData,
  };
};

// -----------------------------------------------------------------------------
// Source Type Helpers
// -----------------------------------------------------------------------------

/**
 * Checks if declaration was created individually via form
 */
export const isIndividualDeclaration = (sourceType: DeclarationSource): boolean => {
  return sourceType === USER_DECLARATION_SOURCE.FORM;
};

/**
 * Checks if declaration was created via file upload
 */
export const isDeclarationUpload = (sourceType: DeclarationSource): boolean => {
  return sourceType === USER_DECLARATION_SOURCE.FILE_UPLOAD;
};

// -----------------------------------------------------------------------------
// File Validation
// -----------------------------------------------------------------------------

/**
 * Validates a declaration file (size and format)
 * 
 * @param file - File to validate
 * @returns Validation result with error code if invalid
 */
export const validateDeclarationFile = (file: File | null): FileValidationResult => {
  if (!file) {
    return { isValid: true };
  }

  if (!hasExtension(file, ACCEPTED_DECLARATION_UPLOAD_TYPES)) {
    return {
      isValid: false,
      error: UPLOAD_DECLARATIONS_ERROR_CODES.UPLOAD_FILE_INVALID_TYPE,
    };
  }

  if (convertBytesToMb(file.size) > ACCEPTED_DECLARATION_UPLOAD_MB_SIZE) {
    return {
      isValid: false,
      error: UPLOAD_DECLARATIONS_ERROR_CODES.UPLOAD_FILE_LARGE,
    };
  }

  return { isValid: true };
};

/**
 * Gets accepted file types and max size for declaration uploads
 */
export const getAcceptedDeclarationFileConfig = (): {
  accept: string[];
  maxSize: number;
} => ({
  accept: ACCEPTED_DECLARATION_UPLOAD_TYPES.map((ext) => `.${ext}`),
  maxSize: convertMbToBytes(ACCEPTED_DECLARATION_UPLOAD_MB_SIZE),
});
