import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { fileToAvatarFormData } from 'services/FileServices';
import { uploadFile } from 'store/actions/baseActions';
import { UPLOAD_FILES_ENDPOINT } from 'constants/api';
import { useMultiStep } from 'hooks/launch/useMultiStep';
import { useCompanyImages } from 'hooks/launch/design/useCompanyImages';
import { setLaunchDataStep } from 'store/actions/launchActions';
import { BACKGROUND_COVER, COMPANY_LOGO, COMPANY_NAME } from 'constants/wall/launch';

/**
 * Hook used to handle company design data save
 *
 * @param companyNameState
 */
export const useDesignDataSave = companyNameState => {
  const [allDataValid, setDataStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    companyCoverConfig,
    companyCroppedCover,
    companyAvatarConfig,
    companyCroppedAvatar,
    setCompanyCroppedAvatar,
    setCompanyCroppedCover
  } = useCompanyImages();
  const dispatch = useDispatch();

  useEffect(() => {
    setDataStatus(true);
    if (!companyNameState[0].trim().length || !companyCroppedAvatar || !companyCroppedCover) {
      setDataStatus(false);
    }
  }, [companyNameState[0], companyCroppedAvatar, companyCroppedCover]);

  const {
    stepSet: { setNextStep }
  } = useMultiStep();

  const handleNextStep = async () => {
    setIsLoading(true);
    // If companyAvatar was changed or a new picture was uploaded (companyCroppedAvatar has base64 representation),
    // we need to upload the new image to server and set info in localstorage
    if (companyCroppedAvatar && companyCroppedAvatar.includes('base64')) {
      const croppedAvatarData = await fileToAvatarFormData(companyCroppedAvatar, companyAvatarConfig);
      try {
        const { data: avatarResponse }: any = await uploadFile(croppedAvatarData, UPLOAD_FILES_ENDPOINT);
        dispatch(setLaunchDataStep({ key: COMPANY_LOGO, value: avatarResponse[0].id }));
        setCompanyCroppedAvatar(avatarResponse[0].publicPath);
      } catch (e) {
        throw new Error(e);
      }
    }
    // If companyCover was changed or a new picture was uploaded (companyCroppedCover has base64 representation),
    // we need to upload the new image to server and set info in localstorage
    if (companyCroppedCover && companyCroppedCover.includes('base64')) {
      const croppedCoverData = await fileToAvatarFormData(companyCroppedCover, companyCoverConfig);
      try {
        const { data: coverResponse }: any = await uploadFile(croppedCoverData, UPLOAD_FILES_ENDPOINT);

        dispatch(setLaunchDataStep({ key: BACKGROUND_COVER, value: coverResponse[0].id }));
        setCompanyCroppedCover(coverResponse[0].publicPath);
      } catch (e) {
        throw new Error(e);
      }
    }

    dispatch(setLaunchDataStep({ key: COMPANY_NAME, value: companyNameState[0] }));

    setIsLoading(false);
    setNextStep();
  };

  return { handleNextStep, allDataValid, isLoading };
};
