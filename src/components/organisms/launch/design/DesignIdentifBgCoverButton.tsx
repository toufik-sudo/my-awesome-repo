import React from 'react';
import ImageUploader from 'react-images-upload';

import ImageUploadModal from 'components/organisms/modals/ImageUploadModal';
import ExtendedOptimalResolution from 'components/atoms/launch/products/ExtendedOptimalResolution';
import ButtonDelete from 'components/atoms/ui/ButtonDelete';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { getSeconds } from 'utils/general';
import { submitFullAvatar } from 'services/PersonalInformationServices';
import { MAX_AVATAR_FILE_SIZE } from 'constants/general';
import { ACCEPTED_IMAGE_FORMAT } from 'constants/personalInformation';
import { DESIGN_COVER_MODAL, designIdentificationModalConfig } from 'constants/modal';
import { OPTIMAL_RESOLUTION, IDENTIFICATION_COVER } from 'constants/wall/launch';
import { useCompanyBackgroundCover } from 'hooks/launch/design/useCompanyBackgroundCover';
import { DesignIdentificationContext } from 'components/pages/DesignIdentificationPage';

import style from 'sass-boilerplate/stylesheets/pages/DesignIdentification.module.scss';
import basicStyle from 'assets/style/components/Modals/Modal.module.scss';

/**
 * Organism component used to render design identification background cover button
 *
 * @constructor
 */
const DesignIdentifBgCoverButton = () => {
  const {
    designUploadValue,
    designCoverUpload,
    designAvatarUploadField,
    designAvatarUploadButton,
    designAvatarUploadError
  } = style;
  const {
    setCroppedAvatar,
    croppedAvatar,
    imageModal,
    avatarContext,
    dispatch,
    formatMessage,
    imageName
  } = useCompanyBackgroundCover(DesignIdentificationContext, IDENTIFICATION_COVER);

  return (
    <div className={designCoverUpload}>
      {croppedAvatar && imageName && (
        <p className={designUploadValue}>
          <DynamicFormattedMessage tag="span" id="launchProgram.design.imageUploaded" values={{ value: imageName }} />
          <ButtonDelete onclick={() => setCroppedAvatar(null)} />
        </p>
      )}
      <ImageUploader
        key={getSeconds()}
        buttonText={formatMessage({
          id: `launchProgram.designIdentification.${!croppedAvatar ? `addImage` : 'changeImage'}`
        })}
        onChange={image => submitFullAvatar(image, avatarContext, imageModal, dispatch, DESIGN_COVER_MODAL)}
        maxFileSize={MAX_AVATAR_FILE_SIZE}
        imgExtension={ACCEPTED_IMAGE_FORMAT}
        withLabel={false}
        withIcon={false}
        singleImage
        className={designAvatarUploadField}
        errorClass={designAvatarUploadError}
        buttonClassName={designAvatarUploadButton}
        fileTypeError={formatMessage({ id: 'personalInformation.info.form.format.error' })}
        buttonStyles={{
          background: 'transparent',
          color: '#000'
        }}
      />
      <ExtendedOptimalResolution size={OPTIMAL_RESOLUTION.CONTENT_COVER} />
      <ImageUploadModal
        context={DesignIdentificationContext}
        imageModal={DESIGN_COVER_MODAL}
        config={designIdentificationModalConfig}
        modalSize={basicStyle.mediumModal}
      />
    </div>
  );
};

export default DesignIdentifBgCoverButton;
