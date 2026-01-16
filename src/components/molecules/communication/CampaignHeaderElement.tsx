import React from 'react';

import SortSwitch from 'components/atoms/ui/SortSwitch';
import { EMAIL_CAMPAIGNS_SORTING } from 'constants/api/communications';
import { HTML_TAGS } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'sass-boilerplate/stylesheets/components/wall/UserHeaderElement.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/communication/Communication.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render campaign header element
 *
 * @constructor
 */
const CampaignHeaderElement = ({ setSortingFilter, sortingFilter, isLoading }) => {
  const { userHeaderElement, userHeaderFieldWrapper, userHeaderSort, userHeaderSortActive } = style;
  const { campaignHeaderElement, campaignHeaderItem } = componentStyle;
  const campaignLabel = 'communication.campaign.';

  return (
    <div className={`${userHeaderElement} ${campaignHeaderElement}`}>
      <div className={`${userHeaderFieldWrapper} ${campaignHeaderItem} ${coreStyle.flexSpace1}`}>
        <DynamicFormattedMessage tag={HTML_TAGS.P} id={`${campaignLabel}name`} />
        <SortSwitch
          parentClass={userHeaderSort}
          activeClass={userHeaderSortActive}
          onSort={setSortingFilter}
          disabled={isLoading}
          sortBy={EMAIL_CAMPAIGNS_SORTING.NAME}
          currentSorting={sortingFilter}
        />
      </div>
      <div className={`${userHeaderFieldWrapper} ${campaignHeaderItem} ${coreStyle.flexSpace1}`}>
        <DynamicFormattedMessage tag={HTML_TAGS.DIV} id={`${campaignLabel}program`} />
        <SortSwitch
          parentClass={userHeaderSort}
          activeClass={userHeaderSortActive}
          onSort={setSortingFilter}
          sortBy={EMAIL_CAMPAIGNS_SORTING.PROGRAM}
          currentSorting={sortingFilter}
          disabled={isLoading}
        />
      </div>
      <div className={`${userHeaderFieldWrapper} ${campaignHeaderItem} ${coreStyle.flexSpace1}`}>
        <DynamicFormattedMessage tag={HTML_TAGS.DIV} id={`${campaignLabel}recipients`} />
        <SortSwitch
          parentClass={userHeaderSort}
          activeClass={userHeaderSortActive}
          onSort={setSortingFilter}
          sortBy={EMAIL_CAMPAIGNS_SORTING.RECIPIENTS}
          currentSorting={sortingFilter}
          disabled={isLoading}
        />
      </div>
      <div className={`${userHeaderFieldWrapper} ${campaignHeaderItem} ${coreStyle.flexSpace1}`}>
        <DynamicFormattedMessage tag={HTML_TAGS.P} id={`${campaignLabel}status`} />
        <SortSwitch
          parentClass={userHeaderSort}
          activeClass={userHeaderSortActive}
          onSort={setSortingFilter}
          sortBy={EMAIL_CAMPAIGNS_SORTING.STATUS}
          currentSorting={sortingFilter}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default CampaignHeaderElement;
