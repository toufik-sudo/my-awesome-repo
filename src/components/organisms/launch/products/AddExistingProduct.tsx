import React from 'react';

import SelectDeselectAll from 'components/atoms/launch/products/SelectDeselectAll';
import AddExistingItems from 'components/molecules/launch/products/AddExistingItems';
import SelectedItemsOutput from 'components/molecules/launch/products/SelectedItemsOutput';
import { useCreateCategoryProductsList } from 'hooks/launch/products/category/useCreateCategoryProductsList';
import { useAlreadyCreatedProducts } from 'hooks/launch/products/items/useAlreadyCreatedProducts';

import style from 'assets/style/components/launch/Products.module.scss';

/**
 * Organism component used to render existing product
 *
 * @constructor
 */
const AddExistingProduct = () => {
  const { productListState } = useCreateCategoryProductsList();
  const [productList] = productListState;
  const {
    handleItemSelection,
    productIds,
    allSelected,
    handleMultipleSelections,
    filteredProducts
  } = useAlreadyCreatedProducts(productList);

  if (!productList.length) return null;

  return (
    <div className={style.addExistingProductsWrapper}>
      <SelectDeselectAll {...{ allSelected, handleMultipleSelections }} />
      <AddExistingItems
        {...{
          productList,
          handleItemSelection,
          productIds,
          isDisabledProducts:{}
        }}
      />
      <SelectedItemsOutput {...{ filteredItems: filteredProducts }} />
    </div>
  );
};

export default AddExistingProduct;
