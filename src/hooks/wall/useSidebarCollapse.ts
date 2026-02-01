// -----------------------------------------------------------------------------
// useSidebarCollapse Hook
// Manages sidebar collapse state with hover expansion support
// -----------------------------------------------------------------------------

import { useState, useCallback } from 'react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface UseSidebarCollapseReturn {
  /** Whether sidebar is collapsed */
  isCollapsed: boolean;
  /** Whether sidebar appears collapsed (collapsed AND not hovered) */
  isVisuallyCollapsed: boolean;
  /** Whether sidebar is expanded due to hover */
  isHoverExpanded: boolean;
  /** Toggle collapse state */
  toggleCollapse: () => void;
  /** Handle mouse enter on sidebar */
  handleMouseEnter: () => void;
  /** Handle mouse leave from sidebar */
  handleMouseLeave: () => void;
  /** Manually set collapsed state */
  setIsCollapsed: (collapsed: boolean) => void;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Hook to manage sidebar collapse state with hover expansion support
 */
export const useSidebarCollapse = (): UseSidebarCollapseReturn => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHoverExpanded, setIsHoverExpanded] = useState(false);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
    setIsHoverExpanded(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (isCollapsed) {
      setIsHoverExpanded(true);
    }
  }, [isCollapsed]);

  const handleMouseLeave = useCallback(() => {
    if (isCollapsed) {
      setIsHoverExpanded(false);
    }
  }, [isCollapsed]);

  // Sidebar appears collapsed only if it's collapsed AND not hovered
  const isVisuallyCollapsed = isCollapsed && !isHoverExpanded;

  return {
    isCollapsed,
    isVisuallyCollapsed,
    isHoverExpanded,
    toggleCollapse,
    handleMouseEnter,
    handleMouseLeave,
    setIsCollapsed,
  };
};

export default useSidebarCollapse;
