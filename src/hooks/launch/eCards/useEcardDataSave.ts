import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useMultiStep } from 'hooks/launch/useMultiStep';
import { setLaunchDataStep } from 'store/actions/launchActions';
import { ECARD_SELECTED_LIST } from 'constants/wall/launch';

/**
 * Hook used to handle company design data save
 *
 * @param eCardSelectedList
 */
export const useEcardDataSave = eCardSelectedList => {
  const [allDataValid, setDataStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setDataStatus(true);
    if (!eCardSelectedList || eCardSelectedList.length == 0) {
      setDataStatus(false);
    }
  }, []);

  const {
    stepSet: { setNextStep }
  } = useMultiStep();

  const handleNextStep = async () => {
    setIsLoading(true);
    // If companyAvatar was changed or a new picture was uploaded (companyCroppedAvatar has base64 representation),
    // we need to upload the new image to server and set info in localstorage
    if (eCardSelectedList && eCardSelectedList.length > 0) {
      try {
        dispatch(setLaunchDataStep({ key: ECARD_SELECTED_LIST, value: null }));
        // setCompanyCroppedAvatar(avatarResponse[0].publicPath);
      } catch (e) {
        throw new Error(e);
      }
    }

    setIsLoading(false);
    setNextStep();
  };

  return { handleNextStep, allDataValid, isLoading };
};
