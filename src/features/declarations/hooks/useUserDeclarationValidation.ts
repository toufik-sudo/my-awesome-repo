// -----------------------------------------------------------------------------
// useUserDeclarationValidation Hook
// Migrated from old_app/src/hooks/declarations/useUserDeclarationValidation.ts
// -----------------------------------------------------------------------------

import { useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'sonner';
import { extractErrorCode } from '@/utils/api';
import { declarationsApi } from '@/api/DeclarationsApi';
import { DeclarationStatus } from '@/api/types';

export interface IDeclaration {
  id: number;
  hash: string;
  status: number;
  [key: string]: unknown;
}

export interface IValidationState {
  status: number;
  isValidating: boolean;
}

// Error codes for declarations
const ERROR_CODES = {
  USER_DECLARATION_CHANGED: 'USER_DECLARATION_CHANGED',
  INSUFFICIENT_WINS: 'COMPANY WINS IS NOT SUFFISANTE !'
} as const;

/**
 * Hook used to validate a single user declaration
 */
const useUserDeclarationValidation = (
  declaration: IDeclaration,
  reloadDeclaration: () => void,
  triggerConfirmation?: () => void
) => {
  const [validation, setValidation] = useState<IValidationState>({
    status: declaration.status,
    isValidating: false
  });
  const intl = useIntl();

  const onValidate = useCallback(async (status: number) => {
    if (validation.isValidating) {
      return;
    }

    setValidation(prev => ({ ...prev, isValidating: true }));

    try {
      await declarationsApi.validateDeclaration(
        { id: declaration.id, hash: declaration.hash as string },
        status as DeclarationStatus
      );
      setValidation({ status, isValidating: false });
      
      if (triggerConfirmation) {
        triggerConfirmation();
      }
    } catch (error: unknown) {
      const response = (error as { response?: { data?: { message?: string } } })?.response;
      const errorCode = extractErrorCode(response);
      
      if (errorCode === ERROR_CODES.USER_DECLARATION_CHANGED) {
        toast.error(intl.formatMessage({ id: 'wall.userDeclaration.validation.error.updated' }));
        reloadDeclaration();
        return;
      }
      
      if (response?.data?.message === ERROR_CODES.INSUFFICIENT_WINS) {
        toast.error(intl.formatMessage({ id: 'wall.userDeclaration.validation.error.notSuffisantWins' }));
        return;
      }

      toast.error(intl.formatMessage({ id: 'toast.message.generic.error' }));
      setValidation(prev => ({ ...prev, isValidating: false }));
    }
  }, [validation.isValidating, declaration, intl, reloadDeclaration, triggerConfirmation]);

  const resetValidation = useCallback(() => {
    setValidation({
      status: declaration.status,
      isValidating: false
    });
  }, [declaration.status]);

  return {
    validation,
    onValidate,
    resetValidation,
    isValidating: validation.isValidating,
    currentStatus: validation.status
  };
};

export default useUserDeclarationValidation;
