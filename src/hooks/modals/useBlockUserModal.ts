/**
 * useBlockUserModal Hook
 * Migrated from old_app/src/hooks/modals/useBlockUserModal.ts
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '@/store/actions/modalActions';
import type { RootState } from '@/store';

interface BlockUserData {
  userUuid?: string;
  programId?: number | string;
  status?: string;
  setUserBlockingError?: (error: string) => void;
  refreshPrograms?: () => void;
}

/**
 * Hook to manage block user modal state and actions
 */
export const useBlockUserModal = () => {
  const dispatch = useDispatch();
  const modalState = useSelector(
    (state: RootState) => state.modalReducer.blockUserModal
  );

  const handleClose = useCallback(() => {
    dispatch(closeModal('blockUserModal'));
  }, [dispatch]);

  const handleConfirm = useCallback(async () => {
    const data = modalState.data as BlockUserData;
    if (data) {
      const { refreshPrograms } = data;
      // Note: Block/unblock API call would be integrated here
      // For now, we just trigger the callback
      refreshPrograms?.();
    }
    handleClose();
  }, [modalState.data, handleClose]);

  return {
    isOpen: modalState.active,
    data: modalState.data as BlockUserData,
    onConfirm: handleConfirm,
    onClose: handleClose
  };
};

export default useBlockUserModal;
