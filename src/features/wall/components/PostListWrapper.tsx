// -----------------------------------------------------------------------------
// PostListWrapper Component
// Migrated from old_app/src/components/molecules/wall/posts/PostListWrapper.tsx
// Orchestrates posts list with header and state management
// -----------------------------------------------------------------------------

import React, { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { PostsList, type PostsListProps } from './PostsList';
import { PostListHeader } from './PostListHeader';
import CreatePostBlock from './CreatePostBlock';
import type { IPost } from './PostBlock';

// Context for post list state
export interface PostListContextValue {
  isLoading: boolean;
  setTriggerPin?: (trigger: boolean) => void;
}

export const PostListContext = createContext<PostListContextValue>({
  isLoading: false
});

export interface PostListWrapperProps {
  posts: IPost[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onDeletePost?: (postId: number) => Promise<void>;
  isBeneficiary?: boolean;
  selectedProgramId?: number | null;
  showCreatePost?: boolean;
  colorContent?: string;
  colorTask?: string;
  className?: string;
}

const PostListWrapper: React.FC<PostListWrapperProps> = ({
  posts,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  onDeletePost,
  isBeneficiary = false,
  selectedProgramId = null,
  showCreatePost = true,
  colorContent,
  colorTask,
  className = ''
}) => {
  const contextValue: PostListContextValue = {
    isLoading
  };

  return (
    <PostListContext.Provider value={contextValue}>
      <div className={cn('w-full max-w-2xl mx-auto', className)}>
        {/* Header - shows create post or summary based on user type */}
        <PostListHeader 
          isBeneficiary={isBeneficiary}
          selectedProgramId={selectedProgramId}
        />

        {/* Create post block */}
        {showCreatePost && !isBeneficiary && selectedProgramId && (
          <div className="mb-6">
            <CreatePostBlock onPostCreated={() => onLoadMore?.()} />
          </div>
        )}

        {/* Posts list */}
        <PostsList
          posts={posts}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          onDeletePost={onDeletePost}
          isBeneficiary={isBeneficiary}
          colorContent={colorContent}
          colorTask={colorTask}
        />
      </div>
    </PostListContext.Provider>
  );
};

export { PostListWrapper };
export default PostListWrapper;
