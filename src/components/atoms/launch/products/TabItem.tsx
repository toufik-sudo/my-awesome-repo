import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

/**
 * Atom component used to render a tab item
 * @param textId
 *
 * @see TabItem
 */
export default function TabItem({ textId }) {
  return (
    <>
      <FontAwesomeIcon icon={faPlus} />
      <DynamicFormattedMessage tag="p" id={`launchProgram.products.${textId}`} />
    </>
  );
}
