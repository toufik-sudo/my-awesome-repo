// -----------------------------------------------------------------------------
// useJoinProgram Hook
// Manages program join flow
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'sonner';

import { usersApi } from '@/api/UsersApi';
import { PROGRAM_JOIN_OPERATION } from '@/constants/api/userPrograms';

/**
 * Hook used to manage program join
 * @param programId - The program ID to join
 * @param userUuid - The user UUID
 * @param onNext - Callback after successful join
 */
export const useJoinProgram = (
  programId: number, 
  userUuid: string,
  onNext: () => void
) => {
  const { formatMessage } = useIntl();
  const [newsletter, setNewsletter] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const join = useCallback(async () => {
    setSubmitting(true);
    try {
      await usersApi.joinOrDeclineProgram({
        uuid: userUuid,
        programId,
        operation: PROGRAM_JOIN_OPERATION.ACCEPT,
      });
      onNext();
    } catch (e) {
      toast.error(formatMessage({ id: 'program.join.failed' }));
      setSubmitting(false);
    }
  }, [userUuid, programId, formatMessage, onNext]);

  return { 
    newsletter, 
    setNewsletter, 
    termsAccepted, 
    setTermsAccepted, 
    join, 
    submitting 
  };
};

export default useJoinProgram;
