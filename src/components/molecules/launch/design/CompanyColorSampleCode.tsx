import React from 'react';

import style from 'assets/style/components/launch/Design.module.scss';

/**
 * Molecule component used to render color sample with hex code
 *
 * @param setPickerOpen
 * @param pickerOpen
 * @param currentColor
 * @constructor
 */
const CompanyColorSampleCode = ({ setPickerOpen, pickerOpen, currentColor }) => {
  const { designColorsSample, designColorsContent, designColorsInput } = style;

  return (
    <div onClick={() => setPickerOpen(!pickerOpen)} className={designColorsContent}>
      <span className={designColorsSample} style={{ backgroundColor: currentColor }} />
      <span className={designColorsInput}>{currentColor}</span>
    </div>
  );
};

export default CompanyColorSampleCode;
