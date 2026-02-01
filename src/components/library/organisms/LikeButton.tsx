// -----------------------------------------------------------------------------
// LikeButton Component
// Animated like button with tooltip showing who liked
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface LikeUser {
  id: string;
  name: string;
}

export interface LikeButtonProps {
  /** Whether the current user has liked */
  isLiked?: boolean;
  
  /** Total number of likes */
  likesCount: number;
  
  /** Users who have liked (for tooltip) */
  likedByUsers?: LikeUser[];
  
  /** Callback when like is toggled */
  onLike?: (isLiked: boolean) => void;
  
  /** Whether like action is in progress */
  isLoading?: boolean;
  
  /** Whether to show the count */
  showCount?: boolean;
  
  /** Whether to show "Like" text */
  showLabel?: boolean;
  
  /** Custom class name */
  className?: string;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export const LikeButton: React.FC<LikeButtonProps> = ({
  isLiked = false,
  likesCount,
  likedByUsers = [],
  onLike,
  isLoading = false,
  showCount = true,
  showLabel = true,
  className,
  size = 'md'
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isLoading) return;
    
    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    
    onLike?.(!isLiked);
  };

  // Format likes tooltip
  const formatLikesTooltip = () => {
    if (likedByUsers.length === 0) {
      return 'Be the first to like this';
    }

    const displayedUsers = likedByUsers.slice(0, 5);
    const remainingCount = likedByUsers.length - 5;

    const names = displayedUsers.map(u => u.name);
    
    if (remainingCount > 0) {
      return (
        <div className="text-center">
          {names.map((name, i) => (
            <div key={i}>{name}</div>
          ))}
          <div className="text-muted-foreground">+{remainingCount} more</div>
        </div>
      );
    }

    return (
      <div className="text-center">
        {names.map((name, i) => (
          <div key={i}>{name}</div>
        ))}
      </div>
    );
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      button: 'h-8 px-2 text-xs',
      icon: 'h-3.5 w-3.5',
      gap: 'gap-1'
    },
    md: {
      button: 'h-9 px-3 text-sm',
      icon: 'h-4 w-4',
      gap: 'gap-2'
    },
    lg: {
      button: 'h-10 px-4 text-base',
      icon: 'h-5 w-5',
      gap: 'gap-2'
    }
  };

  const config = sizeConfig[size];

  const buttonContent = (
    <Button
      variant="ghost"
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        'flex items-center transition-all',
        config.button,
        config.gap,
        isLiked && 'text-destructive hover:text-destructive/80 hover:bg-destructive/10',
        isAnimating && 'scale-110',
        className
      )}
    >
      <Heart
        className={cn(
          config.icon,
          'transition-all',
          isLiked && 'fill-current',
          isAnimating && 'scale-125'
        )}
      />
      {showCount && likesCount > 0 && (
        <span>{likesCount}</span>
      )}
      {showLabel && (
        <span className="hidden sm:inline">
          {isLiked ? 'Liked' : 'Like'}
        </span>
      )}
    </Button>
  );

  // Wrap in tooltip if there are likes
  if (likedByUsers.length > 0) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            {buttonContent}
          </TooltipTrigger>
          <TooltipContent>
            {formatLikesTooltip()}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return buttonContent;
};

export default LikeButton;
