import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setLaunchDataStep } from 'store/actions/launchActions';
import { LAUNCH_PROGRAM, PROGRAM_BUDGET } from 'constants/wall/launch';
import { MAX_NUMBER_VALUE } from 'constants/general';
import { IStore } from 'interfaces/store/IStore';
import { formatNumberLocale } from 'utils/general';

/**
 * Hook used to handle budget information data
 */
export const useBudgetSet = () => {
  const { programBudget } = useSelector((store: IStore) => store.launchReducer);
  const [formattedBudget, setFormattedBudget] = useState<any>(formatNumberLocale(programBudget && programBudget));
  const dispatch = useDispatch();

  const setBudgetValue = ({ target: { value } }) => {
    const convertedBudget = parseInt(value && value.replace(/\D/g, ''));
    if (convertedBudget > MAX_NUMBER_VALUE) return;
    setFormattedBudget(formatNumberLocale(convertedBudget));
    dispatch(setLaunchDataStep({ category: LAUNCH_PROGRAM, key: PROGRAM_BUDGET, value: convertedBudget }));
  };

  return { formattedBudget, programBudget, setBudgetValue };
};
