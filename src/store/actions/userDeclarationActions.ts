// -----------------------------------------------------------------------------
// User Declaration Actions
// Migrated from old_app/src/store/actions/userDeclarationActions.ts
// -----------------------------------------------------------------------------

import { SET_USER_DECLARATION_LIST_SORTING } from './actionTypes';
import { ISortable } from '@/features/declarations/types';

/**
 * Set user declaration list sorting
 */
export const setUserDeclarationListSorting = (payload: ISortable | undefined) => ({
  type: SET_USER_DECLARATION_LIST_SORTING,
  payload
});
