import { useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import CommentsApi from 'api/CommentsApi';
import { MAX_DESIGN_CONTENT } from 'constants/general';
import { CommentsListContext } from 'components/molecules/wall/PostBlock';
import { validatePostFile } from 'services/WallServices';

const commentsApi = new CommentsApi();

/**
 * Hook used to handle Create Post Data Save
 * @param postType
 * @param id
 */
export const useCreateComment = (postType, id) => {
  const [allDataValid, setDataStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasContentError, setHasContentError] = useState(true);
  const [contentLengthError, setContentLengthError] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const { setTriggerCommentsList, setPostId, reloadComments, setCommentsWereDeleted } = useContext(CommentsListContext);
  const [commentFile, setCommentFile] = useState<any>({});
  const intl = useIntl();
  const notify = succeeded =>
    toast(intl.formatMessage({ id: `wall.post.add.comment.${succeeded ? 'success' : 'failed'}` }));
  const updateCommentFile = newFileUpload => {
    if (!newFileUpload || !newFileUpload.file) {
      return setCommentFile({});
    }

    const validationResult = validatePostFile(newFileUpload);
    setCommentFile({ ...newFileUpload, error: validationResult.error, maxSize: validationResult.maxSize });
  };

  useEffect(() => {
    setDataStatus(true);
    if (!commentContent.trim().length) {
      setHasContentError(true);
    }

    if (commentContent.trim().length > MAX_DESIGN_CONTENT) {
      setHasContentError(true);
      setContentLengthError(true);
    }

    if (commentContent.trim().length && commentContent.trim().length < MAX_DESIGN_CONTENT) {
      setHasContentError(false);
      setContentLengthError(false);
    }
  }, [commentContent]);

  const addComment = async () => {
    setIsLoading(true);
    setHasContentError(true);
    reloadComments(true);
    setCommentsWereDeleted(false);

    try {
      let fileId;
      if (commentFile && commentFile.file) {
        fileId = await commentsApi.uploadFile({
          filename: commentFile.file.name,
          type: commentFile.fileType.type,
          file: commentFile.file
        });
      }
      const data = await commentsApi.createComment({
        postId: id,
        content: commentContent,
        fileId: fileId
      });

      if (data) {
        notify(true);
        setPostId(id);
        setTriggerCommentsList(true);
      }
      setTriggerCommentsList(false);
    } catch (e) {
      setTriggerCommentsList(false);
      reloadComments(false);
      notify(false);
      throw new Error(e);
    }
    setCommentFile({});
    setCommentContent('');
    setHasContentError(false);
    setIsLoading(false);
    setContentLengthError(false);
  };

  return {
    addComment,
    allDataValid: allDataValid && !commentFile.error,
    isLoading,
    hasContentError,
    commentContent,
    setCommentContent,
    setCommentFile: updateCommentFile,
    commentFile,
    contentLengthError
  };
};
