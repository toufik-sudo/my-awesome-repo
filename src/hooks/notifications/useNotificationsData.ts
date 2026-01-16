import NotificationsApi from 'api/NotificationsApi';
import useInfiniteScrollLoader from 'hooks/general/useInfiniteScrollLoader';
import { NOTIFICATION_CATEGORY } from 'constants/notifications/notifications';
import { useUserRole } from 'hooks/user/useUserRole';
import { hasAtLeastSuperRole } from 'services/security/accessServices';
import { VIEW_TYPE } from 'constants/api';
import usePlatformIdSelection from 'hooks/wall/slider/usePlatformIdSelection';

const notificationsApi = new NotificationsApi();

/**
 * Hook used to manipulate notifications data
 */
const useNotificationsData = () => {
  const role = useUserRole();
  const isAtLeastSuper = hasAtLeastSuperRole(role);
  const initialListCriteria = { category: NOTIFICATION_CATEGORY.ALL };
  const platformId = usePlatformIdSelection();
  const loadMore = async listCriteria => {
    const viewType = isAtLeastSuper ? VIEW_TYPE.PLATFORM : VIEW_TYPE.LIST;
    const { data } = await notificationsApi.getNotifications(
      listCriteria,
      viewType,
      isAtLeastSuper ? platformId : null
    );
    const { notifications: entries, total } = data.length > 0 ? data[0] : { notifications: [], total: 0 };
    return { entries, total };
  };
  const {
    entries,
    hasMore,
    isLoading,
    setListCriteria,
    handleLoadMore,
    listCriteria,
    scrollRef
  } = useInfiniteScrollLoader({
    loadMore,
    initialListCriteria,
    pageSize: 20
  });

  const setCategory = category => {
    !isLoading && setListCriteria(criteria => ({ ...criteria, category }));
  };

  return {
    isLoading,
    scrollRef,
    setCategory,
    notifications: entries,
    loadMore: handleLoadMore,
    hasMore,
    category: listCriteria.category
  };
};

export default useNotificationsData;
