import { useDispatch, useSelector } from 'react-redux';

import { IStore } from 'interfaces/store/IStore';
import { setLaunchDataStep } from 'store/actions/launchActions';
import { CORRELATED, CORRELATED_GOALS, CUBE, INDEPENDENT } from 'constants/wall/launch';
import { useMultiStep } from 'hooks/launch/useMultiStep';

/**
 * Hook used to manage rewards goal data
 */
const useRewardsGoalRelations = () => {
  const launchStore = useSelector((store: IStore) => store.launchReducer);
  const { confidentiality, type, cube } = launchStore;
  const dispatch = useDispatch();
  const {
    stepSet: { setNextStep }
  } = useMultiStep();
  const setCorelatedStep = value => {
    dispatch(setLaunchDataStep({ key: CUBE, value: { ...cube, [CORRELATED]: value === CORRELATED } }));
    dispatch(setLaunchDataStep({ key: CORRELATED_GOALS, value: value === CORRELATED }));
    setNextStep();
  };
  const getActiveElement = cube => {
    if (cube && cube.correlated !== undefined) {
      return cube.correlated ? CORRELATED : INDEPENDENT;
    }
  };
  const activeElement = getActiveElement(cube);

  return { confidentiality, type, setCorelatedStep, activeElement };
};

export default useRewardsGoalRelations;
