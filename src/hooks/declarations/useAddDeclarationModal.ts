import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setModalState } from 'store/actions/modalActions';
import { ADD_USER_DECLARATION_MODAL } from 'constants/modal';
import { useHistory } from 'react-router-dom';
import { IStore } from 'interfaces/store/IStore';

/**
 * Hook used for option-based navigation on adding a new user declaration.
 */
const useAddDeclarationModal = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { active, data } = useSelector((state: IStore) => state.modalReducer.addUserDeclarationModal);

  const closeModal = useCallback(() => dispatch(setModalState(false, ADD_USER_DECLARATION_MODAL)), [dispatch]);

  const navigateTo = useCallback(
    (route: string) => {
      history.push({
        pathname: route,
        state: data
      });
      closeModal();
    },
    [data, history, closeModal]
  );

  return { active, navigateTo, closeModal };
};

export default useAddDeclarationModal;
