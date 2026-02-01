import React from 'react';
import { useIntl } from 'react-intl';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import RankRowElement from './RankRowElement';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface RankingUser {
  uuid: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  croppedPicturePath?: string;
  points: number;
}

export interface RankingListProps {
  /** Array of ranked users */
  users: RankingUser[];
  /** Whether data is loading */
  isLoading?: boolean;
  /** Whether there are more users to load */
  hasMore?: boolean;
  /** Callback to load more users */
  onLoadMore?: () => void;
  /** Callback when a user row is clicked */
  onUserClick?: (user: RankingUser) => void;
  /** Maximum height of the scrollable area */
  maxHeight?: string;
  /** Additional CSS classes */
  className?: string;
  /** Empty state message key */
  emptyMessageId?: string;
}

// -----------------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------------

const RankingListHeader: React.FC = () => {
  const intl = useIntl();

  return (
    <div className="flex items-center gap-4 py-2 px-4 border-b bg-muted/30 text-sm font-medium text-muted-foreground">
      <div className="w-8 text-center">
        {intl.formatMessage({ id: 'ranking.header.rank' })}
      </div>
      <div className="w-10" /> {/* Avatar space */}
      <div className="flex-1">
        {intl.formatMessage({ id: 'ranking.header.name' })}
      </div>
      <div className="text-right">
        {intl.formatMessage({ id: 'ranking.header.points' })}
      </div>
    </div>
  );
};

const RankingListSkeleton: React.FC = () => (
  <div className="space-y-2 p-4">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex items-center gap-4 py-3">
        <Skeleton className="w-8 h-6" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="flex-1 h-4" />
        <Skeleton className="w-16 h-4" />
      </div>
    ))}
  </div>
);

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

/**
 * RankingList displays a scrollable leaderboard of users
 * Supports infinite scroll loading and click interactions
 * 
 * @example
 * ```tsx
 * <RankingList
 *   users={rankings}
 *   isLoading={isLoading}
 *   hasMore={hasNextPage}
 *   onLoadMore={loadMore}
 *   onUserClick={(user) => navigate(`/users/${user.uuid}`)}
 * />
 * ```
 */
const RankingList: React.FC<RankingListProps> = ({
  users,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  onUserClick,
  maxHeight = '400px',
  className,
  emptyMessageId = 'wall.users.rankings.none',
}) => {
  const intl = useIntl();

  // Handle scroll to load more
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (!hasMore || isLoading || !onLoadMore) return;

    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const threshold = 100;

    if (scrollHeight - scrollTop - clientHeight < threshold) {
      onLoadMore();
    }
  };

  // Empty state
  if (!isLoading && users.length === 0) {
    return (
      <div className={cn('text-center py-8 text-muted-foreground', className)}>
        <p>{intl.formatMessage({ id: emptyMessageId })}</p>
      </div>
    );
  }

  return (
    <div className={cn('rounded-lg border bg-card', className)}>
      <RankingListHeader />
      
      <ScrollArea 
        style={{ maxHeight }} 
        className="overflow-auto"
        onScrollCapture={handleScroll}
      >
        {users.map((user, index) => (
          <RankRowElement
            key={user.uuid}
            rank={index + 1}
            firstName={user.firstName}
            lastName={user.lastName}
            avatarUrl={user.avatarUrl || user.croppedPicturePath}
            points={user.points}
            onClick={onUserClick ? () => onUserClick(user) : undefined}
          />
        ))}
        
        {/* Loading indicator for infinite scroll */}
        {(isLoading || hasMore) && <RankingListSkeleton />}
      </ScrollArea>
    </div>
  );
};

export default RankingList;
