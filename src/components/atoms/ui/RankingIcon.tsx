import React, { memo } from 'react';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Atom component used to render ranking icon
 *
 * @constructor
 *
 */
const RankingIcon = ({ hasRanking, fillColor }) => {
  const { width9, width11, mxAuto, displayBlock } = coreStyle;

  return (
    <svg
      id="Layer_1"
      className={`${!hasRanking ? width11 : width9} ${mxAuto} ${displayBlock}`}
      style={{ fill: fillColor }}
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 72.5 59.5"
    >
      <rect className="cls-1" y="17.5" width="22.5" height="42" />
      <rect className="cls-1" x="25" width="22.5" height="59.5" />
      <rect className="cls-1" x="50" y="34" width="22.5" height="25.5" />
    </svg>
  );
};

export default memo(RankingIcon);
