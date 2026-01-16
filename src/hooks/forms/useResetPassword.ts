import { useHistory, useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

import { useTokenValidate } from 'hooks/authorization/useTokenValidate';
import { setModalState } from 'store/actions/modalActions';
import { SUCCESS_MODAL } from 'constants/modal';
import { MODAL_ACTION_TYPES } from 'constants/forms';

/**
 * Hook used to handle reset password logic
 */
export const useResetPassword = () => {
  const history = useHistory();
  const { authState, token } = useParams();
  const dispatch = useDispatch();
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const isValid = useTokenValidate(history);

  useEffect(() => {
    if (forgotSubmitted) {
      dispatch(setModalState(true, SUCCESS_MODAL, { type: `.${MODAL_ACTION_TYPES.CHANGED}` }));
    }
  }, [forgotSubmitted, dispatch]);

  return { authState, token, setForgotSubmitted, formLoading, setFormLoading, isValid, history };
};
