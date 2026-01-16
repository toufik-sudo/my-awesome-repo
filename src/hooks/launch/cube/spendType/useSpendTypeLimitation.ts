import { useEffect } from 'react';
import { BASE_SPEND_POINTS_TYPES, SPEND_POINTS_TYPE } from 'constants/wall/launch';
import { useSelector } from 'react-redux';
import { IStore } from 'interfaces/store/IStore';

/**
 * Hook used to handle spend type limitation
 *
 * @param setSpendPointsTypes
 * @param setSelectedSpendPoint
 */
export const useSpendTypeLimitation = (setSpendPointsTypes, setSelectedSpendPoint) => {
  const {
    cube,
    duration: { end }
  } = useSelector((store: IStore) => store.launchReducer);
  const { AT_END, AT_VALIDATION, AT_START } = SPEND_POINTS_TYPE;

  useEffect(() => {
    setSelectedSpendPoint(cube.spendType);
    if (!end && BASE_SPEND_POINTS_TYPES.includes(AT_END)) {
      setSpendPointsTypes([AT_START, AT_VALIDATION]);
    }
  }, [cube]);
};
