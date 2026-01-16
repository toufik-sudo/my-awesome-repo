import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { useContext } from 'react';

import { DesignAvatarContext } from 'components/pages/DesignPage';
import { IStore } from 'interfaces/store/IStore';
import { DESIGN_AVATAR_MODAL } from 'constants/modal';
import { COMPANY_AVATAR } from 'constants/wall/launch';
import { useImagePersistence } from 'hooks/others/useImagePersistance';

/**
 * Hook used to handle company avatar logic
 */
export const useCompanyAvatar = () => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const avatarContext = useContext(DesignAvatarContext);
  const {
    config: { avatarConfig }
  } = avatarContext;
  const imageModal = useSelector(state => (state as IStore).modalReducer[DESIGN_AVATAR_MODAL]);
  const imageName = avatarConfig.name;
  const {
    cropped: { croppedAvatar }
  } = useContext(DesignAvatarContext);

  useImagePersistence(DesignAvatarContext, COMPANY_AVATAR);

  return { croppedAvatar, imageModal, avatarContext, formatMessage, dispatch, imageName };
};
