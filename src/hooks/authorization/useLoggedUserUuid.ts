import { useContext } from 'react';

import { UserContext } from 'components/App';
import { getUserUuid } from 'services/UserDataServices';

/**
 * Hook used to get current user uuid
 */
export const useLoggedUserUuid = () => {
  const { userData = {} } = useContext(UserContext);
  const loggedUserUuid = userData.uuid || getUserUuid();

  return { loggedUserUuid };
};
