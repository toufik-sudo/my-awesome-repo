import React from 'react';

import SortSwitch from 'components/atoms/ui/SortSwitch';
import { SORTING_CAMPAIGN_RECIPIENTS_LISTS } from 'constants/api/communications';
import { HTML_TAGS } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'sass-boilerplate/stylesheets/components/wall/UserHeaderElement.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/communication/Communication.module.scss';

/**
 * Molecule component used to render liust header element
 *
 * @constructor
 */
const RecipientsListHeaderElement = ({ setSortingFilter, sortingFilter, isLoading, isProcessing }) => {
  const { userHeaderElement, userHeaderFieldWrapper, userHeaderDate, userHeaderSort, userHeaderSortActive } = style;
  const { campaignHeaderElement, listHeaderElement, listHeaderItem } = componentStyle;
  const listLabel = 'communication.list.';
  const isDisabled = isLoading || isProcessing;

  return (
    <div className={`${userHeaderElement} ${campaignHeaderElement} ${listHeaderElement}`}>
      <div className={`${userHeaderFieldWrapper} ${listHeaderItem}`}>
        <DynamicFormattedMessage tag={HTML_TAGS.P} id={`${listLabel}name`} />
        <SortSwitch
          parentClass={userHeaderSort}
          activeClass={userHeaderSortActive}
          onSort={setSortingFilter}
          disabled={isDisabled}
          sortBy={SORTING_CAMPAIGN_RECIPIENTS_LISTS.NAME}
          currentSorting={sortingFilter}
        />
      </div>
      <div className={`${userHeaderFieldWrapper} ${listHeaderItem}`}>
        <DynamicFormattedMessage tag={HTML_TAGS.DIV} className={userHeaderDate} id={`${listLabel}recipients`} />
        <SortSwitch
          parentClass={userHeaderSort}
          activeClass={userHeaderSortActive}
          onSort={setSortingFilter}
          disabled={isDisabled}
          sortBy={SORTING_CAMPAIGN_RECIPIENTS_LISTS.RECIPIENTS}
          currentSorting={sortingFilter}
        />
      </div>
      <div className={`${userHeaderFieldWrapper} ${listHeaderItem}`}>
        <DynamicFormattedMessage tag={HTML_TAGS.P} id={`${listLabel}creation`} />
        <SortSwitch
          parentClass={userHeaderSort}
          activeClass={userHeaderSortActive}
          onSort={setSortingFilter}
          disabled={isDisabled}
          sortBy={SORTING_CAMPAIGN_RECIPIENTS_LISTS.CREATED_AT}
          currentSorting={sortingFilter}
        />
      </div>
    </div>
  );
};

export default RecipientsListHeaderElement;
