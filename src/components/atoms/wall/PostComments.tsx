import React, { useContext } from 'react';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { usePostCommentsData } from 'hooks/wall/comments/usePostComments';
import { emptyFn } from 'utils/general';
import { CommentsListContext } from 'components/molecules/wall/PostBlock';

import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import style from 'sass-boilerplate/stylesheets/components/wall/PostList.module.scss';

/**
 * Atom component used to show post comments block
 * @param nrOfComments
 * @param showComments
 * @param setShowComments
 * @param id
 * @param type
 * @constructor
 */
const PostComments = ({ noOfComments, showComments, setShowComments, id, type }) => {
  const { likeType } = usePostCommentsData(type);
  const { newCommentsList, getCommentsList, setComponentLoading } = useContext(CommentsListContext);

  return (
    <div
      className={`${grid['mr-2']} ${grid['mr-md-5']} ${coreStyle.pointer} ${showComments ? likeType : ''} ${
        style.postActionBlock
      }`}
      onClick={() => {
        setShowComments(!showComments);
        newCommentsList && newCommentsList.length < noOfComments ? getCommentsList(id, true) : emptyFn();
        setComponentLoading(true);
      }}
    >
      <FontAwesomeIcon icon={faComment} className={`${grid['mr-2']} ${grid['mr-md-3']}`} />
      <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id={'wall.posts.comments'} values={{ noOfComments }} />
    </div>
  );
};

export default PostComments;
