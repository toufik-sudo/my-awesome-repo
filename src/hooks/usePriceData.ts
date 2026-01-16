import PlatformApi from 'api/PlatformApi';
import { IReturnUsePriceData } from 'interfaces/components/sections/IPricingPlansBlock';
import { TDynamicObject } from 'interfaces/IGeneral';
import { IStore } from 'interfaces/store/IStore';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { applyApiCall } from 'store/actions/generalActions';
import { setPricingData } from 'store/actions/landingActions';
import { getTransformedPricingData } from 'services/PricingPlanServices';
import { AnyAction, Dispatch } from 'redux';
import axios from 'axios';

const platformApi = new PlatformApi();

/**
 * Hook used to retrieve price data and return pricingData and loading boolean state
 */
export const usePriceData: (shouldFilter?: boolean) => IReturnUsePriceData = shouldFilter => {
  const [pricingData, setPricingInfo] = useState<TDynamicObject[]>([]);
  const dispatch = useDispatch();
  const isLoading = useSelector(state => (state as IStore).generalReducer.globalLoading);

  const getPricing: () => any = () => {
    return async (dispatch: Dispatch<AnyAction>) => {
      const data = await platformApi.getPlatformTypes();

      if (data) {
        dispatch(setPricingData(data));

        return getTransformedPricingData(data, shouldFilter);
      }
    };
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    applyApiCall<TDynamicObject[]>(dispatch(getPricing())).then(pricingData => {
      setPricingInfo(pricingData);
    });
    return()=>{
      source.cancel();
    }
  }, [dispatch, shouldFilter]);

  return { isLoading, pricingData };
};
