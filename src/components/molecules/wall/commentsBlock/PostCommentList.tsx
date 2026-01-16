import React, { useContext } from 'react';

import PostCommentBlock from './PostCommentBlock';
import useUnmount from 'hooks/general/useUnmount';
import CommentsSpinner from 'components/atoms/wall/CommentsSpinner';
import { CommentsListContext } from 'components/molecules/wall/PostBlock';

/**
 * Molecule component used to render post comment list
 * @param type
 * @constructor
 */
const PostCommentList = ({ type }) => {
  const {
    isComponentLoading,
    newCommentsList,
    forceReloadComments,
    isDeleting,
    canDeleteComments,
    setCommentToBeDeleted,
    commentToBeDeleted,
    onDeleteComment
  } = useContext(CommentsListContext);

  useUnmount(() => setCommentToBeDeleted(null));

  if (isComponentLoading || forceReloadComments) {
    setCommentToBeDeleted(null);
    return <CommentsSpinner />;
  }

  if (!newCommentsList.length) {
    return null;
  }

  return (
    <div>
      {newCommentsList
        .slice(0)
        .reverse()
        .map(comment => (
          <PostCommentBlock
            key={comment.id}
            {...{
              comment,
              type,
              setCommentToBeDeleted,
              commentToBeDeleted,
              onDeleteComment,
              canDeleteComments,
              isDeleting
            }}
          />
        ))}
    </div>
  );
};

export default PostCommentList;
