import PostsApi from 'api/PostsApi';
import { useDispatch } from 'react-redux';
import { setModalState } from 'store/actions/modalActions';
import { CONFIRMATION_MODAL } from 'constants/modal';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import useUnmount from 'hooks/general/useUnmount';

const postsApi = new PostsApi();

/**
 * Returns needed functions and variables to handle the deletion of a post
 * Also after a successfull delete it triggers a post reload
 *
 * @param triggerPostsReload
 */
const useOnDeletePost = triggerPostsReload => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const [postIdToBeDeleted, setPostIdToBeDeleted] = useState(null);

  const openConfirmDeleteModal = selectedId => {
    dispatch(setModalState(true, CONFIRMATION_MODAL, { selectedId }));
  };

  const onDeletePost = async postId => {
    if (!postId) {
      return toast(formatMessage({ id: 'toast.message.generic.error' }));
    }
    setPostIdToBeDeleted(postId);
    try {
      await postsApi.deletePost(postId);
      triggerPostsReload();
      toast(formatMessage({ id: 'wall.post.delete.success' }));
    } catch (error) {
      toast(formatMessage({ id: 'wall.post.delete.error' }));
    }
    dispatch(setModalState(false, CONFIRMATION_MODAL));
    setPostIdToBeDeleted(null);
  };

  useUnmount(() => dispatch(setModalState(false, CONFIRMATION_MODAL)));

  return { dispatch, openConfirmDeleteModal, onDeletePost, postIdToBeDeleted };
};

export default useOnDeletePost;
