import { SORT_DIRECTION } from 'constants/api/sorting';

export interface ISortable {
  sortBy?: string;
  sortDirection?: SORT_DIRECTION;
}
