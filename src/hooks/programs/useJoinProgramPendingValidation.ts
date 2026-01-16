import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import { PROGRAM_JOIN_PENDING, PROGRAM_DETAILS_JOINED } from 'constants/api/userPrograms';

/**
 * Hook used to manage program join.
 * @param programDetails
 * @param onNext
 */
const useJoinProgramPendingValidation = (programDetails, onNext) => {
  const { formatMessage } = useIntl();
  const isPending = programDetails.registerManualValidation;

  useEffect(() => {
    const status = isPending ? PROGRAM_JOIN_PENDING : PROGRAM_DETAILS_JOINED;

    if (status === PROGRAM_DETAILS_JOINED) {
      toast(formatMessage({ id: 'program.join.success' }, { programName: programDetails.name }));
      onNext({ joined: true });
    }
  }, []);

  return isPending;
};

export default useJoinProgramPendingValidation;
