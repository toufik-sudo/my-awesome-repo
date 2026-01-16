import { useContext, useMemo, useState } from 'react';
import { CreateDeclarationContext } from 'components/organisms/form-wrappers/CreateUserDeclarationFormWrapper';
import { buildLabelValue } from 'services/FormServices';

/**
 * Hooks used for handling the available product options of the current selected program
 * @param values
 * @param setErrors
 * @param errors
 * @param setFieldTouched
 * @param setValues
 * @param label
 */
export const useDeclarationProductFieldData = (
  { values, setErrors, errors, setFieldTouched, setValues },
  field,
  setMeasurementName = null
) => {
  const { products, cube } = useContext(CreateDeclarationContext);
  const [reloadKey, setReloadKey] = useState(0);
  const hasNoSpecificGoals = cube.goals.every(goal => !goal.productIds || !goal.productIds.length);
  const hasOnlySpecificGoals = cube.goals.every(goal => goal.productIds && goal.productIds.length);
  const hasMixedData = !hasNoSpecificGoals && !hasOnlySpecificGoals;
 
  const filteredProducts = products.filter(product =>
    cube.goals.some(goal => goal.productIds.includes(product.id))
  );

  const currentProducts = useMemo(() => filteredProducts.map(buildLabelValue()), [products]);
  const { productName } = values;
  const [isPlainText, setIsPlainTextState] = useState(hasNoSpecificGoals);

  const selectedProductOption = useMemo(() => {
    if (isPlainText) return productName.otherProductName || '';
    return currentProducts.find(({ value: id }) => productName.productId && id === productName.productId);
  }, [currentProducts, productName, isPlainText]);

  
  

  const setIsPlainText = bool => {
    setValues({ ...values, productName: {} });
    setReloadKey(reloadKey + 1);
    setIsPlainTextState(bool);
  };

  const setProductData = productName => {
    let selectedGoal = null;
    if (productName.productId) {
      selectedGoal = cube.goals.find(goal => goal.productIds && goal.productIds.includes(productName.productId));
    } else {
      selectedGoal = cube.goals.find(goal => !goal.productIds ||  goal.productIds?.length == 0);
    }
    const ms = selectedGoal ? selectedGoal.measurementName : null;
    // console.log("HADA MIZUREMENT :", measurementName)
    // field.measurementName = ms;
    setMeasurementName(ms);    
    setFieldTouched(field.label);
    setErrors({ ...errors, productName: !selectedProductOption });
    setValues({ ...values, productName });
  };

  return {
    hasOnlySpecificGoals,
    hasMixedData,
    currentProducts,
    isPlainText,
    selectedProductOption,
    reloadKey,
    setIsPlainText,
    setProductData
  };
};
