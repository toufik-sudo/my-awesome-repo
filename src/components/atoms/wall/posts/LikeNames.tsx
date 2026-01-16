import React from 'react';
import { useIntl } from 'react-intl';

import { getLikesFormattedList } from 'services/WallServices';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Atom component used to render list of names.
 * @param likeNames
 * @param noOfLikes
 * @constructor
 */
const LikeNames = ({ likeNames, noOfLikes }) => {
  const intl = useIntl();

  return (
    <div>
      {getLikesFormattedList(likeNames, intl, noOfLikes).map((like, key) => {
        return (
          <li className={coreStyle.pt05} key={key}>
            {like}
          </li>
        );
      })}
    </div>
  );
};

export default LikeNames;
