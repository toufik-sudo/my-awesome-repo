import React from 'react';

import Loading from 'components/atoms/ui/Loading';
import RecipientsListRowElement from 'components/molecules/communication/RecipientsListRowElement';
import { LOADER_TYPE, HTML_TAGS } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import componentStyle from 'sass-boilerplate/stylesheets/components/communication/CreateCampaignList.module.scss';
/**
 * Organism component used to render recipients list
 *
 * @constructor
 */
const RecipientsList = ({ userLists, isLoading, hasNoUserLists, setEmailUserListId, emailUserListId }) => {
  if ((!userLists.length && !hasNoUserLists) || isLoading) return <Loading type={LOADER_TYPE.COMMUNICATION} />;

  if (hasNoUserLists) {
    return (
      <DynamicFormattedMessage
        className={componentStyle.campaignNotFound}
        tag={HTML_TAGS.DIV}
        id="communication.users.data.notFound"
      />
    );
  }

  return (
    <>
      {userLists.map(userList => {
        const isSelected = emailUserListId == userList.id;
        return <RecipientsListRowElement key={userList.id} {...{ ...userList, setEmailUserListId, isSelected }} />;
      })}
    </>
  );
};
export default RecipientsList;
