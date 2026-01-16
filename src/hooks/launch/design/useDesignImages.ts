import { useContext } from 'react';

import { DesignIdentificationContext } from 'components/pages/DesignIdentificationPage';

/**
 * Hook used to get all information on design images
 */
export const useDesignImages = () => {
  const designAvatar = useContext(DesignIdentificationContext);
  const {
    cropped: { croppedAvatar: companyCroppedCover, setCroppedAvatar: setCompanyCroppedAvatar },
    config: { avatarConfig: companyCoverConfig }
  } = designAvatar;

  return { companyCroppedCover, companyCoverConfig, setCompanyCroppedAvatar };
};
