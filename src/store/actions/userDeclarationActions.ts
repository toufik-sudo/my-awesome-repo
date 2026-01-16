import { SET_USER_DECLARATION_LIST_SORTING } from 'store/actions/actionTypes';
import { ISortable } from 'interfaces/api/ISortable';

/**
 * Action for setting the sorting state of the user declaration list
 *
 * @param sorting
 */
export const setListSorting = (sorting: ISortable) => {
  return {
    type: SET_USER_DECLARATION_LIST_SORTING,
    payload: sorting
  };
};
