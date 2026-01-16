import { useEffect, useState } from 'react';

import { getProductsAction } from 'store/actions/launchActions';
import { useWallSelection } from 'hooks/wall/useWallSelection';

/**
 * Hook used to handle data from created products
 */
export const useCreateCategoryProductsList = () => {
  const productListState = useState<any>(false);
  const { selectedPlatform } = useWallSelection();

  useEffect(() => {
    getProductsAction(productListState, selectedPlatform);
  }, [getProductsAction, selectedPlatform]);

  return { productListState };
};
