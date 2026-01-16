import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BASE_SPEND_POINTS_TYPES, CUBE } from 'constants/wall/launch';
import { IStore } from 'interfaces/store/IStore';
import { setLaunchDataStep } from 'store/actions/launchActions';
import { useSpendTypeLimitation } from 'hooks/launch/cube/spendType/useSpendTypeLimitation';

/**
 * Hook used to handle spend points selection
 */
export const useSpendPoints = () => {
  const dispatch = useDispatch();
  const [spendPointsTypes, setSpendPointsTypes] = useState(BASE_SPEND_POINTS_TYPES);
  const [selectedSpendPoint, setSelectedSpendPoint] = useState(null);
  const { cube } = useSelector((store: IStore) => store.launchReducer);
  const spendPointsValidated = cube.cubeValidated.spendType;

  useSpendTypeLimitation(setSpendPointsTypes, setSelectedSpendPoint);

  const sectionShouldDisplay = cube.cubeValidated.frequencyAllocation;
  const validateShouldDisplay = !spendPointsValidated && selectedSpendPoint;
  const modifyShouldDisplay = spendPointsValidated && selectedSpendPoint;

  const handleSpendPointsValidation = selectedSpendPoint => {
    dispatch(
      setLaunchDataStep({
        key: CUBE,
        value: {
          ...cube,
          spendType: selectedSpendPoint,
          validityPoints: { value: `1y`, label: '1 Year' },
          cubeValidated: {
            ...cube.cubeValidated,
            spendType: !cube.cubeValidated.spendType,
            validityPoints: false,
            rewardPeopleManagers: false
          }
        }
      })
    );
  };

  return {
    spendPointsTypes,
    selectedSpendPoint,
    setSelectedSpendPoint,
    validateShouldDisplay,
    modifyShouldDisplay,
    sectionShouldDisplay,
    spendPointsValidated,
    handleSpendPointsValidation
  };
};
