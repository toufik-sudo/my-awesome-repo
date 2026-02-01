/**
 * useImageUploadModal Hook
 * For managing image upload modal state
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, ModalType } from '@/store/actions/modalActions';
import type { RootState } from '@/store';

type ImageModalType = 'imageUploadModal' | 'designCoverModal' | 'contentsCoverModal' | 'designAvatarModal';

interface ImageUploadModalData {
  imageUrl?: string;
  context?: string;
}

interface UseImageUploadModalOptions {
  modalType?: ImageModalType;
}

/**
 * Hook to manage image upload modal state and actions
 */
export const useImageUploadModal = ({
  modalType = 'imageUploadModal'
}: UseImageUploadModalOptions = {}) => {
  const dispatch = useDispatch();
  const modalState = useSelector(
    (state: RootState) => state.modalReducer[modalType]
  );

  const handleClose = useCallback(() => {
    dispatch(closeModal(modalType as ModalType));
  }, [dispatch, modalType]);

  return {
    isOpen: modalState.active,
    data: modalState.data as ImageUploadModalData,
    onClose: handleClose
  };
};

export default useImageUploadModal;
