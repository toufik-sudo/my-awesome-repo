import React from 'react';

import WallTopNavigation from 'components/molecules/wall/WallTopNavigation';
import style from 'assets/style/components/LeftSideLayout.module.scss';

/**
 * Molecule component used as a wrapper for wall
 *
 * @param theme
 * @param outputChildren
 * @param isCollapsed
 * @constructor
 */
const BaseWallWrapper = ({ theme, outputChildren, isCollapsed = false }) => {
  const wrapperClasses = `${style[`${theme}-wrapper`]} ${isCollapsed ? style.wrapperCollapsed : ''}`;
  
  return (
    <div className={wrapperClasses}>
      {/* {<WallTopNavigation />} */}
      {outputChildren}
    </div>
  );
};

export default BaseWallWrapper;
