import { IPageable } from './IPageable';

export interface IUserRankingsSearch extends IPageable {
  platformId: number;
  programId?: number;
}
