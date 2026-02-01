// -----------------------------------------------------------------------------
// User Declaration Reducer
// Migrated from old_app/src/store/reducers/userDeclarationReducer.ts
// -----------------------------------------------------------------------------

import { AnyAction } from 'redux';
import { SET_USER_DECLARATION_LIST_SORTING } from '../actions/actionTypes';
import { IUserDeclarationReducer } from '@/types/store';
import { initialUserDeclarationState } from '../initialState/initialUserDeclarationState';

/**
 * User declaration reducer - handles updates to user declaration related state
 */
const userDeclarationReducer = (
  state: IUserDeclarationReducer = initialUserDeclarationState,
  { type, payload }: AnyAction
): IUserDeclarationReducer => {
  switch (type) {
    case SET_USER_DECLARATION_LIST_SORTING:
      return {
        ...state,
        listSorting: payload && { ...payload }
      };
    default:
      return state;
  }
};

export default userDeclarationReducer;
