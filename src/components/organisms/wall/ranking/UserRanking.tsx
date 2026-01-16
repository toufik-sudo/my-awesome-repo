import React from 'react';

import RankingHeader from 'components/organisms/wall/ranking/RankingHeader';
import RankingList from 'components/molecules/ranking/RankingList';
import LeftSideLayout from 'components/organisms/layouts/LeftSideLayout';
import { useSelector } from 'react-redux';
import { IStore } from 'interfaces/store/IStore';
import { WALL_TYPE } from 'constants/general';

import userRowStyle from 'sass-boilerplate/stylesheets/components/wall/UserRowElement.module.scss';
import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Organism component used to render users invitation block
 * @constructor
 */
const UserRanking = () => {
  const { selectedProgramId } = useSelector((store: IStore) => store.wallReducer);
  const { userRowProgramRanking } = userRowStyle;
  const { withShadowFullElement, pt0, px4, withBackgroundDefault } = coreStyle;
  const { table, tableScrollable } = tableStyle;

  return (
    <LeftSideLayout theme={WALL_TYPE} hasUserIcon>
      <div className={px4}>
        <div className={`${userRowProgramRanking} ${withShadowFullElement} ${pt0}`}>
          <RankingHeader />
          <div className={`${table} ${withBackgroundDefault}`}>
            <div className={tableScrollable}>
              <RankingList programId={selectedProgramId} />
            </div>
          </div>
        </div>
      </div>
    </LeftSideLayout>
  );
};

export default UserRanking;
