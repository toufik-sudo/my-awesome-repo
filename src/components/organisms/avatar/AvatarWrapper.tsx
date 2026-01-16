import React from 'react';
import ImageUploader from 'react-images-upload';
import { FormattedMessage } from 'react-intl';

import AvatarPreview from 'components/organisms/avatar/AvatarPreview';
import { IArrayKey } from 'interfaces/IGeneral';
import { ACCEPTED_IMAGE_FORMAT } from 'constants/personalInformation';
import { submitFullAvatar } from 'services/PersonalInformationServices';
import { getSeconds } from 'utils/general';
import { MAX_AVATAR_FILE_SIZE } from 'constants/general';
import { useAvatarData } from 'hooks/onboarding/useAvatarData';
import { AvatarContext } from 'components/pages/PersonalInformationPage';
import { IMAGE_UPLOAD_MODAL } from 'constants/modal';

import style from 'assets/style/components/PersonalInformation/PersonalInformation.module.scss';

/**
 * Organism component used to render avatar preview + image uploader + avatar editor modal
 * @param form
 * @param imageError
 * @param setImageError
 *
 * @constructor
 */
const AvatarWrapper = ({ form, imageError, setImageError }) => {
  const { imageModal, avatarContext, dispatch, formatMessage, croppedAvatar } = useAvatarData(
    form ? form.setErrors : setImageError,
    setImageError
  );
  const requiredImgError = (form && (form.errors as IArrayKey<string>).requiredImage) || imageError.requiredImage;

  return (
    <div className={style.addImage}>
      <AvatarPreview {...{ style }} context={AvatarContext} setImageError={setImageError} />
      <div
        onMouseDown={() => {
          setTimeout(() => {
            const button = document.querySelector('.fileContainer').querySelector('input');
            button.click();
          });
        }}
      >
        <ImageUploader
          key={getSeconds()}
          buttonText={formatMessage({
            id: `personalInformation.info.form.${!croppedAvatar ? `imageUpload` : 'changeImage'}`
          })}
          onChange={image => submitFullAvatar(image, avatarContext, imageModal, dispatch, IMAGE_UPLOAD_MODAL)}
          maxFileSize={MAX_AVATAR_FILE_SIZE}
          imgExtension={ACCEPTED_IMAGE_FORMAT}
          withLabel={false}
          withIcon={false}
          singleImage
          fileTypeError={formatMessage({ id: 'personalInformation.info.form.format.error' })}
          buttonStyles={{
            background: 'transparent',
            color: '#000'
          }}
        />
      </div>
      {requiredImgError && (
        <span className={style.error}>
          <FormattedMessage id={requiredImgError} />
        </span>
      )}
    </div>
  );
};

export default AvatarWrapper;
