import React from 'react';
import { Link } from 'react-router-dom';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import MomentUtilities from '../../../utils/MomentUtilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { USERS_DETAILS_ROUTE } from 'constants/routes';
import { HTML_TAGS } from 'constants/general';
import { DynamicFormattedMessage } from '../../atoms/ui/DynamicFormattedMessage';
import { getCampaignStylingRowElement } from 'services/communications/EmailCampaignService';
import { CAMPAIGN_STATUS_IDS, CAMPAIGN_STATUS_NOT_SUPPORTED } from 'constants/communications/campaign';

import style from 'sass-boilerplate/stylesheets/components/wall/UserRowElement.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/communication/Communication.module.scss';

/**
 * Molecule component used to render Users Row Element
 *
 * @constructor
 */
const CampaignRowElement = ({ name, updatedAt, createdAt, program, recipients, status: statusId }) => {
  const { userRowSeeUserWrapper, userRowSeeUserLabel, userRowSeeUser } = style;
  const {
    campaignRowName,
    campaignRowElement,
    campaignRowElementContainer,
    campaignRowDefaultElement,
    campaignSubtitle,
    campaignRowItemHeight
  } = componentStyle;

  const statusValue = CAMPAIGN_STATUS_IDS[statusId] || CAMPAIGN_STATUS_NOT_SUPPORTED;
  const dateTranslationId = `communication.campaign.data.${updatedAt ? 'updatedAt' : 'createdAt'}`;

  return (
    <div className={campaignRowElement}>
      <div
        className={`${campaignRowElementContainer} ${getCampaignStylingRowElement(componentStyle)[statusValue] || ''}`}
      >
        <div className={`${campaignRowItemHeight} ${campaignRowDefaultElement}`}>
          <p className={campaignRowName}>{name}</p>
          <div className={campaignSubtitle}>
            <DynamicFormattedMessage tag={HTML_TAGS.P} id={dateTranslationId} />
            {MomentUtilities.formatDate(updatedAt || createdAt)}
          </div>
        </div>
        <p className={`${campaignRowDefaultElement} ${campaignRowItemHeight}`}>{program && program.name}</p>
        <div className={`${campaignRowItemHeight} ${campaignRowDefaultElement}`}>
          <p className={campaignRowDefaultElement}>{recipients}</p>
          <DynamicFormattedMessage
            tag={HTML_TAGS.P}
            className={campaignSubtitle}
            id="communication.campaign.recipients"
          />
        </div>

        <DynamicFormattedMessage
          tag={HTML_TAGS.P}
          className={`${campaignRowDefaultElement} ${campaignRowItemHeight}`}
          id={`communication.campaign.table.row.status.${statusValue}`}
        />
      </div>
      <div className={userRowSeeUserWrapper}>
        <Link to={USERS_DETAILS_ROUTE} className={userRowSeeUser} id="wall.user.see.all">
          <FontAwesomeIcon icon={faUser} />
          <div className={userRowSeeUserLabel}>See user details</div>
        </Link>
      </div>
    </div>
  );
};

export default CampaignRowElement;
