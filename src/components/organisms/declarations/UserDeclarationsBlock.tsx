import React from 'react';

import UserDeclarationsList from 'components/molecules/wall/declarations/UserDeclarationsList';
import UserDeclarationHeaderMenu from 'components/molecules/wall/declarations/UserDeclarationHeaderMenu';
import usePlatformIdSelection from 'hooks/wall/slider/usePlatformIdSelection';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';

/**
 * Organism component used to render User Declarations block
 *
 * @constructor
 */
const UserDeclarationsBlock = () => {
  const platformId = usePlatformIdSelection();
  const { withShadow, px3, borderRadius1 } = coreStyle;

  return (
    <div className={`${tableStyle.table} ${px3}`}>
      <div className={`${withShadow} ${borderRadius1}`}>
        <UserDeclarationHeaderMenu />
        {platformId && <UserDeclarationsList />}
      </div>
    </div>
  );
};

export default UserDeclarationsBlock;
