import { useDispatch, useSelector } from 'react-redux';
import { IStore } from 'interfaces/store/IStore';
import { CLOSED } from 'constants/general';
import { useMultiStep } from 'hooks/launch/useMultiStep';
import { setLaunchDataStep } from 'store/actions/launchActions';
import { RESULTS_USERS_FIELDS } from 'constants/wall/launch';

/**
 * Hook used to handle results information
 *
 * @param selectedFields
 */
export const useResultsInformation = selectedFields => {
  const dispatch = useDispatch();
  const { confidentiality } = useSelector((store: IStore) => store.launchReducer);
  const isClosedProgram = confidentiality === CLOSED;
  const {
    stepSet: { setNextStep, setResultStep }
  } = useMultiStep();

  const submitResultsInformationFieldList = () => {
    dispatch(setLaunchDataStep({ key: RESULTS_USERS_FIELDS, value: selectedFields }));
    setNextStep();
  };

  return { isClosedProgram, setResultStep, submitResultsInformationFieldList };
};
