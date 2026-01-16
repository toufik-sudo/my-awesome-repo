import React from 'react';

import UsersAvatarBlock from 'components/molecules/wall/users/UsersAvatarBlock';
import LinkBack from 'components/atoms/ui/LinkBack';
import { USERS_ROUTE } from 'constants/routes';

import style from 'sass-boilerplate/stylesheets/components/wall/UsersHeader.module.scss';

/**
 * Organism component used to render user detail header
 * @constructor
 */
const UserDetailsHeader = ({ userDetails }) => {
  const { usersHeader, usersInvitationCta } = style;

  return (
    <div className={usersHeader}>
      <LinkBack to={USERS_ROUTE} messageId="wall.users.back" className={usersInvitationCta} />
      <UsersAvatarBlock {...userDetails} />
    </div>
  );
};

export default UserDetailsHeader;
