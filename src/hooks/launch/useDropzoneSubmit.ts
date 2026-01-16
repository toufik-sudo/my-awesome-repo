import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { useMultiStep } from 'hooks/launch/useMultiStep';
import { setLaunchDataStep } from 'store/actions/launchActions';
import { FREEMIUM, INVITED_USER_DATA, QUICK } from 'constants/wall/launch';
import { IStore } from 'interfaces/store/IStore';
import { CLOSED } from 'constants/general';
import { LAUNCH, LAUNCH_PRODUCTS_FIRST } from 'constants/routes';

/**
 * Hook used to submit dropzone submit user invite list
 */
export const useDropzoneSubmit = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { confidentiality, programJourney, type } = useSelector((store: IStore) => store.launchReducer);
  const isClosedProgram = confidentiality === CLOSED;
  const {
    stepSet: { setNextStep, resultsRoute }
  } = useMultiStep();

  const proceedUserList = (userData, setNextStep) => {
    dispatch(setLaunchDataStep({ key: INVITED_USER_DATA, value: userData }));

    if (history.location.pathname.includes(LAUNCH)) {
      if (isClosedProgram) {
        return setNextStep();
      }
      programJourney === QUICK || type === FREEMIUM ? history.push(resultsRoute) : history.push(LAUNCH_PRODUCTS_FIRST);
    }
  };

  const removeFile = () => {
    dispatch(setLaunchDataStep({ key: INVITED_USER_DATA }));
    return true;
  };

  return { setNextStep, proceedUserList, removeFile };
};
