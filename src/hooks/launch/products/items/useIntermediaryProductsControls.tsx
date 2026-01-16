import { useMultiStep } from 'hooks/launch/useMultiStep';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { setLaunchDataStep } from 'store/actions/launchActions';
import { LAUNCH_PROGRAM, PERSONALISE_PRODUCTS } from 'constants/wall/launch';
import { LAUNCH_RESULTS_FIRST } from 'constants/routes';

/**
 * Hook used to handle logic for intermediary controls of products
 */
export const useIntermediaryProductsControls = () => {
  const {
    stepSet: { setNextStep }
  } = useMultiStep();
  const history = useHistory();
  const dispatch = useDispatch();
  const changePersonaliseProductsStoreValue = value =>
    dispatch(setLaunchDataStep({ category: LAUNCH_PROGRAM, key: PERSONALISE_PRODUCTS, value }));
  const acceptProducts = () => {
    changePersonaliseProductsStoreValue(true);
    setNextStep();
  };
  const declineProducts = () => {
    changePersonaliseProductsStoreValue(false);
    history.push(LAUNCH_RESULTS_FIRST);
  };

  return { acceptProducts, declineProducts };
};
