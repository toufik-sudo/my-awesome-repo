import { IPageable } from 'interfaces/api/IPageable';
import { POST_VIEW_TYPE, POST_TYPE } from 'constants/wall/posts';

export interface IPostSearchCriteria extends IPageable {
  platform: number;
  program?: number;
  view: POST_VIEW_TYPE;
  type: POST_TYPE;
  startDate: Date;
  endDate: Date;
}
