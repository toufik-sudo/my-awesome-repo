import { useSelector } from 'react-redux';

import { IStore } from 'interfaces/store/IStore';

/**
 * Hook used to return all reward managers validation flags
 *
 * @param selectedRewardManagers
 */
export const useRewardManagersValidation = selectedRewardManagers => {
  const { cube } = useSelector((store: IStore) => store.launchReducer);
  const rewardsManagerValidated = cube.cubeValidated.rewardPeopleManagers;
  const validateShouldDisplay = !rewardsManagerValidated && selectedRewardManagers;
  const modifyShouldDisplay = rewardsManagerValidated && selectedRewardManagers;
  const sectionShouldDisplay = cube.cubeValidated.validityPoints;

  return { rewardsManagerValidated, validateShouldDisplay, modifyShouldDisplay, sectionShouldDisplay };
};
