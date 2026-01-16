import React from 'react';

import CreateNewCategoryItem from 'components/molecules/launch/products/CreateNewCategoryItem';
import Loading from 'components/atoms/ui/Loading';
import { useCreateCategoryProductsList } from 'hooks/launch/products/category/useCreateCategoryProductsList';
import { LOADER_TYPE } from 'constants/general';

import style from 'assets/style/components/launch/Products.module.scss';

/**
 * Molecule component used to render create new category list
 *
 * @param handleItemSelection
 * @param selectedItemCategories
 * @constructor
 */
const CreateNewCategoryProductsList = ({ handleItemSelection, selectedItemCategories }) => {
  const { productListState } = useCreateCategoryProductsList();
  const [productList] = productListState;

  if (!productList.length) return <Loading type={LOADER_TYPE.CATEGORY} />;

  return (
    <div className={style.itemsScrollView}>
      <>
        {productList.map(({ name, id, picturePath }) => (
          <CreateNewCategoryItem key={id} {...{ id, name, picturePath, handleItemSelection, selectedItemCategories }} />
        ))}
      </>
    </div>
  );
};

export default CreateNewCategoryProductsList;
