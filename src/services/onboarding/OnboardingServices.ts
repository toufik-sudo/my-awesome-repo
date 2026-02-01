// -----------------------------------------------------------------------------
// Onboarding Services
// Migrated from old_app/src/services/OnboardingServices.ts
// -----------------------------------------------------------------------------

import { isFieldRequired } from '@/services/FormServices';
import type { IFormField } from '@/types/forms/IForm';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

export const REGISTER_PAGE_STEPS = {
  TITLE: 1,
  EMAIL: 2,
  PASSWORD: 3,
  PERSONAL: 4,
  CONFIRM: 5,
} as const;

export const ONBOARDING_ERROR_CODES = {
  INTERNAL_SERVER: 500,
  DUPLICATE_VALUE: 1013,
  INVALID_EMAIL: 1001,
  WEAK_PASSWORD: 1002,
} as const;

const REGISTER_DATA_STORAGE_KEY = 'registerData';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface RegisterStep {
  index: number;
  name: string;
  component?: React.ComponentType;
  errorCodes: number[];
}

export interface PageError {
  step: number;
  error: string;
}

export interface PreparedField extends Omit<IFormField, 'initialValue'> {
  initialValue: string;
}

// -----------------------------------------------------------------------------
// Storage Helpers
// -----------------------------------------------------------------------------

/**
 * Gets register data from local storage
 */
