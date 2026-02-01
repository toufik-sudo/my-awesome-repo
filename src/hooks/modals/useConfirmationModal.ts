/**
 * useConfirmationModal Hook
 * Migrated from old_app/src/hooks/modals/useConfirmationModalData.ts
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CONFIRMATION_MODAL } from '@/constants/modal';
import { closeModal } from '@/store/actions/modalActions';
import type { RootState } from '@/store';

interface UseConfirmationModalOptions {
  onAccept: (data: unknown) => void;
  onAcceptArgs?: string;
  onClose?: () => void;
}

/**
 * Hook to manage confirmation modal state and actions
 */
export const useConfirmationModal = ({
  onAccept,
  onAcceptArgs = 'selectedId',
  onClose
}: UseConfirmationModalOptions) => {
  const dispatch = useDispatch();
  const { active, data } = useSelector(
    (state: RootState) => state.modalReducer.confirmationModal
  );

  const handleClose = useCallback(() => {
    onClose?.();
    dispatch(closeModal('confirmationModal'));
  }, [dispatch, onClose]);

  const handleConfirm = useCallback(() => {
    if (data && onAcceptArgs in data) {
      onAccept(data[onAcceptArgs as keyof typeof data]);
    }
    handleClose();
  }, [data, onAccept, onAcceptArgs, handleClose]);

  return {
    isOpen: active,
    data,
    onConfirm: handleConfirm,
    onClose: handleClose
  };
};

export default useConfirmationModal;
