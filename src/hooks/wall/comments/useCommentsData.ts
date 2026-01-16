import { useEffect, useState } from 'react';

import ArrayUtilities from 'utils/ArrayUtilities';
import { getCommentsData } from 'store/actions/wallActions';
import { DEFAULT_OFFSET } from 'constants/api';
import { getCommentsListOffset } from 'services/WallServices';

const arrayUtilities = new ArrayUtilities();
/**
 * Hook used to retrieve comments data and return comment state
 * @param nrOfComments
 */
export const useCommentsData = nrOfComments => {
  const [showComments, setShowComments] = useState(false);
  const [isCommentsLoading, setLoading] = useState(false);
  const [offset, setOffset] = useState(DEFAULT_OFFSET);
  const [isComponentLoading, setComponentLoading] = useState(false);
  const [newCommentsList, setCommentsList] = useState([]);
  const [postToAdd, setPostId] = useState(null);
  const [triggerCommentsList, setTriggerCommentsList] = useState(false);
  const [forceReloadComments, reloadComments] = useState(false);
  const [noOfComments, setNoOfComments] = useState(nrOfComments);
  const [commentsWereDeleted, setCommentsWereDeleted] = useState(false);

  const getCommentsList = (id, idChanged, fromComment) => {
    setLoading(true);
    if (idChanged) {
      setComponentLoading(true);
      setOffset(DEFAULT_OFFSET);
    }
    let offsetFromComment = offset;
    if (fromComment)
      offsetFromComment = getCommentsListOffset(
        commentsWereDeleted,
        offsetFromComment,
        offset,
        setCommentsWereDeleted,
        newCommentsList
      );
    setOffset(offsetFromComment);

    getCommentsData(id, idChanged ? DEFAULT_OFFSET : offsetFromComment).then(data => {
      const newData = arrayUtilities.getUniqueArrayValues([...newCommentsList, ...data.comments], 'id');
      setCommentsList(newData);
      setLoading(false);
      setComponentLoading(false);
      setCommentsWereDeleted(false);
    });
  };

  useEffect(() => {
    setLoading(true);
    if (triggerCommentsList && postToAdd) {
      getCommentsData(postToAdd, DEFAULT_OFFSET).then(data => {
        setCommentsList([...data.comments]);
        setTriggerCommentsList(false);
        setLoading(false);
        setNoOfComments(data.total);
        reloadComments(false);
        setCommentsWereDeleted(false);
      });
    }
    setLoading(false);
  }, [triggerCommentsList]);

  return {
    showComments,
    setShowComments,
    getCommentsList,
    isCommentsLoading,
    isComponentLoading,
    setComponentLoading,
    newCommentsList,
    setPostId,
    setTriggerCommentsList,
    setLoading,
    setCommentsList,
    reloadComments,
    forceReloadComments,
    noOfComments,
    setNoOfComments,
    setCommentsWereDeleted
  };
};
