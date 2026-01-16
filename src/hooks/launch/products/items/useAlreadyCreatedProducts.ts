import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { handleFullItemSetStore, handleItemMultipleSelectionAction } from 'store/actions/launchActions';
import { IStore } from 'interfaces/store/IStore';

/**
 * Hook used to handle already created items logic
 */
export const useAlreadyCreatedProducts = productList => {
  const dispatch = useDispatch();
  const { productIds } = useSelector((store: IStore) => store.launchReducer);
  const [allSelected, setAllSelected] = useState(false);
  const handleItemSelection = product => handleFullItemSetStore(product, dispatch, productIds, productList);
  const handleMultipleSelections = () => handleItemMultipleSelectionAction(productList, allSelected, dispatch);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (productIds && productIds.length === productList.length) {
      return setAllSelected(true);
    }
    setAllSelected(false);
  }, [productIds, productList]);

  useEffect(() => {
    if (productList && productIds) {
      setFilteredProducts(productList.filter(product => productIds.includes(product.id)));
    }
  }, [productIds, productList]);

  useEffect(() => {
    setAllSelected(productIds && productIds.length !== productList.length);
  }, []);

  return {
    handleItemSelection,
    productIds,
    handleMultipleSelections,
    allSelected,
    filteredProducts
  };
};
