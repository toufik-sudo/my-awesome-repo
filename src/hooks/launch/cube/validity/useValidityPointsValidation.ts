import { useDispatch, useSelector } from 'react-redux';

import { setLaunchDataStep } from 'store/actions/launchActions';
import { CUBE } from 'constants/wall/launch';
import { IStore } from 'interfaces/store/IStore';

/**
 * Hook used to handle validity points selection
 */
export const useValidityPointsValidation = selectedValidityPoints => {
  const dispatch = useDispatch();
  const { cube } = useSelector((store: IStore) => store.launchReducer);
  const validityPointsValidated = cube.cubeValidated.validityPoints;
  const validateShouldDisplay = !validityPointsValidated && selectedValidityPoints;
  const modifyShouldDisplay = validityPointsValidated && selectedValidityPoints;
  const sectionShouldDisplay = cube.cubeValidated.spendType;

  const handleValidityValidation = selectedValidityPoints => {
    dispatch(
      setLaunchDataStep({
        key: CUBE,
        value: {
          ...cube,
          validityPoints: selectedValidityPoints,
          rewardPeopleManagers: 10,
          rewardPeopleManagerAccepted: true,
          cubeValidated: {
            ...cube.cubeValidated,
            validityPoints: !cube.cubeValidated.validityPoints,
            rewardPeopleManagers: false
          }
        }
      })
    );
  };

  return {
    handleValidityValidation,
    validateShouldDisplay,
    modifyShouldDisplay,
    sectionShouldDisplay,
    validityPointsValidated
  };
};
