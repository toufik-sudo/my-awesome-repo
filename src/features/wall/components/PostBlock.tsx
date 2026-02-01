// -----------------------------------------------------------------------------
// PostBlock Component
// Migrated from old_app/src/components/molecules/wall/PostBlock.tsx
// -----------------------------------------------------------------------------

import React, { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { Loading } from '@/components/library/atoms/Loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Heart, Pin, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FormattedMessage } from 'react-intl';
import { format } from 'date-fns';
import { POST_TYPE } from '@/constants/wall/posts';

// Context for comments
export interface CommentsListContextValue {
  isCommentsLoading: boolean;
  newCommentsList: IComment[];
  noOfComments: number;
  showComments: boolean;
  setShowComments: (show: boolean) => void;
}

export const CommentsListContext = createContext < CommentsListContextValue | null > (null);

export interface IPostAuthor {
  firstName?: string;
  lastName?: string;
  croppedPicturePath?: string;
  companyRole?: string;
}

export interface IPostFile {
  url?: string;
  type?: string;
  name?: string;
}

export interface IComment {
  id: number;
  content: string;
  author: IPostAuthor;
  createdAt: string;
}

export interface IPost {
  id: number;
  title?: string;
  content: string;
  type: number;
  author: IPostAuthor;
  file?: IPostFile;
  nrOfComments: number;
  nrOfLikes: number;
  isLiked?: boolean;
  isPinned?: boolean;
  createdAt: string;
  endDate?: string;
  confidentialityType?: number;
  isAutomatic?: boolean;
  automaticType?: string;
  programs?: Array<{ id: number; name: string }>;
}

export interface PostBlockProps {
  post: IPost;
  openConfirmDeleteModal?: (postId: number) => void;
  postIdToBeDeleted?: number | null;
  shouldRenderPin?: boolean;
  colorContent?: string;
  colorTask?: string;
  onLike?: (postId: number) => void;
  onUnlike?: (postId: number) => void;
  canDelete?: boolean;
}

const PostBlock: React.FC<PostBlockProps> = ({
  post,
  openConfirmDeleteModal,
  postIdToBeDeleted,
  shouldRenderPin = true,
  colorContent = 'hsl(var(--primary))',
  colorTask = 'hsl(var(--accent))',
  onLike,
  onUnlike,
  canDelete = false
}) => {
  const {
    id,
    title,
    content,
    type,
    author,
    file,
    nrOfComments,
    nrOfLikes,
    isLiked,
    isPinned,
    createdAt,
    endDate,
    isAutomatic
  } = post;

  const [showComments, setShowComments] = React.useState(false);
  const [likesCount, setLikesCount] = React.useState(nrOfLikes);
  const [liked, setLiked] = React.useState(isLiked);

  const isContentType = type === POST_TYPE.EXPRESS_YOURSELF;
  const accentColor = isContentType ? colorContent : colorTask;

  // Loading state when deleting
  if (postIdToBeDeleted && postIdToBeDeleted === id) {
    return (
      <Card className="mb-4">
        <CardContent className="p-6">
          <Loading type="local" size="md" />
        </CardContent>
      </Card>
    );
  }

  const handleLikeToggle = () => {
    if (liked) {
      setLikesCount(prev => prev - 1);
      setLiked(false);
      onUnlike?.(id);
    } else {
      setLikesCount(prev => prev + 1);
      setLiked(true);
      onLike?.(id);
    }
  };

  const authorName = `${author?.firstName || ''} ${author?.lastName || ''}`.trim() || 'Unknown';
  const authorInitials = `${author?.firstName?.charAt(0) || ''}${author?.lastName?.charAt(0) || ''}`.toUpperCase() || 'U';

  return (
    <Card className="mb-4 overflow-hidden">
      {/* Accent line */}
      <div className="h-1" style={{ backgroundColor: accentColor }} />

      <CardContent className="p-4">
        {/* Header with author and actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={author?.croppedPicturePath} alt={authorName} />
              <AvatarFallback style={{ backgroundColor: accentColor }} className="text-white text-sm">
                {authorInitials}
              </AvatarFallback>
            </Avatar>
            {createdAt && <div>
              <p className="font-medium text-sm">{authorName}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(createdAt || ""), 'PPp')}
              </p>
            </div>}
          </div>

          <div className="flex items-center gap-2">
            {isPinned && shouldRenderPin && (
              <Badge variant="secondary" className="gap-1">
                <Pin className="h-3 w-3" />
                <FormattedMessage id="wall.post.pinned" defaultMessage="Pinned" />
              </Badge>
            )}

            {canDelete && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover">
                  <DropdownMenuItem
                    onClick={() => openConfirmDeleteModal?.(id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    <FormattedMessage id="wall.post.delete" defaultMessage="Delete" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Title */}
        {title && (
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
        )}

        {/* Content */}
        <p className="text-sm text-foreground whitespace-pre-wrap mb-4">{content}</p>

        {/* File/Media */}
        {file?.url && (
          <div className="mb-4 rounded-lg overflow-hidden">
            {file.type?.startsWith('image') ? (
              <img
                src={file.url}
                alt={file.name || 'Post image'}
                className="w-full max-h-96 object-cover"
              />
            ) : file.type?.startsWith('video') ? (
              <video
                src={file.url}
                controls
                className="w-full max-h-96"
              />
            ) : (
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {file.name || 'Download file'}
              </a>
            )}
          </div>
        )}

        {/* Task end date */}
        {endDate && type === POST_TYPE.TASK && (
          <div className="mb-4 p-2 bg-muted rounded-md">
            <p className="text-xs text-muted-foreground">
              <FormattedMessage id="wall.post.task.deadline" defaultMessage="Deadline:" />{' '}
              <span className="font-medium text-foreground">
                {format(new Date(endDate || ""), 'PPP')}
              </span>
            </p>
          </div>
        )}

        {/* Social actions */}
        {!isAutomatic && (
          <div className="flex items-center gap-4 pt-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              className={cn('gap-2', liked && 'text-destructive')}
              onClick={handleLikeToggle}
            >
              <Heart className={cn('h-4 w-4', liked && 'fill-current')} />
              <span>{likesCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{nrOfComments}</span>
            </Button>
          </div>
        )}

        {/* Comments section placeholder */}
        {showComments && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              <FormattedMessage id="wall.post.comments.placeholder" defaultMessage="Comments will appear here..." />
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { PostBlock };
export default PostBlock;
