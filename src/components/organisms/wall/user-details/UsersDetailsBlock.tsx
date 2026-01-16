import React from 'react';
import { useParams } from 'react-router-dom';

import LeftSideLayout from 'components/organisms/layouts/LeftSideLayout';
import UserDetailsInformation from 'components/organisms/wall/user-details/UserDetailsInformation';
import UserDetailsPrograms from 'components/organisms/wall/user-details/UserDetailsPrograms';
import UserDetailsHeader from 'components/organisms/wall/user-details/UserDetailsHeader';
import useUserDetails from 'hooks/user/useUserDetails';
import Loading from 'components/atoms/ui/Loading';
import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import { setTranslate } from 'utils/animations';
import { DELAY_INITIAL } from 'constants/animations';
import { LOADER_TYPE, WALL_TYPE } from 'constants/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import style from 'sass-boilerplate/stylesheets/components/wall/WallUserDetails.module.scss';
import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';

/**
 * Organism component used to render Users Details
 *
 * @constructor
 */
const UsersDetailsBlock = () => {
  const { id } = useParams();
  const { userDetails, isLoading } = useUserDetails(id);
  const { px3, pb3, mLargeMt8, mLargePx0, mLargePx2 } = coreStyle;

  if (isLoading) {
    return <Loading type={LOADER_TYPE.DROPZONE} />;
  }

  return (
    <LeftSideLayout theme={WALL_TYPE} hasUserIcon>
      <SpringAnimation settings={setTranslate(DELAY_INITIAL)} className={`${px3} ${pb3} ${mLargePx0}`}>
        <div className={`${style.userDetails} ${mLargePx2} ${mLargeMt8}`}>
          <UserDetailsHeader userDetails={userDetails} />
          <div className={`${tableStyle.table} ${tableStyle.tableScrollable}`}>
            <div className={tableStyle.tableLg}>
              <UserDetailsInformation userDetails={userDetails} />
              <UserDetailsPrograms userDetails={userDetails} />
            </div>
          </div>
        </div>
      </SpringAnimation>
    </LeftSideLayout>
  );
};

export default UsersDetailsBlock;
