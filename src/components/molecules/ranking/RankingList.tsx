import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import RankingUserListHeader from 'components/molecules/ranking/RankingUserListHeader';
import Loading from 'components/atoms/ui/Loading';
import RankRowElement from 'components/molecules/ranking/RankRowElement';
import useUsersRakingsData from 'hooks/wall/useUsersRankingsData';
import { HEIGHT, THRESHOLD } from 'constants/wall/posts';
import { HTML_TAGS, LOADER_TYPE } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'sass-boilerplate/stylesheets/components/wall/UserHeaderElement.module.scss';
import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';

/**
 * Molecule component used to render ranking list in a Infinite Scroll component.
 */
const RankingList = ({ programId }) => {
  const { users, hasMore, handleLoadMore, isLoading } = useUsersRakingsData(programId);
  const noRanking = !isLoading && !users.length;
  const { tableMd } = tableStyle;

  if (noRanking) {
    return (
      <DynamicFormattedMessage id="wall.users.rankings.none" tag={HTML_TAGS.P} className={style.userHeaderElement} />
    );
  }

  return (
    <div className={tableMd}>
      <RankingUserListHeader />
      <InfiniteScroll
        hasMore={!isLoading && hasMore}
        height={HEIGHT}
        threshold={THRESHOLD}
        loadMore={handleLoadMore}
        initialLoad={false}
        isReverse={false}
        key={`usersRankingsScroll_${programId}`}
      >
        {users.map(({ uuid, firstName, lastName, croppedPicturePath, points }, index) => (
          <RankRowElement key={uuid} {...{ firstName, lastName, croppedPicturePath, points, rank: index + 1 }} />
        ))}
        {(isLoading || hasMore) && <Loading type={LOADER_TYPE.DROPZONE} />}
      </InfiniteScroll>
    </div>
  );
};

export default RankingList;
