import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

import { toggleSorting } from 'utils/api';
import { emptyFn } from 'utils/general';
import { SORT_DIRECTION } from 'constants/api/sorting';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

const SortSwitch = ({
  sortBy,
  onSort,
  currentSorting,
  wrapperClass = '',
  parentClass = '',
  activeClass,
  disabled = false,
  children = null,
  sortIconsFirst = false
}) => {
  const isSorted = sortBy === currentSorting.sortBy;
  const isAscending = isSorted && SORT_DIRECTION.ASC === currentSorting.sortDirection;
  const isDescending = isSorted && !isAscending;

  let onClick = emptyFn;
  if (!disabled) {
    onClick = () => onSort(toggleSorting(sortBy, isAscending));
  }

  return (
    <div onClick={onClick} className={`${wrapperClass} ${coreStyle.pointer}`}>
      {!sortIconsFirst && children}
      <div className={parentClass}>
        <FontAwesomeIcon icon={faSortUp} size={'xs'} className={isAscending ? activeClass : ''} />
        <FontAwesomeIcon icon={faSortDown} size={'xs'} className={isDescending ? activeClass : ''} />
      </div>
      {sortIconsFirst && children}
    </div>
  );
};

export default SortSwitch;
