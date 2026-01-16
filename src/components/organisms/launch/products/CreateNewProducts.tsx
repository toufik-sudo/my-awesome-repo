import React from 'react';

import CreateNewProductNotice from 'components/molecules/launch/products/CreateNewProductNotice';
import CreateNewProductImageUpload from 'components/atoms/launch/products/CreateNewProductImageUpload';
import CreateNewProductCategories from 'components/molecules/launch/products/CreateNewProductCategories';
import CreateProductCTA from 'components/atoms/launch/products/CreateProductCTA';
import CreateNewInputField from 'components/atoms/launch/products/CreateNewInputField';
import SizeLabelInformation from 'components/molecules/launch/products/SizeLabelInformation';
import { useCreateNewProduct } from 'hooks/launch/products/items/useCreateNewProduct';

import style from 'assets/style/components/launch/Products.module.scss';

/**
 * Organism component used to render create new products box
 *
 * @constructor
 */
const CreateNewProducts = () => {
  const { createProductBox, createProductWrapper } = style;
  const {
    createProduct,
    isProductDataValid,
    submitting,
    fileInputRef,
    previewImage,
    handleImageUpload,
    handleProductNameChange,
    productError,
    productName,
    setCategoriesIds,
    productCreated
  } = useCreateNewProduct();

  return (
    <div className={createProductWrapper}>
      <div style={{ backgroundImage: previewImage && `url(${previewImage})` }} className={createProductBox}>
        {/* <CreateNewProductNotice {...{ productError, productCreated }} /> */}
        <CreateNewProductImageUpload {...{ handleImageUpload, productError, previewImage, fileInputRef }} />
        <CreateNewInputField {...{ onChange: handleProductNameChange, value: productName }} type="product" />
        <CreateNewProductCategories {...{ setCategoriesIds }} />
        <CreateProductCTA {...{ isValid: isProductDataValid, submitting, onClick: createProduct }} />
      </div>
      <SizeLabelInformation />
    </div>
  );
};

export default CreateNewProducts;
