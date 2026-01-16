import React from 'react';
import { useDispatch } from 'react-redux';

import ButtonDelete from 'components/atoms/ui/ButtonDelete';
import { setModalState } from 'store/actions/modalActions';
import { IMAGE_UPLOAD_MODAL } from 'constants/modal';
import { IMAGES_ALT, REGISTER_DATA_COOKIE } from 'constants/general';
import { getLocalStorage, setLocalStorage } from 'services/StorageServies';
import { AVATAR_CONFIG_TYPE, ROTATE, ZOOM } from 'constants/personalInformation';

/**
 * Molecule component used to render avatar selection preview
 *
 * @param croppedAvatar
 * @param setCroppedAvatar
 * @param setImageError
 * @constructor
 *
 * @see AvatarSelectionPreviewStory
 */
const AvatarSelectionPreview = ({ croppedAvatar, setCroppedAvatar, setImageError = null }) => {
  const dispatch = useDispatch();
  const registerDataCookie = getLocalStorage(REGISTER_DATA_COOKIE) || {};
  const onImageDelete = () => {
    registerDataCookie.croppedAvatar = null;
    registerDataCookie.fullAvatar = null;
    registerDataCookie.avatarConfig = {
      zoom: AVATAR_CONFIG_TYPE[ZOOM].min,
      rotate: AVATAR_CONFIG_TYPE[ROTATE].min,
      name: '',
      width: 79,
      height: 79
    };
    setLocalStorage(REGISTER_DATA_COOKIE, { ...registerDataCookie });
  };

  return (
    <>
      <img
        onClick={() => dispatch(setModalState(true, IMAGE_UPLOAD_MODAL))}
        src={croppedAvatar}
        alt={IMAGES_ALT.AVATAR_IMAGE}
        width={79}
        height={79}
      />
      <ButtonDelete
        onclick={() => {
          setCroppedAvatar(null);
          !registerDataCookie && setImageError && setImageError({ requiredImage: 'form.validation.image.required' });
          onImageDelete();
        }}
      />
    </>
  );
};

export default AvatarSelectionPreview;
