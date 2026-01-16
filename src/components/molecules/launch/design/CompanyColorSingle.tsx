import React from 'react';

import CompanyColorPicker from 'components/molecules/launch/design/CompanyColorPicker';
import CompanyColorSampleCode from 'components/molecules/launch/design/CompanyColorSampleCode';
import { useCompanyColorSingle } from 'hooks/launch/design/useCompanyColorSingle';

/**
 * Molecule component used to render color picker + sample and code
 *
 * @param name
 * @param color
 * @param index
 * @param resetColors
 * @constructor
 */
const CompanyColorSingle = ({ colorData: { color, name }, resetColors }) => {
  const { currentColor, setPickerOpen, pickerOpen, handleColorChange } = useCompanyColorSingle(
    color,
    name,
    resetColors
  );

  return (
    <div>
      <CompanyColorSampleCode {...{ pickerOpen, setPickerOpen, currentColor }} />
      {pickerOpen && <CompanyColorPicker {...{ setPickerOpen, currentColor, handleColorChange }} />}
    </div>
  );
};

export default CompanyColorSingle;