export const getRegisterData = (): Record<string, unknown> | null => {
  try {
    const data = localStorage.getItem(REGISTER_DATA_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

/**
 * Sets register data in local storage
 */
export const setRegisterData = (data: Record<string, unknown>): void => {
  try {
    localStorage.setItem(REGISTER_DATA_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save register data:', error);
  }
};

/**
 * Clears register data from local storage
 */
export const clearRegisterData = (): void => {
  localStorage.removeItem(REGISTER_DATA_STORAGE_KEY);
};

// -----------------------------------------------------------------------------
// Step Navigation
// -----------------------------------------------------------------------------

/**
 * Gets the active register component for the current step
 * 
 * @param step - Current step number (1-indexed)
 * @param steps - Array of step configurations
 * @returns The component for the current step
 */
export const getActiveRegisterComponent = <T extends { component: React.ComponentType }>(
  step: number | string,
  steps: T[]
): React.ComponentType | undefined => {
  const stepIndex = typeof step === 'string' ? parseInt(step, 10) - 1 : step - 1;
  return steps[stepIndex]?.component || steps[0]?.component;
};

/**
 * Gets the first incomplete step from registration data
 * 
 * @param data - Current registration progress data
 * @param steps - Array of step configurations
 * @returns First incomplete step info
 */
export const getFirstIncompleteStep = (
  data: Record<string, unknown>,
  steps: RegisterStep[]
): { step: number } | undefined => {
  const incompleteSteps = steps
    .filter((step) => !data[step.name])
    .map((step) => ({ step: step.index }));

  return incompleteSteps[0];
};

/**
 * Validates that the current route step is valid
 * 
 * @param step - Current step from URL
 * @param steps - Array of valid steps
 * @param navigate - Navigation function
 * @param baseRoute - Base route for registration
 */
export const ensureSafeRoute = (
  step: number | string,
  steps: RegisterStep[],
  navigate: (path: string) => void,
  baseRoute: string
): void => {
  const stepIndex = typeof step === 'string' ? parseInt(step, 10) - 1 : step - 1;
  
  if (!steps[stepIndex]) {
    navigate(`${baseRoute}${REGISTER_PAGE_STEPS.TITLE}`);
  }
};

// -----------------------------------------------------------------------------
// Field Preparation
// -----------------------------------------------------------------------------

/**
 * Prepares form fields with initial values from stored data
 * 
 * @param requiredFields - Array of required field names
 * @param formFields - Array of form field configurations
 * @returns Prepared fields with initial values
 */
export const prepareFieldsWithValues = (
  requiredFields: string[],
  formFields: IFormField[]
): PreparedField[] => {
  const storedData = getRegisterData();

  return formFields
    .map((field) => {
      const { label } = field;
      const isRequired = isFieldRequired(field);

      if (isRequired || requiredFields.includes(label as string)) {
        const storedValue = storedData?.[label as string];
        const value = storedValue ?? '';

        return { ...field, initialValue: value as string };
      }

      return undefined;
    })
    .filter((field): field is PreparedField => field !== undefined);
};

// -----------------------------------------------------------------------------
// Error Handling
// -----------------------------------------------------------------------------

/**
 * Resolves error details from API response to determine which page has the error
 * 
 * @param errorData - Error data from API response
 * @param steps - Array of step configurations
 * @param formatMessage - i18n format function
 * @returns Page error details or null
 */
export const getPageErrorDetails = (
  errorData: { message?: string; code?: number } | null,
  steps: RegisterStep[],
  formatMessage: (descriptor: { id: string }) => string
): PageError | null => {
  if (!errorData) {
    return null;
  }

  const { message, code } = errorData;
  const validationPrefix = 'form.validation.';

  // Internal server error fallback
  if (!code || code === ONBOARDING_ERROR_CODES.INTERNAL_SERVER) {
    return {
      step: REGISTER_PAGE_STEPS.PASSWORD,
      error: message || formatMessage({ id: 'form.validation.generic.error' }),
    };
  }

  // Find step that handles this error code
  for (const step of steps) {
    if (step.errorCodes.includes(code)) {
      const errorMessage =
        code === ONBOARDING_ERROR_CODES.DUPLICATE_VALUE
          ? formatMessage({ id: 'onboarding.register.error.1013' })
          : formatMessage({ id: `${validationPrefix}${code}` });

      return { step: step.index, error: errorMessage };
    }
  }

  return null;
};

/**
 * Handles navigation to the error page and clears sensitive data
 * 
 * @param errorData - Error data from API
 * @param steps - Step configurations
 * @param navigate - Navigation function
 * @param baseRoute - Base route for registration
 * @param formatMessage - i18n format function
 * @param onError - Optional error callback
 */
export const handleRegistrationError = (
  errorData: { message?: string; code?: number } | null,
  steps: RegisterStep[],
  navigate: (path: string) => void,
  baseRoute: string,
  formatMessage: (descriptor: { id: string }) => string,
  onError?: (error: PageError) => void
): void => {
  const pageError = getPageErrorDetails(errorData, steps, formatMessage);

  if (!pageError) {
    return;
  }

  // Clear sensitive data
  const storedData = getRegisterData();
  if (storedData) {
    setRegisterData({
      ...storedData,
      createAccountPassword: null,
      passwordConfirmation: null,
    });
  }

  onError?.(pageError);
  navigate(`${baseRoute}${pageError.step}`);
};

// -----------------------------------------------------------------------------
// Progress Tracking
// -----------------------------------------------------------------------------

/**
 * Updates registration progress for a specific step
 * 
 * @param stepName - Name of the step completed
 * @param data - Data to store for this step
 */
export const updateRegistrationProgress = (
  stepName: string,
  data: Record<string, unknown>
): void => {
  const currentData = getRegisterData() || {};
  setRegisterData({
    ...currentData,
    ...data,
    [stepName]: true,
  });
};

/**
 * Checks if a specific step is completed
 * 
 * @param stepName - Name of the step to check
 * @returns Whether the step is completed
 */
export const isStepCompleted = (stepName: string): boolean => {
  const data = getRegisterData();
  return !!data?.[stepName];
};

/**
 * Gets the overall registration progress
 * 
 * @param steps - Array of step configurations
 * @returns Object with completion stats
 */
export const getRegistrationProgress = (
  steps: RegisterStep[]
): { completed: number; total: number; percentage: number } => {
  const data = getRegisterData() || {};
  const completed = steps.filter((step) => data[step.name]).length;
  const total = steps.length;

  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100),
  };
};
