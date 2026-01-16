import { useDispatch, useSelector } from 'react-redux';
import { useLogoutUser } from 'hooks/user/useLogoutUser';
import { IStore } from 'interfaces/store/IStore';
import { setModalState } from 'store/actions/modalActions';
import { LOG_OUT_MODAL } from 'constants/modal';

/**
 * Logout hook used to manage logout modal actions,store
 * */
const useLogOutModalData = () => {
  const dispatch = useDispatch();
  const { logoutUser } = useLogoutUser();
  const logoutStateModal = useSelector((state: IStore) => state.modalReducer.logOutModal);
  const closeModal = () => dispatch(setModalState(false, LOG_OUT_MODAL));

  return { logoutUser, logoutStateModal, closeModal };
};

export default useLogOutModalData;
