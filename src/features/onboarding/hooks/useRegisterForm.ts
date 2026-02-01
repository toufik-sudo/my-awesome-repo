// -----------------------------------------------------------------------------
// useRegisterForm Hook
// Manages multi-step registration state and validation with persistence
// -----------------------------------------------------------------------------

import { useState, useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { 
  RegisterData, 
  RegisterStep, 
  REGISTER_STEPS, 
  REGISTER_DATA_STORAGE_KEY,
  PasswordValidation,
  PasswordStrength,
  validationRules 
} from '../types';
import axiosInstance from '@/config/axiosConfig';
import { USERS_ENDPOINT } from '@/constants/api';
import { filesApi } from '@/api';

const initialRegisterData: RegisterData = {
  title: null,
  firstName: null,
  lastName: null,
  email: null,
  phone: null,
  password: null,
  passwordConfirmation: null,
  avatar: null,
  avatarPreview: null,
  programId: null,
  platformId: null,
  termsAccepted: false,
  newsletterOptIn: false,
};

interface UseRegisterFormReturn {
  currentStep: RegisterStep;
  stepIndex: number;
  registerData: RegisterData;
  isLoading: boolean;
  error: string | null;
  updateData: (data: Partial<RegisterData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: RegisterStep) => void;
  submitRegistration: () => Promise<boolean>;
  canGoNext: boolean;
  canGoBack: boolean;
  progress: number;
  validateCurrentStep: () => boolean;
  validatePassword: (password: string) => PasswordValidation;
  clearForm: () => void;
}

/**
 * Validate password and return strength info
 */
const validatePassword = (password: string): PasswordValidation => {
  const hasMinLength = password.length >= validationRules.password.minLength;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Calculate strength
  let score = 0;
  if (hasMinLength) score++;
  if (hasUppercase) score++;
  if (hasLowercase) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;
  if (password.length >= 12) score++;

  let strength: PasswordStrength = 'weak';
  if (score >= 5) strength = 'strong';
  else if (score >= 4) strength = 'good';
  else if (score >= 3) strength = 'fair';

  const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumber;

  return {
    isValid,
    strength,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial,
  };
};

/**
 * Load persisted data from localStorage
 */
const loadPersistedData = (): Partial<RegisterData> => {
  try {
    const stored = localStorage.getItem(REGISTER_DATA_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Don't restore sensitive data
      delete parsed.password;
      delete parsed.passwordConfirmation;
      delete parsed.avatar;
      delete parsed.avatarPreview;
      return parsed;
    }
  } catch {
    // Ignore parsing errors
  }
  return {};
};

/**
 * Persist data to localStorage (excluding sensitive fields)
 */
const persistData = (data: RegisterData) => {
  const safeData = {
    title: data.title,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    programId: data.programId,
    platformId: data.platformId,
    termsAccepted: data.termsAccepted,
    newsletterOptIn: data.newsletterOptIn,
  };
  localStorage.setItem(REGISTER_DATA_STORAGE_KEY, JSON.stringify(safeData));
};

export const useRegisterForm = (): UseRegisterFormReturn => {
  const { formatMessage } = useIntl();
  const [stepIndex, setStepIndex] = useState(0);
  const [registerData, setRegisterData] = useState<RegisterData>(() => ({
    ...initialRegisterData,
    ...loadPersistedData(),
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentStep = REGISTER_STEPS[stepIndex];
  const totalSteps = REGISTER_STEPS.length - 1; // Exclude 'complete'
  const progress = Math.round((stepIndex / totalSteps) * 100);

  // Persist data when it changes
  useEffect(() => {
    persistData(registerData);
  }, [registerData]);

  const updateData = useCallback((data: Partial<RegisterData>) => {
    setRegisterData(prev => ({ ...prev, ...data }));
    setError(null);
  }, []);

  const validateCurrentStep = useCallback((): boolean => {
    switch (currentStep) {
      case 'civility':
        return !!registerData.title;
      case 'name':
        return !!(
          registerData.firstName && 
          registerData.firstName.length >= validationRules.firstName.minLength &&
          registerData.lastName && 
          registerData.lastName.length >= validationRules.lastName.minLength
        );
      case 'contact':
        const emailValid = registerData.email && validationRules.email.pattern.test(registerData.email);
        const phoneValid = !registerData.phone || 
          (registerData.phone.length >= validationRules.phone.minLength && 
           validationRules.phone.pattern.test(registerData.phone));
        return !!(emailValid && phoneValid);
      case 'avatar':
        return true; // Avatar is optional
      case 'password':
        if (!registerData.password) return false;
        const passwordValidation = validatePassword(registerData.password);
        return passwordValidation.isValid && registerData.password === registerData.passwordConfirmation;
      case 'terms':
        return registerData.termsAccepted;
      default:
        return true;
    }
  }, [currentStep, registerData]);

  const nextStep = useCallback(() => {
    if (stepIndex < REGISTER_STEPS.length - 1 && validateCurrentStep()) {
      setStepIndex(prev => prev + 1);
      setError(null);
    }
  }, [stepIndex, validateCurrentStep]);

  const prevStep = useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex(prev => prev - 1);
      setError(null);
    }
  }, [stepIndex]);

  const goToStep = useCallback((step: RegisterStep) => {
    const index = REGISTER_STEPS.indexOf(step);
    if (index !== -1 && index <= stepIndex) {
      setStepIndex(index);
    }
  }, [stepIndex]);

  const clearForm = useCallback(() => {
    setRegisterData(initialRegisterData);
    setStepIndex(0);
    setError(null);
    localStorage.removeItem(REGISTER_DATA_STORAGE_KEY);
  }, []);

  const submitRegistration = useCallback(async (): Promise<boolean> => {
    if (!validateCurrentStep()) {
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Upload avatar if present
      let avatarFileId: number | undefined;
      if (registerData.avatar instanceof File) {
        try {
          const uploadResult = await filesApi.uploadFile(registerData.avatar, 1); // 1 = avatar type
          avatarFileId = uploadResult.id;
        } catch {
          // Avatar upload failed, continue without it
          console.warn('Avatar upload failed, continuing without avatar');
        }
      }

      const payload = {
        email: registerData.email,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        title: registerData.title,
        phone: registerData.phone,
        password: registerData.password,
        passwordConfirmation: registerData.passwordConfirmation,
        type: 3, // Beneficiary type
        programIdInvite: registerData.programId,
        platformIdInvite: registerData.platformId,
        avatarFileId,
        newsletterOptIn: registerData.newsletterOptIn,
      };

      await axiosInstance(false).post(USERS_ENDPOINT, payload);
      
      // Clear persisted data on success
      localStorage.removeItem(REGISTER_DATA_STORAGE_KEY);
      
      // Go to complete step
      setStepIndex(REGISTER_STEPS.indexOf('complete'));
      return true;
    } catch (err: unknown) {
      const axiosError = err as { 
        response?: { 
          data?: { 
            message?: string;
            code?: number;
          } 
        } 
      };
      
      const errorCode = axiosError.response?.data?.code;
      let errorMessage = axiosError.response?.data?.message || 
        formatMessage({ id: 'error.registration.failed', defaultMessage: 'Registration failed. Please try again.' });
      
      // Handle specific error codes
      if (errorCode === 1013) {
        errorMessage = formatMessage({ id: 'error.email.duplicate', defaultMessage: 'This email is already registered.' });
        setStepIndex(REGISTER_STEPS.indexOf('contact'));
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [registerData, validateCurrentStep, formatMessage]);

  const canGoBack = stepIndex > 0 && currentStep !== 'complete';
  const canGoNext = stepIndex < REGISTER_STEPS.length - 1 && currentStep !== 'complete';

  return {
    currentStep,
    stepIndex,
    registerData,
    isLoading,
    error,
    updateData,
    nextStep,
    prevStep,
    goToStep,
    submitRegistration,
    canGoNext,
    canGoBack,
    progress,
    validateCurrentStep,
    validatePassword,
    clearForm,
  };
};

export default useRegisterForm;
