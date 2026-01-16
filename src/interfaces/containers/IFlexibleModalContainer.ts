import { ReactElement } from 'react';

export interface IFlexibleModalContainerProps {
  children: ReactElement;
  closeModal: () => void;
  closeButtonAvailable?: boolean;
  isModalOpen: boolean;
  className?: string;
  overlayClassName?: string;
  animationClass?: string;
  fullOnMobile?: boolean;
}
