import React, { createContext } from 'react';

import PostAuthorDetails from 'components/atoms/wall/PostAuthorDetails';
import MediaTextContent from 'components/atoms/wall/MediaTextContent';
import PostPublishInfo from 'components/atoms/wall/PostPublishInfo';
import PostAuthorizeIcon from 'components/atoms/wall/PostAuthorizeIcon';
import PostBottomSocialSection from 'components/molecules/wall/PostBottomSocialSection';
import PostCommentsBlock from 'components/molecules/wall/commentsBlock/PostCommentsBlock';
import useDeletePostComment from 'hooks/wall/posts/useDeletePostComment';
import Loading from 'components/atoms/ui/Loading';
import { LOADER_TYPE } from 'constants/general';
import { PLATFORM_HIERARCHIC_TYPE } from 'constants/platforms';
import { POST_TYPE } from 'constants/wall/posts';
import { useCommentsData } from 'hooks/wall/comments/useCommentsData';
import { usePostAuthorizeData } from 'hooks/wall/confidentiality/usePostAuthorizeIcon';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';

import componentStyle from 'sass-boilerplate/stylesheets/components/wall/PostList.module.scss';
import { hasAtLeastSuperPlatformCreated, isUserSuperAdmin } from 'services/security/accessServices';
import { useWallSelection } from 'hooks/wall/useWallSelection';

export const CommentsListContext = createContext(null);

/**
 * Molecule component used to render base wall post block
 * @param post
 * @param openConfirmDeleteModal
 * @param postIdToBeDeleted
 * @param shouldRenderPin
 * @constructor
 */
const PostBlock = ({ post, openConfirmDeleteModal, postIdToBeDeleted, shouldRenderPin = true }) => {
  const {
    content,
    file,
    type,
    id,
    nrOfComments,
    isComponentLoading,
    confidentialityType,
    automaticType,
    endDate,
    isAutomatic,
    objectId,
    programs = [{}]
  } = post;
  const {
    postBlock,
    postBlockExpress,
    postBlockTask,
    postBlockWrapper,
    expanded,
    lineStrike,
    lineStrikeContainer
  } = componentStyle;
  const {
    setShowComments,
    showComments,
    getCommentsList,
    isCommentsLoading,
    setComponentLoading,
    newCommentsList,
    setCommentsList,
    setPostId,
    setTriggerCommentsList,
    reloadComments,
    forceReloadComments,
    noOfComments,
    setNoOfComments,
    setCommentsWereDeleted
  } = useCommentsData(nrOfComments);

  const { showConfidentiality } = usePostAuthorizeData(isAutomatic);

  const {
    commentToBeDeleted,
    setCommentToBeDeleted,
    canDeleteComments,
    onDeleteComment,
    isDeleting
  } = useDeletePostComment(setCommentsList, setNoOfComments, setCommentsWereDeleted);
  const { selectedPlatform } = useWallSelection();

  const { colorContent, colorTask } = useSelectedProgramDesign();

  if (postIdToBeDeleted && postIdToBeDeleted === id) {
    return (
      <div className={`${postBlockWrapper} ${postBlock}`}>
        <Loading type={LOADER_TYPE.DROPZONE} />
      </div>
    );
  }

  const isContent = type === POST_TYPE.EXPRESS_YOURSELF;

  const showOnlySuperAdminFirstContent =
    selectedPlatform.hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM &&
    isUserSuperAdmin(selectedPlatform.role);
  let showPostContent = true;

  if (showOnlySuperAdminFirstContent && isAutomatic) {
    showPostContent = hasAtLeastSuperPlatformCreated(automaticType);
  }

  return (
    <CommentsListContext.Provider
      value={{
        isCommentsLoading,
        getCommentsList,
        isDeleting,
        setCommentToBeDeleted,
        commentToBeDeleted,
        onDeleteComment,
        canDeleteComments,
        isComponentLoading,
        setComponentLoading,
        newCommentsList,
        setPostId,
        setTriggerCommentsList,
        reloadComments,
        forceReloadComments,
        setCommentsWereDeleted
      }}
    >
      {showPostContent && (
        <div className={postBlockWrapper}>
          <PostPublishInfo post={post} dateColor={isContent ? colorContent : colorTask} />
          <div className={`${postBlock} ${showComments || expanded} ${isContent ? postBlockExpress : postBlockTask}`}>
            <div className={lineStrikeContainer}>
              <div className={lineStrike} style={{ backgroundColor: isContent ? colorContent : colorTask }} />
            </div>
            <div>
              {showConfidentiality && (
                <PostAuthorizeIcon
                  {...{
                    confidentialityType,
                    id,
                    openConfirmDeleteModal,
                    postProgramId: programs && programs[0] && programs[0].id
                  }}
                />
              )}
              <PostAuthorDetails {...{ post, isAutomatic }} color={isContent ? colorContent : colorTask} />
              <MediaTextContent {...{ endDate, objectId, content, file, isAutomatic, automaticType }} />
              {!isAutomatic && (
                <PostBottomSocialSection {...{ post, setShowComments, showComments, noOfComments, shouldRenderPin }} />
              )}
              {showComments && <PostCommentsBlock {...{ id, noOfComments, type }} />}
            </div>
          </div>
        </div>
      )}
    </CommentsListContext.Provider>
  );
};

export default PostBlock;
