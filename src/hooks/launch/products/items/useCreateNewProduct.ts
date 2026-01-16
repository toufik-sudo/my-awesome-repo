import { useState } from 'react';

import usePlatformIdSelection from 'hooks/wall/slider/usePlatformIdSelection';
import { useCreateNewProductsImageUpload } from 'hooks/launch/products/items/useCreateNewProductsImageUpload';
import { createProductAction, uploadProductImage } from 'store/actions/launchActions';
import { processProductData } from 'services/LaunchServices';
import { useCreateProductValidation } from 'hooks/launch/products/items/useCreateProductValidation';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';

/**
 * Hook used to handle all create product logic
 */
export const useCreateNewProduct = () => {
  const [productCreated, setProductCreated] = useState(false);
  const [categoryIds, setCategoriesIds] = useState([]);
  const [productError, setProductError] = useState('');
  const [productName, setProductName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isProductDataValid, setProductDataValid] = useState(false);
  const platformId = usePlatformIdSelection();
  const { formatMessage } = useIntl();

  const {
    handleImageUpload,
    fileInputRef,
    previewImage,
    formDataImage,
    clearSelections
  } = useCreateNewProductsImageUpload(setProductError);

  useCreateProductValidation(setProductDataValid, formDataImage, productError, productName);

  const handleProductNameChange = e => {
    setProductName(e.target.value);
    if (productError === 'launchProgram.products.invalid.1015') {
      setProductError('');
    }
  };

  const createProduct = async () => {
    try{
      setSubmitting(true);
      const productId = await uploadProductImage(formDataImage, setProductError);
      const creationSuccess = await createProductAction(
        processProductData({ platformId, productName, productId, categoryIds }),
        setProductError,
        setProductCreated
        
      );
      if (creationSuccess) {
        clearSelections();
        setProductName('');
      }
      setSubmitting(false);
      toast(formatMessage({ id: 'launchProgram.products.productCreated' }));
    } catch(e){
      toast(formatMessage({ id: 'launchProgram.products.productError' }));
    }
  };

  return {
    handleProductNameChange,
    handleImageUpload,
    fileInputRef,
    previewImage,
    submitting,
    isProductDataValid,
    createProduct,
    productError,
    productName,
    setCategoriesIds,
    productCreated
  };
};
