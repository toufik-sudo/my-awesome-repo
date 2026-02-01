// -----------------------------------------------------------------------------
// WallCover Component
// Migrated from old_app/src/components/organisms/wall/WallCover.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { useWallSelection } from '@/hooks/wall';
import { getKeyByValue } from '@/utils/general';
import { PROGRAM_TYPES, CHALLENGE, LOYALTY, SPONSORSHIP } from '@/constants/wall/launch';
import { cn } from '@/lib/utils';
import type { IProgramDetail } from '../types';

// Default cover images - using placeholder URLs until assets are migrated
const defaultWallCovers: Record<string, string> = {
  [CHALLENGE]: '/images/wall/challenge-default-bg.jpg',
  [LOYALTY]: '/images/wall/loyalty-default-bg.jpg',
  [SPONSORSHIP]: '/images/wall/sponsorship-default-bg.jpg'
};

interface IWallCoverProps {
  className?: string;
}

/**
 * Wall top banner for beneficiary users
 */
const WallCover: React.FC<IWallCoverProps> = ({ className }) => {
  const { selectedProgramId, programDetails } = useWallSelection();
  const programDetail: IProgramDetail = (programDetails[selectedProgramId as number] || {}) as IProgramDetail;
  const { design, type } = programDetail;
  
  const programTypeKey = getKeyByValue(PROGRAM_TYPES, type) || CHALLENGE;
  const image = design?.backgroundCoverUrl || defaultWallCovers[programTypeKey] || defaultWallCovers[CHALLENGE];
  const wallBgColor = design?.colorBackground || 'hsl(var(--background))';

  return (
    <div className={cn('relative w-full h-48 md:h-64 lg:h-80 overflow-hidden', className)}>
      <img 
        src={image} 
        alt="Wall cover"
        className="w-full h-full object-cover"
      />
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          background: `linear-gradient(transparent 50%, ${wallBgColor})` 
        }} 
      />
    </div>
  );
};

export default WallCover;
