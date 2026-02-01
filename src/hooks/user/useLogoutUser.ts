// -----------------------------------------------------------------------------
// useLogoutUser Hook
// Handles user logout logic
// -----------------------------------------------------------------------------

import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/store';
import { setUserLoggedIn } from '@/store/actions/generalActions';
import { closeModal } from '@/store/actions/modalActions';
import { clearUserData } from '@/services/UserDataServices';
import { WALL } from '@/constants/routes';

/**
 * Hook used to logout current user
 */
export const useLogoutUser = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const logoutUser = () => {
    dispatch(closeModal('logOutModal'));
    dispatch(setUserLoggedIn(false));
    clearUserData();
    navigate(`/${WALL}`, { replace: true });
  };

  return { logoutUser };
};

export default useLogoutUser;
