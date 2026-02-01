// -----------------------------------------------------------------------------
// useLaunchValidation Hook
// Provides validation utilities for launch wizard steps using Zod schemas
// -----------------------------------------------------------------------------

import { useCallback, useMemo } from 'react';
import { z } from 'zod';
import {
  launchWizardSchemas,
  type LaunchWizardSchemaKey,
  type CompleteLaunchData,
} from './launchWizardSchemas';
import {
  PROGRAM,
  USERS,
  RESULTS,
  PRODUCTS,
  REWARDS,
  DESIGN,
} from '@/constants/wall/launch';

const PLATFORM = 'platform';

// Step to schema mapping
const STEP_SCHEMA_MAP: Record<string, LaunchWizardSchemaKey> = {
  [PLATFORM]: 'platformSelection',
  [PROGRAM]: 'programDetails',
  [USERS]: 'usersInvitation',
  [RESULTS]: 'resultsConfig',
  [PRODUCTS]: 'products',
  [REWARDS]: 'rewardsConfig',
  [DESIGN]: 'designConfig',
  cube: 'cubeConfig',
  ecard: 'eCardSelection',
  confidentiality: 'confidentiality',
  programType: 'programType',
};

export interface ValidationError {
  path: string;
  message: string;
}

export interface ValidationResult {
  success: boolean;
  errors: ValidationError[];
  data?: unknown;
}

export interface UseLaunchValidationReturn {
  /** Validate data for a specific step */
  validateStep: (step: string, data: unknown) => ValidationResult;
  
  /** Validate data against any schema by key */
  validateBySchema: (schemaKey: LaunchWizardSchemaKey, data: unknown) => ValidationResult;
  
  /** Validate complete launch data before submission */
  validateComplete: (data: unknown) => ValidationResult;
  
  /** Get the schema for a specific step */
  getSchemaForStep: (step: string) => z.ZodSchema | null;
  
  /** Check if step data is valid (boolean shorthand) */
  isStepValid: (step: string, data: unknown) => boolean;
  
  /** Parse and transform data using schema (returns typed data or throws) */
  parseStepData: <T>(step: string, data: unknown) => T | null;
  
  /** Get first error message for a specific field path */
  getFieldError: (errors: ValidationError[], path: string) => string | null;
  
  /** Format errors into a user-friendly object keyed by field path */
  formatErrors: (errors: ValidationError[]) => Record<string, string>;
}

/**
 * Hook providing validation utilities for the launch wizard
 */
export function useLaunchValidation(): UseLaunchValidationReturn {
  /**
   * Convert Zod errors to our ValidationError format
   */
  const formatZodErrors = useCallback((error: z.ZodError): ValidationError[] => {
    return error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }));
  }, []);

  /**
   * Get the appropriate schema for a step
   */
  const getSchemaForStep = useCallback((step: string): z.ZodSchema | null => {
    const schemaKey = STEP_SCHEMA_MAP[step];
    if (!schemaKey) return null;
    return launchWizardSchemas[schemaKey] as z.ZodSchema;
  }, []);

  /**
   * Validate data against a specific schema
   */
  const validateBySchema = useCallback(
    (schemaKey: LaunchWizardSchemaKey, data: unknown): ValidationResult => {
      const schema = launchWizardSchemas[schemaKey];
      const result = schema.safeParse(data);

      if (result.success) {
        return { success: true, errors: [], data: result.data };
      }

      return {
        success: false,
        errors: formatZodErrors(result.error),
      };
    },
    [formatZodErrors]
  );

  /**
   * Validate data for a specific wizard step
   */
  const validateStep = useCallback(
    (step: string, data: unknown): ValidationResult => {
      const schemaKey = STEP_SCHEMA_MAP[step];
      if (!schemaKey) {
        console.warn(`No schema found for step: ${step}`);
        return { success: true, errors: [] };
      }

      return validateBySchema(schemaKey, data);
    },
    [validateBySchema]
  );

  /**
   * Validate complete launch data before submission
   */
  const validateComplete = useCallback(
    (data: unknown): ValidationResult => {
      return validateBySchema('complete', data);
    },
    [validateBySchema]
  );

  /**
   * Check if step data is valid (boolean shorthand)
   */
  const isStepValid = useCallback(
    (step: string, data: unknown): boolean => {
      return validateStep(step, data).success;
    },
    [validateStep]
  );

  /**
   * Parse and transform data using schema
   */
  const parseStepData = useCallback(
    <T>(step: string, data: unknown): T | null => {
      const schema = getSchemaForStep(step);
      if (!schema) return null;

      const result = schema.safeParse(data);
      if (result.success) {
        return result.data as T;
      }
      return null;
    },
    [getSchemaForStep]
  );

  /**
   * Get first error message for a specific field path
   */
  const getFieldError = useCallback(
    (errors: ValidationError[], path: string): string | null => {
      const error = errors.find(
        (e) => e.path === path || e.path.startsWith(`${path}.`)
      );
      return error?.message || null;
    },
    []
  );

  /**
   * Format errors into a user-friendly object keyed by field path
   */
  const formatErrors = useCallback(
    (errors: ValidationError[]): Record<string, string> => {
      return errors.reduce(
        (acc, error) => {
          acc[error.path] = error.message;
          return acc;
        },
        {} as Record<string, string>
      );
    },
    []
  );

  return useMemo(
    () => ({
      validateStep,
      validateBySchema,
      validateComplete,
      getSchemaForStep,
      isStepValid,
      parseStepData,
      getFieldError,
      formatErrors,
    }),
    [
      validateStep,
      validateBySchema,
      validateComplete,
      getSchemaForStep,
      isStepValid,
      parseStepData,
      getFieldError,
      formatErrors,
    ]
  );
}

export default useLaunchValidation;
