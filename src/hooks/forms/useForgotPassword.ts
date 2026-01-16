import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

import { setModalState } from 'store/actions/modalActions';
import { SUCCESS_MODAL } from 'constants/modal';
import { MODAL_ACTION_TYPES } from 'constants/forms';

/**
 * Hook used to handle logic for forgot password
 */
export const useForgotPassword = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  useEffect(() => {
    if (forgotSubmitted) {
      dispatch(setModalState(true, SUCCESS_MODAL, { type: `.${MODAL_ACTION_TYPES.RESET}` }));
      setForgotSubmitted(false);
    }
  }, [forgotSubmitted, dispatch]);

  return { history, setForgotSubmitted, formLoading, setFormLoading };
};
