import { IPageable } from './IPageable';
import { ISortable } from './ISortable';

export interface IUserProgramsSearchCriteria extends ISortable, IPageable {
  platformId?: number;
  uuid: string;
  filterStatus?: number;
  filterRole?: number;
  filterProgramType?: number;
  programsSize?: number;
  programsOffset?: number;
}
