import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';

import { getLikesPlaceholder } from 'services/WallServices';
import { emptyFn } from 'utils/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Atom component used to render list of names.
 * @param showLikesModal
 * @param likeNames
 * @param postIsLiked
 * @param currentUser
 * @param id
 * @param noOfLikes
 * @constructor
 */
const PostMobileLikes = ({ showLikesModal, likeNames, postIsLiked, currentUser, id, noOfLikesState }) => {
  const { withFontSmall, withGrayAccentColor, mt1 } = coreStyle;
  const commonClassName = `${withGrayAccentColor} ${withFontSmall} ${mt1}`;
  const [noOfLikes] = noOfLikesState;

  if (!likeNames.length) {
    return null;
  }

  return (
    <div onClick={() => (likeNames.length > 1 ? showLikesModal(true, id) : emptyFn())} className={commonClassName}>
      <FontAwesomeIcon icon={faHeart} />
      {getLikesPlaceholder(postIsLiked, likeNames, currentUser, noOfLikes)}
    </div>
  );
};

export default PostMobileLikes;
