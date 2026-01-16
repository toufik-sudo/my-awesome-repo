import { ReactElement } from 'react';
import { IArrayKey } from 'interfaces/IGeneral';
import { IntlShape } from 'react-intl';

export interface IFeatureProps {
  label: string;
}

export interface IFeatureListProps {
  labels: IArrayKey<string>;
}

export interface IReactIntlProps {
  intl: IntlShape;
  index: number;
  label: string;
  activeBox: number;
  setActiveBox: (activeBox: number) => void;
}

export interface IFeaturesContainerProps {
  messages: IArrayKey<string>;
  children: (props: IFeatureProps) => ReactElement<IFeatureProps>;
}
