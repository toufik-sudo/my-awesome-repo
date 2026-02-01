import { SORT_DIRECTION } from '@/constants/api/sorting';

interface ISortable {
  sortBy: string;
  sortDirection: SORT_DIRECTION;
}

export enum EMAIL_CAMPAIGNS_SORTING {
  ID = 'id',
  NAME = 'name',
  CREATED_AT = 'createdAt'
}

export enum SORTING_USER_LISTS {
  ID = 'id',
  NAME = 'name',
  CREATED_AT = 'createdAt'
}

export enum SORTING_CREATE_USER_LIST {
  ID = 'id',
  NAME = 'name',
  EMAIL = 'email'
}

export const DEFAULT_EMAIL_CAMPAIGNS_FILTER: ISortable = {
  sortBy: EMAIL_CAMPAIGNS_SORTING.ID,
  sortDirection: SORT_DIRECTION.DESC
};

export const DEFAULT_USER_LISTS_FILTER: ISortable = {
  sortBy: SORTING_USER_LISTS.CREATED_AT,
  sortDirection: SORT_DIRECTION.DESC
};
