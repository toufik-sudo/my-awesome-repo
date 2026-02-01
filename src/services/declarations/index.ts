// -----------------------------------------------------------------------------
// Declaration Services Barrel Export
// -----------------------------------------------------------------------------

export {
  // Constants
  USER_DECLARATION_STATUS,
  USER_DECLARATION_SOURCE,
  PROGRAM_TYPES,
  ERROR_CODES,
  UPLOAD_DECLARATIONS_ERROR_CODES,
  // Types
  type DeclarationStatus,
  type DeclarationSource,
  type DeclarationStatusSettings,
  type Declaration,
  type BeneficiaryData,
  type ProgramData,
  type FileValidationResult,
  // Status helpers
  isPendingStatus,
  isValidatedStatus,
  isDeclinedStatus,
  isAllocatedStatus,
  getDeclarationStatusSettings,
  // Error handling
  resolveDeclarationCreateErrorMessage,
  // Data extraction
  extractDeclarationDataForField,
  // Data preparation
  prepareDeclarationData,
  // Source type helpers
  isIndividualDeclaration,
  isDeclarationUpload,
  // File validation
  validateDeclarationFile,
  getAcceptedDeclarationFileConfig,
} from './DeclarationServices';
