/* eslint-disable quotes */
import { useEffect, useState } from 'react';

import { AVATAR_CONFIG_TYPE, ROTATE, ZOOM } from 'constants/personalInformation';
import { getLocalStorage } from 'services/StorageServies';
import { REGISTER_DATA_COOKIE } from 'constants/general';

/**
 * Hook contains getter and setter for image crop slider customisation
 */
export const useAvatarPictureConfigurations = (stepIndex?) => {
  const [fullAvatar, setFullAvatar] = useState(null);
  const [croppedAvatar, setCroppedAvatar] = useState(null);
  const [avatarConfig, setAvatarConfig] = useState({
    zoom: AVATAR_CONFIG_TYPE[ZOOM].min,
    rotate: AVATAR_CONFIG_TYPE[ROTATE].min,
    name: '',
    with: stepIndex == '1' ? 480 : 300,
    height: stepIndex == '1' ? 255 : 120
  });
  const pictureData = getLocalStorage(REGISTER_DATA_COOKIE);

  const fullReset = () => {
    setFullAvatar(null);
    setCroppedAvatar(null);
  };

  useEffect(() => {
    if (!croppedAvatar && pictureData && pictureData.croppedAvatar) {
      setFullAvatar(pictureData.fullAvatar);
      setCroppedAvatar(pictureData.croppedAvatar);
      const avatarConf: any = Object.assign(pictureData.avatarConfig, {});
      avatarConf.width = stepIndex == '1' ? 480 : 300;
      avatarConf.height = stepIndex == '1' ? 255 : 120;
      setAvatarConfig(avatarConf);
    }
  }, []);

  return {
    full: { fullAvatar: fullAvatar, setFullAvatar },
    config: { avatarConfig: avatarConfig, setAvatarConfig },
    cropped: { croppedAvatar: croppedAvatar, setCroppedAvatar },
    avatarData: { fullAvatar, avatarConfig, croppedAvatar },
    fullReset
  };
};
