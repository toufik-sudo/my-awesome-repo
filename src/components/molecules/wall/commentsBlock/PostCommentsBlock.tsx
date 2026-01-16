import React, { useContext } from 'react';

import AddPostCommentBlock from 'components/molecules/wall/commentsBlock/AddPostCommentBlock';
import PostCommentList from 'components/molecules/wall/commentsBlock/PostCommentList';
import CommentsSpinner from 'components/atoms/wall/CommentsSpinner';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { CommentsListContext } from 'components/molecules/wall/PostBlock';

import style from 'sass-boilerplate/stylesheets/components/wall/PostComments.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render post comments block
 * @param userData
 * @param id
 * @param noOfComments
 * @param type
 * @constructor
 */
const PostCommentsBlock = ({ id, noOfComments, type }) => {
  const { displayBlock, textCenter, withSecondaryColor, mt15, pointer } = coreStyle;
  const { isCommentsLoading, newCommentsList, getCommentsList, forceReloadComments } = useContext(CommentsListContext);
  const showMoreBtn = newCommentsList.length < noOfComments && !forceReloadComments;
  const isLoading = isCommentsLoading && noOfComments && !forceReloadComments;

  return (
    <div className={style.comments}>
      {isLoading ? (
        <CommentsSpinner />
      ) : (
        showMoreBtn && (
          <DynamicFormattedMessage
            onClick={() => {
              getCommentsList(id, false, true);
            }}
            id={'wall.post.comments.show.more'}
            tag={HTML_TAGS.P}
            className={`${displayBlock} ${textCenter} ${withSecondaryColor} ${mt15} ${pointer}`}
          />
        )
      )}
      <PostCommentList {...{ type }} />
      <AddPostCommentBlock {...{ type, id }} />
    </div>
  );
};

export default PostCommentsBlock;
