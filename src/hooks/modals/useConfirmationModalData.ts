import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IStore } from 'interfaces/store/IStore';
import { setModalState } from 'store/actions/modalActions';
import { CONFIRMATION_MODAL } from 'constants/modal';

/**
 * Hook used to manage confirmation modal actions / state.
 * @param onAccept callback to execute on confirmation
 * @param onAcceptArgs arguments to be taken from store and applied on onAccept function
 * @param onClose
 * */
const useConfirmationModalData = (onAccept, onAcceptArgs, onClose) => {
  const dispatch = useDispatch();
  const { active, data } = useSelector((state: IStore) => state.modalReducer.confirmationModal);
  const closeModal = useCallback(() => {
    onClose();
    return dispatch(setModalState(false, CONFIRMATION_MODAL));
  }, [dispatch, onClose]);
  const confirmAction = useCallback(() => {
    onAccept(data[onAcceptArgs]);
    closeModal();
  }, [data, onAccept, onAcceptArgs, closeModal]);

  return { isActive: active, data, confirmAction, closeModal };
};

export default useConfirmationModalData;
