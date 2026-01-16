import React from 'react';
import Select from 'react-select';
import { useIntl } from 'react-intl';

import ReactSelectPlaceholder from 'components/atoms/vendorsComponents/ReactSelectPlaceholder';
import { customStyles } from 'constants/reactselect/reactSelectStyle';
import { TYPE_FILTER_OPTIONS } from 'constants/programs';

/**
 * Molecule component that renders program select
 *
 * @constructor
 */
const ProgramBlockSelect = ({ onFilter }) => {
  const intl = useIntl();

  return (
    <Select
      placeholder={<ReactSelectPlaceholder />}
      onChange={onFilter}
      styles={customStyles}
      isSearchable={true}
      getOptionLabel={option => intl.formatMessage({ id: option.label })}
      options={TYPE_FILTER_OPTIONS}
    />
  );
};

export default ProgramBlockSelect;
