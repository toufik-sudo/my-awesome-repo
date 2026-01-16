import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setLaunchDataStep } from 'store/actions/launchActions';
import { IStore } from 'interfaces/store/IStore';

/**
 * Hook used to handle image persistence
 *
 * @param context
 * @param type
 */
export const useImagePersistence = (context, type) => {
  const launchStore = useSelector(state => (state as IStore).launchReducer);
  const dispatch = useDispatch();
  const {
    cropped: { croppedAvatar, setCroppedAvatar },
    config: { avatarConfig, setAvatarConfig }
  } = useContext(context);

  useEffect(() => {
    // avatarConfig.width = stepIndex == '1' ? 600 : 330;
    // avatarConfig.height = stepIndex == '1' ? 145 : 120;
    dispatch(setLaunchDataStep({ key: type, value: { croppedAvatar, avatarConfig } }));
  }, [croppedAvatar, avatarConfig]);

  useEffect(() => {
    if (launchStore[type]) {
      setCroppedAvatar(launchStore[type].croppedAvatar);
      setAvatarConfig(launchStore[type].avatarConfig);
    } else{
      setCroppedAvatar("");
      avatarConfig.name = ""
      setAvatarConfig(avatarConfig);
    }
  }, [type]);
};
