import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';

import postStyle from 'sass-boilerplate/stylesheets/components/wall/PostList.module.scss';

/**
 * Atom component used to render list of names.
 * @param likeNames
 * @param postColor
 * @constructor
 */
const LikesList = ({ likeNames, postColor }) => {
  return (
    <div className={postStyle.likesList}>
      {likeNames.map((name, key) => {
        return (
          <li key={key}>
            <FontAwesomeIcon icon={faHeart} className={postColor} />
            <span>{name}</span>
          </li>
        );
      })}
    </div>
  );
};

export default LikesList;
