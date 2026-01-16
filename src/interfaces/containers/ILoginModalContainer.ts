import { ReactElement } from 'react';
import { IntlShape } from 'react-intl';

export interface IAuthModalProps {
  closeModal: () => void;
  intl: IntlShape;
}

export interface IAuthContainerProps {
  children: (props: IAuthModalProps) => ReactElement<IAuthModalProps>;
  targetModal: string;
}
