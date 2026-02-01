// -----------------------------------------------------------------------------
// PostBottomSocialSection Component
// Migrated from old_app/src/components/molecules/wall/PostBottomSocialSection.tsx
// Renders likes, comments, and pin actions for a post
// -----------------------------------------------------------------------------

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Pin } from 'lucide-react';
import { FormattedMessage } from 'react-intl';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface PostBottomSocialSectionProps {
  postId: number;
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  isPinned?: boolean;
  showPinOption?: boolean;
  showComments: boolean;
  onToggleLike: () => void;
  onToggleComments: () => void;
  onTogglePin?: () => void;
  likeNames?: string[];
  className?: string;
}

const PostBottomSocialSection: React.FC<PostBottomSocialSectionProps> = ({
  postId,
  isLiked,
  likesCount,
  commentsCount,
  isPinned = false,
  showPinOption = true,
  showComments,
  onToggleLike,
  onToggleComments,
  onTogglePin,
  likeNames = [],
  className = ''
}) => {
  return (
    <div className={cn('flex items-center gap-2 text-muted-foreground', className)}>
      {/* Like button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleLike}
              className={cn(
                'gap-2 hover:text-destructive',
                isLiked && 'text-destructive'
              )}
            >
              <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
              <span className="text-sm">{likesCount}</span>
            </Button>
          </TooltipTrigger>
          {likeNames.length > 0 && (
            <TooltipContent>
              <div className="max-w-xs">
                {likeNames.slice(0, 5).map((name, idx) => (
                  <p key={idx} className="text-sm">{name}</p>
                ))}
                {likeNames.length > 5 && (
                  <p className="text-sm text-muted-foreground">
                    <FormattedMessage 
                      id="wall.posts.like.more" 
                      defaultMessage="and {count} more" 
                      values={{ count: likeNames.length - 5 }}
                    />
                  </p>
                )}
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      {/* Comments button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleComments}
        className={cn(
          'gap-2',
          showComments && 'text-primary'
        )}
      >
        <MessageCircle className="h-4 w-4" />
        <span className="text-sm">{commentsCount}</span>
      </Button>

      {/* Pin button */}
      {showPinOption && onTogglePin && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onTogglePin}
                className={cn(
                  'gap-2',
                  isPinned && 'text-primary'
                )}
              >
                <Pin className={cn('h-4 w-4', isPinned && 'fill-current')} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <FormattedMessage 
                id={isPinned ? 'wall.post.unpin' : 'wall.post.pin'} 
                defaultMessage={isPinned ? 'Unpin post' : 'Pin post'} 
              />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export { PostBottomSocialSection };
export default PostBottomSocialSection;
