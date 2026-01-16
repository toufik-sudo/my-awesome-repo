import { VIEW_TYPE } from 'constants/api';
import { USER_PROGRAM_STATUS } from 'constants/api/userPrograms';
import { IPageable } from 'interfaces/api/IPageable';
import { ISortable } from 'interfaces/api/ISortable';

export interface IUserSeachFilters {
  program?: number;
  status?: USER_PROGRAM_STATUS[];
  notJoinedOrInvitedOnPrograms?: number[];
  peopleManager?: any;
}

export interface IUserSearchCriteria extends ISortable, IPageable {
  platform: number;
  search?: string;
  view: VIEW_TYPE;
  filters?: IUserSeachFilters;
}
