import { useContext } from 'react';
import { CommentsListContext } from 'components/molecules/wall/PostBlock';
import { usePinData } from 'hooks/wall/usePinData';

/**
 * Hook used to return comments data
 * @param type
 */
export const usePostCommentsData = type => {
  const { isCommentsLoading, getCommentsList, isComponentLoading, setComponentLoading, newCommentsList } = useContext(
    CommentsListContext
  );
  const { likeType } = usePinData(type);

  return {
    getCommentsList,
    setComponentLoading,
    isCommentsLoading,
    isComponentLoading,
    newCommentsList,
    likeType
  };
};
