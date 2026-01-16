import React from 'react';

import GenericInfiniteScroll from 'components/atoms/list/GenericInfiniteScroll';
import UserHeaderElement from './UserHeaderElement';
import UserRowElement from './UserRowElement';
import ConfirmationModal from 'components/organisms/modals/ConfirmationModal';
import useUsersData from 'hooks/wall/useUsersData';
import { isProgramOngoing } from 'services/UsersServices';

import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';
import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';

/**
 * Molecule component used to render users list in a Infinite Scroll component.
 */
const UsersList = ({ programId, programStatus }) => {
  const {
    users,
    hasMore,
    handleLoadMore,
    isLoading,
    scrollRef,
    sorting,
    setSorting,
    validateJoinRequest,
    isValidatingJoin,
    confirmJoinAction
  } = useUsersData(programId);

  const onProgramOnly = !!programId;
  const ongoingProgram = programStatus && isProgramOngoing({ programStatus });
  const { tableTextFix, tableRowHoverUser, tableUsers, tableCustomHeight: height } = tableStyle;

  return (
    <>
      <GenericInfiniteScroll
        {...{
          hasMore: !isLoading && hasMore,
          loadMore: page => handleLoadMore(page, sorting),
          scrollRef,
          isLoading,
          height
        }}
      >
        <div className={`${grid['table-responsive']} ${grid['table-responsive-md']} ${tableTextFix}`}>
          <table className={`${grid['table']} ${tableRowHoverUser} ${tableUsers}`}>
            <UserHeaderElement sortState={sorting} onSort={setSorting} onProgramOnly={onProgramOnly} />
            <tbody>
              {users.map(user => (
                <UserRowElement
                  key={user.uuid}
                  {...{ user, onProgramOnly, ongoingProgram, confirmJoinAction, isValidatingJoin }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </GenericInfiniteScroll>
      <ConfirmationModal
        question="wall.user.details.programs.join.confirm"
        onAccept={validateJoinRequest}
        onAcceptArgs="payload"
      />
    </>
  );
};

export default UsersList;
