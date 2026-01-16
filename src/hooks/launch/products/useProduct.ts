import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useCreateCategoryProductsList } from 'hooks/launch/products/category/useCreateCategoryProductsList';
import { BASE_GOAL_VALUE, CUBE, PRODUCTS_TABS_STEPS } from 'constants/wall/launch';
import { useMultiStep } from 'hooks/launch/useMultiStep';
import { IStore } from 'interfaces/store/IStore';
import { setLaunchDataStep } from 'store/actions/launchActions';
import { useUpdateEffect } from 'hooks/general/useUpdateEffect';

/**
 * Hook used to handle product wrapper logic
 */
export const useProduct = () => {
  const dispatch = useDispatch();
  const { cube } = useSelector((store: IStore) => store.launchReducer);
  const [currentStep, setCurrentStep] = useState(PRODUCTS_TABS_STEPS.CREATE_NEW_PRODUCT);
  const handleTabChange = index => setCurrentStep(index);
  const { productListState } = useCreateCategoryProductsList();
  const [nextButtonAvailable, setNextButtonAvailable] = useState(false);
  const [tabsLoading, setTabsLoading] = useState(false);
  const [productList] = productListState;
  const { categoryIds, productIds } = useSelector((store: IStore) => store.launchReducer);
  const {
    stepSet: { setNextStep }
  } = useMultiStep();

  useEffect(() => {
    if (productList) {
      setTabsLoading(true);
    }
  }, [productList]);

  useEffect(() => {
    setNextButtonAvailable((productIds && productIds.length) || (categoryIds && categoryIds.length));
  }, [productIds, categoryIds]);

  useEffect(() => {
    if (productList && productList.length) {
      setCurrentStep(PRODUCTS_TABS_STEPS.ADD_EXISTING_PRODUCT);
    }
  }, [productList]);

  useUpdateEffect(() => {
    const updatedCube = cube;
    updatedCube.goals = [{ ...BASE_GOAL_VALUE, validated: { ...BASE_GOAL_VALUE.validated } }];
    dispatch(setLaunchDataStep({ key: CUBE, value: updatedCube }));
  }, [productIds, categoryIds]);

  const handleProductNextStep = () => {
    if (nextButtonAvailable) {
      setNextStep();
    }
  };

  return {
    handleTabChange,
    currentStep,
    handleProductNextStep,
    nextButtonAvailable,
    tabsLoading
  };
};
