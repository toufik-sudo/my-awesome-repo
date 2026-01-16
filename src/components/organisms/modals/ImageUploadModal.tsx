import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AvatarEditor from 'components/organisms/avatar/AvatarEditor';
import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import ButtonClose from 'components/atoms/ui/ButtonClose';
import HeadingAtom from 'components/atoms/ui/Heading';
import { IStore } from 'interfaces/store/IStore';
import { setModalState } from 'store/actions/modalActions';
import { baseCropModalConfig, DESIGN_COVER_MODAL } from 'constants/modal';

import basicStyle from 'assets/style/components/Modals/Modal.module.scss';

/**
 * Template component used to render fraud image modal
 *
 * @constructor
 */
const ImageUploadModal = ({ context, imageModal, config = baseCropModalConfig, modalSize = '' }) => {
  const dispatch = useDispatch();
  const imageModalState = useSelector((state: IStore) => state.modalReducer[imageModal]);
  const closeModal = () => dispatch(setModalState(false, imageModal));
  const { smallModal, modal } = basicStyle;

  return (
    <FlexibleModalContainer
      isModalOpen={imageModalState.active}
      closeModal={closeModal}
      className={`${modalSize ? modalSize : smallModal} ${modal}`}
    >
      <div className={basicStyle[DESIGN_COVER_MODAL]}>
        <ButtonClose closeModal={closeModal} isAlt />
        <HeadingAtom size="4" textId="personalInformation.info.form.crop" />
        <AvatarEditor {...{ closeModal, context, config, imageModal }} />
      </div>
    </FlexibleModalContainer>
  );
};

export default ImageUploadModal;
