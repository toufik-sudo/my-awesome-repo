import { useState } from 'react';
import { emptyFn } from 'utils/general';

/**
 * Hook used to manage delete account modal data
 */
const useDeleteAccountModal = () => {
  const [showModal, setShowModal] = useState(false);
  const onDelete = emptyFn;

  return { setShowModal, showModal, onDelete };
};

export default useDeleteAccountModal;
