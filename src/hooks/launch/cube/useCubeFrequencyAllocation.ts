import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MomentUtilities from 'utils/MomentUtilities';
import {
  ALLOCATION_TYPE,
  ALLOCATION_WITHOUT_INSTANT,
  BASE_FREQUENCY_TYPES,
  CUBE,
  FREQUENCY_TYPE
} from 'constants/wall/launch';
import { IStore } from 'interfaces/store/IStore';
import { handleDateDifferences } from 'services/CubeServices';
import { setLaunchDataStep } from 'store/actions/launchActions';

const momentUtilities = new MomentUtilities();

/**
 * Hook used to handle frequency allocation logic
 */
export const useCubeFrequencyAllocation = () => {
  const [frequencyTypes, setFrequencyTypes] = useState(BASE_FREQUENCY_TYPES);
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const dispatch = useDispatch();
  const {
    cube,
    duration: { start, end }
  } = useSelector((store: IStore) => store.launchReducer);

  const frequencyValidated = cube.cubeValidated.frequencyAllocation;
  const validateShouldDisplay = !frequencyValidated && selectedFrequency;
  const modifyShouldDisplay = frequencyValidated && selectedFrequency;

  const handleFrequencyValidation = selectedFrequency => {
    dispatch(
      setLaunchDataStep({
        key: CUBE,
        value: {
          ...cube,
          frequencyAllocation: selectedFrequency,
          spendType: '',
          cubeValidated: {
            ...cube.cubeValidated,
            frequencyAllocation: !cube.cubeValidated.frequencyAllocation,
            spendType: false,
            validityPoints: false,
            rewardPeopleManagers: false
          }
        }
      })
    );
  };

  useEffect(() => {
    const dateDifference = momentUtilities.getDiff(start, end);
    const allAllocationTypes = cube.goals.filter(goal => ALLOCATION_WITHOUT_INSTANT.includes(goal[ALLOCATION_TYPE]));
    const updatedFrequencyTypes = [...frequencyTypes];

    if (allAllocationTypes.length && updatedFrequencyTypes.includes(FREQUENCY_TYPE.INSTANTANEOUSLY))
      updatedFrequencyTypes.shift();

    handleDateDifferences(dateDifference, setFrequencyTypes, [...updatedFrequencyTypes]);

    if (cube.frequencyAllocation && selectedFrequency !== cube.frequencyAllocation) {
      setSelectedFrequency(cube.frequencyAllocation);
    }
  }, [cube]);

  return {
    selectedFrequency,
    setSelectedFrequency,
    frequencyTypes,
    validateShouldDisplay,
    modifyShouldDisplay,
    handleFrequencyValidation,
    frequencyValidated
  };
};
