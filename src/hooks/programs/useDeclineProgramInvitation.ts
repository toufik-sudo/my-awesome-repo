import { useCallback, useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import UsersApi from 'api/UsersApi';
import { setModalState } from 'store/actions/modalActions';
import { CONFIRMATION_MODAL } from 'constants/modal';
import { PROGRAM_INVITATION_OPERATION } from 'constants/api/userPrograms';
import { UserContext } from 'components/App';

const usersApi = new UsersApi();
/**
 * Hook used to decline program invitations.
 *
 * @param triggerReloadPrograms
 */
const useDeclineProgramInvitation = triggerReloadPrograms => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [processingInvitations, setProcessingInvitations] = useState<any>({});
  const { userData = {} } = useContext(UserContext);
  const { uuid } = userData;

  const confirmRefusal = useCallback(program => dispatch(setModalState(true, CONFIRMATION_MODAL, { program })), [
    dispatch
  ]);

  const declineInvitation = useCallback(
    async program => {
      const { programId } = program;
      setProcessingInvitations(state => ({ ...state, [programId]: true }));
      try {
        await usersApi.joinOrDeclineProgram({
          uuid,
          programId,
          operation: PROGRAM_INVITATION_OPERATION.DECLINE
        });
        triggerReloadPrograms();
        toast(intl.formatMessage({ id: 'program.invitation.decline.success' }));
      } catch (e) {
        toast(intl.formatMessage({ id: 'program.invitation.decline.failed' }));
      }
      setProcessingInvitations(state => {
        const { ...rest } = state;
        return rest;
      });
    },
    [uuid, dispatch, intl]
  );

  useEffect(() => {
    setProcessingInvitations({});
  }, [uuid]);

  return { confirmRefusal, declineInvitation, processingInvitations };
};

export default useDeclineProgramInvitation;
