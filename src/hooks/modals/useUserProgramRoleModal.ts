/**
 * useUserProgramRoleModal Hook
 * Migrated from old_app/src/hooks/modals/useUserProgramRoleModal.ts
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '@/store/actions/modalActions';
import type { RootState } from '@/store';

interface ProgramRoleData {
  program?: {
    id: number;
    name: string;
  };
}

/**
 * Hook to manage user program role modal state and actions
 */
export const useUserProgramRoleModal = () => {
  const dispatch = useDispatch();
  const modalState = useSelector(
    (state: RootState) => state.modalReducer.userProgramRoleModal
  );

  const handleClose = useCallback(() => {
    dispatch(closeModal('userProgramRoleModal'));
  }, [dispatch]);

  return {
    isOpen: modalState.active,
    data: modalState.data as ProgramRoleData,
    onClose: handleClose
  };
};

export default useUserProgramRoleModal;
