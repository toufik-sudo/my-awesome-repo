import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import React from 'react';
import componentStyle from 'sass-boilerplate/stylesheets/components/wall/WallUserDeclarationsBlock.module.scss';

/**
 * Renders Declaration Product checkbox
 * @param labelId
 * @param hasMixedData
 * @param onClick
 * @param isChecked
 * @constructor
 */
export const DeclarationProductCheckbox = ({ labelId, hasMixedData, onClick, isChecked }) => {
  if (!hasMixedData) {
    return null;
  }
  return (
    <span
      onClick={onClick}
      className={`${componentStyle.customCheckboxInput} ${isChecked ? componentStyle.customCheckboxInputActive : ''}`}
    >
      {isChecked && <span className={componentStyle.customCheckboxInputIcon}>&#9745;</span>}
      <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id={labelId} />
    </span>
  );
};
