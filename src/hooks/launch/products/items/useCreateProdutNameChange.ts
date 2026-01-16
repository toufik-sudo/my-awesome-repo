import { useDispatch } from 'react-redux';

import { setLaunchDataStep } from 'store/actions/launchActions';
import { LAUNCH_PROGRAM, NEW_PRODUCT_NAME } from 'constants/wall/launch';

/**
 * Hook used to handle product name change
 *
 * @param setProductName
 */
export const useCreateProductNameChange = setProductName => {
  const dispatch = useDispatch();
  const handleProductNameChange = ({ target: { value } }) => {
    setProductName(value);
    dispatch(
      setLaunchDataStep({
        category: LAUNCH_PROGRAM,
        key: NEW_PRODUCT_NAME,
        value
      })
    );
  };

  return handleProductNameChange;
};
