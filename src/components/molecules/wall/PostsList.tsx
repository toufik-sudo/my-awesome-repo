import React, { useContext } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import PostBlock from 'components/molecules/wall/PostBlock';
import PostsPlaceholders from 'components/molecules/wall/placeholders/PostsPlaceholders';
import ConfirmationModal from 'components/organisms/modals/ConfirmationModal';
import useOnDeletePost from 'hooks/wall/posts/useOnDeletePosts';
import { HEIGHT, THRESHOLD } from 'constants/wall/posts';
import { PostListContext } from 'components/molecules/wall/blocks/WallBaseBlock';

import style from 'sass-boilerplate/stylesheets/components/wall/PostList.module.scss';

/**
 * Molecule component used to render Infinite Scroll component
 * @constructor
 */
const PostsList = ({ postsListData, hasMore, triggerPostsReload, isBeneficiary, handleLoadMoreItems, scrollRef }) => {
  const { isLoading } = useContext(PostListContext);
  const { openConfirmDeleteModal, onDeletePost, postIdToBeDeleted } = useOnDeletePost(triggerPostsReload);

  if (isLoading) return <PostsPlaceholders />;

  return (
    <div className={style.baseList}>
      <InfiniteScroll
        hasMore={hasMore}
        height={HEIGHT}
        threshold={THRESHOLD}
        loadMore={handleLoadMoreItems}
        initialLoad={false}
        isReverse={false}
        scrollref={scrollRef}
      >
        {Object.values(postsListData).map(post => (
          <PostBlock
            key={(post as any).id}
            {...{ post, openConfirmDeleteModal, postIdToBeDeleted, shouldRenderPin: !isBeneficiary }}
          />
        ))}
        <div>{(isLoading || hasMore) && <PostsPlaceholders />}</div>
      </InfiniteScroll>
      <ConfirmationModal question="wall.post.delete.question" onAccept={onDeletePost} />
    </div>
  );
};

export default PostsList;
