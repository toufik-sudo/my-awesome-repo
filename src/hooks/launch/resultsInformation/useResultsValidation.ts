import { useDispatch } from 'react-redux';

import { setLaunchDataStep } from 'store/actions/launchActions';
import { RESULTS_VALIDATION_FIELDS } from 'constants/wall/launch';
import { ACCEPT } from 'constants/general';

/**
 * Hook used to handle user invite confirmation on user fields customisation
 *
 * @param textLabel
 * @param index
 * @param setValue
 */
export const useResultsValidation = (textLabel, index, setValue) => {
  const dispatch = useDispatch();
  const currentValidationForm = `${textLabel}-${RESULTS_VALIDATION_FIELDS[index]}`;

  const setLaunchStep = (val, customIndex) => {
    dispatch(setLaunchDataStep({ key: RESULTS_VALIDATION_FIELDS[customIndex], value: val }));
  };

  const handleValidationUpdate = () => {
    setValue(currentValidationForm);
    setLaunchStep(textLabel === ACCEPT, index);
  };

  return { currentValidationForm, handleValidationUpdate };
};
