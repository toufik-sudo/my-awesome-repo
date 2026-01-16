import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { PRODUCTS_INFO_LABELS } from 'constants/wall/launch';

import style from 'assets/style/components/launch/Products.module.scss';

/**
 * Molecule component used to render label information
 *
 * @constructor
 */
const SizeLabelInformation = () => {
  return (
    <div className={style.createProductInfo}>
      {PRODUCTS_INFO_LABELS.map(label => (
        <DynamicFormattedMessage tag="p" id={`launchProgram.products.${label}`} key={label} />
      ))}
    </div>
  );
};

export default SizeLabelInformation;
