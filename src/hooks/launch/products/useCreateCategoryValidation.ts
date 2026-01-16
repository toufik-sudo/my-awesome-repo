import { useEffect } from 'react';

/**
 * Hook used to handle submit validation on create new category
 *
 * @param setCategoryDataValid
 * @param categoryName
 */
export const useCreateCategoryValidation = (setCategoryDataValid, categoryName) => {
  useEffect(() => {
    setCategoryDataValid(true);
    if (!categoryName || categoryName && (categoryName.trim().length == 0 || categoryName.trim() == '') ) {
      setCategoryDataValid(false);
    }
  }, [categoryName]);
};
