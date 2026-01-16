import React, { FC } from 'react';

import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import useAuthModalData from 'hooks/modals/useAuthModalData';
import { IAuthContainerProps } from 'interfaces/containers/ILoginModalContainer';

import style from 'assets/style/components/LoginModal.module.scss';

/**
 * Template used to render login modal template component (LoginModal.tsx)
 *
 * @param children
 * @param targetModal
 * @constructor
 */
const AuthModalTemplate: FC<IAuthContainerProps> = ({ children, targetModal }) => {
  const { closeModal, modalState, intl } = useAuthModalData(children, targetModal);

  return (
    <FlexibleModalContainer
      isModalOpen={modalState && modalState.active}
      closeModal={closeModal}
      className={style.loginModal}
    >
      {children({ closeModal, intl })}
    </FlexibleModalContainer>
  );
};

export default AuthModalTemplate;
