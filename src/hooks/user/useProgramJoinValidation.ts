// -----------------------------------------------------------------------------
// useProgramJoinValidation Hook
// Handles program join request validation
// -----------------------------------------------------------------------------

import { useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'sonner';

import { useAppDispatch } from '@/hooks/store';
import { usersApi } from '@/api/UsersApi';
import { openModal } from '@/store/actions/modalActions';
import {
  addJoinValidationInProgress,
  removeJoinValidation,
  isJoinRequestValidationInProgress,
  type JoinRequestState,
} from '@/services/programs';

interface ValidateJoinRequestParams {
  userId: string;
  operation: string;
  programId: number;
}

/**
 * Hook used to validate program join request
 */
export const useProgramJoinValidation = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const [validatingRequests, setValidatingRequest] = useState<JoinRequestState>({});

  const confirmJoinAction = useCallback(
    (payload: any) => dispatch(openModal('confirmationModal', { payload })),
    [dispatch]
  );

  const isValidatingJoin = useCallback(
    (userId: string, programId: number) => 
      isJoinRequestValidationInProgress(validatingRequests, userId, programId),
    [validatingRequests]
  );

  const validateJoinRequest = useCallback(
    async ({ userId, operation, programId }: ValidateJoinRequestParams) => {
      setValidatingRequest(state => addJoinValidationInProgress(state, userId, programId));

      let wasSuccessful = true;
      try {
        await usersApi.validateJoinRequest({
          uuid: userId,
          operation,
          programId,
        });
      } catch (e) {
        toast.error(intl.formatMessage({ id: 'wall.user.details.programs.joinValidation.failed' }));
        wasSuccessful = false;
      }

      setValidatingRequest(state => removeJoinValidation(state, userId, programId));

      return wasSuccessful;
    },
    [intl]
  );

  return {
    confirmJoinAction,
    validateJoinRequest,
    isValidatingJoin,
  };
};

export default useProgramJoinValidation;
