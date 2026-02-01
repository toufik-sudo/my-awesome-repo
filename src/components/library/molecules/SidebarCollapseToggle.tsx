// -----------------------------------------------------------------------------
// SidebarCollapseToggle Molecule Component
// Toggle button for sidebar collapse/expand
// -----------------------------------------------------------------------------

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface SidebarCollapseToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isHoverExpanded?: boolean;
  className?: string;
}

const SidebarCollapseToggle: React.FC<SidebarCollapseToggleProps> = ({
  isCollapsed,
  onToggle,
  isHoverExpanded = false,
  className = ''
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              'absolute -right-3 top-1/2 -translate-y-1/2 z-10',
              'h-6 w-6 rounded-full border bg-background shadow-sm',
              'hover:bg-accent hover:text-accent-foreground',
              'transition-all duration-200',
              isHoverExpanded && 'opacity-50',
              className
            )}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { SidebarCollapseToggle };
export default SidebarCollapseToggle;
