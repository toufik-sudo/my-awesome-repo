import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

import NotificationsApi from 'api/NotificationsApi';
import { WALL_NOTIFICATIONS_ROUTE } from 'constants/routes';
import { useUserRole } from 'hooks/user/useUserRole';
import { hasAtLeastSuperRole } from 'services/security/accessServices';
import { VIEW_TYPE } from 'constants/api';
import usePlatformIdSelection from 'hooks/wall/slider/usePlatformIdSelection';
import axios from 'axios';

const notificationsApi = new NotificationsApi();

/**
 * Hook used to manipulate notifications data
 */
const useNotificationsDropdownData = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [lastNotificationsCount, setLastNotificationsCount] = useState();
  const { formatMessage } = useIntl();
  const history = useHistory();
  const role = useUserRole();
  const isAtLeastSuper = hasAtLeastSuperRole(role);
  const platformId = usePlatformIdSelection();
  const updateNotificationCount = i => {
    setNotificationsCount(i);
    setLastNotificationsCount(i);
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    const isShowingAllNotifications = history.location.pathname === WALL_NOTIFICATIONS_ROUTE;
    if (isShowingAllNotifications) {
      return;
    }
    notificationsApi.countUnreadNotifications(isAtLeastSuper ? platformId : null, source)
      .then(({ data }) => {
        updateNotificationCount(data.total);
      })
      .catch((e) => {
        console.error(e);
        // toast(formatMessage({ id: 'toast.message.generic.error' }));
      });
    return()=>{
      source.cancel();
    }
  }, []);

  const openNotifications = async () => {
    setIsOpen(true);
    setIsLoading(true);
    try {
      const viewType = isAtLeastSuper ? VIEW_TYPE.PLATFORM : VIEW_TYPE.PREVIEW;
      const { data } = await notificationsApi.getPreviewNotifications(viewType, isAtLeastSuper ? platformId : null);
      setNotifications(data.notifications || []);
      setNotificationsCount(0);
    } catch (e) {
      toast(formatMessage({ id: 'toast.message.generic.error' }));
    }
    setIsLoading(false);
  };

  const closeNotifications = () => {
    setIsOpen(false);
    setLastNotificationsCount(notificationsCount);
  };

  return {
    isOpen,
    isLoading,
    openNotifications,
    closeNotifications,
    notifications: notifications,
    notificationsCount,
    lastNotificationsCount
  };
};

export default useNotificationsDropdownData;
