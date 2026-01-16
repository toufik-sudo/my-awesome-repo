/* eslint-disable quotes */
import React, { useEffect, useState } from 'react';
import ImageUploader from 'react-images-upload';

import ImageUploadModal from 'components/organisms/modals/ImageUploadModal';
import OptimalResolution from 'components/atoms/launch/products/OptimalResolution';
import ButtonDelete from 'components/atoms/ui/ButtonDelete';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { getSeconds } from 'utils/general';
import { submitFullAvatar } from 'services/PersonalInformationServices';
import { MAX_PRODUCT_FILE_SIZE } from 'constants/general';
import { ACCEPTED_IMAGE_FORMAT } from 'constants/personalInformation';
import { contentsCropModalConfig, CONTENTS_COVER_MODAL } from 'constants/modal';
import { OPTIMAL_RESOLUTION, CONTENTS_COVER } from 'constants/wall/launch';
import { useCompanyBackgroundCover } from 'hooks/launch/design/useCompanyBackgroundCover';
import { ContentsCoverContext } from 'components/pages/ContentsPage';

import contentsStyle from 'assets/style/components/launch/Contents.module.scss';
import style from 'assets/style/components/launch/Design.module.scss';
import basicStyle from 'assets/style/components/Modals/Modal.module.scss';
import { useParams } from 'react-router-dom';
import BannerPreview from 'components/molecules/launch/BannerPreview';

/**
 * Organism component used to render contents background cover
 *
 * @constructor
 */
const ContentsBackgroundCover = () => {
  let contentsCover = CONTENTS_COVER;
  const { step, stepIndex } = useParams();
  if (stepIndex == '1') {
    contentsCover = CONTENTS_COVER;
  } else {
    const indexConst = (stepIndex - 1).toString();
    contentsCover = CONTENTS_COVER + indexConst;
  }

  const {
    brandTitle,
    companyAvatarUpload,
    companyAvatarUploadField,
    companyAvatarUploadButton,
    companyAvatarUploadError,
    designUploadValue
  } = style;
  const { contentsCoverImageWrapper, contentsTitle, contentsUploadValue } = contentsStyle;
  const {
    setCroppedAvatar,
    croppedAvatar,
    imageModal,
    avatarContext,
    dispatch,
    formatMessage,
    imageName
  } = useCompanyBackgroundCover(ContentsCoverContext, contentsCover);
  if (contentsCropModalConfig) {
    contentsCropModalConfig.width = stepIndex == '1' ? 600 : 330;
    contentsCropModalConfig.height = stepIndex == '1' ? 145 : 120;
  }

  const [highlightedIndex, setHighlightedIndex] = useState(0);

  useEffect(() => {
    // Calculate the highlighted index based on stepIndex
    let newIndex = 0;
    if (stepIndex > 1 && stepIndex <= 5 && step === "contents") {
      // Logic to map stepIndex to highlightedIndex
      newIndex = stepIndex - 2; // Subtract 2 to map stepIndex to array index
    }
    setHighlightedIndex(newIndex);
  }, [stepIndex, step]);

  return (
    <div className={`${contentsCoverImageWrapper} ${companyAvatarUpload}`}>
      <DynamicFormattedMessage
        tag="p"
        id={(stepIndex <= 1 || !stepIndex) ? 'launchProgram.contents.companyBackground.title' : 'launchProgram.contents.companyBackground'}
        className={`${contentsTitle} ${brandTitle}`}
      />

      {croppedAvatar && imageName && (
        <p className={`${contentsUploadValue} ${designUploadValue}`}>
          <DynamicFormattedMessage tag="span" id="launchProgram.design.imageUploaded" values={{ value: imageName }} />
          <ButtonDelete onclick={() => setCroppedAvatar(null)} />
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
        modalSize={basicStyle.largeModal}
      />

      {stepIndex > 1 && stepIndex <= 5 && step === 'contents' && (
        <BannerPreview highlightedIndex={highlightedIndex} />
      )}
    </div>
  );
};

export default ContentsBackgroundCover;
