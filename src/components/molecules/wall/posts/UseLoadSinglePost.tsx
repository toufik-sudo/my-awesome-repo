import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import PostsApi from 'api/PostsApi';
import { REDIRECT_DATA_TYPE } from 'constants/general';

const postsApi = new PostsApi();

/**
 * Loads a single post on wall and handles the wanted behaviour
 */
const useLoadSinglePost = (postId, type) => {
  const { formatMessage } = useIntl();
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState(null);
  const [showModal, setShowModal] = useState(type === REDIRECT_DATA_TYPE.SHOW_CONFIDENTIALITY);

  useEffect(() => {
    if (!postId) {
      return;
    }
    setIsLoading(true);
    postsApi
      .getPost(postId)
      .then(({ data }) => setPost(data))
      .catch(() => toast(formatMessage({ id: 'toast.message.generic.error' })))
      .finally(() => setIsLoading(false));
  }, [postId]);
  return { isLoading, post, showModal, setShowModal };
};

export default useLoadSinglePost;
