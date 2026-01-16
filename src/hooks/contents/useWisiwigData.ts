import { useDispatch } from 'react-redux';
import { convertToRaw } from 'draft-js';

import { useMultiStep } from 'hooks/launch/useMultiStep';
import { setLaunchDataStep } from 'store/actions/launchActions';
import { WISYWIG_DATA_FIELD } from 'constants/wall/launch';

/**
 * Hook used to handle Wysiwig data from Contents page
 *
 * @param selectedFields
 */
export const useWisiwigData = (wysiwigData, stepIndex) => {
  const dispatch = useDispatch();
  const {
    stepSet: { setNextStep, setResultStep }
  } = useMultiStep();
  let wysiwigDataField = stepIndex == "1" ? WISYWIG_DATA_FIELD : WISYWIG_DATA_FIELD + (stepIndex-1);
  const submitWysiwigData = () => {
    dispatch(setLaunchDataStep({ key: wysiwigDataField, value: JSON.stringify(convertToRaw(wysiwigData)) }));
    setNextStep();
  };

  return { setResultStep, submitWysiwigData };
};
