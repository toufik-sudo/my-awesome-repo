import { useDispatch } from 'react-redux';

import { setLaunchDataStep } from 'store/actions/launchActions';
import { USER_VALIDATION_FIELDS } from 'constants/wall/launch';
import { ACCEPT } from 'constants/general';

/**
 * Hook used to handle user invite confirmation on user fields customisation
 *
 * @param textLabel
 * @param index
 * @param setValue
 */
export const useRegistrationValidation = (textLabel, index, setValue) => {
  const dispatch = useDispatch();
  const currentValidationForm = `${textLabel}-${USER_VALIDATION_FIELDS[index]}`;

  const setLaunchStep = (val, customIndex) =>
    dispatch(setLaunchDataStep({ key: USER_VALIDATION_FIELDS[customIndex], value: val }));

  const handleValidationUpdate = () => {
    setValue(currentValidationForm);
    setLaunchStep(textLabel === ACCEPT, index);
  };

  return { currentValidationForm, handleValidationUpdate };
};
