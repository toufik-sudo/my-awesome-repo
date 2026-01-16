import React from 'react';

import WallTopNavigation from 'components/molecules/wall/WallTopNavigation';
import style from 'assets/style/components/LeftSideLayout.module.scss';

/**
 * Molecule component used as a wrapper for wall
 *
 * @param theme
 * @param outputChildren
 * @constructor
 */
const BaseWallWrapper = ({ theme, outputChildren }) => {
  return (
    <div className={style[`${theme}-wrapper`]}>
      {<WallTopNavigation />}
      {outputChildren}
    </div>
  );
};

export default BaseWallWrapper;
