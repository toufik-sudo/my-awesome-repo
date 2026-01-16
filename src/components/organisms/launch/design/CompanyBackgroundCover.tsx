/* eslint-disable quotes */
import React from 'react';
import ImageUploader from 'react-images-upload';

import ImageUploadModal from 'components/organisms/modals/ImageUploadModal';
import OptimalResolution from 'components/atoms/launch/products/OptimalResolution';
import ButtonDelete from 'components/atoms/ui/ButtonDelete';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { getSeconds } from 'utils/general';
import { submitFullAvatar } from 'services/PersonalInformationServices';
import { MAX_AVATAR_FILE_SIZE } from 'constants/general';
import { ACCEPTED_IMAGE_FORMAT } from 'constants/personalInformation';
import { coverCropModalConfig, DESIGN_COVER_MODAL } from 'constants/modal';
import { OPTIMAL_RESOLUTION, COMPANY_COVER } from 'constants/wall/launch';
import { DesignCoverContext } from 'components/pages/DesignPage';
import { useCompanyBackgroundCover } from 'hooks/launch/design/useCompanyBackgroundCover';

import style from 'assets/style/components/launch/Design.module.scss';
import basicStyle from 'assets/style/components/Modals/Modal.module.scss';

/**
 * Organism component used to render company background cover
 *
 * @constructor
 */
const CompanyBackgroundCover = () => {
  const {
    designTitle,
    designCoverImageWrapper,
    companyAvatarUpload,
    companyAvatarUploadField,
    companyAvatarUploadButton,
    companyAvatarUploadError,
    designUploadValue
  } = style;
  const {
    setCroppedAvatar,
    croppedAvatar,
    imageModal,
    avatarContext,
    dispatch,
    formatMessage,
    imageName
  } = useCompanyBackgroundCover(DesignCoverContext, COMPANY_COVER);

  return (
    <div className={`${designCoverImageWrapper} ${companyAvatarUpload}`}>
      <DynamicFormattedMessage tag="p" id="launchProgram.design.companyBackground.title" className={designTitle} />

      {croppedAvatar && imageName && (
        <p className={designUploadValue}>
          <DynamicFormattedMessage tag="span" id="launchProgram.design.imageUploaded" values={{ value: imageName }} />
          <ButtonDelete onclick={() => setCroppedAvatar(null)} />
        </p>
      )}
      <ImageUploader
        key={getSeconds()}
        buttonText={formatMessage({
          id: `launchProgram.info.form.${!croppedAvatar ? `imageUpload` : 'changeImage'}`
        })}
        onChange={image => submitFullAvatar(image, avatarContext, imageModal, dispatch, DESIGN_COVER_MODAL)}
        maxFileSize={MAX_AVATAR_FILE_SIZE}
        imgExtension={ACCEPTED_IMAGE_FORMAT}
        withLabel={false}
        withIcon={false}
        singleImage
        className={companyAvatarUploadField}
        errorClass={companyAvatarUploadError}
        buttonClassName={companyAvatarUploadButton}
        fileTypeError={formatMessage({ id: 'personalInformation.info.form.format.error' })}
        buttonStyles={{
          background: 'transparent',
          color: '#000'
        }}
      />
      <OptimalResolution size={OPTIMAL_RESOLUTION.COVER} textId="launchProgram.design.cover.tips" />
      <ImageUploadModal
        context={DesignCoverContext}
        imageModal={DESIGN_COVER_MODAL}
        config={coverCropModalConfig}
        modalSize={basicStyle.mediumModal}
      />
    </div>
  );
};

export default CompanyBackgroundCover;
