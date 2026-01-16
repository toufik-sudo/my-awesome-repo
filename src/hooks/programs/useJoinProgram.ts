import { useContext, useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import UsersApi from 'api/UsersApi';
import { UserContext } from 'components/App';
import { PROGRAM_INVITATION_OPERATION } from 'constants/api/userPrograms';

const userApi = new UsersApi();
/**
 * Hook used to manage program join.
 * @param programId
 * @param onNext
 */
const useJoinProgram = (programId, onNext) => {
  const { formatMessage } = useIntl();
  const { userData } = useContext(UserContext);
  const [newsletter, setNewsletter] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const join = useCallback(async () => {
    setSubmitting(true);
    try {
      await userApi.joinOrDeclineProgram({
        uuid: userData.uuid,
        programId,
        newsletter,
        operation: PROGRAM_INVITATION_OPERATION.ACCEPT
      });
      onNext();
    } catch ({ response }) {
      toast(formatMessage({ id: 'program.join.failed' }));
      setSubmitting(false);
    }
  }, [userData.uuid, programId, newsletter, formatMessage, onNext]);

  return { newsletter, setNewsletter, termsAccepted, setTermsAccepted, join, submitting };
};

export default useJoinProgram;
