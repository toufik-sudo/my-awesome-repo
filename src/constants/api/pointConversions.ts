// -----------------------------------------------------------------------------
// Point Conversions Constants
// Migrated from old_app/src/constants/api/pointConversions.ts
// -----------------------------------------------------------------------------

import { DEFAULT_MAX_SIZE_REQUEST } from '@/constants/general';

export const DEFAULT_POINT_CONVERSIONS_SIZE = Object.freeze({ 
  offset: 0, 
  size: DEFAULT_MAX_SIZE_REQUEST 
});

export enum POINT_CONVERSION_STATUS {
  PENDING = 1,
  DONE = 2,
  DECLINED = 3
}
