import React, { FC } from 'react';
import Modal from 'react-modal';

import style from 'assets/style/components/Modals/Modal.module.scss';
import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import { DELAY_INITIAL } from 'constants/animations';
import { IFlexibleModalContainerProps } from 'interfaces/containers/IFlexibleModalContainer';
import { setScale } from 'utils/animations';

const { modalBaseStyle, scaleAnimation, fullMobile } = style;

/**
 * Modal wrapper container to render a react-modal
 *
 * @param isModalOpen
 * @param children
 * @param closeModal
 * @param closeButtonAvailable
 * @param className
 * @param noAnimation
 * @constructor
 */
const FlexibleModalContainer: FC<IFlexibleModalContainerProps> = ({
  isModalOpen,
  children,
  closeModal,
  closeButtonAvailable,
  className,
  overlayClassName,
  animationClass,
  fullOnMobile = true
}) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      className={`${modalBaseStyle} ${className} ${fullOnMobile ? fullMobile : ''}`}
      ariaHideApp={false}
      overlayClassName={overlayClassName}
    >
      <SpringAnimation className={`${scaleAnimation} ${animationClass}`} settings={setScale(DELAY_INITIAL)}>
        <>
          {children}
          {closeButtonAvailable && <button onClick={closeModal}>Close modal</button>}
        </>
      </SpringAnimation>
    </Modal>
  );
};

export default FlexibleModalContainer;
