import React from 'react';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useIntl } from 'react-intl';

import style from 'assets/style/components/wall/TopNavigation.module.scss';

/**
 * Molecule component used to render search bar
 *
 * @constructor
 */
const SearchBar = () => {
  const { formatMessage } = useIntl();

  return (
    <div className={style.searchBar}>
      <input type="text" placeholder={formatMessage({ id: 'wall.search.placeholder' })} />
      <FontAwesomeIcon icon={faSearch} />
      <FontAwesomeIcon icon={faFilter} />
    </div>
  );
};

export default SearchBar;
