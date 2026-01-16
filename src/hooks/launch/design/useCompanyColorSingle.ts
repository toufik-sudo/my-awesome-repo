import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { IStore } from 'interfaces/store/IStore';
import { setLaunchDataStep } from 'store/actions/launchActions';
import { DESIGN } from 'constants/wall/launch';

/**
 * Hook used to handle all company color single logic
 *
 * @param color
 * @param resetColors
 * @param name
 */
export const useCompanyColorSingle = (color, name, resetColors) => {
  const dispatch = useDispatch();
  const [pickerOpen, setPickerOpen] = useState(false);
  let { design } = useSelector((store: IStore) => store.launchReducer);
  design = undefined === design ? {} : design;
  const [currentColor, setCurrentColor] = useState(color);
  const handleColorChange = color => {
    dispatch(setLaunchDataStep({ key: DESIGN, value: { ...design, [name]: color.hex } }));
    setCurrentColor(color.hex);
  };

  useEffect(() => {
    setCurrentColor(color);
  }, [resetColors]);

  useEffect(() => {
    if (Object.keys(design).includes(name)) {
      setCurrentColor(design[name]);
    }
  }, [design]);

  return { pickerOpen, setPickerOpen, currentColor, handleColorChange };
};
