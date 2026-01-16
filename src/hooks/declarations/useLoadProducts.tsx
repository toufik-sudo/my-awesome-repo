import useInfiniteScrollLoader from 'hooks/general/useInfiniteScrollLoader';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { useUpdateEffect } from 'hooks/general/useUpdateEffect';
import ProductsApi from 'api/ProductsApi';

const productsApi = new ProductsApi();
/**
 * Hook used for rendering the beneficiary declarations
 */
export const useLoadProducts = program => {
  const {
    selectedPlatform: { role, id: platform }
  } = useWallSelection();

  const initialListCriteria = { platform, program };

  const loadMore = async criteria => {
    const { products: entries, total } = await productsApi.getProducts(criteria);

    return { entries, total };
  };

  const {
    entries: products,
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

  useUpdateEffect(() => {
    setListCriteria({ ...listCriteria, program, platform });
  }, [program, platform]);

  return { role, products, hasMore, isLoading, loadMore: handleLoadMore, scrollRef };
};
