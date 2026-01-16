import React from 'react';

import Button from 'components/atoms/ui/Button';
import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import { VIDEO } from 'constants/files';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { resolveVideoType } from 'services/WallServices';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import style from 'sass-boilerplate/stylesheets/components/wall/PostMedia.module.scss';

/**
 * Molecule component used to render media preview modal
 * @param setShowModal
 * @param media
 * @param mediaType
 * @param showModal
 * @constructor
 */
const MediaModal = ({ setShowModal, media, mediaType, showModal }) => {
  let component = <img className={coreStyle.imgFluid} src={media.src} alt={media.alt} title={media.title} />;

  if (mediaType === VIDEO) {
    component = (
      <div className={style.mediaVideoContainer}>
        <video className={style.mediaVideo} controls>
          <source src={media.url} type={`video/${resolveVideoType(media.ext)}`} />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <FlexibleModalContainer
      fullOnMobile={false}
      className={style.mediaModal}
      closeModal={() => setShowModal(false)}
      isModalOpen={showModal}
    >
      <div className={style.mediaModalContent}>
        {component}
        <DynamicFormattedMessage
          onClick={() => setShowModal(false)}
          tag={Button}
          className={coreStyle.mxAuto}
          id="label.close.modal"
        />
      </div>
    </FlexibleModalContainer>
  );
};

export default MediaModal;
