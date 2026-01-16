import { IntlShape } from 'react-intl';
import { MessageFormatElement } from 'intl-messageformat-parser';
import { ReactElement } from 'react';
import { IPageableResult } from './IPageableResult';

export interface IArrayKey<Value> {
  [key: string]: Value;
}

export interface ExtendedNavigator extends Navigator {
  userLanguage: string;
}

export type TDynamicObject = IArrayKey<any>;
export type TDynamicType = boolean | number | null | string | ReactElement;

export interface IReactIntlProps {
  intl: IntlShape;
}

export type IReactIntl = Record<string, string> | Record<string, MessageFormatElement[]>;

export interface IAnimationProps {
  children: ReactElement;
  className?: string;
  settings: any;
  disable?: boolean;
}

export interface LaunchProgramButtonProps {
  textId?: string;
  action?: void;
  className?: string;
  buttons?: any;
  sectionText: string;
  imgFile: number | string;
  extraClass?: string;
  programType?: boolean;
}

export interface IInfiniteScrollLoaderProps {
  loadMore: (listCriteria: any) => Promise<IPageableResult<any>>;
  initialListCriteria?: any;
  pageSize?: number;
  onErrorMessageId?: string;
  mutateEntries?: any;
}
