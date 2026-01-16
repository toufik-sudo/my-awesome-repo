import { AVATAR_CONFIG_TYPE, ROTATE, ZOOM } from 'constants/personalInformation';
import { setModalState } from 'store/actions/modalActions';
import { convertToBase64 } from 'utils/general';

/**
 * Method sets the base 64 full image to the modal to be cropped after
 *
 * @param images
 * @param setFullAvatar
 * @param setAvatarConfig
 * @param imageModal
 * @param dispatch
 * @param type
 */
export const submitFullAvatar = (
  images,
  { full: { setFullAvatar }, config: { setAvatarConfig } },
  imageModal,
  dispatch,
  type
) => {
  if (!images.length || imageModal.active) {
    return;
  }

  const latestImage = images[images.length - 1];
  convertToBase64(latestImage, base64Image => {
    setFullAvatar(base64Image);
    setAvatarConfig({
      zoom: AVATAR_CONFIG_TYPE[ZOOM].min,
      rotate: AVATAR_CONFIG_TYPE[ROTATE].min,
      name: latestImage.name
    });
    dispatch(setModalState(true, type));
  });
};
