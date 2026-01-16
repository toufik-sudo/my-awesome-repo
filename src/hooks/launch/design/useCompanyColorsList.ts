import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setLaunchDataStep } from 'store/actions/launchActions';
import { DESIGN } from 'constants/wall/launch';
import { getInitialColors } from 'services/LaunchServices';
import { IStore } from 'interfaces/store/IStore';

/**
 * Hook used to handle company color list logic
 */
export const useCompanyColorsList = () => {
  const [resetColors, setResetColors] = useState(false);
  const dispatch = useDispatch();
  let { design } = useSelector((store: IStore) => store.launchReducer);
  design = undefined === design ? {} : design;

  const handleResetColors = () => {
    dispatch(setLaunchDataStep({ key: DESIGN, value: getInitialColors(design.font) }));
    setResetColors(!resetColors);
  };

  useEffect(() => {
    if (Object.values(design).length === 1) {
      dispatch(setLaunchDataStep({ key: DESIGN, value: { ...design, ...getInitialColors(design.font) } }));
    }
  }, [resetColors]);

  return { resetColors, handleResetColors };
};
