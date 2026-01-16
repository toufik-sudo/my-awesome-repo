/* eslint-disable quotes */
import React from 'react';

import { HTML_TAGS } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import styleCube from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Atom component used to render cube option radio
 *
 * @param isSelected
 * @param handleSelection
 * @param index
 * @param type
 * @param translation
 * @constructor
 */
const CubeOption = ({ isSelected, handleSelection, index = null, type, translation, isDisabled }) => {
  const { cubeRadioItem, cubeRadioItemSelected } = styleCube;
  if (translation?.indexOf('launchProgram.cube.spendPoints.') >= 0 && (type == 2 || type == 3)) {
    isDisabled = true;
  }
  return (
    <DynamicFormattedMessage
      className={`${cubeRadioItem} ${isSelected && !isDisabled ? cubeRadioItemSelected : ''} ${
        isDisabled ? styleCube.disabledRadio : ''
      }`}
      tag={HTML_TAGS.SPAN}
      id={translation}
      onClick={() => {
        if (!isDisabled) {
          handleSelection(index, type);
        }
      }}
      disable={isDisabled?.toString()}
    />
  );
};

export default CubeOption;
