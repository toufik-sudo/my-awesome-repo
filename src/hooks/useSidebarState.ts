// -----------------------------------------------------------------------------
// useSidebarState Hook
// Manages sidebar collapse and mobile states
// -----------------------------------------------------------------------------

import { useState, useCallback } from 'react';

export interface UseSidebarStateReturn {
  isCollapsed: boolean;
  isVisuallyCollapsed: boolean;
  isHoverExpanded: boolean;
  isMobileOpen: boolean;
  toggleCollapse: () => void;
  toggleMobile: () => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  setIsCollapsed: (value: boolean) => void;
  setIsMobileOpen: (value: boolean) => void;
}

export const useSidebarState = (defaultCollapsed = false): UseSidebarStateReturn => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isHoverExpanded, setIsHoverExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
    setIsHoverExpanded(false);
  }, []);

  const toggleMobile = useCallback(() => {
    setIsMobileOpen(prev => !prev);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (isCollapsed) {
      setIsHoverExpanded(true);
    }
  }, [isCollapsed]);

  const handleMouseLeave = useCallback(() => {
    setIsHoverExpanded(false);
  }, []);

  // Visual collapsed state (collapsed but not hover expanded)
  const isVisuallyCollapsed = isCollapsed && !isHoverExpanded;

  return {
    isCollapsed,
    isVisuallyCollapsed,
    isHoverExpanded,
    isMobileOpen,
    toggleCollapse,
    toggleMobile,
    handleMouseEnter,
    handleMouseLeave,
    setIsCollapsed,
    setIsMobileOpen
  };
};

export default useSidebarState;
