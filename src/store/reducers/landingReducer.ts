// -----------------------------------------------------------------------------
// Landing Reducer
// Migrated from old_app/src/store/reducers/landingReducer.ts
// -----------------------------------------------------------------------------

import { AnyAction } from 'redux';
import { SET_PRICING_DATA } from '../actions/actionTypes';
import { ILandingReducer } from '@/types/store';
import { initialLandingState } from '../initialState/initialLandingState';

/**
 * Landing reducer - manages landing page state
 */
const landingReducer = (
  state: ILandingReducer = initialLandingState,
  action: AnyAction
): ILandingReducer => {
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

export default landingReducer;
