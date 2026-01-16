import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import UsersApi from 'api/UsersApi';
import { isNotFound, isForbidden } from 'utils/api';
import { PAGE_NOT_FOUND, USERS_ROUTE } from 'constants/routes';

const usersApi = new UsersApi();
/**
 * Hook used to get and manipulate user details data
 * @param userId
 */
const useUserDetails = userId => {
  const intl = useIntl();
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({});

  const loadUser = useCallback(async () => {
    setLoading(true);
    try {
      const user = await usersApi.getUserDetails(userId);
      setUserDetails(user);
      setLoading(false);
    } catch ({ response }) {
      if (isNotFound(response) || isForbidden(response)) {
        history.push(PAGE_NOT_FOUND);
        return;
      }

      toast(intl.formatMessage({ id: 'wall.user.details.error.failedToLoad' }));
      history.push(USERS_ROUTE);
    }
  }, [userId, history, intl]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return { userDetails, isLoading };
};

export default useUserDetails;
