import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'assets/style/components/launch/Products.module.scss';

/**
 * Atom component used to render select/deselect button + text
 *
 * @param handleMultipleSelections
 * @param allSelected
 * @constructor
 */
const SelectDeselectAll = ({ handleMultipleSelections, allSelected }) => (
  <div className={style.addExistingProductsControlsWrapper}>
    <div onClick={handleMultipleSelections} className={style.addExistingProductsControls}>
      <FontAwesomeIcon icon={allSelected ? faMinusCircle : faPlusCircle} />
      <DynamicFormattedMessage tag="span" id={`launchProgram.products.${allSelected ? 'deselectAll' : 'selectAll'}`} />
    </div>
  </div>
);

export default SelectDeselectAll;
