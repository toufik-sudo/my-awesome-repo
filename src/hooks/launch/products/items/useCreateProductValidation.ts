import { useEffect } from 'react';

/**
 * Hook used to handle submit validation on create new product
 *
 * @param setProductDataValid
 * @param formDataImage
 * @param productError
 * @param productName
 */
export const useCreateProductValidation = (setProductDataValid, formDataImage, productError, productName) => {
  useEffect(() => {
    setProductDataValid(true);
    if (!formDataImage || productError || !productName.trim().length) {
      setProductDataValid(false);
    }
  }, [formDataImage, productError, productName]);
};
