import React from 'react';

import { getDMYDateFormat, getHMHourFormat } from 'services/WallServices';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';

/**
 * Atom component used to render post publish info
 *
 * @param post
 * @param dateColor
 * @constructor
 */
const PostPublishInfo = ({ post, dateColor = '' }) => {
  const { withFontSmall, withGrayAccentColor, withSecondaryColor } = coreStyle;
  const { startDate } = post;

  return (
    <div className={withFontSmall}>
      <span className={withGrayAccentColor}>{getDMYDateFormat(startDate)}</span>
      <span style={{ color: dateColor }} className={`${withSecondaryColor} ${grid['ml-2']}`}>
        {getHMHourFormat(startDate)}
      </span>
    </div>
  );
};

export default PostPublishInfo;
