import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PostsApi from 'api/PostsApi';
import { useIntl } from 'react-intl';

const postsApi = new PostsApi();
/**
 * Hook used to handle the integration
 * @param postId
 * @param setReloadPostsKey
 * @param notifyNewSpecificUsers
 * @param isOpen
 * @param setIsOpen
 */
export const useSpecificUsersSelection = ({ postId, setReloadPostsKey, notifyNewSpecificUsers, isOpen, setIsOpen }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isNotifying, setIsNotifying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { formatMessage } = useIntl();
  const [isLoadingSelectedUsers, setIsLoadingSelectedUsers] = useState(false);

  const onSelectUser = userId => {
    setHasError(false);
    setSelectedUsers([...selectedUsers, userId]);
  };

  const onRemoveUser = userId => {
    setSelectedUsers(selectedUsers.filter(id => id !== userId));
  };

  const reloadPosts = () => setReloadPostsKey(i => i + 1);

  const handleConfirmation = async () => {
    if (!selectedUsers.length) {
      setHasError(true);
      return;
    }
    setIsNotifying(true);
    await notifyNewSpecificUsers(selectedUsers, reloadPosts);
    setIsOpen(false);
    setIsNotifying(false);
    postId && setSelectedUsers([]);
  };

  useEffect(() => {
    if (!isOpen || !postId || isLoadingSelectedUsers) {
      return;
    }
    setSelectedUsers([]);
    setIsLoadingSelectedUsers(true);
    postsApi
      .getPost(postId)
      .then(({ data }) => setSelectedUsers(data.specificUserIds || []))
      .catch(() => toast(formatMessage({ id: 'toast.message.generic.error' })))
      .finally(() => setIsLoadingSelectedUsers(false));
  }, [postId, isOpen]);

  const handleCancel = async () => {
    setSelectedUsers([]);
    await notifyNewSpecificUsers([], reloadPosts);
    setIsOpen(false);
  };

  return {
    selectedUsers,
    isNotifying,
    hasError,
    onSelectUser,
    onRemoveUser,
    handleConfirmation,
    handleCancel,
    isLoadingSelectedUsers
  };
};
