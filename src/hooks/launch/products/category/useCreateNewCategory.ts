import { useState } from 'react';

import usePlatformIdSelection from 'hooks/wall/slider/usePlatformIdSelection';
import { useCreateCategoryValidation } from 'hooks/launch/products/useCreateCategoryValidation';
import { createNewCategory } from 'store/actions/launchActions';

/**
 *  Hook used to handle all create new category logic
 */
export const useCreateNewCategory = () => {
  const [productCreated, setProductCreated] = useState(false);
  const [productError, setProductError] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [selectedItemCategories, setSelectedItemCategories] = useState([]);
  const [isCategoryDataValid, setCategoryDataValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const platformId = usePlatformIdSelection();

  useCreateCategoryValidation(setCategoryDataValid, categoryName);

  const handleItemSelection = id => {
    if (!selectedItemCategories.includes(id)) {
      return setSelectedItemCategories([...selectedItemCategories, id]);
    }

    return setSelectedItemCategories(selectedItemCategories.filter(item => item !== id));
  };

  const handleCategoryNameChange = e => setCategoryName(e.target.value);
  const handleCategoryCreation = async () => {
    setProductError('');
    setSubmitting(true);
    setProductCreated(false);
    const creationSuccess = await createNewCategory(
      { platformId, categories: [{ productIds: selectedItemCategories, name: categoryName }] },
      setProductError,
      setProductCreated
    );
    if (creationSuccess) {
      setSelectedItemCategories([]);
      setCategoryName('');
    }
    setSubmitting(false);
  };

  return {
    isCategoryDataValid,
    submitting,
    handleCategoryNameChange,
    handleItemSelection,
    handleCategoryCreation,
    categoryName,
    selectedItemCategories,
    productError,
    productCreated
  };
};
