import { ReactElement } from 'react';
import { IntlShape } from 'react-intl';
import type { IPageableResult } from './api/IPageableResult';

/**
 * Generic key-value interface
 */
export interface IArrayKey<Value> {
  [key: string]: Value;
}

/**
 * Extended Navigator interface with userLanguage support
 */
export interface ExtendedNavigator extends Navigator {
  userLanguage: string;
}

/**
 * Dynamic object type alias
 */
export type TDynamicObject = IArrayKey<any>;

/**
 * Union of primitive types and ReactElement
 */
export type TDynamicType = boolean | number | null | string | ReactElement;

/**
 * React Intl props interface
 */
export interface IReactIntlProps {
  intl: IntlShape;
}

/**
 * React Intl messages type
 */
export type IReactIntl = Record<string, string> | Record<string, any[]>;

/**
 * Animation component props
 */
export interface IAnimationProps {
  children: ReactElement;
  className?: string;
  settings: any;
  disable?: boolean;
}

/**
 * Launch program button props
 */
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

/**
 * Infinite scroll loader props
 */
export interface IInfiniteScrollLoaderProps {
  loadMore: (listCriteria: any) => Promise<IPageableResult<any>>;
  initialListCriteria?: any;
  pageSize?: number;
  onErrorMessageId?: string;
  mutateEntries?: any;
}
