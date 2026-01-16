import React from 'react';
import { USERS_ROUTE } from 'constants/routes';

import UserRankingCta from 'components/atoms/wall/UserRankingCta';
import UsersProgramBlock from 'components/molecules/wall/users/UsersProgramBlock';

import style from 'sass-boilerplate/stylesheets/components/wall/UsersHeader.module.scss';

/**
 * Organism component used to render ranking header
 * @constructor
 */
const RankingHeader = () => {
  const { usersRankingHeaderButton, usersHeader, usersRankingHeader } = style;

  return (
    <div className={`${usersHeader} ${usersRankingHeader}`}>
      <UsersProgramBlock />
      <UserRankingCta buttonText="wall.users.back" route={USERS_ROUTE} className={usersRankingHeaderButton} />
    </div>
  );
};

export default RankingHeader;
