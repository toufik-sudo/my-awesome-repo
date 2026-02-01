// -----------------------------------------------------------------------------
// useSidebarCollapse Hook
// Migrated from old_app/src/hooks/nav/useSidebarCollapse.ts
// -----------------------------------------------------------------------------

import { useState, useCallback } from 'react';

interface UseSidebarCollapseReturn {
  isCollapsed: boolean;
  isVisuallyCollapsed: boolean;
  isHoverExpanded: boolean;
  toggleCollapse: () => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  setIsCollapsed: (collapsed: boolean) => void;
}

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
