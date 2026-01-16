import React from 'react';
import ImageUploader from 'react-images-upload';

import AvatarPreview from 'components/organisms/avatar/AvatarPreview';
import ImageUploadModal from 'components/organisms/modals/ImageUploadModal';
import OptimalResolution from 'components/atoms/launch/products/OptimalResolution';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { getSeconds } from 'utils/general';
import { submitFullAvatar } from 'services/PersonalInformationServices';
import { HTML_TAGS, MAX_PRODUCT_FILE_SIZE } from 'constants/general';
import { ACCEPTED_IMAGE_FORMAT } from 'constants/personalInformation';
import { contentsCropModalConfig, CONTENTS_COVER_MODAL } from 'constants/modal';
import { OPTIMAL_RESOLUTION, CONTENTS_COVER } from 'constants/wall/launch';
import { useCompanyBackgroundCover } from 'hooks/launch/design/useCompanyBackgroundCover';
import { ContentsCoverContext } from 'components/pages/ContentsPage';

import contentsStyle from 'assets/style/components/launch/Contents.module.scss';
import style from 'assets/style/components/launch/Design.module.scss';

/**
 * Organism component used to render contents background cover
 * param fromUpdate
 * @constructor
 */
const ContentsUpdateAccountPicture = ({ fromUpdate = false }) => {
  const {
    brandTitle,
    companyAvatarUpload,
    companyAvatarUploadField,
    companyAvatarUploadButton,
    companyAvatarUploadError,
    designUploadValue
  } = style;
  const { contentsCoverImageWrapper, contentsTitle, contentsUploadValue } = contentsStyle;
  const { croppedAvatar, imageModal, avatarContext, dispatch, formatMessage, imageName } = useCompanyBackgroundCover(
    ContentsCoverContext,
    CONTENTS_COVER
  );

  return (
    <div className={`${fromUpdate ? '' : contentsCoverImageWrapper} ${companyAvatarUpload}`}>
      <DynamicFormattedMessage
        tag={HTML_TAGS.P}
        id="launchProgram.contents.companyBackground.title"
        className={`${contentsTitle} ${brandTitle}`}
      />
      <AvatarPreview {...{ style }} context={ContentsCoverContext} />
      {croppedAvatar && imageName && (
        <p className={`${contentsUploadValue} ${designUploadValue}`}>
          <DynamicFormattedMessage
            tag={HTML_TAGS.SPAN}
            id="launchProgram.design.imageUploaded"
            values={{ value: imageName }}
          />
        </p>
      )}
      <ImageUploader
        key={getSeconds()}
        buttonText={formatMessage({
          id: `launchProgram.info.form.${!croppedAvatar ? `imageUpload` : 'changeImage'}`
        })}
        onChange={image => submitFullAvatar(image, avatarContext, imageModal, dispatch, CONTENTS_COVER_MODAL)}
        maxFileSize={MAX_PRODUCT_FILE_SIZE}
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
      <OptimalResolution size={OPTIMAL_RESOLUTION.CONTENT_COVER} textId="launchProgram.design.cover.tips" />
      <ImageUploadModal
        context={ContentsCoverContext}
        imageModal={CONTENTS_COVER_MODAL}
        config={contentsCropModalConfig}
      />
    </div>
  );
};

export default ContentsUpdateAccountPicture;
