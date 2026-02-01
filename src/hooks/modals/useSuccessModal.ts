/**
 * useSuccessModal Hook
 * For managing success modal state
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '@/store/actions/modalActions';
import type { RootState } from '@/store';

interface SuccessModalData {
  title?: string;
  message?: string;
  customStyle?: string;
  type?: string;
}

/**
 * Hook to manage success modal state and actions
 */
export const useSuccessModal = () => {
  const dispatch = useDispatch();
  const modalState = useSelector(
    (state: RootState) => state.modalReducer.successModal
  );

  const handleClose = useCallback(() => {
    dispatch(closeModal('successModal'));
  }, [dispatch]);

  return {
    isOpen: modalState.active,
    data: modalState.data as SuccessModalData,
    onClose: handleClose
  };
};

export default useSuccessModal;
