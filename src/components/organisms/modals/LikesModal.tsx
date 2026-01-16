import React from 'react';

import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import LikesList from 'components/atoms/wall/posts/LikesList';

import postStyle from 'sass-boilerplate/stylesheets/components/wall/PostList.module.scss';
import { POST, POST_TYPES } from 'constants/wall/posts';

/**
 *
 * @param showLikesModal
 * @param likesModal
 * @param likeNames
 * @param type
 * @constructor
 */
const LikesModal = ({ showLikesModal, likesModal, likeNames, type }) => {
  const { likes, likesBackBtn, likesBack, express, task, likesList } = postStyle;
  const postColor = type === POST_TYPES[POST] ? express : task;

  return (
    <FlexibleModalContainer
      fullOnMobile={false}
      closeModal={() => showLikesModal(false, null)}
      isModalOpen={likesModal.active}
      className={likes}
    >
      <>
        <div className={likesBack}>
          <button onClick={() => showLikesModal(false)} className={`${likesBackBtn} ${postColor}`} />
        </div>

        <div className={likesList}>
          <LikesList {...{ likeNames, postColor }} />
        </div>
      </>
    </FlexibleModalContainer>
  );
};

export default LikesModal;
