import { SORTING_USER_LISTS } from '@/constants/api/communications';
import { SORT_DIRECTION } from '@/constants/api/sorting';

interface ISortable {
  sortBy: string;
  sortDirection: SORT_DIRECTION;
}

export const USER_LIST_DEFAULT_FILTER: ISortable = {
  sortBy: SORTING_USER_LISTS.CREATED_AT,
  sortDirection: SORT_DIRECTION.DESC
};
