import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

/**
 * Atom component used to render pricing setup cell
 *
 * @param columnIndex
 * @param outputContent
 * @param translationPrefix
 * @constructor
 * @see PricingSetupCellStory
 */
const PricingSetupCell = ({ columnIndex, outputContent, translationPrefix = 'landing.setup' }) => {
  return (
    <>
      <DynamicFormattedMessage tag="p" id={`${translationPrefix}${columnIndex}`} values={{ quantity: outputContent }} />
      {columnIndex < 5 && (
        <DynamicFormattedMessage
          tag="p"
          id={`${translationPrefix}${columnIndex}.additional`}
          values={{ quantity: outputContent }}
        />
      )}
    </>
  );
};

export default PricingSetupCell;
