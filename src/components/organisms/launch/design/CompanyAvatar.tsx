import React from 'react';
import ImageUploader from 'react-images-upload';

import ImageUploadModal from 'components/organisms/modals/ImageUploadModal';
import CompanyAvatarPreview from 'components/molecules/launch/design/CompanyAvatarPreview';
import OptimalResolution from 'components/atoms/launch/products/OptimalResolution';
import { getSeconds } from 'utils/general';
import { submitFullAvatar } from 'services/PersonalInformationServices';
import { MAX_AVATAR_FILE_SIZE } from 'constants/general';
import { ACCEPTED_IMAGE_FORMAT } from 'constants/personalInformation';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { DesignAvatarContext } from 'components/pages/DesignPage';
import { OPTIMAL_RESOLUTION } from 'constants/wall/launch';
import { useCompanyAvatar } from 'hooks/launch/design/useCompanyAvatar';
import { DESIGN_AVATAR_MODAL } from 'constants/modal';

import style from 'assets/style/components/launch/Design.module.scss';

/**
 * Organism component used to render company avatar
 *
 * @constructor
 */
const CompanyAvatar = () => {
  const {
    companyAvatarUpload,
    companyAvatarUploadField,
    companyAvatarUploadButton,
    companyAvatarUploadError,
    designUploadValue
  } = style;
  const { croppedAvatar, imageModal, avatarContext, formatMessage, dispatch, imageName } = useCompanyAvatar();

  return (
    <div className={companyAvatarUpload}>
      <DynamicFormattedMessage tag="p" id="launchProgram.design.companyLogo.title" className={style.designTitle} />
      <ImageUploader
        key={getSeconds()}
        buttonText={formatMessage({
          id: `launchProgram.info.form.${!croppedAvatar ? `imageUpload` : 'changeImage'}`
        })}
        onChange={image => submitFullAvatar(image, avatarContext, imageModal, dispatch, DESIGN_AVATAR_MODAL)}
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
      <OptimalResolution size={OPTIMAL_RESOLUTION.AVATAR} textId="launchProgram.design.cover.tips" />
      <CompanyAvatarPreview />
      {croppedAvatar && imageName && (
        <p className={designUploadValue}>
          <DynamicFormattedMessage tag="span" id="launchProgram.design.imageUploaded" values={{ value: imageName }} />
        </p>
      )}
      <ImageUploadModal context={DesignAvatarContext} imageModal={DESIGN_AVATAR_MODAL} />
    </div>
  );
};

export default CompanyAvatar;
