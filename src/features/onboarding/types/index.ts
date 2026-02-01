// -----------------------------------------------------------------------------
// Onboarding Feature Types
// -----------------------------------------------------------------------------

export interface RegisterData {
  title: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  password: string | null;
  passwordConfirmation: string | null;
  avatar: File | string | null;
  avatarPreview: string | null;
  programId: number | null;
  platformId: number | null;
  termsAccepted: boolean;
  newsletterOptIn: boolean;
}

export interface OnboardingState {
  registerData: RegisterData;
  currentStep: number;
  isLoading: boolean;
  error: string | null;
}

export type RegisterStep = 
  | 'civility' 
  | 'name' 
  | 'contact'
  | 'avatar' 
  | 'password' 
  | 'terms'
  | 'complete';

export const REGISTER_STEPS: RegisterStep[] = [
  'civility', 
  'name', 
  'contact',
  'avatar',
  'password', 
  'terms',
  'complete'
];

export const CIVILITY_OPTIONS = [
  { value: 'mr', labelKey: 'civility.mr', label: 'Mr.' },
  { value: 'mrs', labelKey: 'civility.mrs', label: 'Mrs.' },
  { value: 'ms', labelKey: 'civility.ms', label: 'Ms.' },
  { value: 'mx', labelKey: 'civility.mx', label: 'Mx.' },
];

// Validation schemas
export const validationRules = {
  firstName: {
    minLength: 2,
    maxLength: 50,
  },
  lastName: {
    minLength: 2,
    maxLength: 50,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    pattern: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
    minLength: 6,
  },
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: false,
  },
};

// Password strength levels
export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordValidation {
  isValid: boolean;
  strength: PasswordStrength;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

// Step validation result
export interface StepValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

// Error codes from backend
export const ERROR_CODES = {
  DUPLICATE_VALUE: 1013,
  INVALID_FILE: 1014,
  FILE_SIZE_TOO_LARGE: 1015,
  PASSWORD_MATCH: 1016,
  INTERNAL_SERVER: 500,
};

// Local storage key for persisting form data
export const REGISTER_DATA_STORAGE_KEY = 'onboarding_register_data';
