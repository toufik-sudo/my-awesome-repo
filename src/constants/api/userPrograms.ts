import { ISortable } from 'interfaces/api/ISortable';
import { SORT_DIRECTION } from 'constants/api/sorting';

export const DEFAULT_PROGRAMS_QUERY = Object.freeze({ programsSize: 100000 });
export const DEFAULT_ADMIN_PLATFORMS_QUERY = Object.freeze({ platformsSize: 200 });

export const DEFAULT_USERS_LIST_SIZE = 20;

export enum USER_PROGRAM_STATUS {
  ACTIVE = 1,
  INACTIVE = 2,
  BLOCKED = 3,
  PENDING = 4,
  REJECTED = 5
}

export enum PROGRAM_USERS_SORTING {
  FIRST_NAME = 'firstName',
  NAME = 'lastName',
  DATE = 'createdAt',
  STATUS = 'status',
  EMAIL = 'email',
  RANK = 'ranking'
}

export const USERS_DEFAULT_SORTING: ISortable = Object.freeze({
  sortBy: PROGRAM_USERS_SORTING.FIRST_NAME,
  sortDirection: SORT_DIRECTION.ASC
});

export const PROGRAM_DETAILS_STATUS_ACTIVE = 'Active';
export const PROGRAM_DETAILS_STATUS_BLOCKED = 'Blocked';
export const PROGRAM_DETAILS_STATUS_PENDING = 'Pending';
export const VISITED_WALL = 'visited_wall';
export const PROGRAM_ONGOING = 1;
export const PROGRAM_CLOSING = 2;
export const PROGRAM_FINISHED = 3;

export const PROGRAM_JOIN_PENDING = 'pending';
export const PROGRAM_DETAILS_JOINED = 'joined';
const PROGRAM_DETAILS_DECLINED = 'declined';
export const PROGRAM_DETAILS_BLOCKED = 'blocked';
export const PROGRAM_DETAILS_INVITED = 'invited';

export const USER_PROGRAM_STATUSES = {
  [PROGRAM_DETAILS_JOINED]: PROGRAM_DETAILS_STATUS_ACTIVE,
  [PROGRAM_DETAILS_DECLINED]: PROGRAM_DETAILS_STATUS_BLOCKED,
  [PROGRAM_JOIN_PENDING]: PROGRAM_DETAILS_STATUS_PENDING,
  [PROGRAM_DETAILS_INVITED]: PROGRAM_DETAILS_STATUS_PENDING,
  [PROGRAM_DETAILS_BLOCKED]: PROGRAM_DETAILS_STATUS_BLOCKED
};

export const USER_STATUS_MANAGER = 'Manager';
export const USER_STATUS_USER = 'User';

export enum PROGRAM_JOIN_OPERATION {
  ACCEPT = 'accept',
  REJECT = 'reject'
}

export enum PROGRAM_INVITATION_OPERATION {
  ACCEPT = 'join',
  DECLINE = 'decline'
}

export const NO_MANAGER_ASSIGNED_FILTER = 0;

export const ERROR_CODES = Object.freeze({
  MANAGE_USER_NOT_FOUND: 1005,
  MANAGE_USER_ALREADY_ASSIGNED: 1033
});
