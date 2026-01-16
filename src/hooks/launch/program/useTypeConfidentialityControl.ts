import { useDispatch, useSelector } from 'react-redux';
import { IStore } from 'interfaces/store/IStore';
import { useMultiStep } from 'hooks/launch/useMultiStep';
import { DOT_SEPARATOR } from 'constants/general';
import { LAUNCH_TYPES } from 'constants/wall/launch';
import { resetSpecificStepData } from 'store/actions/launchActions';

/**
 * Hook used to handle type and confidentiality flow control
 *
 * @param textId
 */
export const useTypeConfidentialityControl = textId => {
  const { TYPE, CONFIDENTIALITY } = LAUNCH_TYPES;
  const dispatch = useDispatch();
  const launchStore = useSelector((store: IStore) => store.launchReducer);
  const { type: storeType, confidentiality: storeConfidentiality, platform } = launchStore;
  const {
    stepSet: { setNextStep }
  } = useMultiStep();

  const addSelection = selection => {
    const [, currentType, selectedValue] = selection.split(DOT_SEPARATOR);
    const isTypeCompleted = storeType && currentType === TYPE && selectedValue !== storeType;
    const isConfidentialityCompleted =
      storeConfidentiality && currentType === CONFIDENTIALITY && selectedValue !== storeConfidentiality;

    if (isTypeCompleted || isConfidentialityCompleted) {
      dispatch(resetSpecificStepData(currentType, selectedValue, platform));
    }

    setNextStep(selection, textId);
  };

  return { addSelection };
};
