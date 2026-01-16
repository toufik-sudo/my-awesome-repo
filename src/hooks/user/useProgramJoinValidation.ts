import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import UsersApi from 'api/UsersApi';
import { setModalState } from 'store/actions/modalActions';
import { CONFIRMATION_MODAL } from 'constants/modal';
import {
  addJoinValidationInProgress,
  removeJoinValidation,
  isJoinRequestValidationInProgress
} from 'services/ProgramServices';

const usersApi = new UsersApi();
/**
 * Hook used to validate program join request
 */
const useProgramJoinValidation = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const confirmJoinAction = useCallback(payload => dispatch(setModalState(true, CONFIRMATION_MODAL, { payload })), [
    dispatch
  ]);
  const [validatingRequests, setValidatingRequest] = useState({});

  const isValidatingJoin = useCallback(
    (userId, programdId) => isJoinRequestValidationInProgress(validatingRequests, userId, programdId),
    [validatingRequests]
  );

  const validateJoinRequest = useCallback(
    async ({ userId, operation, programId }) => {
      setValidatingRequest(state => addJoinValidationInProgress(state, userId, programId));

      let wasSuccessful = true;
      try {
        await usersApi.validateJoinRequest({
          uuid: userId,
          operation,
          programId
        });
      } catch (e) {
        toast(intl.formatMessage({ id: 'wall.user.details.programs.joinValidation.failed' }));
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
    isValidatingJoin
  };
};

export default useProgramJoinValidation;
