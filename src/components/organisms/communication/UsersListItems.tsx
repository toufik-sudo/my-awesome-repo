import React from 'react';

import Loading from 'components/atoms/ui/Loading';
import UserListRowElement from 'components/molecules/communication/UserListRowElement';
import { HTML_TAGS, LOADER_TYPE } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import componentStyle from 'sass-boilerplate/stylesheets/components/communication/Communication.module.scss';

/**
 * Organism component used to render user list items
 *
 * @param hasNoUserLists
 * @param isLoading
 * @param userLists
 * @param openDeleteUserListModal
 * @param onEditUser
 * @param canEdit
 * @constructor
 */
const UsersListsItems = ({ hasNoUserLists, isLoading, userLists, openDeleteUserListModal, onEditUser, canEdit }) => {
  if (isLoading) return <Loading type={LOADER_TYPE.COMMUNICATION} />;

  if (hasNoUserLists) {
    return (
      <DynamicFormattedMessage
        className={componentStyle.campaignNotFound}
        tag={HTML_TAGS.DIV}
        id="communication.list.data.notFound"
      />
    );
  }

  return (
    <div>
      {!hasNoUserLists &&
        userLists.map(({ name, createdAt, program, total, id }, key) => (
          <UserListRowElement
            key={key}
            {...{ id, openDeleteUserListModal, name, createdAt, program, recipients: total, onEditUser, canEdit }}
          />
        ))}
    </div>
  );
};

export default UsersListsItems;
