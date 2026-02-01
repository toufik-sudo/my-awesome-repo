import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface RankRowElementProps {
  /** User's ranking position */
  rank: number;
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** URL to user's avatar image */
  avatarUrl?: string;
  /** User's points total */
  points: number;
  /** Optional click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

/**
 * RankRowElement displays a single row in a ranking/leaderboard list
 * Shows rank position, user avatar, name, and points
 * 
 * @example
 * ```tsx
 * <RankRowElement
 *   rank={1}
 *   firstName="John"
 *   lastName="Doe"
 *   avatarUrl="/avatars/john.jpg"
 *   points={1250}
 * />
 * ```
 */
const RankRowElement: React.FC<RankRowElementProps> = ({
  rank,
  firstName,
  lastName,
  avatarUrl,
  points,
  onClick,
  className,
}) => {
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  
  // Highlight top 3 positions
  const getRankStyle = () => {
    switch (rank) {
      case 1:
        return 'text-yellow-500 font-bold';
      case 2:
        return 'text-gray-400 font-semibold';
      case 3:
        return 'text-amber-600 font-semibold';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-4 py-3 px-4 hover:bg-muted/50 transition-colors rounded-lg',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Rank Position */}
      <div className={cn('w-8 text-center text-lg', getRankStyle())}>
        {rank}
      </div>

      {/* Avatar */}
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl} alt={`${firstName} ${lastName}`} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">
          {firstName} {lastName}
        </p>
      </div>

      {/* Points */}
      <div className="text-right">
        <span className="font-semibold text-primary">{points.toLocaleString()}</span>
        <span className="text-xs text-muted-foreground ml-1">pts</span>
      </div>
    </div>
  );
};

export default RankRowElement;
