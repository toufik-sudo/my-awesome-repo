import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useWallSelection } from 'hooks/wall/useWallSelection';
import { setModalState } from 'store/actions/modalActions';
import { ADD_USER_DECLARATION_MODAL } from 'constants/modal';
import { IStore } from 'interfaces/store/IStore';

/**
 * Hook used for user declarations header menu controls.
 */
const useUserDeclarationsMenuControls = () => {
  const { listSorting } = useSelector((store: IStore) => store.userDeclarationReducer);
  const dispatch = useDispatch();

  const onAddNew = useCallback(() => dispatch(setModalState(true, ADD_USER_DECLARATION_MODAL, listSorting)), [
    dispatch,
    listSorting
  ]);

  return { ...useWallSelection(), onAddNew };
};

export default useUserDeclarationsMenuControls;
