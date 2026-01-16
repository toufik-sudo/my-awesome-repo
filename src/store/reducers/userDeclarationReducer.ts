import { AnyAction } from 'redux';

import { IUserDeclarationReducer } from 'interfaces/store/IStore';
import { initialUserDeclarationState } from 'store/initialState/initialUserDeclarationState';
import { SET_USER_DECLARATION_LIST_SORTING } from 'store/actions/actionTypes';

/**
 * Reducer for handling updates to user delclaration related state
 *
 * @param state
 * @param action
 */
export default (state: IUserDeclarationReducer = initialUserDeclarationState, { type, payload }: AnyAction) => {
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
