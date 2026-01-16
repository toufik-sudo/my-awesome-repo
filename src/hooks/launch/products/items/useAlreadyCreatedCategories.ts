import { useDispatch, useSelector } from 'react-redux';

import { handleFullItemsCategoryStore } from 'store/actions/launchActions';
import { IStore } from 'interfaces/store/IStore';

/**
 * Hook used to handle already created items logic
 */
export const useAlreadyCreatedCategories = categoriesListState => {
  const dispatch = useDispatch();
  const { categoryIds } = useSelector((store: IStore) => store.launchReducer);
  const handleItemSelection = product =>
    handleFullItemsCategoryStore(product, dispatch, categoryIds, categoriesListState[0]);

  return { handleItemSelection, categoryIds };
};
