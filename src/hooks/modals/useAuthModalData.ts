import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { IModalState, IStore } from 'interfaces/store/IStore';
import { useIntl } from 'react-intl';
import { setModalState } from 'store/actions/modalActions';
import { ROOT } from 'constants/routes';

/**
 * Hook used to render data for auth data
 * @param children
 * @param targetModal
 */
const useAuthModalData = (children, targetModal) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const modalState: IModalState = useSelector((state: IStore) => state.modalReducer[targetModal]);
  const intl = useIntl();
  const closeModal = () => {
    dispatch(setModalState(false, targetModal));
    history.push(ROOT);
  };

  return { closeModal, modalState, intl };
};

export default useAuthModalData;
