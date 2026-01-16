import { useContext } from 'react';

import { ContentsCoverContext } from 'components/pages/ContentsPage';

/**
 * Hook used to get all information on contents images
 */
export const useContentsImages = () => {
  const designAvatar = useContext(ContentsCoverContext);
  const {
    cropped: { croppedAvatar: contentsCroppedCover, setCroppedAvatar: setContentsCroppedAvatar },
    config: { avatarConfig: contentsCoverConfig }
  } = designAvatar;

  return { contentsCroppedCover, contentsCoverConfig, setContentsCroppedAvatar };
};
