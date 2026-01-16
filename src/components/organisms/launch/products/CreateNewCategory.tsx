import React from 'react';

import CreateNewInputField from 'components/atoms/launch/products/CreateNewInputField';
import CreateNewCategoryProductsList from 'components/molecules/launch/products/CreateNewCategoryProductsList';
import CreateProductCTA from 'components/atoms/launch/products/CreateProductCTA';
import CreateNewProductNotice from 'components/molecules/launch/products/CreateNewProductNotice';
import { useCreateNewCategory } from 'hooks/launch/products/category/useCreateNewCategory';

import style from 'assets/style/components/launch/Products.module.scss';

/**
 * Organism component used to render create new products box
 *
 * @constructor
 */
const CreateNewCategory = () => {
  const { createCategoryWrapper, createCategoryControls, createCategoryNotice, createCategoryControlsSubmit } = style;
  const {
    handleItemSelection,
    handleCategoryNameChange,
    submitting,
    isCategoryDataValid,
    categoryName,
    selectedItemCategories,
    handleCategoryCreation,
    productError,
    productCreated
  } = useCreateNewCategory();

  return (
    <div className={createCategoryWrapper}>
      <div className={createCategoryControls}>
        <CreateNewInputField onChange={handleCategoryNameChange} value={categoryName} type="category" />
        <div className={createCategoryControlsSubmit}>
          <CreateProductCTA onClick={handleCategoryCreation} {...{ isValid: isCategoryDataValid && selectedItemCategories.length > 0, submitting }} />
        </div>
        <CreateNewProductNotice {...{ productError, productCreated }} className={createCategoryNotice} />
      </div>
      <CreateNewCategoryProductsList {...{ handleItemSelection, selectedItemCategories }} />
    </div>
  );
};

export default CreateNewCategory;
