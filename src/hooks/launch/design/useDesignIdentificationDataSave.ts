import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useDesignImages } from './useDesignImages';
import { UPLOAD_FILES_ENDPOINT } from 'constants/api';
import { MAX_DESIGN_CONTENT, MAX_DESIGN_TITLE } from 'constants/general';
import { USER_IMAGE_TYPE } from 'constants/personalInformation';
import { IDENTIFICATION_COVER_ID, IDENTIFICATION_TEXT, IDENTIFICATION_TITLE } from 'constants/wall/launch';
import { useMultiStep } from 'hooks/launch/useMultiStep';
import { fileToAvatarFormData } from 'services/FileServices';
import { uploadFile } from 'store/actions/baseActions';
import { setLaunchDataStep } from 'store/actions/launchActions';

/**
 * Hook used to handle company design identification data save
 *
 */
export const useDesignIdentificationDataSave = () => {
  const designNameState = useState('');
  const designTextState = useState('');
  const [allDataValid, setDataStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { companyCoverConfig, companyCroppedCover, setCompanyCroppedAvatar } = useDesignImages();
  const dispatch = useDispatch();
  const [hasError, setHasError] = useState(false);
  const [hasContentError, setHasContentError] = useState(false);

  useEffect(() => {
    setDataStatus(true);
    if (!designNameState[0].trim().length || !designTextState[0].trim().length || !companyCroppedCover) {
      setDataStatus(false);
    }
    if (designNameState[0].trim().length > MAX_DESIGN_TITLE) {
      setHasError(true);
      setDataStatus(false);
    }
    if (designTextState[0].trim().length > MAX_DESIGN_CONTENT) {
      setHasContentError(true);
      setDataStatus(false);
    }
    if (designNameState[0].trim().length <= MAX_DESIGN_TITLE) {
      setHasError(false);
    }
    if (designTextState[0].trim().length <= MAX_DESIGN_CONTENT) {
      setHasContentError(false);
    }
  }, [designNameState[0], designTextState[0], companyCroppedCover]);

  const {
    stepSet: { setNextStep }
  } = useMultiStep();

  const handleNextStep = async () => {
    setIsLoading(true);
    // If identificationCover was changed or a new picture was uploaded (companyCroppedCover has base64 representation),
    // we need to upload the new image to server and set info in localstorage
    if (companyCroppedCover && companyCroppedCover.includes('base64')) {
      const croppedCoverData = await fileToAvatarFormData(
        companyCroppedCover,
        companyCoverConfig,
        USER_IMAGE_TYPE.PROGRAM_IMAGE
      );
      try {
        const { data: coverResponse }: any = await uploadFile(croppedCoverData, UPLOAD_FILES_ENDPOINT);

        setCompanyCroppedAvatar(coverResponse[0].publicPath);
        dispatch(setLaunchDataStep({ key: IDENTIFICATION_COVER_ID, value: coverResponse[0].id }));
      } catch (e) {
        throw new Error(e);
      }
    }
    dispatch(setLaunchDataStep({ key: IDENTIFICATION_TITLE, value: designNameState[0] }));
    dispatch(setLaunchDataStep({ key: IDENTIFICATION_TEXT, value: designTextState[0] }));

    setIsLoading(false);
    setNextStep();
  };

  return { handleNextStep, allDataValid, isLoading, hasError, hasContentError, designNameState, designTextState };
};
