// -----------------------------------------------------------------------------
// PostsPlaceholder Component
// Skeleton loading state for posts
// -----------------------------------------------------------------------------

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface PostsPlaceholderProps {
  count?: number;
  className?: string;
}

const PostsPlaceholder: React.FC<PostsPlaceholderProps> = ({
  count = 3,
  className = ''
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          {/* Accent line skeleton */}
          <Skeleton className="h-1 w-full" />
          
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2 mb-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Image placeholder (sometimes) */}
            {index % 2 === 0 && (
              <Skeleton className="h-48 w-full rounded-lg mb-4" />
            )}

            {/* Social actions */}
            <div className="flex items-center gap-4 pt-3 border-t">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export { PostsPlaceholder };
export default PostsPlaceholder;
