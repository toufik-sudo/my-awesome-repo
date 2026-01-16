import { useContext } from 'react';

import { DesignAvatarContext, DesignCoverContext } from 'components/pages/DesignPage';

/**
 * Hook used to get all information on company images
 */
export const useCompanyImages = () => {
  const companyAvatar = useContext(DesignAvatarContext);
  const designAvatar = useContext(DesignCoverContext);
  const {
    cropped: { croppedAvatar: companyCroppedAvatar, setCroppedAvatar: setCompanyCroppedAvatar },
    config: { avatarConfig: companyAvatarConfig }
  } = companyAvatar;
  const {
    cropped: { croppedAvatar: companyCroppedCover, setCroppedAvatar: setCompanyCroppedCover },
    config: { avatarConfig: companyCoverConfig }
  } = designAvatar;

  return {
    companyCroppedAvatar,
    companyAvatarConfig,
    companyCroppedCover,
    companyCoverConfig,
    setCompanyCroppedAvatar,
    setCompanyCroppedCover
  };
};
