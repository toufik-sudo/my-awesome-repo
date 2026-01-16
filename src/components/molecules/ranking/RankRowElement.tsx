import React from 'react';

import style from 'sass-boilerplate/stylesheets/components/wall/UserRowElement.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';

/**
 * Molecule component used to render Rank Users Row Element
 *
 * @constructor
 */
const RankRowElement = ({ rank, firstName, lastName, croppedPicturePath, points }) => {
  const { userRowElementLink } = style;
  const { tableMdSize2 } = tableStyle;

  const {
    borderRadiusFull,
    width5,
    width12,
    height5,
    textLeft,
    ml4,
    py1,
    displayBlock,
    verticalAlignMiddle,
    textSm,
    withGrayAccentColor
  } = coreStyle;

  return (
    <div className={`${py1} ${textSm} ${withGrayAccentColor}`}>
      <div className={`${userRowElementLink} ${coreStyle['flex-center-vertical']}`}>
        <p className={`${width12} ${tableMdSize2}`}>
          <span>{rank}</span>
          <img
            src={croppedPicturePath}
            className={`${borderRadiusFull} ${width5} ${height5} ${ml4} ${verticalAlignMiddle}`}
            alt="User avatar"
          />
        </p>
        <p className={tableMdSize2}>{firstName}</p>
        <p className={tableMdSize2}>{lastName}</p>
        <p className={tableMdSize2}>
          <span className={`${textLeft} ${displayBlock}`}>{points}</span>
        </p>
      </div>
    </div>
  );
};

export default RankRowElement;
