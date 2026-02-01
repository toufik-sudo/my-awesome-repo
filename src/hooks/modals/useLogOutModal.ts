/**
 * useLogOutModal Hook
 * Migrated from old_app/src/hooks/modals/useLogOutModalData.ts
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '@/store/actions/modalActions';
import { useLogoutUser } from '@/hooks/user/useLogoutUser';
import type { RootState } from '@/store';

/**
 * Hook to manage logout modal state and actions
 */
export const useLogOutModal = () => {
  const dispatch = useDispatch();
  const { logoutUser } = useLogoutUser();
  const modalState = useSelector(
    (state: RootState) => state.modalReducer.logOutModal
  );

  const handleClose = useCallback(() => {
    dispatch(closeModal('logOutModal'));
  }, [dispatch]);

  const handleConfirmLogout = useCallback(() => {
    logoutUser();
    handleClose();
  }, [logoutUser, handleClose]);

  return {
    isOpen: modalState.active,
    data: modalState.data,
    onLogout: handleConfirmLogout,
    onClose: handleClose
  };
};

export default useLogOutModal;
