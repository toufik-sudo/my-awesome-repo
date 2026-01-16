import React from 'react';

import MomentUtilities from 'utils/MomentUtilities';

import componentStyle from 'sass-boilerplate/stylesheets/components/communication/Communication.module.scss';
import createListStyle from 'sass-boilerplate/stylesheets/components/communication/CreateCampaignList.module.scss';

/**
 * Molecule component used to render recipients list row element
 *
 * @constructor
 */
const RecipientsListRowElement = ({ id, name, total, createdAt, setEmailUserListId, isSelected }) => {
  const {
    campaignRowName,
    campaignRowElement,
    campaignRowElementContainer,
    campaignRowDefaultElement,
    listRowElementContainer,
    listRowDefaultElement
  } = componentStyle;
  const { createListRadioElement, createListRadioElementSelected } = createListStyle;
  const isSelectedClass = (isSelected && createListRadioElementSelected) || '';

  return (
    <div className={campaignRowElement}>
      <div
        className={`${campaignRowElementContainer} ${listRowElementContainer} ${createListRadioElement} ${isSelectedClass}`}
        onClick={() => setEmailUserListId(id)}
      >
        <p className={`${campaignRowName} ${campaignRowDefaultElement} ${listRowDefaultElement}`}>{name}</p>
        <p className={`${campaignRowDefaultElement} ${listRowDefaultElement}`}>{total}</p>
        <p className={`${campaignRowDefaultElement} ${listRowDefaultElement}`}>
          {MomentUtilities.formatDate(createdAt)}
        </p>
      </div>
    </div>
  );
};

export default RecipientsListRowElement;
