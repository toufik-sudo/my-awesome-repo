import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IStore } from 'interfaces/store/IStore';
import { setLaunchDataStep } from 'store/actions/launchActions';
import { CUBE, REWARD_MANAGERS_DEFAULT_VALUE } from 'constants/wall/launch';
import { REWARDED_AMOUNT_REGEXP } from 'constants/validation';
import { useRewardManagersValidation } from 'hooks/launch/cube/rewardManagers/useRewardManagersValidation';
import { useRewardManagersStore } from 'hooks/launch/cube/rewardManagers/useRewardManagersStore';

/**
 * Hook used to handle reward manager data
 */
export const useRewardManagers = () => {
  const dispatch = useDispatch();
  const { cube } = useSelector((store: IStore) => store.launchReducer);
  const [acceptsRewardManagers, setAcceptsRewardManagers] = useState<boolean>(true);
  const [selectedRewardManagers, setRewardManagers] = useState<number>(REWARD_MANAGERS_DEFAULT_VALUE);
  const [fieldError, setFieldError] = useState<string>('');
  const {
    rewardsManagerValidated,
    validateShouldDisplay,
    modifyShouldDisplay,
    sectionShouldDisplay
  } = useRewardManagersValidation(selectedRewardManagers);
  useRewardManagersStore(setAcceptsRewardManagers, setRewardManagers);

  const handleRewardsManagersValidation = (selectedRewardManagers: string) => {
    const isValid: boolean = REWARDED_AMOUNT_REGEXP.test(selectedRewardManagers);
    if (isValid) {
      setFieldError('');

      return dispatch(
        setLaunchDataStep({
          key: CUBE,
          value: {
            ...cube,
            rewardPeopleManagers: selectedRewardManagers,
            rewardPeopleManagerAccepted: acceptsRewardManagers,
            cubeValidated: { ...cube.cubeValidated, rewardPeopleManagers: !cube.cubeValidated.rewardPeopleManagers }
          }
        })
      );
    }

    setFieldError('form.validation.invalid');
  };

  return {
    acceptsRewardManagers,
    setAcceptsRewardManagers,
    setRewardManagers,
    selectedRewardManagers,
    sectionShouldDisplay,
    validateShouldDisplay,
    modifyShouldDisplay,
    rewardsManagerValidated,
    handleRewardsManagersValidation,
    fieldError
  };
};
