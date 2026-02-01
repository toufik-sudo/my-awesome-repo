// -----------------------------------------------------------------------------
// PageIndexItem Component
// Migrated from old_app/src/components/atoms/ui/PageIndexItem.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IPageIndexItemProps {
  index: number;
  type?: number;
  isActive?: boolean;
  isCompleted?: boolean;
  onClick?: (index: number) => void;
}

/**
 * Individual step indicator item for the launch wizard
 */
const PageIndexItem: React.FC<IPageIndexItemProps> = ({
  index,
  type,
  isActive = false,
  isCompleted = false,
  onClick
}) => {
  const handleClick = () => {
    if (onClick && isCompleted) {
      onClick(index);
    }
  };

  return (
    <li
      className={cn(
        'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-200',
        isActive && 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2',
        isCompleted && !isActive && 'bg-primary/80 text-primary-foreground cursor-pointer hover:bg-primary',
        !isActive && !isCompleted && 'bg-muted text-muted-foreground',
        onClick && isCompleted && 'cursor-pointer'
      )}
      onClick={handleClick}
      role={onClick && isCompleted ? 'button' : undefined}
      tabIndex={onClick && isCompleted ? 0 : undefined}
    >
      {isCompleted && !isActive ? (
        <Check className="h-4 w-4" />
      ) : (
        index
      )}
    </li>
  );
};

export default PageIndexItem;
