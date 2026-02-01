// -----------------------------------------------------------------------------
// Onboarding Services Barrel Export
// -----------------------------------------------------------------------------

export {
  // Constants
  REGISTER_PAGE_STEPS,
  ONBOARDING_ERROR_CODES,
  // Types
  type RegisterStep,
  type PageError,
  type PreparedField,
  // Storage helpers
  getRegisterData,
  setRegisterData,
  clearRegisterData,
  // Step navigation
  getActiveRegisterComponent,
  getFirstIncompleteStep,
  ensureSafeRoute,
  // Field preparation
  prepareFieldsWithValues,
  // Error handling
  getPageErrorDetails,
  handleRegistrationError,
  // Progress tracking
  updateRegistrationProgress,
  isStepCompleted,
  getRegistrationProgress,
} from './OnboardingServices';
