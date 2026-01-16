import React from 'react';

import ManageUsersHeader from 'components/molecules/wall/user-details/userManagement/ManageUsersHeader';
import ManageUserRow from 'components/molecules/wall/user-details/userManagement/ManageUserRow';
import GenericInfiniteScroll from 'components/atoms/list/GenericInfiniteScroll';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import style from 'sass-boilerplate/stylesheets/components/wall/UserRowElement.module.scss';

/**
 * Component used to render managed users list
 * @param props
 * @constructor
 */
const ManageUsersList = ({
  users,
  hasMore,
  loading: isLoading,
  handleLoadUsers: loadMore,
  setManagedStatus,
  allManaged,
  setAllManagedStatus,
  managerUuid,
  isValidating
}) => {
  const { w100, pb3, pt1, textMd, height250 } = coreStyle;

  return (
    <>
      <DynamicFormattedMessage className={textMd} id="wall.user.details.manager.usersRelated" tag={HTML_TAGS.H4} />
      <ManageUsersHeader {...{ setManagedStatus, allManaged, setAllManagedStatus, isValidating }} />
      <GenericInfiniteScroll
        {...{
          hasMore,
          loadMore,
          isLoading,
          scrollRef: null,
          height: height250,
          className: `${w100} ${pb3} ${pt1} ${style.userManagerList}`
        }}
        key={`users_${managerUuid}`}
      >
        <ul>
          {users.map((user, index: number) =>
            user.uuid === managerUuid ? null : (
              <ManageUserRow key={`${user.uuid}_${index}`} {...{ user, index, setManagedStatus, isValidating }} />
            )
          )}
        </ul>
      </GenericInfiniteScroll>
    </>
  );
};

export default ManageUsersList;
