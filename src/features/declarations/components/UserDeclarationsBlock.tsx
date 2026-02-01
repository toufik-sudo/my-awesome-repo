// -----------------------------------------------------------------------------
// UserDeclarationsBlock Component
// Migrated from old_app/src/components/organisms/declarations/UserDeclarationsBlock.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useWallSelection } from '@/hooks/wall';
import UserDeclarationsList from './UserDeclarationsList';
import UserDeclarationHeaderMenu from './UserDeclarationHeaderMenu';
import { cn } from '@/lib/utils';

interface IUserDeclarationsBlockProps {
  className?: string;
}

/**
 * Organism component used to render User Declarations block
 */
const UserDeclarationsBlock: React.FC<IUserDeclarationsBlockProps> = ({ className }) => {
  const { selectedPlatform } = useWallSelection();
  const platformId = selectedPlatform?.id;

  return (
    <div className={cn('px-4', className)}>
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <UserDeclarationHeaderMenu />
        </CardHeader>
        <CardContent>
          {platformId && <UserDeclarationsList />}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDeclarationsBlock;
