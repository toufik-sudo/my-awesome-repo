import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';

import usePrevious from 'hooks/general/usePrevious';
import CommunicationsApi from 'api/CommunicationsApi';
import { IEmailUsersList } from 'interfaces/components/wall/communication/ICampaign';
import { ISortable } from 'interfaces/api/ISortable';
import { USER_LIST_DEFAULT_FILTER } from 'constants/communications/userList';
import { isNotFound } from 'utils/api';
import { setupOpenDeleteUserListModal, setupOnDeleteUserList } from 'services/communications/EmailUserListService';
import usePlatformIdSelection from 'hooks/wall/slider/usePlatformIdSelection';
import { useWallSelection } from 'hooks/wall/useWallSelection';

const communicationsApi = new CommunicationsApi();

/**
 * Hook for Communication email user list page
 *
 */
export const useUserLists = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [forceReloadListCounter, setForceReloadList] = useState<number>(0);
  const [userLists, setUserLists] = useState<IEmailUsersList[]>([]);
  const [sortingFilter, setSortingFilter] = useState<ISortable>(USER_LIST_DEFAULT_FILTER);
  const platformId = usePlatformIdSelection();
  const { selectedProgramId: programId } = useWallSelection();
  const prevState = usePrevious({ programId });
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (!platformId) {
      return;
    }
    if (prevState && prevState.programId !== programId && sortingFilter !== USER_LIST_DEFAULT_FILTER) {
      setSortingFilter(USER_LIST_DEFAULT_FILTER);
      return;
    }
    setIsLoading(true);
    communicationsApi
      .getListData({ platformId, programId, ...sortingFilter })
      .then(({ data }) => setUserLists(data.data))
      .catch(({ response }) => {
        setUserLists([]);
        if (isNotFound(response)) {
          return;
        }
        toast(formatMessage({ id: 'toast.message.generic.error' }));
      })
      .finally(() => setIsLoading(false));
  }, [programId, platformId, sortingFilter, forceReloadListCounter]);

  const hasNoUserLists = !isLoading && !userLists.length;

  const openDeleteUserListModal = setupOpenDeleteUserListModal(formatMessage, dispatch);
  const onDeleteUserList = setupOnDeleteUserList(formatMessage, () => setForceReloadList(forceReloadListCounter + 1));

  return {
    userLists,
    setSortingFilter,
    sortingFilter,
    hasNoUserLists,
    isLoading,
    onDeleteUserList,
    openDeleteUserListModal,
    areAllProgramsSelected: !programId
  };
};
