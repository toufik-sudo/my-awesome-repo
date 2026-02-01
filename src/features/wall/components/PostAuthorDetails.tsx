// -----------------------------------------------------------------------------
// PostAuthorDetails Component
// Displays post author avatar, name, and role
// Migrated from old_app/src/components/atoms/wall/PostAuthorDetails.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IPostAuthor } from './PostBlock';

interface PostAuthorDetailsProps {
  author: IPostAuthor;
  createdAt?: string;
  isAutomatic?: boolean;
  color?: string;
  className?: string;
}

const PostAuthorDetails: React.FC<PostAuthorDetailsProps> = ({
  author,
  createdAt,
  isAutomatic = false,
  color,
  className,
}) => {
  const authorName = `${author.firstName || ''} ${author.lastName || ''}`.trim() || 'Unknown';
  const authorInitials = `${author.firstName?.charAt(0) || ''}${author.lastName?.charAt(0) || ''}`.toUpperCase() || 'U';

  const getTimeDisplay = () => {
    if (!createdAt) return null;
    const date = new Date(createdAt);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    // Show relative time for recent posts (< 24 hours)
    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    // Show full date for older posts
    return format(date, 'PPp');
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Avatar 
        className="h-10 w-10 ring-2 ring-background shadow-sm"
        style={color ? { borderColor: color } : undefined}
      >
        <AvatarImage src={author.croppedPicturePath} alt={authorName} />
        <AvatarFallback 
          className="text-sm font-medium text-white"
          style={{ backgroundColor: color || 'hsl(var(--primary))' }}
        >
          {authorInitials}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-foreground">
            {authorName}
          </span>
          {isAutomatic && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              Auto
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {author.companyRole && (
            <>
              <span>{author.companyRole}</span>
              {createdAt && <span>•</span>}
            </>
          )}
          {createdAt && <span>{getTimeDisplay()}</span>}
        </div>
      </div>
    </div>
  );
};

export { PostAuthorDetails };
export default PostAuthorDetails;
