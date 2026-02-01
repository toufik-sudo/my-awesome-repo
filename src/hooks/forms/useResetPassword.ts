// -----------------------------------------------------------------------------
// useResetPassword Hook
// Handles reset password form logic
// -----------------------------------------------------------------------------

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAppDispatch } from '@/hooks/store';
import { openModal } from '@/store/actions/modalActions';

const MODAL_ACTION_TYPES = {
  RESET: 'reset',
  CHANGED: 'changed',
} as const;

/**
 * Hook used to handle reset password logic
 */
export const useResetPassword = () => {
  const navigate = useNavigate();
  const params = useParams<{ authState?: string; token?: string }>();
  const { authState, token } = params;
  const dispatch = useAppDispatch();
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (forgotSubmitted) {
      dispatch(openModal('successModal', { type: `.${MODAL_ACTION_TYPES.CHANGED}` }));
    }
  }, [forgotSubmitted, dispatch]);

  return { 
    authState, 
    token, 
    setForgotSubmitted, 
    formLoading, 
    setFormLoading, 
    isValid, 
    navigate 
  };
};

export default useResetPassword;
