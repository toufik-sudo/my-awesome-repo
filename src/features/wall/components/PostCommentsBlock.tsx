// -----------------------------------------------------------------------------
// PostCommentsBlock Component
// Displays comments section for posts
// Migrated from old_app/src/components/molecules/wall/commentsBlock/PostCommentsBlock.tsx
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Send, MoreHorizontal, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Loading } from '@/components/library/atoms/Loading';
import { formatDistanceToNow } from 'date-fns';
import { IComment, IPostAuthor } from './PostBlock';

interface PostCommentsBlockProps {
  postId: number;
  comments: IComment[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onAddComment?: (content: string) => void;
  onDeleteComment?: (commentId: number) => void;
  canDeleteComments?: boolean;
  isAddingComment?: boolean;
  className?: string;
}

const CommentItem: React.FC<{
  comment: IComment;
  onDelete?: (id: number) => void;
  canDelete?: boolean;
}> = ({ comment, onDelete, canDelete }) => {
  const authorName = `${comment.author.firstName || ''} ${comment.author.lastName || ''}`.trim() || 'Unknown';
  const authorInitials = `${comment.author.firstName?.charAt(0) || ''}${comment.author.lastName?.charAt(0) || ''}`.toUpperCase() || 'U';

  return (
    <div className="flex gap-3 py-3 group">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={comment.author.croppedPicturePath} alt={authorName} />
        <AvatarFallback className="text-xs bg-muted">
          {authorInitials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="bg-muted/50 rounded-lg px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">{authorName}</span>
            {canDelete && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover">
                  <DropdownMenuItem 
                    onClick={() => onDelete?.(comment.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    <FormattedMessage id="wall.comment.delete" defaultMessage="Delete" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <p className="text-sm text-foreground whitespace-pre-wrap mt-1">
            {comment.content}
          </p>
        </div>
        <span className="text-xs text-muted-foreground mt-1 block">
          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
};

const PostCommentsBlock: React.FC<PostCommentsBlockProps> = ({
  postId,
  comments,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  onAddComment,
  onDeleteComment,
  canDeleteComments = false,
  isAddingComment = false,
  className,
}) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className={cn('border-t pt-4', className)}>
      {/* Comments List */}
      {isLoading && comments.length === 0 ? (
        <div className="flex justify-center py-4">
          <Loading type="local" size="sm" />
        </div>
      ) : (
        <>
          {hasMore && onLoadMore && (
            <Button
              variant="link"
              size="sm"
              className="w-full mb-2"
              onClick={onLoadMore}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loading type="local" size="sm" />
              ) : (
                <FormattedMessage 
                  id="wall.post.comments.show.more" 
                  defaultMessage="Show more comments" 
                />
              )}
            </Button>
          )}

          <ScrollArea className={cn(comments.length > 3 ? 'max-h-64' : '')}>
            <div className="space-y-1 divide-y divide-border/50">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onDelete={onDeleteComment}
                  canDelete={canDeleteComments}
                />
              ))}
            </div>
          </ScrollArea>

          {comments.length === 0 && !isLoading && (
            <p className="text-sm text-muted-foreground text-center py-4">
              <FormattedMessage 
                id="wall.post.comments.empty" 
                defaultMessage="No comments yet. Be the first to comment!" 
              />
            </p>
          )}
        </>
      )}

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          disabled={isAddingComment}
          className="flex-1"
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={!newComment.trim() || isAddingComment}
        >
          {isAddingComment ? (
            <Loading type="local" size="sm" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
};

export { PostCommentsBlock };
export default PostCommentsBlock;
