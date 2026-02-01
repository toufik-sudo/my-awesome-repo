/**
 * useCreatePlatformModal Hook
 * Migrated from old_app/src/hooks/modals/useCreatePlatformModalData.ts
 */

import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '@/store/actions/modalActions';
import { isValidPlatformName, isSuperPlatform as checkSuperPlatform } from '@/services/HyperProgramService';
import { PLATFORM_HIERARCHIC_TYPE } from '@/constants/platforms';
import type { RootState } from '@/store';

interface PlatformModalData {
  hierarchicType?: PLATFORM_HIERARCHIC_TYPE;
  parentPlatform?: {
    id: number;
    name: string;
  };
}

interface UseCreatePlatformModalOptions {
  onPlatformCreated?: (wasCreated: boolean) => void;
}

/**
 * Hook to manage create platform modal state and actions
 */
export const useCreatePlatformModal = ({
  onPlatformCreated
}: UseCreatePlatformModalOptions = {}) => {
  const dispatch = useDispatch();
  const [platformName, setPlatformName] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const modalState = useSelector(
    (state: RootState) => state.modalReducer.createPlatformModal
  );
  const data = (modalState?.data || {}) as PlatformModalData;

  const handleClose = useCallback((wasCreated = false) => {
    setPlatformName('');
    setError(undefined);
    onPlatformCreated?.(wasCreated);
    dispatch(closeModal('createPlatformModal'));
  }, [dispatch, onPlatformCreated]);

  const handleNameChange = useCallback((name: string) => {
    setPlatformName(name);
    setError(undefined);
  }, []);

  const canSubmit = !error && isValidPlatformName(platformName) && !isLoading;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;

    setIsLoading(true);
    try {
      // Note: Platform API call would be integrated here
      // await platformApi.createPlatform({
      //   hierarchicType: data.hierarchicType,
      //   parentPlatformId: data.parentPlatform?.id,
      //   name: platformName.trim()
      // });
      
      // Simulate success for now
      handleClose(true);
    } catch (err) {
      setError('form.validation.platform.creation.failed');
    } finally {
      setIsLoading(false);
    }
  }, [canSubmit, platformName, handleClose]);

  const isSuperPlatformType = checkSuperPlatform(data.hierarchicType);

  return {
    isOpen: modalState?.active || false,
    data,
    platformName,
    error,
    isLoading,
    canSubmit,
    isSuperPlatform: isSuperPlatformType,
    onNameChange: handleNameChange,
    onSubmit: handleSubmit,
    onClose: handleClose
  };
};

export default useCreatePlatformModal;
