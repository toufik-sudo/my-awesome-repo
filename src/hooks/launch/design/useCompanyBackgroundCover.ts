/* eslint-disable quotes */
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { useContext } from 'react';

import { IStore } from 'interfaces/store/IStore';
import { DESIGN_COVER_MODAL } from 'constants/modal';
import { useImagePersistence } from 'hooks/others/useImagePersistance';

/**
 * Hook used to handle all background company logic
 */
export const useCompanyBackgroundCover = (context, storeId) => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const avatarContext: any = useContext(context);
  const imageModal: any = useSelector(state => (state as IStore).modalReducer[DESIGN_COVER_MODAL]);
  const coverContext: any = useContext(context);
  let imageName = '';
  const {
    config: { avatarConfig },
    cropped: { croppedAvatar, setCroppedAvatar }
  } = coverContext;

  if (avatarConfig) {
    imageName = avatarConfig.name;
  }

  useImagePersistence(context, storeId);

  return { dispatch, formatMessage, avatarContext, imageModal, imageName, croppedAvatar, setCroppedAvatar };
};
