import React from 'react';

import PostsList from 'components/molecules/wall/PostsList';
import PostListHeader from './PostListHeader';
import { usePostsListData } from 'hooks/wall/usePostsListData';

import { PostListContext } from 'components/molecules/wall/blocks/WallBaseBlock';

/**
 * Wrapper for post creation and post list
 *
 * @constructor
 */
const PostListWrapper = () => {
  const {
    setTriggerPin,
    isLoading,
    isBeneficiary,
    postsListData,
    hasMore,
    triggerPostsReload,
    handleLoadMoreItems,
    scrollRef
  } = usePostsListData();

  return (
    <PostListContext.Provider value={{ setTriggerPin, isLoading }}>
      <PostListHeader />
      <PostsList
        {...{
          postsListData,
          hasMore,
          setTriggerPin,
          triggerPostsReload,
          isBeneficiary,
          handleLoadMoreItems,
          scrollRef
        }}
      />
    </PostListContext.Provider>
  );
};

export default PostListWrapper;
