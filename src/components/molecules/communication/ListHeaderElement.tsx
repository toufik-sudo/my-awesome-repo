import React from 'react';

import SortSwitch from 'components/atoms/ui/SortSwitch';
import { HTML_TAGS } from 'constants/general';
import { SORTING_USER_LISTS } from 'constants/api/communications';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'sass-boilerplate/stylesheets/components/wall/UserHeaderElement.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/communication/Communication.module.scss';

/**
 * Molecule component used to render liust header element
 *
 * @param isLoading
 * @param setSortingFilter
 * @param sortingFilter
 * @constructor
 */
const UserListHeaderElement = ({ isLoading, setSortingFilter, sortingFilter }) => {
  const { userHeaderElement, userHeaderFieldWrapper, userHeaderDate, userHeaderSort, userHeaderSortActive } = style;
  const { campaignHeaderElement, listHeaderElement, listHeaderItem } = componentStyle;
  const listLabel = 'communication.list.';

  return (
    <div className={`${userHeaderElement} ${campaignHeaderElement} ${listHeaderElement}`}>
      <div className={`${userHeaderFieldWrapper} ${listHeaderItem}`}>
        <DynamicFormattedMessage tag={HTML_TAGS.P} id={`${listLabel}name`} />
        <SortSwitch
          parentClass={userHeaderSort}
          activeClass={userHeaderSortActive}
          onSort={setSortingFilter}
          disabled={isLoading}
          sortBy={SORTING_USER_LISTS.NAME}
          currentSorting={sortingFilter}
        />
      </div>
      <div className={`${userHeaderFieldWrapper} ${listHeaderItem}`}>
        <DynamicFormattedMessage tag={HTML_TAGS.DIV} id={`${listLabel}program`} />
        <SortSwitch
          parentClass={userHeaderSort}
          activeClass={userHeaderSortActive}
          onSort={setSortingFilter}
          disabled={isLoading}
          sortBy={SORTING_USER_LISTS.PROGRAM}
          currentSorting={sortingFilter}
        />
      </div>
      <div className={`${userHeaderFieldWrapper} ${listHeaderItem}`}>
        <DynamicFormattedMessage tag={HTML_TAGS.DIV} className={userHeaderDate} id={`${listLabel}recipients`} />
        <SortSwitch
          parentClass={userHeaderSort}
          activeClass={userHeaderSortActive}
          onSort={setSortingFilter}
          disabled={isLoading}
          sortBy={SORTING_USER_LISTS.RECIPIENTS}
          currentSorting={sortingFilter}
        />
      </div>
      <div className={`${userHeaderFieldWrapper} ${listHeaderItem}`}>
        <DynamicFormattedMessage tag={HTML_TAGS.P} id={`${listLabel}creation`} />
        <SortSwitch
          parentClass={userHeaderSort}
          activeClass={userHeaderSortActive}
          onSort={setSortingFilter}
          disabled={isLoading}
          sortBy={SORTING_USER_LISTS.CREATED_AT}
          currentSorting={sortingFilter}
        />
      </div>
    </div>
  );
};

export default UserListHeaderElement;
