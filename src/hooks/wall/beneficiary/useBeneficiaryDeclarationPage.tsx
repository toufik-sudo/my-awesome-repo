import { useContext } from 'react';

import UserDeclarationApi from 'api/UserDeclarationsApi';
import useInfiniteScrollLoader from 'hooks/general/useInfiniteScrollLoader';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { USER_DECLARATIONS_DEFAULT_SORT } from 'constants/api/declarations';
import { useUpdateEffect } from 'hooks/general/useUpdateEffect';
import { UserContext } from 'components/App';
import { isUserBeneficiary } from 'services/security/accessServices';

const userDeclarationApi = new UserDeclarationApi();
/**
 * Hook used for rendering the beneficiary declarations
 */
export const useBeneficiaryDeclarationPage = () => {
  const {
    selectedProgramId: programId,
    selectedPlatform: { role, id: platformId }
  } = useWallSelection();
  const {
    userData: { uuid }
  } = useContext(UserContext);
  const initialListCriteria = {
    ...USER_DECLARATIONS_DEFAULT_SORT,
    platformId,
    programId,
    uuid: isUserBeneficiary(role) ? uuid : undefined
  };

  const loadMore = async criteria => {
    if (!platformId || !uuid) {
      return { entries: [], total: 0 };
    }
    const { userDeclarations: entries, total } = await userDeclarationApi.getDeclarations(criteria);

    return { entries, total };
  };
  const {
    entries: declarations,
    hasMore,
    isLoading,
    handleLoadMore,
    scrollRef,
    listCriteria,
    setListCriteria
  } = useInfiniteScrollLoader({
    loadMore,
    pageSize: 20,
    initialListCriteria
  });

  const onSort = sortState => {
    console.log("CRITERIAAA")
    console.log(listCriteria)
    setListCriteria({ ...listCriteria, ...sortState });
  };
  useUpdateEffect(() => {
   
    setListCriteria({ ...listCriteria, programId, platformId, uuid });
  }, [programId, platformId, uuid]);

  return { role, declarations, hasMore, isLoading, loadMore: handleLoadMore, scrollRef, listCriteria, onSort };
};
