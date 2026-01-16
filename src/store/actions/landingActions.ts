import { IPriceObject } from 'interfaces/containers/ILandingPricingContainer';
import { SET_PRICING_DATA } from 'store/actions/actionTypes';

/**
 * Action adds to store payload(IPriceObject[])
 *
 * @param payload
 */
export const setPricingData = (payload: IPriceObject[]) => {
  return {
    type: SET_PRICING_DATA,
    payload
  };
};
