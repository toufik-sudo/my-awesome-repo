import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import UserDeclarationApi from 'api/UserDeclarationsApi';
import { USER_DECLARATIONS_DEFAULT_SORT } from 'constants/api/declarations';
import { DEFAULT_OFFSET, DEFAULT_LIST_SIZE } from 'constants/api';
import { ISortable } from 'interfaces/api/ISortable';
import { setListSorting } from 'store/actions/userDeclarationActions';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { isUserAdmin, isUserHyperAdmin, isUserSuperAdmin } from 'services/security/accessServices';
import axios from 'axios';

const userDeclarationApi = new UserDeclarationApi();
/**
 * Hook used to load user declarations.
 * @param sortState
 */
const useUserDeclarationsData = (sortState: ISortable = {}) => {
  const [declarations, setDeclarations] = useState({ userDeclarations: [], hasMore: false });
  const [isLoading, setLoading] = useState(false);
  const [sort, setSort] = useState({ ...USER_DECLARATIONS_DEFAULT_SORT, ...sortState });
  const scrollRef = useRef<any>();
  const dispatch = useDispatch();
  const {
    selectedProgramId: programId,
    selectedPlatform: { id: platformId, role }
  } = useWallSelection();
  const isAdmin = isUserAdmin(role) || isUserSuperAdmin(role) || isUserHyperAdmin(role);

  const loadNextDeclarations = async (existingDeclarations: any[], sorting: ISortable, source?) => {
    const offset = existingDeclarations.length;
    const declarationsPage = await userDeclarationApi.getDeclarations({
      ...sorting,
      platformId,
      programId,
      offset,
      size: DEFAULT_LIST_SIZE
    }, source);

    return {
      userDeclarations: [...existingDeclarations, ...declarationsPage.userDeclarations],
      hasMore: offset + DEFAULT_LIST_SIZE < declarationsPage.total
    };
  };

  const handleLoadMore = async (page: number, sorting: ISortable, source?) => {
    setLoading(true);
    try {
      let existingDeclarations = declarations.userDeclarations;
      if (DEFAULT_OFFSET === page) {
        existingDeclarations = [];
      }
      const loaded = await loadNextDeclarations(existingDeclarations, sorting, source);
      setDeclarations(loaded);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(setListSorting(sort));
  }, [sort, dispatch]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    setDeclarations({ userDeclarations: [], hasMore: false });
    if (scrollRef.current) {
      scrollRef.current.pageLoaded = DEFAULT_OFFSET;
    }
    handleLoadMore(DEFAULT_OFFSET, sort, source);
    return()=>{
      source.cancel();
    }    
  }, [programId, platformId, sort]);

  return {
    ...declarations,
    isLoading,
    handleLoadMore,
    sort,
    onSort: setSort,
    scrollRef,
    isAdmin,
    programId,
    platformId
  };
};

export default useUserDeclarationsData;
