import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';

import PostsApi from 'api/PostsApi';
import { POST_CONFIDENTIALITY_TYPES } from 'constants/wall/posts';
import { PostListContext, SpecificUsersContext } from 'components/molecules/wall/blocks/WallBaseBlock';
import { useWallSelection } from 'hooks/wall/useWallSelection';

const postsApi = new PostsApi();

/**
 * Hook used to manage confidentiality data and methods
 * @param postId
 * @param postProgramId
 * @param confidentialityType
 * @param openConfirmDeleteModal
 */
export const useUpdatePostConfidentiality = ({ id: postId, postProgramId, openConfirmDeleteModal }) => {
  const { setTriggerPin } = useContext(PostListContext);
  const intl = useIntl();
  const { selectedProgramId } = useWallSelection();
  const [disabled, setDisabled] = useState(false);
  const { openSpecificUsersModal } = useContext(SpecificUsersContext);

  const onUpdatePostToSpecificPeople = selectedUsers =>
    selectedUsers.length && updatePost(POST_CONFIDENTIALITY_TYPES.SPECIFIC_PEOPLE, selectedUsers);

  const onOptionChanged = async selectedOption => {
    if (selectedOption.type === POST_CONFIDENTIALITY_TYPES.DELETE) {
      return openConfirmDeleteModal(postId);
    }
    if (selectedOption.type === POST_CONFIDENTIALITY_TYPES.SPECIFIC_PEOPLE) {
      return openSpecificUsersModal(postProgramId, postId, onUpdatePostToSpecificPeople);
    }
    updatePost(selectedOption);
  };

  const updatePost = async (selectedOption, specificUserIds = []) => {
    const option = selectedOption || POST_CONFIDENTIALITY_TYPES.ME_ONLY;
    setDisabled(true);
    try {
      await postsApi.updatePost(postId, {
        confidentialityType: option.type || option,
        specificUserIds,
        specificProgramIds: [selectedProgramId || postProgramId]
      });
      setTriggerPin(i => i + 1);
      toast(intl.formatMessage({ id: 'wall.posts.update.success' }));
    } catch (e) {
      toast(intl.formatMessage({ id: 'wall.posts.update.error' }));
    }
    setDisabled(false);
  };

  return {
    onOptionChanged,
    updatePost,
    disabled
  };
};
