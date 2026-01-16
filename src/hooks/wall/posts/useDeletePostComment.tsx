import { useState } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import CommentsApi from 'api/CommentsApi';
import { isUserManager, isUserAdmin } from 'services/security/accessServices';
import { useWallSelection } from 'hooks/wall/useWallSelection';

/**
 * Handles the deletion of a comment
 *
 */
const useDeletePostComment = (setCommentsList, setNoOfComments, setCommentsWereDeleted) => {
  const [commentToBeDeleted, setCommentToBeDeleted] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    selectedPlatform: { role }
  } = useWallSelection();
  const canDeleteComments = isUserManager(role) || isUserAdmin(role);
  const { formatMessage } = useIntl();

  const onDeleteComment = async () => {
    if (commentToBeDeleted === null) {
      return toast(formatMessage({ id: 'toast.message.generic.error' }));
    }

    try {
      setIsDeleting(true);
      await new CommentsApi().deleteComment(commentToBeDeleted);
      setCommentsList(comments => comments.filter(({ id }) => id !== commentToBeDeleted));
      setNoOfComments(count => count - 1);
      setCommentsWereDeleted(true);
      toast(formatMessage({ id: 'wall.comment.delete.success' }));
    } catch (error) {
      toast(formatMessage({ id: 'wall.comment.delete.error' }));
    }
    setIsDeleting(false);
    setCommentToBeDeleted(null);
  };

  return { commentToBeDeleted, setCommentToBeDeleted, onDeleteComment, isDeleting, canDeleteComments };
};

export default useDeletePostComment;
