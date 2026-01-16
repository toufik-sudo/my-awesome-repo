import { ISortable } from 'interfaces/api/ISortable';
import { SORTING_USER_LISTS } from 'constants/api/communications';
import { SORT_DIRECTION } from 'constants/api/sorting';

export const USER_LIST_DEFAULT_FILTER: ISortable = {
  sortBy: SORTING_USER_LISTS.CREATED_AT,
  sortDirection: SORT_DIRECTION.DESC
};
