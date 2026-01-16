import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IStore } from 'interfaces/store/IStore';

/**
 * Hook used to set reward managers data form store
 *
 * @param setAcceptsRewardManagers
 * @param setRewardManagers
 */
export const useRewardManagersStore = (setAcceptsRewardManagers, setRewardManagers) => {
  const { cube } = useSelector((store: IStore) => store.launchReducer);

  useEffect(() => {
    setAcceptsRewardManagers(cube.rewardPeopleManagerAccepted);
    setRewardManagers(cube.rewardPeopleManagers);
  }, [cube]);
};
