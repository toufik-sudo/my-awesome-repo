import React from 'react';

import SortSwitch from 'components/atoms/ui/SortSwitch';
import { HTML_TAGS } from 'constants/general';
import { SORTING_CREATE_USER_LIST } from 'constants/api/communications';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'sass-boilerplate/stylesheets/components/wall/UserHeaderElement.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/communication/Communication.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render list header element
 *
 * @constructor
 */
const UsersListHeaderElement = ({ sortingFilter, setSortingFilter, isLoading }) => {
  const { userHeaderFieldWrapper, userHeaderDate, userHeaderSort, userHeaderSortActive } = style;
  const { campaignHeaderElement, listHeaderItem } = componentStyle;
  const listLabel = 'communication.list.users.';
  const { pl5, pr1, displayFlex, mr05 } = coreStyle;

  return (
    <div className={`${campaignHeaderElement} ${pr1} ${mr05}`}>
      <div className={`${displayFlex} ${pl5}`}>
        <div className={`${userHeaderFieldWrapper} ${listHeaderItem}`}>
          <DynamicFormattedMessage tag={HTML_TAGS.P} id={`${listLabel}firstName`} />
          <SortSwitch
            parentClass={userHeaderSort}
            activeClass={userHeaderSortActive}
            onSort={setSortingFilter}
            disabled={isLoading}
            sortBy={SORTING_CREATE_USER_LIST.FIRST_NAME}
            currentSorting={sortingFilter}
          />
        </div>
        <div className={`${userHeaderFieldWrapper} ${listHeaderItem}`}>
          <DynamicFormattedMessage tag={HTML_TAGS.DIV} className={userHeaderDate} id={`${listLabel}name`} />
          <SortSwitch
            parentClass={userHeaderSort}
            activeClass={userHeaderSortActive}
            onSort={setSortingFilter}
            disabled={isLoading}
            sortBy={SORTING_CREATE_USER_LIST.LAST_NAME}
            currentSorting={sortingFilter}
          />
        </div>
        <div className={`${userHeaderFieldWrapper} ${listHeaderItem}`}>
          <DynamicFormattedMessage tag={HTML_TAGS.P} id={`${listLabel}email`} />
          <SortSwitch
            parentClass={userHeaderSort}
            activeClass={userHeaderSortActive}
            onSort={setSortingFilter}
            disabled={isLoading}
            sortBy={SORTING_CREATE_USER_LIST.EMAIL}
            currentSorting={sortingFilter}
          />
        </div>
      </div>
    </div>
  );
};

export default UsersListHeaderElement;
