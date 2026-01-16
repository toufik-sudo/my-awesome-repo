import { useDispatch, useSelector } from 'react-redux';

import { IStore } from 'interfaces/store/IStore';
import { setModalState } from 'store/actions/modalActions';
import { USER_PROGRAM_ROLE_MODAL } from 'constants/modal';

/**
 * Hook used to manage user program role modal actions / state
 * */
const useUserProgramRoleModalData = () => {
  const dispatch = useDispatch();
  const modalState = useSelector((state: IStore) => state.modalReducer.userProgramRoleModal);
  const closeModal = () => dispatch(setModalState(false, USER_PROGRAM_ROLE_MODAL));

  return { modalState, closeModal };
};

export default useUserProgramRoleModalData;
