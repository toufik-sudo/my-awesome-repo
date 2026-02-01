import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { toast } from 'sonner';
import { DeclarationStatus, IDeclaration } from '../types';
import { DeclarationStatus as ApiDeclarationStatus } from '@/api/types';
import { updateDeclarationStatus } from '../store/declarationsReducer';
import { declarationsApi } from '@/api/DeclarationsApi';

interface UseDeclarationValidationOptions {
  declaration: IDeclaration;
  onSuccess?: () => void;
}

/**
 * Hook for validating or declining declarations
 * Connects to the real declarations API with confirm dialog workflow
 */
export const useDeclarationValidation = ({
  declaration,
  onSuccess,
}: UseDeclarationValidationOptions) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const [isValidating, setIsValidating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(declaration.status);

  const validate = useCallback(
    async (newStatus: DeclarationStatus) => {
      if (isValidating) return;

      // Validate that we have the required hash
      if (!declaration.hash) {
        console.error('Declaration hash is required for validation');
        toast.error(intl.formatMessage({ 
          id: 'declarations.validation.error',
          defaultMessage: 'Failed to update declaration status'
        }));
        return;
      }

      setIsValidating(true);

      try {
        // Map local status to API status
        const apiStatus = newStatus === DeclarationStatus.VALIDATED 
          ? ApiDeclarationStatus.VALIDATED 
          : ApiDeclarationStatus.DECLINED;
        
        // Call the real API
        await declarationsApi.validateDeclaration(
          { id: declaration.id, hash: declaration.hash },
          apiStatus
        );

        // Update local state
        setCurrentStatus(newStatus);
        dispatch(updateDeclarationStatus({ id: declaration.id, status: newStatus }));

        const messageId =
          newStatus === DeclarationStatus.VALIDATED
            ? 'declarations.validation.success.validated'
            : 'declarations.validation.success.declined';

        toast.success(intl.formatMessage({ 
          id: messageId,
          defaultMessage: newStatus === DeclarationStatus.VALIDATED 
            ? 'Declaration validated successfully' 
            : 'Declaration declined'
        }));
        onSuccess?.();
      } catch (error: any) {
        console.error('Validation failed:', error);
        
        // Handle specific error cases
        const errorMessage = error.response?.data?.message || 
          intl.formatMessage({ 
            id: 'declarations.validation.error',
            defaultMessage: 'Failed to update declaration status'
          });
        
        toast.error(errorMessage);
      } finally {
        setIsValidating(false);
      }
    },
    [dispatch, declaration.id, declaration.hash, intl, isValidating, onSuccess]
  );

  const handleValidate = useCallback(() => {
    validate(DeclarationStatus.VALIDATED);
  }, [validate]);

  const handleDecline = useCallback(() => {
    validate(DeclarationStatus.DECLINED);
  }, [validate]);

  return {
    currentStatus,
    isValidating,
    handleValidate,
    handleDecline,
    canValidate: currentStatus === DeclarationStatus.PENDING,
  };
};

export default useDeclarationValidation;
