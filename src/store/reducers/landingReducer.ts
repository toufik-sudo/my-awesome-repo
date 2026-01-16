import { ILandingReducer } from 'interfaces/store/IStore';
import { AnyAction } from 'redux';
import { initialLandingState } from 'store/initialState/initialLandingState';
import { SET_PRICING_DATA } from '../actions/actionTypes';

/**
 * Landing reducer -> manages landing page state
 *
 * @param state
 * @param action
 */
export default (state: ILandingReducer = initialLandingState, action: AnyAction) => {
  switch (action.type) {
    case SET_PRICING_DATA:
      return {
        ...state,
        pricingData: action.payload
      };
    default:
      return state;
  }
};
