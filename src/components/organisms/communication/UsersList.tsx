import React from 'react';

import EmailUserRow from 'components/molecules/communication/EmailUserRow';
import Loading from 'components/atoms/ui/Loading';
import GenericInfiniteScroll from 'components/atoms/list/GenericInfiniteScroll';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS, LOADER_TYPE } from 'constants/general';

import componentStyle from 'sass-boilerplate/stylesheets/components/communication/CreateCampaignList.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Organism component used to render users list
 *
 * @param setOffset
 * @param hasMore
 * @param users
 * @param selectedUserIds
 * @param toggleUserSelected
 * @param isLoading
 * @param programId
 * @constructor
 */
const UsersList = ({
  hasMore,
  users,
  loadMore,
  scrollRef,
  selectedUserIds,
  toggleUserSelected,
  isLoading,
  programId
}) => {
  const { createCampaignRecipientsContainer, createListContainer, createCampaignContainer } = componentStyle;
  const { textCenter, height26: height, withDangerColor, mt2, pl5 } = coreStyle;
  const hasNoUsers = !isLoading && !users.length;

  if (!users.length && !hasNoUsers) return <Loading type={LOADER_TYPE.COMMUNICATION} />;

  if (!programId || hasNoUsers) {
    const messageId = programId ? 'communication.users.data.notFound' : 'communication.specificProgram.notSelected';
    return (
      <DynamicFormattedMessage
        className={`${componentStyle.campaignNotFound} ${coreStyle.textCenter} ${coreStyle.my3}`}
        tag={HTML_TAGS.DIV}
        id={messageId}
      />
    );
  }

  return (
    <div className={`${createCampaignContainer}`}>
      <div className={`${createCampaignRecipientsContainer} ${createListContainer}`}>
        <GenericInfiniteScroll
          {...{
            hasMore,
            loadMore,
            scrollRef,
            isLoading,
            height
          }}
        >
          <div className={pl5}>
            {users.map((user, index) => {
              const isSelected = !!selectedUserIds.find(id => id === user.id);

              return <EmailUserRow key={index} {...{ ...user, isSelected, toggleUserSelected }} />;
            })}
            {!isLoading && !users.length && (
              <DynamicFormattedMessage
                className={`${textCenter} ${withDangerColor} ${mt2}`}
                tag={HTML_TAGS.P}
                id="users.list.none"
              />
            )}
          </div>
        </GenericInfiniteScroll>
      </div>
    </div>
  );
};

export default UsersList;
