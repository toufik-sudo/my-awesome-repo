// -----------------------------------------------------------------------------
// useLikes Hook
// Manages like state and actions for posts/comments
// Migrated from old_app/src/hooks/wall/useLikesData.ts
// -----------------------------------------------------------------------------

import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import type { LikeUser } from '@/components/library/organisms/LikeButton';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface UseLikesConfig {
  /** Initial like state */
  isLiked?: boolean;
  
  /** Initial likes count */
  likesCount?: number;
  
  /** Initial list of users who liked */
  likedByUsers?: LikeUser[];
  
  /** Current user's display name */
  currentUserName?: string;
  
  /** Current user's ID */
  currentUserId?: string;
  
  /** API function to toggle like */
  onLikeToggle?: (itemId: string, isLiked: boolean) => Promise<void>;
}

export interface UseLikesResult {
  /** Whether the current user has liked */
  isLiked: boolean;
  
  /** Total likes count */
  likesCount: number;
  
  /** Users who have liked */
  likedByUsers: LikeUser[];
  
  /** Whether like action is in progress */
  isLoading: boolean;
  
  /** Toggle like state */
  toggleLike: (itemId: string) => Promise<void>;
  
  /** Manually set like state */
  setIsLiked: (liked: boolean) => void;
  
  /** Manually update likes count */
  setLikesCount: React.Dispatch<React.SetStateAction<number>>;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useLikes({
  isLiked: initialIsLiked = false,
  likesCount: initialLikesCount = 0,
  likedByUsers: initialLikedByUsers = [],
  currentUserName,
  currentUserId,
  onLikeToggle
}: UseLikesConfig = {}): UseLikesResult {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [likedByUsers, setLikedByUsers] = useState<LikeUser[]>(initialLikedByUsers);
  const [isLoading, setIsLoading] = useState(false);

  // Toggle like
  const toggleLike = useCallback(async (itemId: string) => {
    if (isLoading) return;

    const newIsLiked = !isLiked;
    
    // Optimistic update
    setIsLiked(newIsLiked);
    setLikesCount(prev => newIsLiked ? prev + 1 : Math.max(0, prev - 1));
    
    // Update liked by users list
    if (currentUserName && currentUserId) {
      if (newIsLiked) {
        setLikedByUsers(prev => [{ id: currentUserId, name: currentUserName }, ...prev]);
      } else {
        setLikedByUsers(prev => prev.filter(user => user.id !== currentUserId));
      }
    }

    // Call API if provided
    if (onLikeToggle) {
      setIsLoading(true);
      try {
        await onLikeToggle(itemId, newIsLiked);
      } catch (error) {
        // Revert on error
        setIsLiked(!newIsLiked);
        setLikesCount(prev => newIsLiked ? Math.max(0, prev - 1) : prev + 1);
        
        if (currentUserName && currentUserId) {
          if (newIsLiked) {
            setLikedByUsers(prev => prev.filter(user => user.id !== currentUserId));
          } else {
            setLikedByUsers(prev => [{ id: currentUserId, name: currentUserName }, ...prev]);
          }
        }
        
        toast.error('Failed to update like');
        console.error('Like toggle error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isLiked, isLoading, currentUserName, currentUserId, onLikeToggle]);

  return {
    isLiked,
    likesCount,
    likedByUsers,
    isLoading,
    toggleLike,
    setIsLiked,
    setLikesCount
  };
}

export default useLikes;
