// -----------------------------------------------------------------------------
// PostCard Component
// Social post card with author, content, likes, and comments
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Heart,
  MessageCircle,
  Pin,
  MoreHorizontal,
  Image as ImageIcon,
  FileText,
  ExternalLink
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PostAuthor {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role?: string;
}

export interface PostAttachment {
  id: string;
  type: 'image' | 'file' | 'link';
  url: string;
  name?: string;
  thumbnailUrl?: string;
}

export interface PostData {
  id: string;
  content: string;
  author: PostAuthor;
  createdAt: Date | string;
  updatedAt?: Date | string;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  isPinned?: boolean;
  isAutomatic?: boolean;
  type?: 'content' | 'task' | 'announcement';
  attachments?: PostAttachment[];
  likedByUsers?: Array<{ id: string; name: string }>;
}

export interface PostCardProps {
  post: PostData;
  onLike?: (postId: string, isLiked: boolean) => void;
  onComment?: (postId: string) => void;
  onPin?: (postId: string, isPinned: boolean) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onAuthorClick?: (authorId: string) => void;
  showPinAction?: boolean;
  showActions?: boolean;
  isLikeLoading?: boolean;
  className?: string;
}

// -----------------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------------

interface PostAuthorHeaderProps {
  author: PostAuthor;
  createdAt: Date | string;
  type?: PostData['type'];
  isPinned?: boolean;
  onAuthorClick?: (authorId: string) => void;
}

const PostAuthorHeader: React.FC<PostAuthorHeaderProps> = ({
  author,
  createdAt,
  type,
  isPinned,
  onAuthorClick
}) => {
  const fullName = `${author.firstName} ${author.lastName}`;
  const initials = `${author.firstName[0]}${author.lastName[0]}`.toUpperCase();
  const parsedDate = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;

  const typeColors = {
    content: 'bg-secondary/20 text-secondary-foreground',
    task: 'bg-primary/20 text-primary-foreground',
    announcement: 'bg-accent/20 text-accent-foreground'
  };

  return (
    <div className="flex items-start gap-3">
      <Avatar
        className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
        onClick={() => onAuthorClick?.(author.id)}
      >
        <AvatarImage src={author.avatarUrl} alt={fullName} />
        <AvatarFallback className="bg-secondary text-secondary-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="font-semibold text-sm hover:underline cursor-pointer"
            onClick={() => onAuthorClick?.(author.id)}
          >
            {fullName}
          </span>
          {type && (
            <Badge variant="outline" className={cn('text-xs', typeColors[type])}>
              {type}
            </Badge>
          )}
          {isPinned && (
            <Badge variant="outline" className="text-xs bg-accent/20 text-accent-foreground">
              <Pin className="h-3 w-3 mr-1" />
              Pinned
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(parsedDate, { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};

interface PostAttachmentsProps {
  attachments: PostAttachment[];
}

const PostAttachments: React.FC<PostAttachmentsProps> = ({ attachments }) => {
  if (!attachments.length) return null;

  const images = attachments.filter(a => a.type === 'image');
  const files = attachments.filter(a => a.type === 'file');
  const links = attachments.filter(a => a.type === 'link');

  return (
    <div className="space-y-3 mt-3">
      {/* Images */}
      {images.length > 0 && (
        <div className={cn(
          'grid gap-2',
          images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
        )}>
          {images.map((img) => (
            <a
              key={img.id}
              href={img.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative rounded-lg overflow-hidden group"
            >
              <img
                src={img.thumbnailUrl || img.url}
                alt={img.name || 'Post image'}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </a>
          ))}
        </div>
      )}

      {/* Files */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <a
              key={file.id}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm flex-1 truncate">{file.name || 'File'}</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          ))}
        </div>
      )}

      {/* Links */}
      {links.length > 0 && (
        <div className="space-y-2">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <ExternalLink className="h-5 w-5 text-secondary" />
              <span className="text-sm flex-1 truncate text-secondary">{link.name || link.url}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onPin,
  onEdit,
  onDelete,
  onShare,
  onAuthorClick,
  showPinAction = false,
  showActions = true,
  isLikeLoading = false,
  className
}) => {
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    if (!isLikeLoading) {
      onLike?.(post.id, !post.isLiked);
    }
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
    onComment?.(post.id);
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <PostAuthorHeader
            author={post.author}
            createdAt={post.createdAt}
            type={post.type}
            isPinned={post.isPinned}
            onAuthorClick={onAuthorClick}
          />

          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border shadow-lg">
                {showPinAction && (
                  <DropdownMenuItem onClick={() => onPin?.(post.id, !post.isPinned)}>
                    <Pin className="h-4 w-4 mr-2" />
                    {post.isPinned ? 'Unpin' : 'Pin'} post
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(post.id)}>
                    Edit post
                  </DropdownMenuItem>
                )}
                {onShare && (
                  <DropdownMenuItem onClick={() => onShare(post.id)}>
                    Share
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(post.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    Delete post
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Post Content */}
        <p className="text-sm whitespace-pre-wrap">{post.content}</p>

        {/* Attachments */}
        {post.attachments && post.attachments.length > 0 && (
          <PostAttachments attachments={post.attachments} />
        )}
      </CardContent>

      <Separator />

      <CardFooter className="py-2">
        <div className="flex items-center gap-4 w-full">
          {/* Like Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={isLikeLoading}
            className={cn(
              'flex items-center gap-2',
              post.isLiked && 'text-destructive hover:text-destructive/80'
            )}
          >
            <Heart
              className={cn('h-4 w-4', post.isLiked && 'fill-current')}
            />
            <span className="text-sm">
              {post.likesCount > 0 ? post.likesCount : ''} {post.isLiked ? 'Liked' : 'Like'}
            </span>
          </Button>

          {/* Comment Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCommentClick}
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">
              {post.commentsCount > 0 ? post.commentsCount : ''} Comment{post.commentsCount !== 1 ? 's' : ''}
            </span>
          </Button>

          {/* Pin indicator (if pinned) */}
          {showPinAction && post.isPinned && (
            <div className="ml-auto flex items-center text-accent-foreground">
              <Pin className="h-4 w-4" />
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
