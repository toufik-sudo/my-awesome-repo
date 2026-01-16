import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { useContext, useEffect } from 'react';

import { IStore } from 'interfaces/store/IStore';
import { AvatarContext } from 'components/pages/PersonalInformationPage';
import { useUserData } from 'hooks/user/useUserData';
import FilesApi from 'api/FilesApi'
import { AVATAR_CONFIG_TYPE, ROTATE, ZOOM } from 'constants/personalInformation';
import { type } from 'os';
import { setModalState } from 'store/actions/modalActions';

/**
 * Hook used to expose all avatar data
 *
 * @param setErrors
 * @param setImageError
 */
export const useAvatarData = (setErrors, setImageError) => {
  const { userData } = useUserData();
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const avatarContext = useContext(AvatarContext);
  const imageModal = useSelector(state => (state as IStore).modalReducer.imageUploadModal);
  const {
    cropped: { setCroppedAvatar, croppedAvatar },
    config: { avatarConfig, setAvatarConfig }
  } = useContext(AvatarContext);

  // const saveImage = async () => {
  //   const filesApi = new FilesApi();
  //   let fileBase64:any = await filesApi.downloadImages(userData.croppedPicturePath);
  //   fileBase64 = fileBase64.replaceAll("data:application/xml;","data:image/png;");
  //   setCroppedAvatar(fileBase64);
  //   setAvatarConfig({
  //     zoom: AVATAR_CONFIG_TYPE[ZOOM].min,
  //     rotate: AVATAR_CONFIG_TYPE[ROTATE].min,
  //     name: 'blob_172485252766cf292f8f84c'
  //   });

  //   dispatch(setModalState(true, 'image/png'));
  // };  
  

  useEffect(() => {
    // setErrors({ requiredImage: '' });
    // setImageError({ requiredImage: '' });
  }, [croppedAvatar]);

  // useEffect(() => {
  //   if(userData && userData.uuid && userData.croppedPicturePath){
  //     saveImage();
  //   }
  // }, [userData]);

  return { formatMessage, dispatch, avatarContext, imageModal, croppedAvatar };
};
