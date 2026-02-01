// -----------------------------------------------------------------------------
// Landing Actions
// Migrated from old_app/src/store/actions/landingActions.ts
// -----------------------------------------------------------------------------

import { SET_PRICING_DATA } from './actionTypes';
import { IPriceObject } from '@/types/store';

/**
 * Set pricing data for landing page
 */
export const setPricingData = (payload: IPriceObject[]) => ({
  type: SET_PRICING_DATA,
  payload
});
