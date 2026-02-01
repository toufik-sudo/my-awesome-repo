import { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { IDeclaration, ISortable, SortDirection, DeclarationSorting } from '../types';
import { DECLARATIONS_DEFAULT_SORT, DEFAULT_DECLARATIONS_PAGE_SIZE } from '../constants';
import {
  setDeclarations,
  appendDeclarations,
  setLoading,
  setHasMore,
  setTotal,
  setListSorting,
  resetDeclarations,
} from '../store/declarationsReducer';
import type { RootState } from '@/store';
import UserDeclarationsApi from '@/api/UserDeclarationsApi';
import { useWallSelection } from '@/features/wall/hooks/useWallSelection';

const userDeclarationsApi = new UserDeclarationsApi();

interface UseDeclarationsListOptions {
  platformId?: number;
  programId?: number;
  uuid?: string;
  isBeneficiary?: boolean;
}

/**
 * Hook for managing declarations list with pagination and sorting
 * Fetches real data from the backend API
 */
export const useDeclarationsList = (options: UseDeclarationsListOptions = {}) => {
  const dispatch = useDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const cancelTokenRef = useRef<ReturnType<typeof axios.CancelToken.source> | null>(null);

  const { declarations, isLoading, hasMore, total, listSorting } = useSelector(
    (state: RootState) => state.declarations
  );

  // Get selected platform and program from wall selection
  const { selectedPlatform, selectedProgramId } = useWallSelection();

  const platformId = options.platformId ?? selectedPlatform?.id;
  const programId = options.programId ?? selectedProgramId;

  const sort = listSorting || DECLARATIONS_DEFAULT_SORT;

  const loadDeclarations = useCallback(
    async (page: number = 0, sorting: ISortable = sort) => {
      if (localLoading) return;

      // Cancel any pending request
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Operation cancelled due to new request');
      }
      cancelTokenRef.current = axios.CancelToken.source();

      setLocalLoading(true);
      dispatch(setLoading(true));

      try {
        const offset = page * DEFAULT_DECLARATIONS_PAGE_SIZE;

        const response = await userDeclarationsApi.getDeclarations(
          {
            platformId,
            programId,
            uuid: options.uuid,
            offset,
            size: DEFAULT_DECLARATIONS_PAGE_SIZE,
            sortBy: sorting.sortBy || DeclarationSorting.OCCURRED_ON,
            sortDirection: sorting.sortDirection === SortDirection.ASC ? 'ASC' : 'DESC',
          },
          cancelTokenRef.current
        );

        // Map API response to IDeclaration format
        const apiDeclarations: IDeclaration[] = (response.userDeclarations || []).map((d: any) => ({
          id: d.id,
          programId: d.program?.id || d.programId,
          programName: d.program?.name || d.programName,
          programType: d.program?.type || d.programType,
          dateOfEvent: d.dateOfEvent,
          quantity: d.quantity || 0,
          amount: d.amount || 0,
          status: d.status,
          source: d.source,
          hash: d.hash, // Include hash for validation API
          firstName: d.firstName,
          lastName: d.lastName,
          companyName: d.companyName,
          productName: d.product?.name || d.otherProductName,
          productId: d.product?.id,
          validatedBy: d.validatedBy
            ? `${d.validatedBy.firstName || ''} ${d.validatedBy.lastName || ''}`.trim()
            : undefined,
          user: d.user,
          product: d.product,
          otherProductName: d.otherProductName,
        }));

        if (page === 0) {
          dispatch(setDeclarations(apiDeclarations));
        } else {
          dispatch(appendDeclarations(apiDeclarations));
        }

        const totalCount = response.total || 0;
        dispatch(setTotal(totalCount));
        dispatch(setHasMore(offset + apiDeclarations.length < totalCount));
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Failed to load declarations:', error);
        }
      } finally {
        setLocalLoading(false);
        dispatch(setLoading(false));
      }
    },
    [dispatch, sort, localLoading, platformId, programId, options.uuid]
  );

  const handleSort = useCallback(
    (newSort: ISortable) => {
      dispatch(setListSorting(newSort));
      dispatch(resetDeclarations());
      loadDeclarations(0, newSort);
    },
    [dispatch, loadDeclarations]
  );

  const handleLoadMore = useCallback(
    (page: number) => {
      if (!isLoading && hasMore) {
        loadDeclarations(page, sort);
      }
    },
    [isLoading, hasMore, loadDeclarations, sort]
  );

  const refresh = useCallback(() => {
    dispatch(resetDeclarations());
    loadDeclarations(0, sort);
  }, [dispatch, loadDeclarations, sort]);

  // Initial load when platformId is available
  useEffect(() => {
    if (platformId) {
      loadDeclarations(0);
    }

    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Component unmounted');
      }
    };
  }, [platformId, programId]);

  return {
    declarations,
    isLoading: isLoading || localLoading,
    hasMore,
    total,
    sort,
    scrollRef,
    handleSort,
    handleLoadMore,
    refresh,
  };
};

export default useDeclarationsList;
