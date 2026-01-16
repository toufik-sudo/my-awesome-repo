import { IPageable } from 'interfaces/api/IPageable';
import { ISortable } from 'interfaces/api/ISortable';

export interface IUserDeclarationSearchCriteria extends ISortable, IPageable {
  platformId: number;
  programId?: number;
  uuid?: string;
}
