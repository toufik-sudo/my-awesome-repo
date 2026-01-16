import React from 'react';
import { ChromePicker } from 'react-color';

import style from 'assets/style/components/launch/Design.module.scss';

/**
 * Molecule component used to render company color picker with overlay
 *
 * @param currentColor
 * @param setPickerOpen
 * @param handleColorChange
 * @constructor
 */
const CompanyColorPicker = ({ currentColor, setPickerOpen, handleColorChange }) => {
  const { designColorsPicker, designColorsOverlay } = style;

  return (
    <div className={designColorsPicker}>
      <div className={designColorsOverlay} onClick={() => setPickerOpen(false)} />
      <ChromePicker disableAlpha color={currentColor} onChangeComplete={handleColorChange} />
    </div>
  );
};

export default CompanyColorPicker;
