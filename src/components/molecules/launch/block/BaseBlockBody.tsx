import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'assets/style/components/BlockElement.module.scss';

/**
 * Molecule component used to render base block body
 * @param description
 * @constructor
 */
const BaseBlockBody = ({ description }) => {
  const { blockElementDescription, blockElementBody } = style;

  return (
    <div className={blockElementBody}>
      <DynamicFormattedMessage id={description} className={blockElementDescription} tag="p" />
    </div>
  );
};

export default BaseBlockBody;
