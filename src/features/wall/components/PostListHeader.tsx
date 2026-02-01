// -----------------------------------------------------------------------------
// PostListHeader Component
// Migrated from old_app/src/components/molecules/wall/posts/PostListHeader.tsx
// Displays header message based on user type and program selection
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

export interface PostListHeaderProps {
  isBeneficiary?: boolean;
  selectedProgramId?: number | null;
  className?: string;
}

const PostListHeader: React.FC<PostListHeaderProps> = ({
  isBeneficiary = false,
  selectedProgramId = null,
  className = ''
}) => {
  // Beneficiary sees introduction block
  if (isBeneficiary) {
    return (
      <Card className={cn('mb-6 bg-gradient-to-r from-primary/10 to-accent/10', className)}>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-2">
            <FormattedMessage 
              id="wall.posts.welcome.title" 
              defaultMessage="Welcome to the Wall" 
            />
          </h2>
          <p className="text-muted-foreground">
            <FormattedMessage 
              id="wall.posts.welcome.description" 
              defaultMessage="Stay up to date with the latest posts and updates from your programs." 
            />
          </p>
        </CardContent>
      </Card>
    );
  }

  // No program selected - show summary message
  if (!selectedProgramId) {
    return (
      <Card className={cn('mb-6', className)}>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            <FormattedMessage 
              id="wall.posts.selectProgram" 
              defaultMessage="Select a program to view and create posts" 
            />
          </p>
        </CardContent>
      </Card>
    );
  }

  // Program selected - header handled by parent with CreatePostBlock
  return null;
};

export { PostListHeader };
export default PostListHeader;
