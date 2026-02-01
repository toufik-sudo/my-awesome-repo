// -----------------------------------------------------------------------------
// useModal Hook
// Generic hook for managing modal state
// -----------------------------------------------------------------------------

import { useState, useCallback } from 'react';

export interface UseModalOptions<T = unknown> {
  defaultOpen?: boolean;
  defaultData?: T;
  onOpen?: (data?: T) => void;
  onClose?: () => void;
}

export interface UseModalReturn<T = unknown> {
  isOpen: boolean;
  data: T | undefined;
  open: (data?: T) => void;
  close: () => void;
  toggle: () => void;
  setData: (data: T) => void;
}

/**
 * Generic hook for managing modal state with optional data
 * 
 * @example
 * const deleteModal = useModal<{ itemId: string }>();
 * 
 * // Open with data
 * deleteModal.open({ itemId: '123' });
 * 
 * // In modal
 * <ConfirmationModal 
 *   isOpen={deleteModal.isOpen}
 *   onClose={deleteModal.close}
 *   onConfirm={() => handleDelete(deleteModal.data?.itemId)}
 * />
 */
export function useModal<T = unknown>(options: UseModalOptions<T> = {}): UseModalReturn<T> {
  const { defaultOpen = false, defaultData, onOpen, onClose } = options;
  
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [data, setData] = useState<T | undefined>(defaultData);

  const open = useCallback((newData?: T) => {
    if (newData !== undefined) {
      setData(newData);
    }
    setIsOpen(true);
    onOpen?.(newData);
  }, [onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
    setData,
  };
}

/**
 * Hook for managing multiple modals
 * 
 * @example
 * const modals = useModals(['delete', 'edit', 'confirm']);
 * 
 * modals.open('delete', { itemId: '123' });
 * modals.isOpen('delete'); // true
 */
export function useModals<T extends string>(modalNames: T[]) {
  const [openModals, setOpenModals] = useState<Record<T, boolean>>(
    modalNames.reduce((acc, name) => ({ ...acc, [name]: false }), {} as Record<T, boolean>)
  );
  const [modalData, setModalData] = useState<Record<T, unknown>>(
    modalNames.reduce((acc, name) => ({ ...acc, [name]: undefined }), {} as Record<T, unknown>)
  );

  const isOpen = useCallback((name: T) => openModals[name] ?? false, [openModals]);

  const open = useCallback(<D>(name: T, data?: D) => {
    setOpenModals((prev) => ({ ...prev, [name]: true }));
    if (data !== undefined) {
      setModalData((prev) => ({ ...prev, [name]: data }));
    }
  }, []);

  const close = useCallback((name: T) => {
    setOpenModals((prev) => ({ ...prev, [name]: false }));
  }, []);

  const closeAll = useCallback(() => {
    setOpenModals(
      modalNames.reduce((acc, name) => ({ ...acc, [name]: false }), {} as Record<T, boolean>)
    );
  }, [modalNames]);

  const getData = useCallback(<D>(name: T): D | undefined => {
    return modalData[name] as D | undefined;
  }, [modalData]);

  return {
    isOpen,
    open,
    close,
    closeAll,
    getData,
  };
}

export default useModal;
