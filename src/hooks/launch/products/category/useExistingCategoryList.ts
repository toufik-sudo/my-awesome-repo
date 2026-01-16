import { useEffect, useState } from 'react';

import { getCategoryAction } from 'store/actions/launchActions';
import { PRODUCTS_INITIAL_ITEMS } from 'constants/wall/launch';
import { useWallSelection } from 'hooks/wall/useWallSelection';

/**
 * Hook used to handle data coming from created products
 */
export const useExistingCategoryList = () => {
  const categoriesListState = useState<any>([]);
  const categoriesSizeState = useState(PRODUCTS_INITIAL_ITEMS);
  const { selectedPlatform } = useWallSelection();

  useEffect(() => {
    getCategoryAction(categoriesListState, selectedPlatform);
  }, [getCategoryAction]);

  return { categoriesListState, categoriesSizeState, selectedPlatform };
};
