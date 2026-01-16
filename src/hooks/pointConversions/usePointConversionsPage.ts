import PointConversionsApi from 'api/PointConversionsApi';
import { POINT_CONVERSIONS_DEFAULT_SORT } from 'constants/api/declarations';
import { DEFAULT_MAX_SIZE_REQUEST, DEFAULT_POINT_CONVERSION_STATUS_DONE } from 'constants/general';
import useInfiniteScrollLoader from 'hooks/general/useInfiniteScrollLoader';

const pointConversionsApi = new PointConversionsApi();
/**
 * Hook used for rendering the point conversions
 */
export const usePointConversionsPage = () => {
  const loadMore = async () => {
    const { pointsConversions: entries, total } = await pointConversionsApi.getPointConversions();

    return { entries, total };
  };
  const mutate = (setEntries, { id }) => {
    setEntries(state => {
      return {
        hasMore: state.hasMore,
        entries: state.entries.map(pointConversion => {
          if (id == pointConversion.id) {
            pointConversion.status = DEFAULT_POINT_CONVERSION_STATUS_DONE;
          }
          return pointConversion;
        })
      };
    });
  };
  const {
    entries: pointsConversions,
    hasMore,
    isLoading,
    handleLoadMore,
    scrollRef,
    listCriteria,
    setListCriteria,
    onMutateEntries
  } = useInfiniteScrollLoader({
    loadMore,
    pageSize: DEFAULT_MAX_SIZE_REQUEST,
    ...POINT_CONVERSIONS_DEFAULT_SORT,
    mutateEntries: mutate
  });

  const onSort = sortState => {
    setListCriteria({ ...listCriteria, ...sortState });
  };

  return {
    pointsConversions,
    hasMore,
    isLoading,
    loadMore: handleLoadMore,
    scrollRef,
    listCriteria,
    onSort,
    onValidateSuccess: onMutateEntries
  };
};
