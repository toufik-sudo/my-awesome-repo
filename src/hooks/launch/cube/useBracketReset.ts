import { useDispatch } from 'react-redux';

import { setBracketValues } from 'store/actions/launchActions';
import { INITIAL_BRACKET_VALUES } from 'constants/wall/launch';

/**
 * Hook used to handle bracket reset
 *
 * @param index
 * @param cube
 * @param handleItemValidation
 */
export const useBracketReset = (index, cube, handleItemValidation) => {
  const dispatch = useDispatch();

  const handleTypeFormValidation = target => {
    setBracketValues(index, INITIAL_BRACKET_VALUES, dispatch, cube);
    handleItemValidation(target);
  };

  return { handleTypeFormValidation };
};
