/**
 * useLikesModal Hook
 * For managing likes modal state
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '@/store/actions/modalActions';
import type { RootState } from '@/store';

interface LikesModalData {
  postId?: string | number;
  likeNames?: Array<{ name: string; avatar?: string }>;
  type?: string;
}

/**
 * Hook to manage likes modal state and actions
 */
export const useLikesModal = () => {
  const dispatch = useDispatch();
  const modalState = useSelector(
    (state: RootState) => state.modalReducer.likesModal
  );

  const handleClose = useCallback(() => {
    dispatch(closeModal('likesModal'));
  }, [dispatch]);

  return {
    isOpen: modalState.active,
    data: modalState.data as LikesModalData,
    onClose: handleClose
  };
};

export default useLikesModal;
