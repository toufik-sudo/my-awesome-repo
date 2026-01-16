import React from 'react';

import Loading from 'components/atoms/ui/Loading';
import CampaignRowElement from 'components/molecules/communication/CampaignRowElement';
import { HTML_TAGS, LOADER_TYPE } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import componentStyle from 'sass-boilerplate/stylesheets/components/communication/Communication.module.scss';

/**
 * Organism component used to render campaigns list items
 *
 * @param hasNoCampaigns
 * @param isLoading
 * @param campaigns
 * @constructor
 */
const CampaignListItems = ({ hasNoCampaigns, isLoading, campaigns }) => {
  if (isLoading) return <Loading type={LOADER_TYPE.COMMUNICATION} />;

  if (hasNoCampaigns) {
    return (
      <DynamicFormattedMessage
        className={componentStyle.campaignNotFound}
        tag={HTML_TAGS.DIV}
        id="communication.campaign.data.notFound"
      />
    );
  }

  return (
    <div>
      {!hasNoCampaigns &&
        campaigns.map(({ name, updatedAt, createdAt, program, emailsSent, status }, key) => (
          <CampaignRowElement key={key} {...{ name, updatedAt, createdAt, program, recipients: emailsSent, status }} />
        ))}
    </div>
  );
};

export default CampaignListItems;
