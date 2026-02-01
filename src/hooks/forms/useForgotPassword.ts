// -----------------------------------------------------------------------------
// useForgotPassword Hook
// Handles forgot password form logic
// -----------------------------------------------------------------------------

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@/hooks/store';
import { openModal } from '@/store/actions/modalActions';

const MODAL_ACTION_TYPES = {
  RESET: 'reset',
  CHANGED: 'changed',
} as const;

/**
 * Hook used to handle logic for forgot password
 */
export const useForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (forgotSubmitted) {
      dispatch(openModal('successModal', { type: `.${MODAL_ACTION_TYPES.RESET}` }));
      setForgotSubmitted(false);
    }
  }, [forgotSubmitted, dispatch]);

  return { navigate, setForgotSubmitted, formLoading, setFormLoading };
};

export default useForgotPassword;
