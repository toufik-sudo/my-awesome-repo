import React from 'react';

import PostLikes from 'components/atoms/wall/PostLikes';
import PostComments from 'components/atoms/wall/PostComments';
import PostPin from 'components/atoms/wall/PostPin';
import { useLikesData } from 'hooks/wall/useLikesData';
import { isMobile } from 'utils/general';
import PostMobileLikes from 'components/atoms/wall/posts/PostMobileLikes';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';

/**
 * Molecule component used to render post social block
 * @param post
 * @param showComments
 * @param setShowComments
 * @param noOfComments
 * @param shouldRenderPin
 * @constructor
 */
const PostBottomSocialSection = ({ post, showComments, setShowComments, noOfComments, shouldRenderPin }) => {
  const {
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
    currentUser
  } = useLikesData(post);
  const { withFontSmall, withGrayAccentColor } = coreStyle;
  const { id, type } = post;

  return (
    <>
      <div className={`${grid['d-flex']} ${withGrayAccentColor} ${withFontSmall}`}>
        <PostLikes
          {...{
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
          }}
        />
        <PostComments {...{ noOfComments, showComments, setShowComments, id, type }} />
        {shouldRenderPin && <PostPin {...post} />}
        
      </div>
      {isMobile() && (
        <PostMobileLikes key={id} {...{ showLikesModal, likeNames, postIsLiked, currentUser, id, noOfLikesState }} />
      )}
    </>
  );
};

export default PostBottomSocialSection;
