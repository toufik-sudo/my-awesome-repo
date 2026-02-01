/**
 * useValidatePointConversionModal Hook
 * Migrated from old_app/src/hooks/modals/useValidatePointConversionModal.ts
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '@/store/actions/modalActions';
import type { RootState } from '@/store';

interface PointConversionData {
  pointConversion?: {
    id: number;
    [key: string]: unknown;
  };
}

interface UseValidatePointConversionModalOptions {
  onSuccess?: (data: { id: number }) => void;
}

/**
 * Hook to manage validate point conversion modal state and actions
 */
export const useValidatePointConversionModal = ({
  onSuccess
}: UseValidatePointConversionModalOptions = {}) => {
  const dispatch = useDispatch();
  const modalState = useSelector(
    (state: RootState) => state.modalReducer.validatePointConversionModal
  );

  const handleClose = useCallback(() => {
    dispatch(closeModal('validatePointConversionModal'));
  }, [dispatch]);

  const handleConfirm = useCallback(async () => {
    const data = modalState.data as PointConversionData;
    if (data?.pointConversion) {
      // Note: Point conversion validation API would be called here
      onSuccess?.({ id: data.pointConversion.id });
    }
    handleClose();
  }, [modalState.data, onSuccess, handleClose]);

  return {
    isOpen: modalState.active,
    data: modalState.data as PointConversionData,
    onConfirm: handleConfirm,
    onClose: handleClose
  };
};

export default useValidatePointConversionModal;
