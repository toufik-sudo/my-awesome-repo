import React from 'react';
import Select from 'react-select';
import ReactTooltip from 'react-tooltip';
import { useIntl } from 'react-intl';

import CampaignHeaderElement from 'components/molecules/communication/CampaignHeaderElement';
import Button from 'components/atoms/ui/Button';
import CampaignListItems from 'components/organisms/communication/CampaignListItems';
import useOnRedirectToCreateCampaign from 'hooks/communication/useOnRedirectToCreateCampaign';
import ConfirmationModal from 'components/organisms/modals/ConfirmationModal';
import { getDropdownStyle } from 'services/LaunchServices';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { useEmailCampaign } from 'hooks/communication/useEmailCampaign';
import { getCampaignFilterOptions } from 'services/communications/EmailCampaignService';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { TOOLTIP_FIELDS } from 'constants/tootltip';

import componentStyle from 'sass-boilerplate/stylesheets/components/communication/Communication.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';

/**
 * Organism component used to render campaign tab
 *
 * @constructor
 */
const CampaignList = () => {
  const { campaignContainer, campaignFilter, campaign, campaignTable } = componentStyle;
  const { mt5, textCenter } = coreStyle;

  const intl = useIntl();
  const campaignFilterOptions = getCampaignFilterOptions(intl);

  const {
    statusFilter,
    setFilter,
    campaigns,
    hasNoCampaigns,
    isLoading,
    setSortingFilter,
    sortingFilter,
    programId
  } = useEmailCampaign(campaignFilterOptions);

  const {
    areAllProgramsSelected,
    isOnRedirectLoading,
    onRedirectToCreateEmailCampaign,
    onConfirmCreateUserList
  } = useOnRedirectToCreateCampaign(programId);

  return (
    <div className={campaign}>
      <div className={campaignFilter}>
        <Select
          name="filter"
          isSearchable={true}
          id="filter"
          value={statusFilter}
          onChange={e => setFilter(e)}
          isDisabled={isLoading}
          options={campaignFilterOptions}
          styles={{ option: getDropdownStyle }}
        />
      </div>
      <div className={tableStyle.tableScrollable}>
        <div className={campaignContainer}>
          <div className={`${tableStyle.tableLg} ${campaignTable}`}>
            <CampaignHeaderElement {...{ setSortingFilter, sortingFilter, isLoading }} />
            <CampaignListItems {...{ isLoading, campaigns, hasNoCampaigns }} />
          </div>
        </div>
      </div>
      <div
        className={`${textCenter} ${mt5}`}
        data-tip={intl.formatMessage({ id: 'communication.specificProgram.notSelected' })}
      >
        <DynamicFormattedMessage
          tag={Button}
          disabled={areAllProgramsSelected || isOnRedirectLoading}
          type={areAllProgramsSelected || isOnRedirectLoading ? BUTTON_MAIN_TYPE.DISABLED : BUTTON_MAIN_TYPE.PRIMARY}
          onClick={onRedirectToCreateEmailCampaign}
          id="communication.campaign.create.cta"
        />
      </div>
      {(areAllProgramsSelected || isOnRedirectLoading) && (
        <ReactTooltip
          place={TOOLTIP_FIELDS.PLACE_BOTTOM}
          type={TOOLTIP_FIELDS.TYPE_ERROR}
          effect={TOOLTIP_FIELDS.EFFECT_SOLID}
        />
      )}
      <ConfirmationModal onAccept={onConfirmCreateUserList} question="confirmation.label.create.campaign" />
    </div>
  );
};

export default CampaignList;
