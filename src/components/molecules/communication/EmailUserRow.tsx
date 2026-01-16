import React from 'react';

import componentStyle from 'sass-boilerplate/stylesheets/components/communication/Communication.module.scss';
import createListStyle from 'sass-boilerplate/stylesheets/components/communication/CreateCampaignList.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';

/**
 * Molecule component used to render recipients users row element
 *
 * @constructor
 */
const EmailUserRow = ({ firstName, lastName, toggleUserSelected, id, email, isSelected = false }: any) => {
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
    <div className={`${campaignRowElement}`}>
      <div
        className={`${campaignRowElementContainer} ${listRowElementContainer} ${createListRadioElement} ${isSelectedClass}`}
        onClick={() => toggleUserSelected(id)}
      >
        <p
          className={`${campaignRowName} ${campaignRowDefaultElement} ${listRowDefaultElement} ${coreStyle.capitalize}`}
        >
          {firstName}
        </p>
        <p className={`${campaignRowDefaultElement} ${listRowDefaultElement} ${coreStyle.capitalize}`}>{lastName}</p>
        <p className={`${campaignRowDefaultElement} ${listRowDefaultElement} ${tableStyle.tableBreak}`}>{email}</p>
      </div>
    </div>
  );
};

export default EmailUserRow;
