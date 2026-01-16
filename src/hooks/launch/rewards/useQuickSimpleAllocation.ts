import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IStore } from 'interfaces/store/IStore';
import { CHALLENGE, INITIAL_SIMPLE_ALLOCATION, LAUNCH_PROGRAM, LOYALTY } from 'constants/wall/launch';
import { setMultipleData, setStoreData } from 'store/actions/launchActions';
import { getRewardsDefaultValue } from '../../../utils/general';

/**
 * Hook used to handle quick simple allocation
 */
export const useQuickSimpleAllocation = () => {
  const launchData = useSelector((store: IStore) => store.launchReducer);
  const [selectedIndex, setIndex] = useState(0);
  const dispatch = useDispatch();
  if (!launchData.simpleAllocation) {
    dispatch(setStoreData({ ...launchData, simpleAllocation: INITIAL_SIMPLE_ALLOCATION }));
  }
  const { type, simpleAllocation } = useSelector((store: IStore) => store.launchReducer);
  const isChallengeProgram = type === CHALLENGE;
  const isLoyaltyProgram = type === LOYALTY;
  let newAllocation = simpleAllocation;

  useEffect(() => {
    if (newAllocation.type) {
      setIndex(newAllocation.type - 1);
    }
  }, []);

  const handleTabSelect = index => {
    dispatch(
      setMultipleData({
        category: LAUNCH_PROGRAM,
        values: {
          simpleAllocation: {
            value: '',
            min: '',
            max: '',
            type: index + 1
          }
        }
      })
    );
    setIndex(index);
  };

  if (!newAllocation.value) {
    newAllocation = {
      ...newAllocation,
      value: getRewardsDefaultValue(type, newAllocation.type)
    };
  }

  return {
    isChallengeProgram,
    isLoyaltyProgram,
    selectedIndex,
    type,
    handleTabSelect,
    simpleAllocation: newAllocation
  };
};
