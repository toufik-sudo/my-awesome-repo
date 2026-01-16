import React from 'react';
import { components } from 'react-select';
import { useIntl } from 'react-intl';

/**
 * Atom component used to render dropdown count inside dropdown category
 *
 * @param props
 * @constructor
 */
const DropdownCount = props => {
  const { formatMessage } = useIntl();

  return (
    <components.SingleValue {...props}>
      <span>{`${props.selectProps.value.length} ${formatMessage({
        id: 'launchProgram.products.categoriesSelected'
      })}`}</span>
    </components.SingleValue>
  );
};

export default DropdownCount;
