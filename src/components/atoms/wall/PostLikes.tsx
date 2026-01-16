import React, { useRef } from 'react';
import ReactTooltip from 'react-tooltip';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LikesModal from 'components/organisms/modals/LikesModal';
import LikeNames from 'components/atoms/wall/posts/LikeNames';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { setNumberOfLikes } from 'store/actions/wallActions';
import { emptyFn } from 'utils/general';
import { TOOLTIP_FIELDS } from 'constants/tootltip';
import { isMobile } from 'utils/general';

import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import style from 'sass-boilerplate/stylesheets/components/wall/PostList.module.scss';

/**
 * Atom component used to show post likes block
 * @param id
 * @param postIsLiked
 * @param noOfLikesState
 * @param postType
 * @param isDisabled
 * @param setIsDisabled
 * @param setIsLiked
 * @param likeNames
 * @param addRemoveNameS
 * @param showLikesModal
 * @param likesModal
 * @param type
 * @constructor
 */
const PostLikes = ({
  id,
  postIsLiked,
  noOfLikesState,
  postType,
  isDisabled,
  setIsDisabled,
  setIsLiked,
  likeNames,
  addRemoveNames,
  showLikesModal,
  likesModal,
  type
}) => {
  const { postBlockIsLikedBtn, postBlockDisabled, postActionBlock } = style;
  const [noOfLikes] = noOfLikesState;
  const tooltipRef = useRef();

  return (
    <div
      className={`${grid['pr-md-5']} ${grid['pr-2']} ${postActionBlock}`}
      data-tip={likeNames}
      ref={tooltipRef}
      data-for={`${'likesTooltip'}${id}`}
      key={`${'likesTooltip'}${id}`}
    >
      <div
        onClick={() =>
          isDisabled
            ? emptyFn()
            : setNumberOfLikes({ noOfLikesState, postId: id, setIsDisabled, postIsLiked, setIsLiked, addRemoveNames })
        }
        className={coreStyle.pointer}
      >
        <FontAwesomeIcon icon={faHeart} className={`${grid['mr-2']} ${grid['mr-md-3']}`} />
        {likeNames.length > 0 && !isMobile() && (
          <ReactTooltip
            place={TOOLTIP_FIELDS.PLACE_TOP}
            effect={TOOLTIP_FIELDS.EFFECT_SOLID}
            id={`${'likesTooltip'}${id}`}
            className={postBlockDisabled}
            getContent={() => <LikeNames {...{ likeNames, noOfLikes }} />}
          />
        )}
        <DynamicFormattedMessage
          tag={HTML_TAGS.SPAN}
          id={`${'wall.posts.'}${postIsLiked ? 'liked' : 'like'}`}
          values={{ noOfLikes }}
          className={`${postBlockIsLikedBtn} ${postIsLiked ? postType : ''} ${isDisabled ? postBlockDisabled : ''}`}
        />
        {likesModal.data.postId === id && <LikesModal {...{ showLikesModal, likesModal, likeNames, type }} />}
      </div>
    </div>
  );
};

export default PostLikes;
