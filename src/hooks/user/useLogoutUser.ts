import { useDispatch } from 'react-redux';

import { setUserLoggedIn } from 'store/actions/generalActions';
import { clearUserData } from 'services/UserDataServices';
import { useLogoutUserRoute } from 'hooks/user/useLogoutBeneficiaryUser';
import { useHistory } from 'react-router-dom';
import { setModalState } from '../../store/actions/modalActions';
import { LOG_OUT_MODAL } from '../../constants/modal';

/**
 * Hook used to logout current user
 */
export const useLogoutUser = () => {
  const { logoutRedirectRoute } = useLogoutUserRoute();
  const history = useHistory();
  const dispatch = useDispatch();

  const logoutUser = () => {
    dispatch(setModalState(false, LOG_OUT_MODAL));
    dispatch(setUserLoggedIn(false));
    clearUserData();
    history.replace(logoutRedirectRoute);
  };

  return { logoutUser };
};
