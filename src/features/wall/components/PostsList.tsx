// -----------------------------------------------------------------------------
// PostsList Component
// Migrated from old_app/src/components/molecules/wall/PostsList.tsx
// -----------------------------------------------------------------------------

import React, { useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { PostBlock, type IPost } from './PostBlock';
import { PostsPlaceholder } from './PostsPlaceholder';
import { Button } from '@/components/ui/button';
import { FormattedMessage } from 'react-intl';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export interface PostsListProps {
  posts: IPost[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onDeletePost?: (postId: number) => Promise<void>;
  isBeneficiary?: boolean;
  colorContent?: string;
  colorTask?: string;
  className?: string;
}

const PostsList: React.FC<PostsListProps> = ({
  posts,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  onDeletePost,
  isBeneficiary = false,
  colorContent,
  colorTask,
  className = ''
}) => {
  const [postIdToDelete, setPostIdToDelete] = React.useState<number | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const openConfirmDeleteModal = useCallback((postId: number) => {
    setPostIdToDelete(postId);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setPostIdToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!postIdToDelete || !onDeletePost) return;
    
    setIsDeleting(true);
    try {
      await onDeletePost(postIdToDelete);
    } finally {
      setIsDeleting(false);
      setPostIdToDelete(null);
    }
  }, [postIdToDelete, onDeletePost]);

  // Initial loading state
  if (isLoading && posts.length === 0) {
    return <PostsPlaceholder count={3} />;
  }

  // Empty state
  if (!isLoading && posts.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12', className)}>
        <p className="text-muted-foreground text-center">
          <FormattedMessage 
            id="wall.posts.empty" 
            defaultMessage="No posts yet. Be the first to share something!" 
          />
        </p>
      </div>
    );
  }

  return (
    <>
      <div ref={scrollRef} className={cn('space-y-4', className)}>
        {posts.map((post) => (
          <PostBlock
            key={post.id}
            post={post}
            openConfirmDeleteModal={openConfirmDeleteModal}
            postIdToBeDeleted={isDeleting ? postIdToDelete : null}
            shouldRenderPin={!isBeneficiary}
            colorContent={colorContent}
            colorTask={colorTask}
            canDelete={!!onDeletePost}
          />
        ))}

        {/* Loading more indicator */}
        {isLoading && posts.length > 0 && (
          <PostsPlaceholder count={2} />
        )}

        {/* Load more button */}
        {hasMore && !isLoading && (
          <div className="flex justify-center py-4">
            <Button 
              variant="outline" 
              onClick={onLoadMore}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              <FormattedMessage id="wall.posts.loadMore" defaultMessage="Load more" />
            </Button>
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={postIdToDelete !== null} onOpenChange={(open) => !open && closeDeleteModal()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <FormattedMessage id="wall.post.delete.title" defaultMessage="Delete Post" />
            </AlertDialogTitle>
            <AlertDialogDescription>
              <FormattedMessage 
                id="wall.post.delete.question" 
                defaultMessage="Are you sure you want to delete this post? This action cannot be undone." 
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              <FormattedMessage id="common.cancel" defaultMessage="Cancel" />
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              <FormattedMessage id="common.delete" defaultMessage="Delete" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export { PostsList };
export default PostsList;
