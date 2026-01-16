import { useDispatch, useSelector } from 'react-redux';

import { IStore } from 'interfaces/store/IStore';
import { BLOCK_USER_MODAL } from 'constants/modal';
import { USER_STATUS_OPERATION } from 'constants/wall/design';
import { blockUnblockUser } from 'store/actions/formActions';
import { setModalState } from 'store/actions/modalActions';

/**
 * Pending invitation hook used to manage pending modal actions
 * */
const useBlockUserModal = () => {
  const dispatch = useDispatch();
  const blockUserModalState = useSelector((state: IStore) => state.modalReducer.blockUserModal);
  const closeModal = () => dispatch(setModalState(false, BLOCK_USER_MODAL));

  const confirmModal = () => {
    if (blockUserModalState.data) {
      const { setUserBlockingError, refreshPrograms, userUuid, programId, status } = blockUserModalState.data;
      blockUnblockUser(
        Number(programId),
        userUuid,
        USER_STATUS_OPERATION[status],
        setUserBlockingError,
        refreshPrograms
      );
    }
    closeModal();
  };
  return { blockUserModalState: blockUserModalState, closeModal, confirmModal };
};

export default useBlockUserModal;
