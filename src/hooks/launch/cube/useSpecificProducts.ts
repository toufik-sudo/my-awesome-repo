/* eslint-disable quotes */
import { useDispatch, useSelector } from 'react-redux';

import { IStore } from 'interfaces/store/IStore';
import { setLaunchDataStep } from 'store/actions/launchActions';
import { CUBE, CUBE_SECTIONS, SIMPLIFIED_CUBE_TYPE } from 'constants/wall/launch';
import {
  getUniqueFullProducts,
  getUniqueSelectedIds,
  getValidForSpecificProducts,
  processProductIdsGoal
} from 'services/CubeServices';
import { useCubeSectionValidation } from 'hooks/launch/cube/useCubeSectionValidation';

/**
 * Hook used to handle logic for specific products cube section
 * @param index
 * @param specificProducts
 */
export const useSpecificProducts = (index, specificProducts) => {
  const dispatch = useDispatch();
  const { fullProducts, fullCategoriesProducts, cube, personaliseProducts } = useSelector(
    (store: IStore) => store.launchReducer
  );

  const combinedFullProducts = [...(fullProducts || []), ...(fullCategoriesProducts || [])];
  const uniqueSelectedIds = getUniqueSelectedIds(combinedFullProducts);
  const uniqueFullProducts = getUniqueFullProducts(uniqueSelectedIds, combinedFullProducts);
  const validateAvailable = getValidForSpecificProducts(specificProducts, cube, index);
  const handleCubeItemSelection = newProductId => {
    const updatedProductsIds = processProductIdsGoal(cube, index, newProductId);
    const updatedGoals = cube.goals;
    updatedGoals[index].productIds = updatedProductsIds;
    dispatch(setLaunchDataStep({ key: CUBE, value: { ...cube, goals: updatedGoals } }));
  };
  const { handleItemValidation } = useCubeSectionValidation(index);

  const handleSpecificProductsValidation = target => {
    handleItemValidation(target);
    const updatedGoals = cube.goals;
    updatedGoals[index][CUBE_SECTIONS.MEASUREMENT_TYPE] = null;
    updatedGoals[index].validated[CUBE_SECTIONS.MEASUREMENT_TYPE] = false;
    updatedGoals[index].validated[CUBE_SECTIONS.ALLOCATION_TYPE] = false;
    updatedGoals[index].main = {
      [SIMPLIFIED_CUBE_TYPE.MIN]: '',
      [SIMPLIFIED_CUBE_TYPE.MAX]: '',
      [SIMPLIFIED_CUBE_TYPE.VALUE]: ''
    };
    dispatch(setLaunchDataStep({ key: CUBE, value: { ...cube, goals: updatedGoals } }));
  };

  const isDisabledProducts: any = {};
  let isAllProductsDisabled: boolean = false;
  let isGenericProductsDisabled: boolean = false;

  const setSpecificProducts = (previousGoals) => {
    // const currentGoal = cube.goals[index];
    isAllProductsDisabled = true;
    if (uniqueFullProducts?.length) {
      uniqueFullProducts.forEach(product => {
        const existProduct = previousGoals.some(goal => goal.specificProducts && goal.productIds.indexOf(product.id) >= 0);
        // if (
        //   cube.goals[1]?.specificProducts &&
        //   cube.goals[1]?.productIds.indexOf(product.id) >= 0 &&
        //   cube.goals[0]?.specificProducts &&
        //   cube.goals[0]?.productIds.indexOf(product.id) >= 0 &&
        //   cube.goals[1]?.measurementType != cube.goals[0]?.measurementType
        // ) {
        //   isDisabledProducts[product.id] = true;
        // }
        if (
            existProduct
        ) {
          isDisabledProducts[product.id] = true;
        } else {
          isAllProductsDisabled = false;
        }
      });
    }
  };

  if (index >= 1) {
    const previousGoals = cube.goals?.filter((goal, i) => i < index);
    isGenericProductsDisabled = previousGoals?.some(goal => !goal.specificProducts);
    setSpecificProducts(previousGoals);
  }

  return {
    personaliseProducts,
    validateAvailable,
    handleCubeItemSelection,
    handleSpecificProductsValidation,
    uniqueFullProducts,
    isDisabledProducts,
    isAllProductsDisabled,
    isGenericProductsDisabled
  };
};
